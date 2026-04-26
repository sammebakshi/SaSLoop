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
  const [contactsMap, setContactsMap] = useState({});
  const [pausedNumbers, setPausedNumbers] = useState([]);
  const [chatSoundEnabled, setChatSoundEnabled] = useState(() => localStorage.getItem("chatSoundEnabled") === "true");

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
  const wasAtBottomRef = useRef(true);

  const scrollToBottom = (instant = false) => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: instant ? "auto" : "smooth"
        });
    }
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      wasAtBottomRef.current = container.scrollHeight - container.scrollTop <= container.clientHeight + 200;
    }
  });

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
    setTimeout(() => scrollToBottom(true), 100);
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

  const contactListJSX = (
    <div className={`flex flex-col h-full bg-white ${isMobile ? 'w-full' : 'w-[350px] border-r border-slate-100'}`}>
        <div className="h-20 px-8 border-b border-slate-50 flex items-center justify-between shrink-0">
          <h3 className="font-black text-slate-900 tracking-[0.2em] uppercase text-[10px] italic">Live Inbox</h3>
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${status === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
            <RefreshCw className="w-4 h-4 text-slate-300 cursor-pointer hover:text-indigo-500 transition-colors" onClick={fetchChats} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
          {activeNumbers.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-full p-10 opacity-20 italic">
                <MessageSquare className="w-12 h-12 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">No active sessions</p>
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
                      className={`w-full p-6 text-left flex gap-5 transition-all relative group ${isSelected && !isMobile ? 'bg-indigo-50/40' : 'hover:bg-slate-50'}`}
                    >
                      {isSelected && !isMobile && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-r-full"></div>}
                      <div className={`w-14 h-14 ${isSelected && !isMobile ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-105' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50'} rounded-[1.5rem] flex items-center justify-center shrink-0 font-black text-xs transition-all duration-300`}>
                          {num.substring(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex justify-between items-center mb-1">
                             <p className={`font-black tracking-tight text-[12px] uppercase italic ${lastMsg?.role === 'customer' && !lastMsg?.is_read ? 'text-indigo-600' : 'text-slate-900'}`}>
                                {contactsMap[num] || num.split('@')[0]}
                             </p>
                             <span className="text-[9px] font-black text-slate-300">{lastMsg ? new Date(lastMsg.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                          </div>
                          <div className="flex justify-between items-center gap-2">
                             <p className={`text-[11px] truncate font-bold ${lastMsg?.role === 'customer' && !lastMsg?.is_read ? 'text-slate-900' : 'text-slate-400'}`}>{lastMsg?.text || '...'}</p>
                             {lastMsg?.role === 'customer' && !lastMsg?.is_read && <div className="w-2 h-2 bg-indigo-600 rounded-full shrink-0 shadow-lg shadow-indigo-200"></div>}
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
    <div className="flex-1 flex flex-col h-full bg-slate-50/40 relative">
        {/* Header */}
        <div className="h-20 bg-white/80 backdrop-blur-2xl border-b border-slate-50 px-8 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            {isMobile && (
                <button onClick={() => setShowMobileChat(false)} className="p-2 -ml-4 text-slate-400"><ChevronLeft className="w-7 h-7" /></button>
            )}
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <Bot className="w-6 h-6" />
            </div>
            <div>
               <h3 className="font-black text-slate-900 tracking-tight text-base italic leading-none flex items-center gap-2 mb-1.5 uppercase">
                  {contactsMap[selectedNumber] || selectedNumber.split('@')[0]} 
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               </h3>
               <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">{isPaused ? 'Manual Mode (Paused)' : 'Autonomous AI Active'}</p>
               </div>
            </div>
          </div>
          
          <button 
            onClick={togglePause}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${isPaused ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white border-2 border-slate-100 text-slate-500 hover:border-indigo-100'}`}
          >
              {isPaused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
              {isPaused ? 'Resume AI' : 'Pause AI'}
          </button>
        </div>

        {/* Scrollable Chat Area */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar scroll-smooth pb-40">
          {selectedChats.map((c, i) => (
            <div key={i} className={`flex w-full ${c.role === 'bot' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`flex flex-col gap-2 max-w-[85%] md:max-w-[65%] ${c.role === 'bot' ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${c.role === 'bot' ? 'text-indigo-400 italic' : 'text-slate-400 italic'}`}>
                      {c.role === 'bot' ? <><Activity className="w-3 h-3" /> Digital Agent</> : <><UserIcon className="w-3 h-3" /> Client</>}
                  </div>
                  <div className={`p-5 rounded-[2rem] whitespace-pre-wrap leading-relaxed shadow-xl text-sm font-bold border-2 ${c.role === 'bot' ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none' : 'bg-white border-slate-50 text-slate-900 rounded-tl-none'}`}>
                      {c.text}
                  </div>
                  <span className="text-[9px] text-slate-300 font-black uppercase italic px-2">
                      {new Date(c.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                  </span>
                </div>
            </div>
          ))}
          <div ref={messagesEndRef} className="h-1 w-full" />
        </div>

        {/* Controls */}
        <div className="px-8 py-6 shrink-0 bg-white/90 backdrop-blur-3xl border-t border-slate-50 absolute bottom-0 left-0 right-0 z-30">
          {isPaused ? (
            <div className="flex gap-4">
                <input 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Send manual response..."
                  className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-6 py-4 text-xs font-black text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner uppercase tracking-wider"
                />
                <button 
                  onClick={sendMessage}
                  disabled={sending || !replyText.trim()}
                  className="bg-slate-900 hover:bg-indigo-600 disabled:opacity-20 text-white w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all shadow-2xl active:scale-90"
                >
                  <Send className="w-5 h-5" />
                </button>
            </div>
          ) : (
            <div className="flex items-center justify-center p-5 bg-indigo-50/50 rounded-[2rem] border-2 border-dashed border-indigo-100 text-indigo-400 gap-3">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">Pause AI to take manual control of this chat</p>
            </div>
          )}
        </div>

        <button onClick={() => scrollToBottom()} className="absolute bottom-32 right-12 w-12 h-12 bg-white border-2 border-slate-50 rounded-full flex items-center justify-center shadow-2xl text-slate-400 hover:text-indigo-600 z-40 transition-all hover:-translate-y-1 active:scale-90">
           <ChevronDown className="w-6 h-6" />
        </button>
    </div>
  ) : null;

  return (
    <div className={`flex flex-col h-[calc(100vh-100px)] bg-white overflow-hidden ${isMobile ? '' : 'p-2'}`}>
      <div className={`flex-1 flex overflow-hidden ${isMobile ? 'h-full' : 'bg-white border-2 border-slate-50 shadow-2xl rounded-[3rem]'}`}>
        {isMobile ? (
          showMobileChat && selectedNumber ? chatWindowJSX : contactListJSX
        ) : (
          <>
            {contactListJSX}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50/10">
              {selectedNumber ? chatWindowJSX : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-10 italic">
                    <MessageSquare className="w-24 h-24 mb-6" />
                    <h3 className="text-xl font-black uppercase tracking-[0.4em]">Select Intelligence Stream</h3>
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
