Created At: 2026-06-20T01:01:27Z
Completed At: 2026-06-20T01:01:27Z
File Path: `file:///c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx`
Total Lines: 21635
Total Bytes: 1320894
Showing lines 270 to 350
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
270: const TransitionSplashScreen = ({ username }) => {
271:   const [statusText, setStatusText] = useState('DECRYPTING KEY...');
272: 
273:   useEffect(() => {
274:     const statuses = [
275:       { time: 0, text: 'DECRYPTING KEY...' },
276:       { time: 900, text: 'VERIFYING COMBINATION...' },
277:       { time: 1950, text: 'AUTHORIZING ACCESS...' },
278:       { time: 2700, text: 'ACCESS GRANTED' }
279:     ];
280: 
281:     const timeouts = statuses.map(s => 
282:       setTimeout(() => setStatusText(s.text), s.time)
283:     );
284: 
285:     return () => timeouts.forEach(t => clearTimeout(t));
286:   }, []);
287: 
288:   return (
289:     <>
290:       <style>{`
291:         .lock-shackle {
292:           transform-origin: 65px 90px;
293:           animation: shackle-unlock 3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
294:         }
295:         .dial-knob {
296:           transform-origin: 100px 130px;
297:           animation: dial-spin-sequence 3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
298:         }
299:         @keyframes dial-spin-sequence {
300:           0% { transform: rotate(0deg); }
301:           30% { transform: rotate(120deg); }
302:           65% { transform: rotate(-80deg); }
303:           90% { transform: rotate(40deg); }
304:           100% { transform: rotate(40deg); }
305:         }
306:         @keyframes shackle-unlock {
307:           0%, 88% {
308:             transform: translateY(0) rotate(0deg);
309:             stroke: #484f58;
310:           }
311:           92% {
312:             transform: tran
<truncated 358 bytes>
order-white/10 bg-[#0d1117]/85 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] w-[360px] relative select-none z-50">
322:         {/* Glow effect */}
323:         <div className="absolute w-[200px] h-[200px] rounded-full bg-[#18ba60]/10 blur-[50px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 animate-pulse" />
324:         
325:         <div className="relative z-10 flex flex-col items-center">
326:           {/* Padlock SVG with dial */}
327:           <div className="relative mb-6">
328:             <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible">
329:               <defs>
330:                 <radialGradient id="metallicGradient" cx="50%" cy="50%" r="50%">
331:                   <stop offset="0%" stop-color="#21262d" />
332:                   <stop offset="70%" stop-color="#161b22" />
333:                   <stop offset="100%" stop-color="#0d1117" />
334:                 </radialGradient>
335:               </defs>
336: 
337:               {/* Padlock Shackle */}
338:               <path className="lock-shackle" d="M 65 90 L 65 50 A 35 35 0 0 1 135 50 L 135 90" fill="none" stroke="#484f58" stroke-width="12" stroke-linecap="round" />
339: 
340:               {/* Padlock Body */}
341:               <rect x="40" y="80" width="120" height="100" rx="20" fill="#0d1117" stroke="#30363d" stroke-width="5" />
342: 
343:               {/* Inner dial rim */}
344:               <circle cx="100" cy="130" r="36" fill="#161b22" stroke="#30363d" stroke-width="3" />
345: 
346:               {/* Ticks ring inside padlock body */}
347:               <circle cx="100" cy="130" r="32" fill="none" stroke="#484f58" stroke-width="1.5" stroke-dasharray="2 4" />
348: 
349:               {/* Rotating Dial Knob */}
350:               <g className="dial-knob">
The above content does NOT show the entire file contents. If you need to view any lines of the file which were not shown to complete your task, call this tool again to view those lines.
