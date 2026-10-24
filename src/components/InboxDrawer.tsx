import React, { useState } from 'react';
import { X, MessageSquare, Send, Check, Phone, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Profile, ChatMessage, Connection } from '../types/matrimony';

interface InboxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  connections: Record<string, Connection>;
  profiles: Profile[];
  onAcceptInterest: (profileId: string) => void;
  onDeclineInterest: (profileId: string) => void;
  onSendMessage: (profileId: string, text: string) => void;
  activeChatProfileId: string | null;
  setActiveChatProfileId: (id: string | null) => void;
}

export const InboxDrawer: React.FC<InboxDrawerProps> = ({
  isOpen,
  onClose,
  connections,
  profiles,
  onAcceptInterest,
  onDeclineInterest,
  onSendMessage,
  activeChatProfileId,
  setActiveChatProfileId,
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'received' | 'sent'>('chats');
  const [messageInput, setMessageInput] = useState('');

  if (!isOpen) return null;

  const getProfile = (id: string) => profiles.find((p) => p.id === id);

  const activeProfile = activeChatProfileId ? getProfile(activeChatProfileId) : null;
  const activeConnection = activeChatProfileId ? connections[activeChatProfileId] : null;

  // Pre-made matrimonial icebreakers
  const icebreakers = [
    'Namaste! I reviewed your biodata and found our aspirations and family values to be closely aligned. Would love to speak further.',
    'Hi! I noticed we both share a passion for travel and classical music. Would you like to connect?',
    'Hello, my family and I were very impressed by your profile. Can we arrange a casual call between families?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || messageInput;
    if (!text.trim() || !activeChatProfileId) return;
    onSendMessage(activeChatProfileId, text);
    if (!textToSend) setMessageInput('');
  };

  const acceptedConnections = Object.entries(connections).filter(([_, c]) => c.status === 'accepted');
  const pendingSentConnections = Object.entries(connections).filter(([_, c]) => c.status === 'pending');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-neutral-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-neutral-900 font-serif">
              Matrimonial Inbox & Connects
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 border-b border-neutral-200 bg-white">
          <div className="flex gap-4 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('chats');
              }}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'chats' ? 'border-rose-600 text-rose-600' : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Conversations ({acceptedConnections.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('sent');
                setActiveChatProfileId(null);
              }}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'sent' ? 'border-rose-600 text-rose-600' : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Interests Sent ({pendingSentConnections.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('received');
                setActiveChatProfileId(null);
              }}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'received' ? 'border-rose-600 text-rose-600' : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Received (1 New)
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'chats' && (
            <div className="h-full flex flex-col">
              {activeProfile && activeConnection ? (
                /* Active Chat Window */
                <div className="h-full flex flex-col">
                  {/* Chat Top Banner with contact info */}
                  <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={activeProfile.photos[0]}
                        alt={activeProfile.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-neutral-300"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">{activeProfile.name}</h4>
                        <p className="text-[11px] text-neutral-500">
                          {activeProfile.profession} · {activeProfile.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveChatProfileId(null)}
                        className="text-xs text-neutral-500 hover:text-neutral-900 px-2 py-1 rounded border border-neutral-200"
                      >
                        All Chats
                      </button>
                    </div>
                  </div>

                  {/* Messages Stream */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50/50">
                    <div className="text-center py-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 bg-white px-3 py-1 rounded-full border border-neutral-200">
                        Mutual Connect Established · End-to-End Encrypted
                      </span>
                    </div>

                    {activeConnection.messages.length === 0 ? (
                      <div className="text-center py-8 space-y-3">
                        <p className="text-xs text-neutral-500">No messages yet. Break the ice!</p>
                        <div className="space-y-2 max-w-sm mx-auto">
                          {icebreakers.map((ib, i) => (
                            <button
                              key={i}
                              onClick={() => handleSend(ib)}
                              className="w-full text-left p-2.5 bg-white border border-rose-200 hover:border-rose-400 rounded-xl text-xs text-neutral-700 transition-colors shadow-xs"
                            >
                              💡 &ldquo;{ib}&rdquo;
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      activeConnection.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`flex ${m.isSelf ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                              m.isSelf
                                ? 'bg-rose-600 text-white rounded-tr-none'
                                : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-none'
                            }`}
                          >
                            <p>{m.text}</p>
                            <span
                              className={`block text-[10px] mt-1 text-right ${
                                m.isSelf ? 'text-rose-200' : 'text-neutral-400'
                              }`}
                            >
                              {m.timestamp}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Chat Input Bar */}
                  <div className="p-3 sm:p-4 bg-white border-t border-neutral-200 space-y-2 safe-bottom">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Write a respectful matrimonial note..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 min-h-[44px] text-xs p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-neutral-900"
                      />
                      <button
                        onClick={() => handleSend()}
                        disabled={!messageInput.trim()}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-xl transition-colors shadow-sm"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Chat List */
                <div className="p-4 space-y-2">
                  {acceptedConnections.length > 0 ? (
                    acceptedConnections.map(([id, conn]) => {
                      const p = getProfile(id);
                      if (!p) return null;
                      const lastMsg = conn.messages[conn.messages.length - 1];
                      return (
                        <div
                          key={id}
                          onClick={() => setActiveChatProfileId(id)}
                          className="flex items-center gap-3 p-3 bg-white hover:bg-rose-50/50 rounded-xl border border-neutral-200 cursor-pointer transition-colors"
                        >
                          <img
                            src={p.photos[0]}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between">
                              <h4 className="text-xs font-bold text-neutral-900 truncate">{p.name}</h4>
                              <span className="text-[10px] text-neutral-400 font-mono">
                                {lastMsg ? lastMsg.timestamp : 'Connected'}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 truncate">
                              {lastMsg ? lastMsg.text : `${p.profession} · ${p.city}`}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-16 text-center space-y-2">
                      <MessageSquare className="w-8 h-8 text-neutral-300 mx-auto" />
                      <p className="text-xs font-semibold text-neutral-700 font-serif">No Active Conversations Yet</p>
                      <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
                        Send Connect requests to profiles you like. Once accepted, your chats and contact numbers appear here!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sent' && (
            <div className="p-4 space-y-3">
              {pendingSentConnections.length > 0 ? (
                pendingSentConnections.map(([id, conn]) => {
                  const p = getProfile(id);
                  if (!p) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.photos[0]}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-neutral-900">{p.name}</h4>
                          <p className="text-[11px] text-neutral-500">
                            {p.age} yrs · {p.profession} · {p.city}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-md">
                          Awaiting Response
                        </span>
                        <p className="text-[10px] text-neutral-400 font-mono mt-1">{conn.sentAt}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-16 text-center space-y-2">
                  <Heart className="w-8 h-8 text-neutral-300 mx-auto" />
                  <p className="text-xs font-semibold text-neutral-700 font-serif">No Pending Interests Sent</p>
                  <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
                    Browse verified profiles and tap &ldquo;Connect&rdquo; to send a matrimonial interest.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'received' && (
            <div className="p-4 space-y-3">
              <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                    New Interest Received · 10m ago
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700">96% Astro Compatible</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={profiles[0]?.photos[0]}
                    alt={profiles[0]?.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">{profiles[0]?.name}</h4>
                    <p className="text-[11px] text-neutral-600">
                      {profiles[0]?.age} yrs · {profiles[0]?.profession} ({profiles[0]?.education})
                    </p>
                    <p className="text-[11px] text-neutral-500">{profiles[0]?.city}, {profiles[0]?.state}</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-700 italic bg-white/80 p-2.5 rounded-lg border border-rose-100">
                  &ldquo;Namaste! I came across your profile and appreciated your family values and career focus. Would be delighted to connect!&rdquo;
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      onAcceptInterest(profiles[0].id);
                      setActiveTab('chats');
                      setActiveChatProfileId(profiles[0].id);
                    }}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Interest & Connect</span>
                  </button>
                  <button
                    onClick={() => onDeclineInterest(profiles[0].id)}
                    className="py-2 px-3 bg-white hover:bg-neutral-100 text-neutral-600 text-xs font-medium rounded-lg border border-neutral-300"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
