import React, { useState, useEffect, useRef } from "react";
import { 
  Search, Filter, Clock, MoreVertical, Send, 
  Smile, Paperclip, Phone, Video, User,
  Check, CheckCheck, MessageSquare, Bot, AlertCircle, 
  X, CheckCircle, Database, ShieldAlert, Sparkles, LayoutGrid, FileText
} from "lucide-react";
import API_BASE from "../config";
import { playConfiguredWaSound } from "../utils/waSoundHelper";

const WhatsAppChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL"); // ALL, UNREAD, BOT_PAUSED
  
  // Modals & Popovers
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateVariables, setTemplateVariables] = useState([]);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [approvedTemplates, setApprovedTemplates] = useState([]);

  const messagesEndRef = useRef(null);
  const prevUnreadTotalRef = useRef(-1);
  const isFirstFetchRef = useRef(true);


  const fetchChats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // 1. Fetch CRM customers for name/metadata resolution
      let crmCustomers = [];
      try {
        const crmRes = await fetch(`${API_BASE}/api/crm/customers`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (crmRes.ok) {
          crmCustomers = await crmRes.json();
        }
      } catch (err) {
        console.error("Failed to fetch CRM customers:", err);
      }
      
      const crmMap = {};
      crmCustomers.forEach(cust => {
        crmMap[cust.customer_number || cust.phone] = cust;
      });

      // 2. Fetch chats from backend
      const res = await fetch(`${API_BASE}/api/whatsapp/chats`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json(); // { status, chats, pausedNumbers }
        const rawMessages = data.chats || [];
        const pausedNumbers = data.pausedNumbers || [];

        // Deduplicate by message ID
        const seenIds = new Set();
        const uniqueMessages = rawMessages.filter(msg => {
          if (seenIds.has(msg.id)) return false;
          seenIds.add(msg.id);
          return true;
        });

        // Group by customerNumber
        const grouped = {};
        uniqueMessages.forEach(msg => {
          const phone = msg.customerNumber;
          if (!grouped[phone]) {
            grouped[phone] = [];
          }
          grouped[phone].push(msg);
        });

        const contactList = Object.keys(grouped).map(phone => {
          // Sort messages by time ascending (older first)
          const thread = grouped[phone].sort((a, b) => new Date(a.time) - new Date(b.time));
          const lastMsg = thread[thread.length - 1];

          // Calculate unread
          const unreadCount = thread.filter(m => m.role === 'customer' && !m.is_read).length;

          // Format last message time
          const lastTime = new Date(lastMsg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const botPaused = pausedNumbers.includes(phone);
          const crmUser = crmMap[phone] || {};

          return {
            id: phone,
            name: crmUser.name || phone,
            phone: phone,
            lastMessage: lastMsg.text,
            time: lastTime,
            unread: unreadCount,
            avatar: (crmUser.name || phone).substring(0, 2).toUpperCase(),
            botPaused: botPaused,
            botPauseUntil: botPaused ? "Manual Takeover" : undefined,
            tags: crmUser.points > 1000 ? ["VIP"] : ["Regular"],
            email: crmUser.email || "",
            location: crmUser.address || ""
          };
        });

        // Sort by newest last message
        contactList.sort((a, b) => {
          const aMsgs = grouped[a.phone];
          const bMsgs = grouped[b.phone];
          const aMax = new Date(aMsgs[aMsgs.length - 1].time);
          const bMax = new Date(bMsgs[bMsgs.length - 1].time);
          return bMax - aMax;
        });

        // Format threads for chatMessages state
        const threadsMap = {};
        Object.keys(grouped).forEach(phone => {
          threadsMap[phone] = grouped[phone].map(m => ({
            id: m.id,
            text: m.text,
            sender: m.role, // 'customer', 'bot', 'agent'
            time: new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
        });

        setChats(contactList);
        setChatMessages(threadsMap);

        const currentUnreadTotal = contactList.reduce((sum, c) => sum + (c.unread || 0), 0);
        if (!isFirstFetchRef.current && prevUnreadTotalRef.current !== -1 && currentUnreadTotal > prevUnreadTotalRef.current) {
          playConfiguredWaSound();
        }
        prevUnreadTotalRef.current = currentUnreadTotal;
        isFirstFetchRef.current = false;


        // Auto-select or preserve selected chat
        if (contactList.length > 0) {
          setSelectedChat(prevSelected => {
            const nextVal = (() => {
              if (prevSelected) {
                const current = contactList.find(c => {
                  const p1 = c.phone ? c.phone.replace(/\D/g, "") : "";
                  const p2 = prevSelected.phone ? prevSelected.phone.replace(/\D/g, "") : "";
                  return p1 === p2;
                });
                return current || contactList[0];
              }
              return contactList[0];
            })();
            fetch(`${API_BASE}/api/whatsapp/debug-log`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                tag: 'fetchChats_setSelectedChat',
                prevSelectedPhone: prevSelected?.phone,
                prevSelectedName: prevSelected?.name,
                nextValPhone: nextVal?.phone,
                nextValName: nextVal?.name,
                contactListPhones: contactList.map(c => c.phone)
              })
            }).catch(() => {});
            return nextVal;
          });
        }
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/whatsapp/templates`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApprovedTemplates(data.map(t => {
          const variablesCount = (t.body.match(/\{\{\d+\}\}/g) || []).length;
          const placeholders = Array(variablesCount).fill("").map((_, i) => `Variable ${i+1}`);
          return {
            id: t.name,
            name: t.name,
            body: t.body,
            variablesCount,
            placeholders
          };
        }));
      }
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchTemplates();
    
    // Set up polling for new messages every 5 seconds
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mark selected chat as read when selected
  useEffect(() => {
    if (selectedChat && selectedChat.unread > 0) {
      const markAsRead = async () => {
        try {
          const token = localStorage.getItem("token");
          await fetch(`${API_BASE}/api/whatsapp/mark-read`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ type: "chats", customerNumber: selectedChat.phone })
          });
          // Update unread count in UI
          setChats(prev => prev.map(c => {
            const p1 = c.phone ? c.phone.replace(/\D/g, "") : "";
            const p2 = selectedChat.phone ? selectedChat.phone.replace(/\D/g, "") : "";
            return p1 === p2 ? { ...c, unread: 0 } : c;
          }));
          setSelectedChat(prev => {
            const nextVal = prev && (prev.phone.replace(/\D/g, "") === selectedChat.phone.replace(/\D/g, "")) ? { ...prev, unread: 0 } : prev;
            fetch(`${API_BASE}/api/whatsapp/debug-log`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                tag: 'markAsRead_setSelectedChat',
                prevPhone: prev?.phone,
                selectedChatPhone: selectedChat.phone,
                nextValPhone: nextVal?.phone
              })
            }).catch(() => {});
            return nextVal;
          });
        } catch (e) {
          console.error("Failed to mark chat as read:", e);
        }
      };
      markAsRead();
    }
  }, [selectedChat]);

  // Scroll to bottom of message thread
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, selectedChat]);

  // Send Text Message
  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputText;
    if (!text.trim() || !selectedChat) return;

    const token = localStorage.getItem("token");
    
    // Add optimism UI update
    const tempMsg = {
      id: Date.now(),
      text: text,
      sender: "agent",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => ({
      ...prev,
      [selectedChat.phone]: [...(prev[selectedChat.phone] || []), tempMsg]
    }));

    if (!textToSend) setInputText("");

    try {
      const res = await fetch(`${API_BASE}/api/whatsapp/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          to: selectedChat.phone,
          text: text
        })
      });

      if (res.ok) {
        fetchChats();
      } else {
        console.error("Failed to send message via API");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Bot Autoresponder Pause/Resume Action
  const toggleBotPause = async () => {
    if (!selectedChat) return;
    const nextStatus = !selectedChat.botPaused;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/whatsapp/chat/pause`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          customerNumber: selectedChat.phone,
          pause: nextStatus
        })
      });

      if (res.ok) {
        setSelectedChat(prev => ({ ...prev, botPaused: nextStatus }));
        setChats(prev => prev.map(c => {
          const p1 = c.phone ? c.phone.replace(/\D/g, "") : "";
          const p2 = selectedChat.phone ? selectedChat.phone.replace(/\D/g, "") : "";
          if (p1 === p2) {
            return { ...c, botPaused: nextStatus, botPauseUntil: nextStatus ? "Manual Takeover" : undefined };
          }
          return c;
        }));
      }
    } catch (e) {
      console.error("Failed to toggle bot pause:", e);
    }
  };

  // Template Quick Send logic
  const handleSelectTemplate = (tpl) => {
    setSelectedTemplate(tpl);
    setTemplateVariables(Array(tpl.variablesCount).fill(""));
  };

  const handleVariableChange = (idx, val) => {
    const updated = [...templateVariables];
    updated[idx] = val;
    setTemplateVariables(updated);
  };

  const sendTemplateMessage = async () => {
    if (!selectedTemplate || !selectedChat) return;
    
    // Bind template variables
    let finalBody = selectedTemplate.body;
    templateVariables.forEach((val, idx) => {
      finalBody = finalBody.replace(`{{${idx + 1}}}`, val || `[${selectedTemplate.placeholders[idx]}]`);
    });

    await handleSendMessage(finalBody);
    
    // Reset & close picker
    setIsTemplatePickerOpen(false);
    setSelectedTemplate(null);
    setTemplateVariables([]);
  };

  // Filter & Search Logics
  const filteredChats = chats.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.phone.includes(searchQuery) ||
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === "UNREAD") {
      return matchesSearch && c.unread > 0;
    }
    if (activeFilter === "BOT_PAUSED") {
      return matchesSearch && c.botPaused;
    }
    return matchesSearch;
  });

  return (
    <div className="h-[calc(100vh-100px)] flex border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm -mt-2">
      
      {/* 1. Left Contact Column */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50 shrink-0">
        
        {/* Search Contact Area */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search contacts or chats..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-1.5 text-[11px] font-medium outline-none focus:border-emerald-500 text-slate-800" 
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-2 hover:text-slate-600 text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Contact filtering tabs */}
          <div className="flex items-center gap-1 bg-slate-150 p-0.5 rounded-lg">
            {[
              { label: "All", value: "ALL" },
              { label: "Unread", value: "UNREAD" },
              { label: "Agent Lock", value: "BOT_PAUSED" }
            ].map(tab => (
              <button 
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`flex-1 text-center py-1 text-[9px] font-black uppercase rounded-md transition-all ${
                  activeFilter === tab.value 
                    ? "bg-white text-slate-800 shadow-sm font-black" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-35" />
              <p className="text-[10px] font-bold">No active conversations found</p>
            </div>
          ) : (
            filteredChats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => {
                  fetch(`${API_BASE}/api/whatsapp/debug-log`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      tag: 'onClick_setSelectedChat',
                      clickedChatPhone: chat.phone,
                      clickedChatName: chat.name
                    })
                  }).catch(() => {});
                  setSelectedChat(chat);
                }}
                className={`flex items-center gap-3 p-3.5 cursor-pointer transition-all ${
                  (selectedChat && chat && selectedChat.phone.replace(/\D/g, "") === chat.phone.replace(/\D/g, ""))
                    ? 'shadow-sm' 
                    : 'hover:bg-white/40'
                }`}
                style={(selectedChat && chat && selectedChat.phone.replace(/\D/g, "") === chat.phone.replace(/\D/g, "")) ? {
                  backgroundColor: '#ffffff',
                  borderLeft: '4px solid #10b981'
                } : {}}
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-[11px] shrink-0">
                  {chat.avatar || chat.name.substring(0, 2)}
                </div>

                {/* Msg preview details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[12px] font-bold text-slate-800 truncate">{chat.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10.5px] text-slate-500 truncate pr-2 font-medium">
                      {chat.lastMessage}
                    </p>
                    <div className="flex items-center gap-1">
                      {chat.botPaused && (
                        <span className="p-0.5 bg-rose-50 text-rose-500 rounded border border-rose-100" title="Bot Paused - Agent Takeover">
                          <Bot className="w-2.5 h-2.5" />
                        </span>
                      )}
                      {chat.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-red-600 shadow-md shadow-red-500/50 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Main Chat Thread Pane */}
      <div className="flex-1 flex flex-col bg-slate-50/60 relative min-w-0">
        {selectedChat ? (
          <>
            {/* Conversation Header */}
            <div className="h-14 px-6 border-b border-slate-100 bg-white flex items-center justify-between z-10 shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8.5 h-8.5 rounded-full bg-slate-100 border flex items-center justify-center font-bold text-[11px] text-slate-700">
                  {selectedChat.avatar || selectedChat.name.substring(0, 2)}
                </div>
                <div>
                  <h3 className="text-[12.5px] font-bold text-slate-800 flex items-center gap-1.5">
                    {selectedChat.name}
                    <span className="text-[9.5px] text-slate-400 font-normal">({selectedChat.phone})</span>
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {selectedChat.botPaused ? (
                      <span className="text-[8px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-100 px-1 rounded flex items-center gap-0.5">
                        <User className="w-2 h-2" /> Agent Lock
                      </span>
                    ) : (
                      <span className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 rounded flex items-center gap-0.5 animate-pulse">
                        <Bot className="w-2.5 h-2.5" /> Bot Responder Active
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Header Action controls */}
              <div className="flex items-center gap-2">
                {/* Bot toggle control */}
                <button
                  onClick={toggleBotPause}
                  className={`px-3 py-1.5 rounded-lg border text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                    selectedChat.botPaused
                      ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100/50"
                      : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100/50"
                  }`}
                  title={selectedChat.botPaused ? "Resume AI Bot responder" : "Pause AI Bot responder to chat manually"}
                >
                  <Bot className="w-3.5 h-3.5" />
                  {selectedChat.botPaused ? "Resume Bot" : "Lock Bot (Chat)"}
                </button>

                <button 
                  onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
                  className={`p-2 rounded-lg border transition-colors ${
                    isInfoPanelOpen ? "bg-slate-100 text-slate-700 border-slate-350" : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50"
                  }`}
                  title="Toggle detail panel"
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chats messages timeline */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 relative bg-[#efeae2] dark:bg-[#0b141a]">
              <div className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.03] z-0" style={{ 
                backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
                backgroundRepeat: 'repeat',
                backgroundAttachment: 'local'
              }} />
              <div className="relative z-10 flex justify-center">
                <span className="px-3 py-1 bg-white/80 backdrop-blur border border-slate-150 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Live Conversation Channel
                </span>
              </div>

              {(chatMessages[selectedChat.phone] || []).map((msg, idx) => {
                const isAgent = msg.sender === "agent" || msg.sender === "bot";
                return (
                  <div key={msg.id || idx} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] space-y-0.5`}>
                      {/* Message Bubble Card */}
                      <div className={`p-3 rounded-lg shadow-sm border text-[11.5px] leading-relaxed ${
                        msg.sender === "agent" 
                          ? "bg-emerald-600 border-emerald-600 text-white rounded-tr-none rounded-br-lg" 
                          : msg.sender === "bot"
                          ? "bg-indigo-600 border-indigo-600 text-white rounded-tr-none rounded-br-lg"
                          : "bg-white border-slate-200 text-slate-750 rounded-tl-none rounded-bl-lg"
                      }`}>
                        
                        {/* Bot marker badge */}
                        {msg.sender === "bot" && (
                          <div className="text-[7.5px] font-black uppercase tracking-wider text-indigo-200 mb-1 flex items-center gap-0.5">
                            <Bot className="w-2.5 h-2.5" /> AI Autopilot response
                          </div>
                        )}

                        <div className={`whitespace-pre-wrap ${isAgent ? "text-white" : "text-slate-800 dark:text-white"}`}>{msg.text}</div>
                      </div>

                      {/* Bubble Status bar */}
                      <div className={`flex items-center gap-1.5 px-1 ${isAgent ? "justify-end" : "justify-start"}`}>
                        <span className="text-[8.5px] text-slate-400 font-bold">{msg.time}</span>
                        {isAgent && (
                          <CheckCheck className={`w-3.5 h-3.5 ${msg.sender === "bot" ? "text-indigo-400" : "text-emerald-500"}`} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat message entry controls bar */}
            <div className="p-3 bg-white border-t border-slate-100 space-y-2 shrink-0">
              
              <div className="flex items-center gap-2">
                {/* Template sending tool button */}
                <button
                  onClick={() => setIsTemplatePickerOpen(true)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1 transition-all border"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" /> Send Template
                </button>
                
                {selectedChat.botPaused && (
                  <span className="text-[8px] font-bold text-slate-400 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-rose-500 animate-pulse" /> Direct Chat Lock is active. Bot won't override.
                  </span>
                )}
              </div>

              {/* Standard text input sending wrapper */}
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Write a message response..." 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] font-medium outline-none focus:border-emerald-500 text-slate-800 focus:bg-white" 
                />
                <button 
                  onClick={() => handleSendMessage()}
                  className="p-2.5 bg-emerald-600 text-white rounded-lg shadow-sm hover:bg-emerald-700 transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <MessageSquare className="w-12 h-12 opacity-30 mb-2 text-slate-400" />
            <h4 className="font-bold text-slate-700">No Chat Selected</h4>
            <p className="text-[10px] text-slate-400">Please choose a dialogue thread to interact.</p>
          </div>
        )}
      </div>

      {/* 3. Detail Pane (Right Column) */}
      {selectedChat && isInfoPanelOpen && (
        <div className="w-64 border-l border-slate-100 bg-white p-4 flex flex-col gap-4 overflow-y-auto shrink-0 select-none">
          {/* Customer Metadata Profile Card */}
          <div className="text-center pb-3 border-b border-slate-100">
            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-800 text-[14px] mx-auto mb-2">
              {selectedChat.avatar || selectedChat.name.substring(0, 2)}
            </div>
            <h4 className="font-black text-slate-800 text-[13px]">{selectedChat.name}</h4>
            <span className="text-[9.5px] font-mono text-slate-400 font-bold">{selectedChat.phone}</span>
          </div>

          {/* CRM Details List */}
          <div className="space-y-3">
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest block">CRM Context Information</span>
            <div className="space-y-2 text-[10px] font-medium text-slate-655">
              <div>
                <span className="text-slate-400 block text-[8px] font-bold uppercase">Email Account</span>
                <span className="font-bold text-slate-800">{selectedChat.email || "Not Configured"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[8px] font-bold uppercase">Geographical Node</span>
                <span className="font-bold text-slate-800">{selectedChat.location || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[8px] font-bold uppercase">CRM Client tags</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(selectedChat.tags || []).map(t => (
                    <span key={t} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold border border-emerald-100 text-[8px] uppercase">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Automated System logs */}
          <div className="space-y-3 border-t border-slate-100 pt-3 flex-1">
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest block">Autopilot Actions</span>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 space-y-2 text-[10px]">
              <div className="flex justify-between font-bold">
                <span className="text-slate-450">Bot Integration:</span>
                <span className={selectedChat.botPaused ? "text-rose-500" : "text-emerald-600"}>
                  {selectedChat.botPaused ? "PAUSED (Agent)" : "AUTO ACTIVE"}
                </span>
              </div>
              {selectedChat.botPaused && (
                <div className="text-[9px] text-slate-400 border-t border-slate-200/50 pt-1.5">
                  Locked manually by Support agent. Resumes automated response only upon clicking "Resume Bot".
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QUICK TEMPLATE PICKER OVERLAY POPUP */}
      {isTemplatePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col">
            
            <div className="border-b border-slate-100 px-4 py-3 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-black uppercase text-slate-750 tracking-wider">Quick Send WhatsApp Template</span>
              </div>
              <button onClick={() => { setIsTemplatePickerOpen(false); setSelectedTemplate(null); }} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {!selectedTemplate ? (
                // 1. Choose from lists
                <div className="space-y-2">
                  <label className="block text-[9.5px] font-black uppercase text-slate-400 tracking-wider">Select Approved Template</label>
                  {approvedTemplates.map(tpl => (
                    <div 
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl)}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/10 cursor-pointer transition-all"
                    >
                      <div className="font-bold text-[11px] text-slate-800">{tpl.name}</div>
                      <p className="text-[10px] text-slate-450 mt-1 line-clamp-2 leading-snug">{tpl.body}</p>
                    </div>
                  ))}
                </div>
              ) : (
                // 2. Bind inputs variables
                <div className="space-y-3">
                  <button 
                    onClick={() => setSelectedTemplate(null)}
                    className="text-[9px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-700"
                  >
                    &larr; Back to list
                  </button>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Body Template Model</span>
                    <p className="text-[11px] text-slate-650 leading-relaxed font-mono">{selectedTemplate.body}</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9.5px] font-black uppercase text-slate-600 tracking-wider block">Bind Dynamic Variables</span>
                    {Array(selectedTemplate.variablesCount).fill("").map((_, vIdx) => (
                      <div key={vIdx} className="space-y-1">
                        <label className="block text-[8px] font-black text-slate-450 uppercase">
                          Variable {`{{${vIdx + 1}}}`} ({selectedTemplate.placeholders[vIdx]})
                        </label>
                        <input 
                          type="text" 
                          placeholder={`Value for ${selectedTemplate.placeholders[vIdx]}`} 
                          value={templateVariables[vIdx] || ""}
                          onChange={(e) => handleVariableChange(vIdx, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[11.5px] font-medium outline-none focus:border-emerald-500 text-slate-850" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 p-3 bg-slate-50 flex items-center justify-end gap-2">
              <button 
                onClick={() => { setIsTemplatePickerOpen(false); setSelectedTemplate(null); }}
                className="pro-btn-secondary h-8 px-4 font-bold text-[10px]"
              >
                Cancel
              </button>
              <button 
                disabled={!selectedTemplate}
                onClick={sendTemplateMessage}
                className={`pro-btn-primary h-8 px-5 rounded font-black text-[10px] uppercase tracking-wider ${
                  selectedTemplate ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                Send Template
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default WhatsAppChat;
