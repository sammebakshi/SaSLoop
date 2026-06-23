Created At: 2026-06-20T03:57:50Z
Completed At: 2026-06-20T03:57:51Z
{"File":"c:\Users\Sajad\Desktop\SaSLoop\scratch\extracted_dial_code.txt","LineNumber":1,"LineContent":""const TransitionSplashScreen = ({ username }) =\u003e {\
  const [statusText, setStatusText] = useState('DECRYPTING KEY...');\
\
  useEffect(() =\u003e {\
    const statuses = [\
      { time: 0, text: 'DECRYPTING KEY...' },\
      { time: 900, text: 'VERIFYING COMBINATION...' },\
      { time: 1950, text: 'AUTHORIZING ACCESS...' },\
      { time: 2700, text: 'ACCESS GRANTED' }\
    ];\
\
    const timeouts = statuses.map(s =\u003e \
      setTimeout(() =\u003e setStatusText(s.text), s.time)\
    );\
\
    return () =\u003e timeouts.forEach(t =\u003e clearTimeout(t));\
  }, []);\
\
  return (\
    \u003c\u003e\
      \u003cstyle\u003e{`\
        .dial-knob {\
          transform-origin: 150px 150px;\
          animation: dial-spin-sequence 3s cubic-bezier(0.25, 1, 0.5, 1) forwards;\
        }\
        @keyframes dial-spin-sequence {\
          0% { transform: rotate(0deg); }\
          30% { transform: rotate(120deg); }\
          65% { transform: rotate(-80deg); }\
          90% { transform: rotate(40deg); }\
          100% { transform: rotate(40deg); }\
        }\
      `}\u003c/style\u003e\
      \u003cdiv className=\"flex flex-col items-center justify-center relative select-none z-50\"\u003e\
        {/* Glow effect around the dial */}\
        \u003cdiv className=\"absolute w-[280px] h-[280px] rounded-full bg-[#18ba60]/10 blur-[60px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0\" /\u003e\
        \
        \u003cdiv className=\"relative z-10 flex flex-col items-center\"\u003e\
          {/* Circular Vault Safe Dial SVG */}\
          \u003cdiv className=\"relative\"\u003e\
            \u003csvg width=\"260\" height=\"260\" viewBox=\"0 0 300 300\" className=\"overflow-visible select-none filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]\"\u003e\
              \u003cdefs\u003e\
                \u003cradialGradient id=\"metallicSteel\" cx=\"50%\" cy=\"50%\" r=\"50%\"\u003e\
                  \u003cstop offset=\"0%\" stop-color=\"#f8fafc\" /\u003e\
                  \u003cstop offset=\"30%\" stop-color=\"#cbd5e1\" /\u003e\
                  \u003cstop offset=\"70%\" stop-color=\"#94a3b8\" /\u003e\
                  \u003cstop offset=\"95%\" sto"}
{"File":"c:\Users\Sajad\Desktop\SaSLoop\scratch\matches.txt","LineNumber":473,"LineContent":"id=\\\"metallicSteel\\\" cx=\\\"50%\\\" cy=\\\"50%\\\" r=\\\"50%\\\"\u003e\\
                  \u003cstop offset=\\\"0%\\\" "}