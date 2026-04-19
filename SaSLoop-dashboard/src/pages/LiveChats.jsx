import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import API_BASE, { isMobileDevice } from "../config";
import { MessageSquare, Bot, User as UserIcon, Activity, RefreshCw, Send, PauseCircle, PlayCircle, ShieldAlert, ChevronLeft, Bell, BellOff, ChevronDown } from "lucide-react";

// ── Web Audio API notification ping ────────
let chatAudioCtx = null;
function ensureChatAudio() {
  if (!chatAudioCtx) chatAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (chatAudioCtx.state === "suspended") chatAudioCtx.resume();
  return chatAudioCtx;
}
function playMessagePing() {
  try {
    const ctx = ensureChatAudio();
    const now = ctx.currentTime;
    // Stronger clear notification chime
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  } catch (e) { console.error("Chat audio error", e); }
}

function LiveChats() {
  const [chats, setChats] = useState([]);
  const [status, setStatus] = useState("OFFLINE");
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [contactsMap, setContactsMap] = useState({});
  const [pausedNumbers, setPausedNumbers] = useState([]);
  const [chatSoundEnabled, setChatSoundEnabled] = useState(() => localStorage.getItem("chatSoundEnabled") === "true");

  // Track previous customer message count for sound trigger
  const prevCustomerMsgCount = useRef(-1);
  const chatSoundRef = useRef(chatSoundEnabled);
  chatSoundRef.current = chatSoundEnabled;

  const fetchContactsInfo = async () => {
    try {
       const impersonateId = sessionStorage.getItem("impersonate_id");
       const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
       const res = await fetch(`${API_BASE}/api/crm/marketing-contacts${targetParam}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
       });
       const data = await res.json();
       if (res.ok && Array.isArray(data)) {
          const map = {};
          data.forEach(c => { map[c.phone] = c.name; });
          setContactsMap(map);
       }
    } catch (e) {}
  };
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef(null);
  const isMobile = isMobileDevice();


  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const impersonateId = sessionStorage.getItem("impersonate_id");
      const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
      const res = await fetch(`${API_BASE}/api/whatsapp/chats${targetParam}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(data.status);
        if (data.pausedNumbers) setPausedNumbers(data.pausedNumbers);
        if (data.chats && data.chats.length > 0) {
           // Sound notification for new customer messages
           const customerMsgCount = data.chats.filter(c => c.role === 'customer').length;
           if (prevCustomerMsgCount.current !== -1 && customerMsgCount > prevCustomerMsgCount.current && chatSoundRef.current) {
             playMessagePing();
           }
           prevCustomerMsgCount.current = customerMsgCount;
           setChats(data.chats);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchContactsInfo();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);


  const chatContainerRef = useRef(null);
  // Track whether user is near bottom BEFORE React updates the DOM
  const wasAtBottomRef = useRef(true);

  const scrollToBottom = (instant = false) => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: instant ? "auto" : "smooth"
        });
    }
  };

  // Before chats update, record if user is near bottom
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      wasAtBottomRef.current = container.scrollHeight - container.scrollTop <= container.clientHeight + 200;
    }
  }); // runs every render, before layout effects

  useLayoutEffect(() => {
    if (selectedNumber) {
        setTimeout(() => scrollToBottom(true), 100);
    }
  }, [selectedNumber]);

  useLayoutEffect(() => {
    if (wasAtBottomRef.current) {
      scrollToBottom();
    }
  }, [chats]);

  const activeNumbers = [...new Set(chats.map(c => c.customerNumber))]
    .filter(Boolean)
    .sort((a, b) => {
      const lastA = chats.filter(c => c.customerNumber === a).slice(-1)[0]?.time || 0;
      const lastB = chats.filter(c => c.customerNumber === b).slice(-1)[0]?.time || 0;
      return new Date(lastB) - new Date(lastA);
    });
  
  const selectContact = async (num) => {
    setSelectedNumber(num);
    setIsPaused(pausedNumbers.includes(num));
    if (isMobile) setShowMobileChat(true);
    
    // Mark as read in DB
    try {
       await fetch(`${API_BASE}/api/whatsapp/mark-read`, {
          method: 'POST',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` 
          },
          body: JSON.stringify({ type: 'chats', customerNumber: num })
       });
    } catch (e) {}

    // Force immediate scroll for new selection
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const togglePause = async () => {
    if (!selectedNumber) return;
    const newPauseState = !isPaused;
    try {
      const impersonateId = sessionStorage.getItem("impersonate_id");
      const res = await fetch(`${API_BASE}/api/whatsapp/chat/pause`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          customerNumber: selectedNumber,
          pause: newPauseState,
          target_user_id: impersonateId
        })
      });
      if (res.ok) {
        setIsPaused(newPauseState);
      }
      fetchChats();
    } catch (err) { console.error(err); }
  };

  const sendMessage = async () => {
    if (!replyText.trim() || sending) return;
    setSending(true);
    try {
      const impersonateId = sessionStorage.getItem("impersonate_id");
      const res = await fetch(`${API_BASE}/api/whatsapp/chat/send`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          to: selectedNumber,
          text: replyText,
          target_user_id: impersonateId
        })
      });
      if (res.ok) {
        setReplyText("");
        fetchChats();
        setTimeout(() => scrollToBottom(true), 50);
      }
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };
  
  const selectedChats = chats.filter(c => c.customerNumber === selectedNumber);

  // ── Inline JSX sections (NOT inner components) ──────────────────
  // Defining these as inner function components caused React to unmount/remount
  // them on every parent re-render, which reset scroll position.

  const contactListJSX = (
    <div className={`flex flex-col h-full bg-white ${isMobile ? 'w-full' : 'w-[320px] border-r border-slate-200'}`}>
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <h3 className="font-black text-slate-800 tracking-tight uppercase text-[10px]">Inbox</h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
            <RefreshCw className="w-3.5 h-3.5 text-slate-400 cursor-pointer" onClick={fetchChats} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {activeNumbers.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-full p-8 opacity-30">
                <MessageSquare className="w-10 h-10 mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Empty Inbox</p>
              </div>
          ) : (
              activeNumbers.map((num) => {
                const msgs = chats.filter(c => c.customerNumber === num);
                const lastMsg = msgs[msgs.length - 1];
                const isSelected = selectedNumber === num;
                return (
                    <button 
                      key={num} 
                      onClick={() => selectContact(num)}
                      className={`w-full p-5 text-left border-b border-slate-50 flex gap-4 transition-all relative ${isSelected && !isMobile ? 'bg-indigo-50/30' : 'hover:bg-slate-50'}`}
                    >
                      {!isMobile && isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
                      <div className={`w-12 h-12 ${isSelected && !isMobile ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-500'} rounded-2xl flex items-center justify-center shrink-0 font-black text-xs`}>
                          {num.substring(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex justify-between items-center mb-0.5">
                             <p className={`font-black tracking-tight text-[11px] ${lastMsg?.role === 'customer' && !lastMsg?.is_read ? 'text-indigo-600' : 'text-slate-800'}`}>
                                {contactsMap[num] || num.split('@')[0]}
                             </p>
                            <span className="text-[8px] font-bold text-slate-400">{lastMsg ? new Date(lastMsg.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                          </div>
                          <div className="flex justify-between items-center gap-1">
                             <p className={`text-[11px] truncate font-medium ${lastMsg?.role === 'customer' && !lastMsg?.is_read ? 'text-slate-900 font-black' : 'text-slate-500'}`}>{lastMsg?.text || '...'}</p>
                             {lastMsg?.role === 'customer' && !lastMsg?.is_read && <div className="w-2 h-2 bg-indigo-600 rounded-full shrink-0 animate-pulse"></div>}
                          </div>
                      </div>
                    </button>
                )
              })
          )}
        </div>
    </div>
  );

  const chatWindowJSX = selectedNumber ? (
    <div className="flex-1 flex flex-col h-full bg-slate-50/30 relative">
        {/* Chat Header */}
        <div className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {isMobile && (
                <button onClick={() => setShowMobileChat(false)} className="p-2 -ml-2 text-slate-400">
                  <ChevronLeft className="w-6 h-6" />
                </button>
            )}
            <div className="w-10 h-10 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="min-w-0">
               <h3 className="font-black text-slate-800 tracking-tight text-sm leading-none flex items-center gap-2 mb-1">
                  {contactsMap[selectedNumber] || selectedNumber.split('@')[0]} 
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
               </h3>
               <div className="flex items-center gap-1.5">
                  <div className={`w-1 h-1 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>
                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest truncate">{isPaused ? 'Human Interv.' : 'AI Agent Live'}</p>
               </div>
            </div>
            </div>
          
          <button 
            onClick={togglePause}
            className={`flex items-center gap-1.5 ${isMobile ? 'px-3 py-1.5' : 'px-5 py-2.5'} rounded-xl text-[8px] font-black uppercase tracking-widest transition-all shadow-lg ${isPaused ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}
          >
              {isPaused ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
              {isPaused ? 'RESUME AI' : 'PAUSE AI'}
          </button>
        </div>

        {/* Messages Window */}
        <div ref={chatContainerRef} className="p-4 md:p-8 flex-1 overflow-y-auto space-y-6 custom-scrollbar pb-32">
          {selectedChats.map((c, i) => (
            <div key={i} className={`flex w-full ${c.role === 'bot' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex flex-col gap-1.5 max-w-[85%] md:max-w-[70%]">
                  <div className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.2em] px-1 ${c.role === 'bot' ? 'flex-row-reverse text-indigo-400' : 'text-slate-400'}`}>
                      {c.role === 'bot' ? <><Activity className="w-2.5 h-2.5" /> AI</> : <><UserIcon className="w-2.5 h-2.5" /> Client</>}
                  </div>
                  <div className={`p-4 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm text-[13px] font-medium ${c.role === 'bot' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'}`}>
                      {c.text}
                  </div>
                  <span className={`text-[8px] text-slate-400 font-bold px-1 ${c.role === 'bot' ? 'text-right' : ''}`}>
                      {new Date(c.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                  </span>
                </div>
            </div>
          ))}

          <div ref={messagesEndRef} className="h-4 w-full" />
        </div>

        {/* Floating Scroll to Bottom Button */}
        <button 
          onClick={() => scrollToBottom()}
          className="absolute bottom-28 right-8 w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-xl text-slate-400 hover:text-indigo-600 z-30 transition-all active:scale-90"
        >
           <ChevronDown className="w-5 h-5" />
        </button>

        {/* Manual Reply Input */}
        <div className="p-4 md:p-8 shrink-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 absolute bottom-0 left-0 right-0 z-20">
          {isPaused ? (
            <div className="flex gap-2">
                <input 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a manual response..."
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                />
                <button 
                  onClick={sendMessage}
                  disabled={sending || !replyText.trim()}
                  className="bg-slate-900 hover:bg-black disabled:opacity-50 text-white w-12 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
            </div>
          ) : (
            <div className="flex items-center justify-center p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-600 gap-2">
                <ShieldAlert className="w-4 h-4" />
                <p className="text-[9px] font-bold uppercase tracking-wider">Pause AI above to reply manually</p>
            </div>
          )}
        </div>
    </div>
  ) : null;

  return (
    <div className={`flex flex-col h-full bg-white overflow-hidden ${isMobile ? '' : 'p-6 space-y-6'}`}>
      {!isMobile && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-indigo-500" /> AI Inbox
            </h2>
            <p className="text-slate-500 mt-1.5 text-sm font-medium">Intervene in real-time AI conversations.</p>
          </div>
          <button 
            onClick={() => {
              ensureChatAudio();
              const newVal = !chatSoundEnabled;
              setChatSoundEnabled(newVal);
              localStorage.setItem("chatSoundEnabled", newVal);
              if (newVal) playMessagePing();
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${chatSoundEnabled ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-rose-500 text-white shadow-lg shadow-rose-100'}`}
          >
            {chatSoundEnabled ? <Bell className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            {chatSoundEnabled ? 'Sound Active' : 'MUTED (FIX)'}
          </button>
        </div>
      )}

      <div className={`${isMobile ? 'h-full' : 'bg-white border border-slate-200 shadow-2xl rounded-[2.5rem] flex-1 flex overflow-hidden'}`}>
        {isMobile ? (
          showMobileChat && selectedNumber ? chatWindowJSX : contactListJSX
        ) : (
          <>
            {contactListJSX}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50/20">
              {selectedNumber ? chatWindowJSX : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                    <MessageSquare className="w-16 h-16 mb-4" />
                    <h3 className="text-lg font-black uppercase tracking-[0.2em]">Select Chat</h3>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LiveChats;
