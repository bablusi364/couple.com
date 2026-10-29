import { Profile, CallType } from '../types/matrimony';

export interface OnlineUser {
  id: string;
  name: string;
  gender: 'male' | 'female';
  photo?: string;
  phone?: string;
  joinedAt: string;
}

export interface IncomingCallEvent {
  roomId: string;
  callType: CallType;
  caller: {
    id: string;
    name: string;
    gender: 'male' | 'female';
    photo?: string;
    phone?: string;
  };
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
};

class RealtimeCallService {
  private ws: WebSocket | null = null;
  private currentUser: OnlineUser | null = null;
  private currentRoomId: string | null = null;
  private pc: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private isConnectingWs = false;
  private reconnectTimer: any = null;

  // Callbacks
  private onIncomingCallCallbacks: ((event: IncomingCallEvent) => void)[] = [];
  private onCallAcceptedCallbacks: ((data: any) => void)[] = [];
  private onCallDeclinedCallbacks: ((data: any) => void)[] = [];
  private onCallEndedCallbacks: ((data: any) => void)[] = [];
  private onRemoteStreamCallbacks: ((stream: MediaStream | null) => void)[] = [];
  private onOnlineUsersCallbacks: ((users: OnlineUser[]) => void)[] = [];
  private onCallRingingCallbacks: ((data: any) => void)[] = [];
  private onProfileAddedCallbacks: ((profile: Profile) => void)[] = [];
  private onProfileDeletedCallbacks: ((id: string) => void)[] = [];

  constructor() {
    // Auto-connect if in browser
    if (typeof window !== 'undefined') {
      this.connectWebSocket();
    }
  }

  public connectWebSocket() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    if (this.isConnectingWs) return;

    this.isConnectingWs = true;
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnectingWs = false;
        if (this.currentUser) {
          this.registerUser(this.currentUser);
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleServerMessage(data);
        } catch (e) {
          console.warn('Error handling WS message:', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnectingWs = false;
        this.ws = null;
        // Schedule auto-reconnect
        if (!this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connectWebSocket();
          }, 3000);
        }
      };

      this.ws.onerror = () => {
        this.isConnectingWs = false;
      };
    } catch {
      this.isConnectingWs = false;
    }
  }

  public registerUser(user: OnlineUser) {
    this.currentUser = user;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'register_user',
        user,
      }));
    }
  }

  private handleServerMessage(data: any) {
    switch (data.type) {
      case 'online_users_list':
        if (Array.isArray(data.users)) {
          this.onOnlineUsersCallbacks.forEach((cb) => cb(data.users));
        }
        break;

      case 'incoming_call':
        this.currentRoomId = data.roomId;
        this.onIncomingCallCallbacks.forEach((cb) => cb(data));
        break;

      case 'call_ringing':
        this.onCallRingingCallbacks.forEach((cb) => cb(data));
        break;

      case 'call_accepted':
        this.currentRoomId = data.roomId;
        this.onCallAcceptedCallbacks.forEach((cb) => cb(data));
        break;

      case 'call_declined':
        this.cleanupWebRTC();
        this.onCallDeclinedCallbacks.forEach((cb) => cb(data));
        break;

      case 'call_ended':
        this.cleanupWebRTC();
        this.onCallEndedCallbacks.forEach((cb) => cb(data));
        break;

      case 'webrtc_signal':
        this.handleRemoteSignal(data.signal);
        break;

      case 'profile_added':
        if (data.profile) {
          this.onProfileAddedCallbacks.forEach((cb) => cb(data.profile));
        }
        break;

      case 'profile_deleted':
        if (data.id) {
          this.onProfileDeletedCallbacks.forEach((cb) => cb(data.id));
        }
        break;
    }
  }

  // ==============================================================
  // REAL 2-PHONE WEBRTC CALLING METHODS
  // ==============================================================

  public async startCall(target: Profile, callType: CallType, existingRoomId?: string): Promise<string> {
    const roomId = existingRoomId || `HW-CALL-${Date.now().toString().slice(-6)}`;
    this.currentRoomId = roomId;

    // Send call invite over WebSocket
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'call_user',
        roomId,
        targetUserId: target.id,
        targetPhone: target.verifiedDetails?.[0] || '',
        callType,
        caller: this.currentUser,
      }));
    }

    return roomId;
  }

  public acceptIncomingCall(roomId: string, caller: any) {
    this.currentRoomId = roomId;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'call_accept',
        roomId,
        callerId: caller.id,
        receiver: this.currentUser,
      }));
    }
  }

  public declineIncomingCall(roomId: string, reason: string = 'Declined by user') {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'call_decline',
        roomId,
        reason,
      }));
    }
    this.cleanupWebRTC();
  }

  public endCall(roomId?: string) {
    const targetRoomId = roomId || this.currentRoomId;
    if (targetRoomId && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'call_end',
        roomId: targetRoomId,
      }));
    }
    this.cleanupWebRTC();
  }

  // ==============================================================
  // WEBRTC PEER CONNECTION & MEDIA STREAM MANAGEMENT
  // ==============================================================

  public async setupPeerConnection(
    roomId: string,
    isCaller: boolean,
    existingLocalStream?: MediaStream | null
  ): Promise<MediaStream | null> {
    this.currentRoomId = roomId;
    this.cleanupWebRTC(false);

    // 1. Obtain local camera/microphone media stream if not provided
    if (existingLocalStream) {
      this.localStream = existingLocalStream;
    } else {
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: true,
        });
      } catch (e) {
        console.warn('Could not acquire real webcam/mic for WebRTC:', e);
      }
    }

    // 2. Instantiate RTCPeerConnection
    try {
      this.pc = new RTCPeerConnection(ICE_SERVERS);

      // Add local tracks to peer connection
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          this.pc?.addTrack(track, this.localStream!);
        });
      }

      // Handle remote incoming tracks
      this.pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          this.remoteStream = event.streams[0];
          this.onRemoteStreamCallbacks.forEach((cb) => cb(this.remoteStream));
        }
      };

      // Handle ICE Candidates
      this.pc.onicecandidate = (event) => {
        if (event.candidate && this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            type: 'webrtc_signal',
            roomId: this.currentRoomId,
            signal: {
              type: 'candidate',
              candidate: event.candidate,
            },
          }));
        }
      };

      this.pc.onconnectionstatechange = () => {
        if (this.pc?.connectionState === 'disconnected' || this.pc?.connectionState === 'failed') {
          console.warn('WebRTC connection state:', this.pc?.connectionState);
        }
      };

      // 3. If Caller: Create Offer and broadcast to remote peer
      if (isCaller) {
        const offer = await this.pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await this.pc.setLocalDescription(offer);

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            type: 'webrtc_signal',
            roomId: this.currentRoomId,
            signal: {
              type: 'offer',
              sdp: offer,
            },
          }));
        }
      }

      return this.localStream;
    } catch (err) {
      console.warn('Error setting up RTCPeerConnection:', err);
      return this.localStream;
    }
  }

  private async handleRemoteSignal(signal: any) {
    if (!signal) return;

    try {
      if (signal.type === 'offer') {
        if (!this.pc) {
          // If receiver hasn't initialized PC yet, create it now
          await this.setupPeerConnection(this.currentRoomId || 'DEFAULT', false, this.localStream);
        }

        if (this.pc) {
          await this.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
          const answer = await this.pc.createAnswer();
          await this.pc.setLocalDescription(answer);

          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
              type: 'webrtc_signal',
              roomId: this.currentRoomId,
              signal: {
                type: 'answer',
                sdp: answer,
              },
            }));
          }
        }
      } else if (signal.type === 'answer') {
        if (this.pc && this.pc.signalingState !== 'stable') {
          await this.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        }
      } else if (signal.type === 'candidate' && signal.candidate) {
        if (this.pc) {
          try {
            await this.pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
          } catch (e) {
            console.warn('Error adding ICE candidate:', e);
          }
        }
      }
    } catch (e) {
      console.warn('Error handling WebRTC remote signal:', e);
    }
  }

  public getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  public getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  public cleanupWebRTC(stopTracks: boolean = true) {
    if (this.pc) {
      try {
        this.pc.close();
      } catch {}
      this.pc = null;
    }
    if (stopTracks && this.localStream) {
      try {
        this.localStream.getTracks().forEach((t) => t.stop());
      } catch {}
      this.localStream = null;
    }
    this.remoteStream = null;
    this.currentRoomId = null;
    this.onRemoteStreamCallbacks.forEach((cb) => cb(null));
  }

  // ==============================================================
  // EVENT SUBSCRIPTIONS
  // ==============================================================

  public onIncomingCall(callback: (event: IncomingCallEvent) => void) {
    this.onIncomingCallCallbacks.push(callback);
    return () => {
      this.onIncomingCallCallbacks = this.onIncomingCallCallbacks.filter((cb) => cb !== callback);
    };
  }

  public onCallAccepted(callback: (data: any) => void) {
    this.onCallAcceptedCallbacks.push(callback);
    return () => {
      this.onCallAcceptedCallbacks = this.onCallAcceptedCallbacks.filter((cb) => cb !== callback);
    };
  }

  public onCallDeclined(callback: (data: any) => void) {
    this.onCallDeclinedCallbacks.push(callback);
    return () => {
      this.onCallDeclinedCallbacks = this.onCallDeclinedCallbacks.filter((cb) => cb !== callback);
    };
  }

  public onCallEnded(callback: (data: any) => void) {
    this.onCallEndedCallbacks.push(callback);
    return () => {
      this.onCallEndedCallbacks = this.onCallEndedCallbacks.filter((cb) => cb !== callback);
    };
  }

  public onRemoteStream(callback: (stream: MediaStream | null) => void) {
    this.onRemoteStreamCallbacks.push(callback);
    // If stream already exists, fire immediately
    if (this.remoteStream) callback(this.remoteStream);
    return () => {
      this.onRemoteStreamCallbacks = this.onRemoteStreamCallbacks.filter((cb) => cb !== callback);
    };
  }

  public onOnlineUsers(callback: (users: OnlineUser[]) => void) {
    this.onOnlineUsersCallbacks.push(callback);
    return () => {
      this.onOnlineUsersCallbacks = this.onOnlineUsersCallbacks.filter((cb) => cb !== callback);
    };
  }

  public onCallRinging(callback: (data: any) => void) {
    this.onCallRingingCallbacks.push(callback);
    return () => {
      this.onCallRingingCallbacks = this.onCallRingingCallbacks.filter((cb) => cb !== callback);
    };
  }

  // ==============================================================
  // COMMUNITY PROFILE SYNC METHODS
  // ==============================================================

  public async syncProfile(profile: Profile) {
    // 1. Send via WebSocket if active
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'sync_profile',
        profile,
      }));
    }

    // 2. Also save to server persistent REST API
    try {
      await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
    } catch (e) {
      console.warn('Failed to post profile to /api/profiles:', e);
    }
  }

  public onProfileAdded(callback: (profile: Profile) => void) {
    this.onProfileAddedCallbacks.push(callback);
    return () => {
      this.onProfileAddedCallbacks = this.onProfileAddedCallbacks.filter((cb) => cb !== callback);
    };
  }

  public onProfileDeleted(callback: (id: string) => void) {
    this.onProfileDeletedCallbacks.push(callback);
    return () => {
      this.onProfileDeletedCallbacks = this.onProfileDeletedCallbacks.filter((cb) => cb !== callback);
    };
  }
}

export const realtimeCallService = new RealtimeCallService();
