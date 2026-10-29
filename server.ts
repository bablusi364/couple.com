import express from 'express';
import type { Request, Response } from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

interface ConnectedUser {
  id: string;
  name: string;
  gender: 'male' | 'female';
  photo?: string;
  phone?: string;
  joinedAt: string;
}

interface RoomChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

interface RoomData {
  id: string;
  title: string;
  createdAt: string;
  participants: Map<WebSocket, ConnectedUser>;
  messages: RoomChatMessage[];
}

// In-memory 1-to-1 active room registry
const activeRooms = new Map<string, RoomData>();

// Helper to find or create a room
function getOrCreateRoom(roomId: string, title?: string): RoomData {
  let room = activeRooms.get(roomId);
  if (!room) {
    room = {
      id: roomId,
      title: title || `1-to-1 Connection Room ${roomId}`,
      createdAt: new Date().toISOString(),
      participants: new Map(),
      messages: [],
    };
    activeRooms.set(roomId, room);
  }
  return room;
}

// ==============================================================
// COMMUNITY PROFILES REPOSITORY (SHARED ACROSS ALL DEVICES)
// ==============================================================
const PROFILES_FILE = path.join(__dirname, 'community_profiles.json');
const communityProfiles = new Map<string, any>();

function loadCommunityProfiles() {
  try {
    if (fs.existsSync(PROFILES_FILE)) {
      const content = fs.readFileSync(PROFILES_FILE, 'utf-8');
      const list = JSON.parse(content);
      if (Array.isArray(list)) {
        list.forEach((p) => {
          if (p && p.id) {
            communityProfiles.set(p.id, p);
          }
        });
      }
    }
  } catch (err) {
    console.warn('Error loading community_profiles.json:', err);
  }
}

function saveCommunityProfilesToFile() {
  try {
    const list = Array.from(communityProfiles.values());
    fs.writeFileSync(PROFILES_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error saving community_profiles.json:', err);
  }
}

loadCommunityProfiles();

// REST API for Community Matrimonial Profiles
app.get('/api/profiles', (_req: Request, res: Response) => {
  const profilesList = Array.from(communityProfiles.values());
  res.json({
    success: true,
    profiles: profilesList,
    count: profilesList.length,
  });
});

app.post('/api/profiles', (req: Request, res: Response) => {
  const profile = req.body;
  if (!profile || !profile.id) {
    return res.status(400).json({ success: false, message: 'Invalid profile data or missing ID' });
  }

  const existing = communityProfiles.get(profile.id) || {};
  const merged = {
    ...existing,
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  communityProfiles.set(profile.id, merged);
  saveCommunityProfilesToFile();

  // Real-time broadcast to all connected phones/devices
  const broadcastMsg = JSON.stringify({
    type: 'profile_added',
    profile: merged,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(broadcastMsg);
    }
  });

  res.json({ success: true, profile: merged });
});

app.delete('/api/profiles/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  if (communityProfiles.has(id)) {
    communityProfiles.delete(id);
    saveCommunityProfilesToFile();

    const deleteMsg = JSON.stringify({
      type: 'profile_deleted',
      id,
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(deleteMsg);
      }
    });

    return res.json({ success: true, message: 'Profile deleted' });
  }
  res.status(404).json({ success: false, message: 'Profile not found' });
});

// REST API for room generation & validation
app.post('/api/rooms/create', (req: Request, res: Response) => {
  const customId = req.body?.customId;
  const title = req.body?.title;
  // Generate a clean matrimonial connect code (e.g., COUPLE-7284)
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const roomId = (customId || `COUPLE-${randomSuffix}`).toUpperCase().trim();

  const room = getOrCreateRoom(roomId, title);

  res.json({
    success: true,
    roomId: room.id,
    title: room.title,
    createdAt: room.createdAt,
    participantCount: room.participants.size,
  });
});

app.get('/api/rooms/:roomId', (req: Request, res: Response) => {
  const roomId = req.params.roomId.toUpperCase().trim();
  const room = activeRooms.get(roomId);
  if (!room) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }

  const userList = Array.from(room.participants.values());
  res.json({
    success: true,
    roomId: room.id,
    title: room.title,
    participantCount: room.participants.size,
    participants: userList,
    messagesCount: room.messages.length,
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    activeRooms: activeRooms.size,
    communityProfilesCount: communityProfiles.size,
    timestamp: new Date().toISOString(),
  });
});

// WebSocket Server for Multi-Device 1-to-1 Real-Time Connection
const wss = new WebSocketServer({ server, path: '/ws' });

// Global map of connected online devices/users
const onlineClients = new Map<WebSocket, ConnectedUser>();

function broadcastOnlineUsers() {
  const users = Array.from(onlineClients.values());
  const msg = JSON.stringify({
    type: 'online_users_list',
    users,
    count: users.length,
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

wss.on('connection', (ws: WebSocket) => {
  let currentRoomId: string | null = null;
  let currentUser: ConnectedUser | null = null;

  ws.on('message', (data: string) => {
    try {
      const payload = JSON.parse(data.toString());

      // 0. Register User presence when app loads or logs in on a phone
      if (payload.type === 'register_user') {
        const u = payload.user;
        currentUser = {
          id: u?.id || `user-${Date.now()}`,
          name: u?.name || 'Candidate',
          gender: u?.gender || 'male',
          photo: u?.photo || '',
          phone: u?.phone || '',
          joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        onlineClients.set(ws, currentUser);
        broadcastOnlineUsers();

        if (payload.profile && payload.profile.id) {
          communityProfiles.set(payload.profile.id, payload.profile);
          saveCommunityProfilesToFile();
          const pMsg = JSON.stringify({ type: 'profile_added', profile: payload.profile });
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(pMsg);
            }
          });
        }
      }

      // Sync community matrimonial profile across all devices
      else if (payload.type === 'sync_profile') {
        if (payload.profile && payload.profile.id) {
          communityProfiles.set(payload.profile.id, payload.profile);
          saveCommunityProfilesToFile();
          const pMsg = JSON.stringify({ type: 'profile_added', profile: payload.profile });
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(pMsg);
            }
          });
        }
      }

      // Query online users
      else if (payload.type === 'get_online_users') {
        ws.send(JSON.stringify({
          type: 'online_users_list',
          users: Array.from(onlineClients.values()),
          count: onlineClients.size,
        }));
      }

      // 1. Direct Call Initiation from Phone 1 to Phone 2
      else if (payload.type === 'call_user') {
        const targetUserId = payload.targetUserId;
        const targetPhone = payload.targetPhone;
        const roomId = payload.roomId || `CALL-${Date.now()}`;
        const caller = currentUser || payload.caller || {
          id: `caller-${Date.now()}`,
          name: 'Caller',
          gender: 'male',
        };

        // Put caller in call room
        const room = getOrCreateRoom(roomId);
        currentRoomId = roomId;
        room.participants.set(ws, caller);

        // Find target websocket connection
        let targetWs: WebSocket | null = null;
        for (const [client, u] of onlineClients.entries()) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            if (targetUserId && u.id === targetUserId) {
              targetWs = client;
              break;
            }
            if (targetPhone && u.phone && (u.phone === targetPhone || u.phone.includes(targetPhone) || targetPhone.includes(u.phone))) {
              targetWs = client;
              break;
            }
          }
        }

        // If target wasn't found by ID or phone, but there is ANY other active connected phone, ring it!
        if (!targetWs) {
          for (const [client] of onlineClients.entries()) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              targetWs = client;
              break;
            }
          }
        }

        if (targetWs) {
          targetWs.send(JSON.stringify({
            type: 'incoming_call',
            roomId,
            callType: payload.callType || 'video',
            caller,
          }));

          ws.send(JSON.stringify({
            type: 'call_ringing',
            roomId,
            targetUserId,
          }));
        } else {
          ws.send(JSON.stringify({
            type: 'call_failed',
            roomId,
            reason: 'offline',
            message: 'Target user is not online on another phone right now.',
          }));
        }
      }

      // 2. Call Accepted on Phone 2
      else if (payload.type === 'call_accept') {
        const roomId = payload.roomId || currentRoomId;
        if (!roomId) return;
        const receiver = currentUser || payload.receiver || {
          id: `user-${Date.now()}`,
          name: 'Receiver',
          gender: 'female',
        };

        const room = getOrCreateRoom(roomId);
        currentRoomId = roomId;
        room.participants.set(ws, receiver);

        const acceptMsg = JSON.stringify({
          type: 'call_accepted',
          roomId,
          receiver,
          participants: Array.from(room.participants.values()),
        });

        room.participants.forEach((_u, client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(acceptMsg);
          }
        });
      }

      // 3. Call Declined on Phone 2
      else if (payload.type === 'call_decline') {
        const roomId = payload.roomId || currentRoomId;
        if (roomId) {
          const room = activeRooms.get(roomId);
          if (room) {
            const declineMsg = JSON.stringify({
              type: 'call_declined',
              roomId,
              reason: payload.reason || 'Call declined by user',
            });
            room.participants.forEach((_u, client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(declineMsg);
              }
            });
          }
        }
      }

      // 4. Call Ended by either phone
      else if (payload.type === 'call_end') {
        const roomId = payload.roomId || currentRoomId;
        if (roomId) {
          const room = activeRooms.get(roomId);
          if (room) {
            const endMsg = JSON.stringify({
              type: 'call_ended',
              roomId,
            });
            room.participants.forEach((_u, client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(endMsg);
              }
            });
          }
        }
      }

      // 5. WebRTC Peer Signaling (Offer, Answer, ICE Candidate)
      else if (payload.type === 'webrtc_signal') {
        const roomId = payload.roomId || currentRoomId;
        if (roomId) {
          const room = activeRooms.get(roomId);
          if (room) {
            const signalMsg = JSON.stringify({
              type: 'webrtc_signal',
              roomId,
              senderId: currentUser?.id,
              signal: payload.signal,
            });
            room.participants.forEach((_u, client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(signalMsg);
              }
            });
          }
        }
      }

      // 6. User Joins 1-to-1 Room (Direct URL / Code Room)
      else if (payload.type === 'join') {
        const roomId = (payload.roomId || 'COUPLE-DEFAULT').toUpperCase().trim();
        const user: ConnectedUser = {
          id: payload.user?.id || `user-${Date.now()}`,
          name: payload.user?.name || 'Candidate',
          gender: payload.user?.gender || 'male',
          photo: payload.user?.photo || '',
          phone: payload.user?.phone || '',
          joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const room = getOrCreateRoom(roomId);
        currentRoomId = roomId;
        currentUser = user;
        onlineClients.set(ws, user);

        room.participants.set(ws, user);
        const allUsers = Array.from(room.participants.values());

        ws.send(JSON.stringify({
          type: 'room_joined',
          roomId,
          user,
          participants: allUsers,
          messages: room.messages,
        }));

        const presenceMsg = JSON.stringify({
          type: 'presence',
          roomId,
          participants: allUsers,
          joinedUser: user,
          isConnectedOneToOne: allUsers.length >= 2,
        });

        room.participants.forEach((_u, client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(presenceMsg);
          }
        });
      }

      // 7. Real-Time Chat Message inside 1-to-1 Room
      else if (payload.type === 'chat_message' && currentRoomId) {
        const room = activeRooms.get(currentRoomId);
        if (!room) return;

        const newMsg: RoomChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          senderId: currentUser?.id || 'unknown',
          senderName: currentUser?.name || 'Candidate',
          text: String(payload.text || '').trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        room.messages.push(newMsg);
        if (room.messages.length > 100) room.messages.shift();

        const broadcastData = JSON.stringify({
          type: 'chat_message',
          roomId: currentRoomId,
          message: newMsg,
        });

        room.participants.forEach((_u, client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(broadcastData);
          }
        });
      }

      // 8. Real-Time Typing Indicator inside 1-to-1 Room
      else if (payload.type === 'typing' && currentRoomId) {
        const room = activeRooms.get(currentRoomId);
        if (!room) return;

        const typingMsg = JSON.stringify({
          type: 'typing',
          roomId: currentRoomId,
          userId: currentUser?.id,
          userName: currentUser?.name,
          isTyping: !!payload.isTyping,
        });

        room.participants.forEach((_u, client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(typingMsg);
          }
        });
      }

      // 9. 1-to-1 Live Call Actions (Reactions, Mute state)
      else if (payload.type === 'call_action' && currentRoomId) {
        const room = activeRooms.get(currentRoomId);
        if (!room) return;

        const actionMsg = JSON.stringify({
          type: 'call_action',
          roomId: currentRoomId,
          senderId: currentUser?.id,
          senderName: currentUser?.name,
          action: payload.action,
          payload: payload.payload,
        });

        room.participants.forEach((_u, client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(actionMsg);
          }
        });
      }

    } catch (err) {
      console.warn('WebSocket message error:', err);
    }
  });

  ws.on('close', () => {
    onlineClients.delete(ws);
    broadcastOnlineUsers();

    if (currentRoomId) {
      const room = activeRooms.get(currentRoomId);
      if (room) {
        room.participants.delete(ws);
        const remainingUsers = Array.from(room.participants.values());

        const leaveMsg = JSON.stringify({
          type: 'presence',
          roomId: currentRoomId,
          participants: remainingUsers,
          leftUser: currentUser,
          isConnectedOneToOne: remainingUsers.length >= 2,
        });

        const callEndMsg = JSON.stringify({
          type: 'call_ended',
          roomId: currentRoomId,
          reason: 'Partner disconnected',
        });

        room.participants.forEach((_u, client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(leaveMsg);
            client.send(callEndMsg);
          }
        });

        if (room.participants.size === 0) {
          setTimeout(() => {
            if (room.participants.size === 0) {
              activeRooms.delete(currentRoomId!);
            }
          }, 3600000);
        }
      }
    }
  });
});

// Mount Vite middleware in development or static dist in production
async function startServer() {
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath);

  if (process.env.NODE_ENV === 'production' || hasDist) {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`husbandwife.com Realtime Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
