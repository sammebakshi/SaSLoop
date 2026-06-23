Created At: 2026-06-20T04:08:07Z
Completed At: 2026-06-20T04:08:08Z
File Path: `file:///c:/Users/Sajad/Desktop/SaSLoop/scratch/temp_dial.jsx`
Total Lines: 48
Total Bytes: 1987
Showing lines 1 to 48
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: "const TransitionSplashScreen = ({ username }) => {
2:   const [statusText, setStatusText] = useState('DECRYPTING KEY...');
3: 
4:   useEffect(() => {
5:     const statuses = [
6:       { time: 0, text: 'DECRYPTING KEY...' },
7:       { time: 900, text: 'VERIFYING COMBINATION...' },
8:       { time: 1950, text: 'AUTHORIZING ACCESS...' },
9:       { time: 2700, text: 'ACCESS GRANTED' }
10:     ];
11: 
12:     const timeouts = statuses.map(s => 
13:       setTimeout(() => setStatusText(s.text), s.time)
14:     );
15: 
16:     return () => timeouts.forEach(t => clearTimeout(t));
17:   }, []);
18: 
19:   return (
20:     <>
21:       <style>{`
22:         .dial-knob {
23:           transform-origin: 150px 150px;
24:           animation: dial-spin-sequence 3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
25:         }
26:         @keyframes dial-spin-sequence {
27:           0% { transform: rotate(0deg); }
28:           30% { transform: rotate(120deg); }
29:           65% { transform: rotate(-80deg); }
30:           90% { transform: rotate(40deg); }
31:           100% { transform: rotate(40deg); }
32:         }
33:       `}</style>
34:       <div className="flex flex-col items-center justify-center relative select-none z-50">
35:         {/* Glow effect around the dial */}
36:         <div className="absolute w-[280px] h-[280px] rounded-full bg-[#18ba60]/10 blur-[60px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />
37:         
38:         <div className="relative z-10 flex flex-col items-center">
39:           {/* Circular Vault Safe Dial SVG */}
40:           <div className="relative">
41:             <svg width="260" height="260" viewBox="0 0 300 300" className="overflow-visible select-none filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
42:               <defs>
43:                 <radialGradient id="metallicSteel" cx="50%" cy="50%" r="50%">
44:                   <stop offset="0%" stop-color="#f8fafc" />
45:                   <stop offset="30%" stop-color="#cbd5e1" />
46:                   <stop offset="70%" stop-color="#94a3b8" />
47:                   <stop offset="95%" sto
48: <truncated 7000 bytes>
The above content shows the entire, complete file contents of the requested file.
