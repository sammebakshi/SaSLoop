import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  RefreshCw,
  Play,
  ShieldAlert,
  Check,
  ShieldCheck,
  Terminal,
  Activity,
  Key,
  Database,
  Power,
  Shield
} from "lucide-react";

// Web Audio API Synthesizer Class
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playClick(frequency = 800, duration = 0.02) {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency / 3, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio synthesis failed:", e);
    }
  }

  playChime(notes = [261.63, 329.63, 392.00, 523.25]) {
    if (!this.enabled) return;
    this.init();
    try {
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.45);
      });
    } catch (e) {
      console.warn("Audio synthesis failed:", e);
    }
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch (e) {
      console.warn("Audio synthesis failed:", e);
    }
  }
}

const soundEngine = new SoundEngine();

const RINGS_CONFIG = [
  {
    name: "Outer Ring (Platinum)",
    fillGradient: "url(#platinumBrushed)",
    color: "#e2e8f0",
    textClass: "text-slate-100",
    radius: 215,
    tickLength: 14,
    notches: 60,
    pitch: 880,
    defaultDir: "CW"
  },
  {
    name: "Mid-Outer Ring (Titanium)",
    fillGradient: "url(#titaniumBrushed)",
    color: "#94a3b8",
    textClass: "text-slate-300",
    radius: 170,
    tickLength: 11,
    notches: 40,
    pitch: 720,
    defaultDir: "CCW"
  },
  {
    name: "Mid-Inner Ring (Bronze)",
    fillGradient: "url(#bronzeBrushed)",
    color: "#f59e0b",
    textClass: "text-amber-500",
    radius: 125,
    tickLength: 9,
    notches: 24,
    pitch: 580,
    defaultDir: "CW"
  },
  {
    name: "Inner Ring (Gold)",
    fillGradient: "url(#goldBrushed)",
    color: "#fbbf24",
    textClass: "text-yellow-400",
    radius: 80,
    tickLength: 7,
    notches: 12,
    pitch: 440,
    defaultDir: "CCW"
  }
];

export default function LockerDial() {
  const [angles, setAngles] = useState([0, 0, 0, 0]);
  const [targets, setTargets] = useState([15, 27, 8, 5]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gearCoupling, setGearCoupling] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("SYSTEM ENCRYPTED // READY");
  const [showConsole, setShowConsole] = useState(false);
  
  const [consoleLogs, setConsoleLogs] = useState([
    "SaSLoop Executive Lockbox System initialized...",
    "System security matrix: PROTECTED",
    "Align concentric metallic tumblers to disengage vault deadbolts."
  ]);

  const svgRef = useRef(null);
  const prevNotchVals = useRef([0, 0, 0, 0]);
  const solverIntervalRef = useRef(null);
  const spinIntervalRef = useRef(null);

  useEffect(() => {
    regenerateCombination();
  }, []);

  useEffect(() => {
    soundEngine.enabled = soundEnabled;
  }, [soundEnabled]);

  const currentValues = useMemo(() => {
    return angles.map((angle, idx) => {
      const notches = RINGS_CONFIG[idx].notches;
      const notchSize = 360 / notches;
      const normalizedAngle = ((angle % 360) + 360) % 360;
      const val = Math.round(((360 - normalizedAngle) % 360) / notchSize) % notches;
      return val;
    });
  }, [angles]);

  useEffect(() => {
    currentValues.forEach((val, idx) => {
      if (val !== prevNotchVals.current[idx]) {
        if (!isSpinning && !isSolving) {
          soundEngine.playClick(RINGS_CONFIG[idx].pitch, 0.02);
        } else if (isSpinning && Math.random() < 0.25) {
          soundEngine.playClick(RINGS_CONFIG[idx].pitch - 80, 0.012);
        }
        prevNotchVals.current[idx] = val;
      }
    });
  }, [currentValues, isSpinning, isSolving]);

  const matchedRings = useMemo(() => {
    return currentValues.map((val, idx) => val === targets[idx]);
  }, [currentValues, targets]);

  const allMatched = useMemo(() => {
    return matchedRings.every(Boolean);
  }, [matchedRings]);

  useEffect(() => {
    if (allMatched && !isUnlocked) {
      setIsUnlocked(true);
      setStatusMessage("TUMBLER COUPLING VERIFIED // ACCESS GRANTED");
      soundEngine.playChime();
      addLog("Vault combination verified successfully.");
      addLog("Authorizing executive control board session...");
      
      const timer = setTimeout(() => {
        setShowConsole(true);
      }, 950);
      return () => clearTimeout(timer);
    } else if (!allMatched && isUnlocked) {
      setIsUnlocked(false);
      setShowConsole(false);
      setStatusMessage("ALIGNMENT MODIFIED // LOCK SECURED");
    }
  }, [allMatched, isUnlocked]);

  const addLog = (msg) => {
    setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-100));
  };

  const regenerateCombination = () => {
    if (isSolving) return;
    const newTargets = RINGS_CONFIG.map((ring) => Math.floor(Math.random() * ring.notches));
    setTargets(newTargets);
    setIsUnlocked(false);
    setShowConsole(false);
    setStatusMessage("NEW ALIGNMENT SEQUENCE ARMED");
    addLog(`Tumbler matrix target altered: L1 [${newTargets[0]}], L2 [${newTargets[1]}], L3 [${newTargets[2]}], L4 [${newTargets[3]}]`);
    soundEngine.playClick(1000, 0.1);
  };

  const rotateRing = (idx, stepsCount) => {
    if (isSolving) return;
    const notchSize = 360 / RINGS_CONFIG[idx].notches;
    const direction = RINGS_CONFIG[idx].defaultDir === "CW" ? 1 : -1;
    const delta = stepsCount * notchSize * direction;

    setAngles((prev) => {
      const next = [...prev];
      next[idx] = prev[idx] + delta;

      if (gearCoupling) {
        for (let i = 0; i < 4; i++) {
          if (i !== idx) {
            const distance = Math.abs(i - idx);
            const couplingFactor = Math.pow(-0.55, distance);
            next[i] = prev[i] + delta * couplingFactor;
          }
        }
      }
      return next;
    });
  };

  const getCouplingRatio = (sourceIdx, targetIdx) => {
    const distance = Math.abs(sourceIdx - targetIdx);
    const sign = distance % 2 === 0 ? 1 : -1;
    const magnitude = 0.5 / distance;
    return sign * magnitude;
  };

  const handleDragStart = (ringIdx, e) => {
    if (isSolving || isUnlocked) return;
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const startMouseAngle = Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
    const startRingAngles = [...angles];

    const handleMouseMove = (moveEvent) => {
      const mx = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const my = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);

      const currentMouseAngle = Math.atan2(my - cy, mx - cx) * (180 / Math.PI);
      let deltaAngle = currentMouseAngle - startMouseAngle;

      if (deltaAngle > 180) deltaAngle -= 360;
      if (deltaAngle < -180) deltaAngle += 360;

      setAngles((prev) => {
        const next = [...prev];
        const activeDelta = deltaAngle;
        next[ringIdx] = startRingAngles[ringIdx] + activeDelta;

        if (gearCoupling) {
          for (let i = 0; i < 4; i++) {
            if (i !== ringIdx) {
              const ratio = getCouplingRatio(ringIdx, i);
              next[i] = startRingAngles[i] + activeDelta * ratio;
            }
          }
        }
        return next;
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);

      setAngles((prev) => {
        return prev.map((ang, idx) => {
          const notchSize = 360 / RINGS_CONFIG[idx].notches;
          return Math.round(ang / notchSize) * notchSize;
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleMouseMove, { passive: false });
    window.addEventListener("touchend", handleMouseUp);
  };

  const triggerMasterSpin = () => {
    if (isSolving || isUnlocked) return;
    setIsSpinning(true);
    addLog("Master crank mechanism engaged. Aligning alternate kinetic tumblers.");

    let velocity = 72;
    const decay = 0.955;

    if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);

    spinIntervalRef.current = setInterval(() => {
      velocity *= decay;

      if (velocity < 0.1) {
        clearInterval(spinIntervalRef.current);
        setIsSpinning(false);
        setAngles((prev) =>
          prev.map((ang, idx) => {
            const notchSize = 360 / RINGS_CONFIG[idx].notches;
            return Math.round(ang / notchSize) * notchSize;
          })
        );
        addLog("Alternate gearbox rotation completed. Tumblers locked.");
      } else {
        setAngles((prev) => {
          const next = [...prev];
          next[0] = prev[0] + velocity;      // CW
          next[1] = prev[1] - velocity * 1.2; // CCW
          next[2] = prev[2] + velocity * 1.5; // CW
          next[3] = prev[3] - velocity * 1.8; // CCW
          return next;
        });
      }
    }, 16);
  };

  const triggerAutoSolve = () => {
    if (isSolving || isUnlocked) return;
    setIsSolving(true);
    addLog("Auto-align sequence triggered. Calibrating locks...");

    let currentActiveRing = 0;
    
    if (solverIntervalRef.current) clearInterval(solverIntervalRef.current);

    const originalCoupling = gearCoupling;
    setGearCoupling(false);

    solverIntervalRef.current = setInterval(() => {
      const config = RINGS_CONFIG[currentActiveRing];
      const targetVal = targets[currentActiveRing];
      const notchSize = 360 / config.notches;
      const targetAngle = (360 - targetVal * notchSize) % 360;
      
      setAngles((prev) => {
        const next = [...prev];
        const curAngle = prev[currentActiveRing];
        
        const curMod = ((curAngle % 360) + 360) % 360;
        let diff = targetAngle - curMod;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        const stepSize = Math.min(Math.abs(diff), 2.2) * Math.sign(diff);
        next[currentActiveRing] = curAngle + stepSize;

        if (Math.abs(diff) < 0.1) {
          next[currentActiveRing] = Math.round((curAngle + diff) / notchSize) * notchSize;
          soundEngine.playClick(1000, 0.08);
          addLog(`${config.name} aligned at combination: ${targetVal}`);
          
          if (currentActiveRing < 3) {
            currentActiveRing++;
          } else {
            clearInterval(solverIntervalRef.current);
            setIsSolving(false);
            setGearCoupling(originalCoupling);
          }
        }
        return next;
      });
    }, 12);
  };

  const relockVault = () => {
    setIsUnlocked(false);
    setShowConsole(false);
    setAngles([0, 0, 0, 0]);
    addLog("Vault manually reset and locked.");
    regenerateCombination();
  };

  return (
    <div className="min-h-screen bg-[#07090b] text-[#f1f5f9] flex flex-col font-sans overflow-x-hidden select-none">
      
      {/* Top Banner Status Info */}
      <header className="border-b border-slate-800/80 bg-[#07090b] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border border-slate-700 shadow-lg">
            <Shield className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-[#f1f5f9] font-mono">
              EXECUTIVE SAFE ACCESS PANEL
            </h1>
            <p className="text-[9px] text-slate-500 font-mono tracking-wider">VAULT DECRYPTOR LAYER // CLASS_4</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#0c0e12] border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title="Toggle Audio Feedback"
              className={`p-1.5 rounded-md transition-all ${
                soundEnabled
                  ? "bg-gradient-to-b from-slate-700 to-slate-850 text-slate-200 border border-slate-650 shadow"
                  : "text-slate-500 hover:text-slate-400"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setGearCoupling(!gearCoupling)}
              title="Toggle Gear Coupling Mode"
              className={`px-3 py-1 text-[9px] font-mono font-bold rounded-md border transition-all ${
                gearCoupling
                  ? "bg-amber-600/10 text-amber-500 border-amber-500/25"
                  : "text-slate-500 border-transparent hover:text-slate-300"
              }`}
            >
              GEARS: {gearCoupling ? "COUPLED" : "FREE"}
            </button>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1 rounded border text-[10px] font-mono font-bold transition-all duration-300 ${
              isUnlocked
                ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-400"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isUnlocked ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
            {isUnlocked ? "UNLOCKED" : "SECURED"}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Dial UI */}
        <section className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-900/5 border border-slate-850/60 rounded-3xl p-6 md:p-10 relative overflow-hidden backdrop-blur-sm min-h-[580px]">
          
          {/* Subtle industrial overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#1f242e_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-25" />

          {/* Alignment Pointer Indicator (12 o'clock pointer) */}
          <div className="absolute top-[32px] left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
            <div className="h-7 w-1.5 bg-gradient-to-b from-slate-400 to-amber-500 rounded-full shadow-[0_1px_4px_rgba(217,119,6,0.4)]" />
            <polygon points="247,56 253,56 250,62" fill="#d97706" className="-mt-1" />
          </div>

          {/* SVG Dial Rendering */}
          <div className="relative select-none aspect-square w-full max-w-[480px] drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
            <svg
              ref={svgRef}
              viewBox="0 0 500 500"
              className="w-full h-full touch-none"
            >
              <defs>
                {/* 3D Radial Metal Base */}
                <radialGradient id="dialBase" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e2430" />
                  <stop offset="55%" stopColor="#131720" />
                  <stop offset="85%" stopColor="#0a0c10" />
                  <stop offset="98%" stopColor="#050608" />
                  <stop offset="100%" stopColor="#151922" />
                </radialGradient>
                
                {/* Brushed steel linear reflections */}
                <linearGradient id="metalBezel" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="15%" stopColor="#64748b" />
                  <stop offset="30%" stopColor="#cbd5e1" />
                  <stop offset="45%" stopColor="#334155" />
                  <stop offset="60%" stopColor="#f8fafc" />
                  <stop offset="75%" stopColor="#475569" />
                  <stop offset="90%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>

                {/* Brushed Platinum (Ring 1) */}
                <linearGradient id="platinumBrushed" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="25%" stopColor="#cbd5e1" />
                  <stop offset="50%" stopColor="#334155" />
                  <stop offset="75%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>

                {/* Brushed Titanium (Ring 2) */}
                <linearGradient id="titaniumBrushed" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#020617" />
                  <stop offset="30%" stopColor="#475569" />
                  <stop offset="60%" stopColor="#94a3b8" />
                  <stop offset="85%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>

                {/* Brushed Bronze (Ring 3) */}
                <linearGradient id="bronzeBrushed" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#451a03" />
                  <stop offset="25%" stopColor="#d97706" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="75%" stopColor="#78350f" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>

                {/* Brushed Gold (Ring 4) */}
                <linearGradient id="goldBrushed" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#78350f" />
                  <stop offset="25%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="75%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>

                {/* Brass gold for spinner handle */}
                <linearGradient id="brassGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ca8a04" />
                  <stop offset="40%" stopColor="#fbbf24" />
                  <stop offset="70%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>

                {/* Wood/Mahogany crank grips */}
                <linearGradient id="mahoganyWood" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7f1d1d" />
                  <stop offset="50%" stopColor="#450a0a" />
                  <stop offset="100%" stopColor="#1e0000" />
                </linearGradient>

                {/* Inner Bevel Shadows */}
                <filter id="innerBevel">
                  <feOffset dx="0.8" dy="0.8"/>
                  <feGaussianBlur stdDeviation="1" result="offset-blur"/>
                  <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                  <feFlood floodColor="black" floodOpacity="0.8" result="color"/>
                  <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
                  <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
                </filter>

                {/* Glass Reflection Highlight overlay */}
                <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.15" />
                  <stop offset="35%" stopColor="white" stopOpacity="0.05" />
                  <stop offset="50%" stopColor="white" stopOpacity="0" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Main Outer Metal Bezel plate with rivets */}
              <circle cx="250" cy="250" r="242" fill="url(#metalBezel)" stroke="#050608" strokeWidth="2.5" />
              <circle cx="250" cy="250" r="236" fill="url(#dialBase)" filter="url(#innerBevel)" />

              {/* Beveled edge ring highlight */}
              <circle cx="250" cy="250" r="236" fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />

              {/* Polished Executive Rivets */}
              {Array.from({ length: 16 }).map((_, i) => {
                const ang = (i * 22.5 * Math.PI) / 180;
                const rx = 250 + 238.5 * Math.cos(ang);
                const ry = 250 + 238.5 * Math.sin(ang);
                return (
                  <g key={`rivet-${i}`}>
                    <circle cx={rx} cy={ry} r="3" fill="#334155" />
                    <circle cx={rx} cy={ry} r="2.2" fill="#475569" stroke="#1e293b" strokeWidth="0.5" />
                    <circle cx={rx - 0.6} cy={ry - 0.6} r="0.6" fill="#cbd5e1" />
                  </g>
                );
              })}

              {/* RINGS */}
              {RINGS_CONFIG.map((ring, idx) => {
                const notchAngle = 360 / ring.notches;
                
                // Gripping ridges configuration (Mechanical Ribs)
                const ridgesCount = ring.notches / 2;
                const ridgeAngle = 360 / ridgesCount;

                return (
                  <g key={ring.name} onMouseDown={(e) => handleDragStart(idx, e)} onTouchStart={(e) => handleDragStart(idx, e)}>
                    {/* Ring Outer Track shadow */}
                    <circle
                      cx="250"
                      cy="250"
                      r={ring.radius + 15}
                      fill="transparent"
                      stroke="#05070a"
                      strokeWidth="1"
                    />

                    {/* Ring Interactive Drag Handle Area */}
                    <circle
                      cx="250"
                      cy="250"
                      r={ring.radius}
                      fill="transparent"
                      stroke="rgba(0,0,0,0.01)"
                      strokeWidth="30"
                      className="cursor-grab active:cursor-grabbing"
                    />

                    {/* Rotating visual group */}
                    <g
                      style={{
                        transform: `rotate(${angles[idx]}deg)`,
                        transformOrigin: "250px 250px",
                        transition: isSpinning || isSolving ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                      }}
                    >
                      {/* Realistic Brushed Metallic Ring body */}
                      <circle
                        cx="250"
                        cy="250"
                        r={ring.radius}
                        fill="transparent"
                        stroke={ring.fillGradient}
                        strokeWidth="28"
                      />

                      {/* Highlight bevel rims */}
                      <circle cx="250" cy="250" r={ring.radius - 14} fill="transparent" stroke="#05070a" strokeWidth="1" />
                      <circle cx="250" cy="250" r={ring.radius + 14} fill="transparent" stroke="#05070a" strokeWidth="1" />
                      <circle cx="250" cy="250" r={ring.radius - 13} fill="transparent" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
                      
                      {/* Physical Mechanical Gripping Ridges */}
                      {Array.from({ length: ridgesCount }).map((_, rIdx) => {
                        const ridAng = rIdx * ridgeAngle;
                        const ridRad = ((ridAng - 90) * Math.PI) / 180;
                        // Draw tiny dark physical ribbed indentation lines
                        const rx1 = 250 + (ring.radius - 14) * Math.cos(ridRad);
                        const ry1 = 250 + (ring.radius - 14) * Math.sin(ridRad);
                        const rx2 = 250 + (ring.radius - 8) * Math.cos(ridRad);
                        const ry2 = 250 + (ring.radius - 8) * Math.sin(ridRad);
                        return (
                          <line
                            key={`ridge-${idx}-${rIdx}`}
                            x1={rx1}
                            y1={ry1}
                            x2={rx2}
                            y2={ry2}
                            stroke="#05070a"
                            strokeWidth="1.5"
                          />
                        );
                      })}

                      {/* Small Brass Rivets embedded inside ring face */}
                      {Array.from({ length: 6 }).map((_, rivIdx) => {
                        const rivAng = rivIdx * 60;
                        const rivRad = ((rivAng - 90) * Math.PI) / 180;
                        const rx = 250 + (ring.radius + 8) * Math.cos(rivRad);
                        const ry = 250 + (ring.radius + 8) * Math.sin(rivRad);
                        return (
                          <g key={`ring-rivet-${idx}-${rivIdx}`}>
                            <circle cx={rx} cy={ry} r="1.8" fill="url(#brassGold)" stroke="#1e293b" strokeWidth="0.5" />
                          </g>
                        );
                      })}

                      {/* Ticks and Number Marks */}
                      {Array.from({ length: ring.notches }).map((_, i) => {
                        const tickAng = i * notchAngle;
                        const tickRad = ((tickAng - 90) * Math.PI) / 180;
                        const x1 = 250 + (ring.radius - 3) * Math.cos(tickRad);
                        const y1 = 250 + (ring.radius - 3) * Math.sin(tickRad);
                        const x2 = 250 + (ring.radius - 3 - ring.tickLength) * Math.cos(tickRad);
                        const y2 = 250 + (ring.radius - 3 - ring.tickLength) * Math.sin(tickRad);

                        const showNum = ring.notches <= 24 ? i % 2 === 0 : i % 5 === 0;

                        return (
                          <g key={`tick-${idx}-${i}`}>
                            {/* Tick mark line (with subtle drop-shadow effect by drawing a dark line behind it) */}
                            <line
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke="#000000"
                              strokeWidth={i === 0 ? "2.5" : "1.5"}
                            />
                            <line
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke={matchedRings[idx] ? ring.color : "#e2e8f0"}
                              strokeWidth={i === 0 ? "1.5" : "0.8"}
                              className="transition-colors duration-300"
                            />
                            
                            {/* Tick values */}
                            {showNum && (
                              <g>
                                <text
                                  x={250 + (ring.radius - 5 - ring.tickLength - 6) * Math.cos(tickRad) + 0.5}
                                  y={250 + (ring.radius - 5 - ring.tickLength - 6) * Math.sin(tickRad) + 0.5}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  fill="#000000"
                                  className="text-[7.5px] font-mono font-bold select-none"
                                  style={{ transform: `rotate(${tickAng}deg)`, transformOrigin: `${250 + (ring.radius - 5 - ring.tickLength - 6) * Math.cos(tickRad)}px ${250 + (ring.radius - 5 - ring.tickLength - 6) * Math.sin(tickRad)}px` }}
                                >
                                  {i}
                                </text>
                                <text
                                  x={250 + (ring.radius - 5 - ring.tickLength - 6) * Math.cos(tickRad)}
                                  y={250 + (ring.radius - 5 - ring.tickLength - 6) * Math.sin(tickRad)}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  fill={matchedRings[idx] ? ring.color : "#94a3b8"}
                                  className="text-[7.5px] font-mono select-none transition-colors duration-300 font-bold"
                                  style={{ transform: `rotate(${tickAng}deg)`, transformOrigin: `${250 + (ring.radius - 5 - ring.tickLength - 6) * Math.cos(tickRad)}px ${250 + (ring.radius - 5 - ring.tickLength - 6) * Math.sin(tickRad)}px` }}
                                >
                                  {i}
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })}

                      {/* Soft indicator dot at notch 0 */}
                      <circle
                        cx="250"
                        cy={250 - ring.radius + 10}
                        r="2.2"
                        fill={matchedRings[idx] ? ring.color : "#d97706"}
                        stroke="#000"
                        strokeWidth="0.8"
                        className="transition-colors duration-300"
                      />
                    </g>
                  </g>
                );
              })}

              {/* 3D Steering Crank Base (Luxury Safe Spinner) */}
              <circle cx="250" cy="250" r="52" fill="url(#metalBezel)" stroke="#05070a" strokeWidth="2.5" />
              <circle cx="250" cy="250" r="48" fill="url(#titaniumBrushed)" filter="url(#innerBevel)" />
              <circle cx="250" cy="250" r="48" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              
              {/* Three Elegant Brass Spokes */}
              {Array.from({ length: 3 }).map((_, i) => {
                const rot = (i * 120 * Math.PI) / 180;
                
                // Coordinates
                const sx = 250 + 8 * Math.cos(rot);
                const sy = 250 + 8 * Math.sin(rot);
                const ex = 250 + 38 * Math.cos(rot);
                const ey = 250 + 38 * Math.sin(rot);
                
                // End handle coordinates (wooden grip)
                const hx = 250 + 44 * Math.cos(rot);
                const hy = 250 + 44 * Math.sin(rot);

                return (
                  <g key={`spoke-${i}`}>
                    {/* Shadow behind spoke */}
                    <line
                      x1={sx + 1.2}
                      y1={sy + 1.2}
                      x2={ex + 1.2}
                      y2={ey + 1.2}
                      stroke="#050608"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    {/* Polished Brass gold spoke */}
                    <line
                      x1={sx}
                      y1={sy}
                      x2={ex}
                      y2={ey}
                      stroke="url(#brassGold)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    
                    {/* Mahogany wooden handle knob at end of spoke */}
                    <circle cx={hx} cy={hy} r="6" fill="#000" />
                    <circle cx={hx} cy={hy} r="5.2" fill="url(#mahoganyWood)" stroke="url(#brassGold)" strokeWidth="0.8" />
                    <circle cx={hx - 1.2} cy={hy - 1.2} r="1.5" fill="white" fillOpacity="0.15" />
                  </g>
                );
              })}
              
              {/* Center Core Cap (Amber Gold Hub with Onyx center jewel) */}
              <circle cx="250" cy="250" r="14" fill="url(#brassGold)" stroke="#451a03" strokeWidth="1" />
              <circle cx="250" cy="250" r="9" fill="#0d1117" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="250" cy="250" r="3.5" fill={isUnlocked ? "#10b981" : "#d97706"} className="transition-colors duration-300" />

              {/* Curved Glass Reflection overlay (covers top half for 3D depth) */}
              <path
                d="M 12 250 A 238 238 0 0 1 488 250 Z"
                fill="url(#glassReflection)"
                pointerEvents="none"
              />
            </svg>

            {/* Help Overlay text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {!isUnlocked && angles.every(a => a === 0) && (
                <div className="bg-[#0b0d10]/95 border border-slate-800 rounded-xl px-5 py-2.5 text-center shadow-2xl backdrop-blur-md">
                  <p className="text-[9px] text-[#94a3b8] font-mono tracking-widest font-bold">DRAG DIALS TO ALIGN VAULT</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Panel under Dial */}
          <div className="w-full max-w-sm mt-8 border border-slate-800 bg-[#0c0e12] rounded-2xl p-4 flex flex-col items-center shadow-inner">
            <p className="text-[8px] text-slate-500 font-mono tracking-widest font-bold mb-1.5 uppercase">VAULT SECURITY DIRECTIVE</p>
            <div className="font-mono text-[11px] font-bold text-center tracking-wider text-amber-500 truncate w-full">
              {statusMessage}
            </div>
            
            {/* Status tags */}
            <div className="mt-3 flex gap-2">
              {RINGS_CONFIG.map((ring, idx) => (
                <div
                  key={`status-led-${idx}`}
                  className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold border flex items-center gap-1 transition-all duration-300 ${
                    matchedRings[idx]
                      ? `${ring.bgClass} ${ring.textClass} ${ring.borderClass}`
                      : "bg-[#07090b] text-slate-500 border-slate-850"
                  }`}
                >
                  <span className={`w-1 h-1 rounded-full ${matchedRings[idx] ? "bg-current" : "bg-slate-700"}`} />
                  T{idx + 1} {matchedRings[idx] ? "OK" : "LOCKED"}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Side: Command Board */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Target Combinations Console */}
          <div className="bg-[#0c0e12] border border-slate-850 rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold font-mono tracking-wider text-slate-300">TUMBLER MECHANICS STATUS</h3>
              </div>
              <button
                onClick={regenerateCombination}
                title="Randomise Target Alignment"
                className="p-1 text-slate-500 hover:text-slate-350 border border-transparent hover:border-slate-800 hover:bg-slate-900 rounded-md transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {RINGS_CONFIG.map((ring, idx) => {
                const pct = (currentValues[idx] / ring.notches) * 100;
                return (
                  <div
                    key={`target-row-${idx}`}
                    className={`border rounded-xl p-3 flex flex-col transition-all duration-300 ${
                      matchedRings[idx]
                        ? "bg-[#07090b] border-slate-800"
                        : "bg-slate-900/10 border-slate-900/50"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: ring.color,
                            boxShadow: `0 0 4px ${ring.color}60`
                          }}
                        />
                        <span className="font-mono text-slate-300 font-bold">{ring.name.split(" ")[0]}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className="text-slate-500">DIR:</span>
                        <span className="text-slate-400 font-bold">
                          {ring.defaultDir}
                        </span>
                        <span className="text-slate-755">|</span>
                        <span className="text-slate-500">ALIGN:</span>
                        <span className={`font-black ${matchedRings[idx] ? "text-amber-500" : "text-slate-400"}`}>
                          {currentValues[idx]} / {targets[idx]}
                        </span>
                        {matchedRings[idx] ? (
                          <Check className="w-3 h-3 text-amber-500 stroke-[3]" />
                        ) : (
                          <Lock className="w-2.5 h-2.5 text-slate-700" />
                        )}
                      </div>
                    </div>

                    {/* Miniature manual adjustment knobs */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        disabled={isSolving || isUnlocked}
                        onClick={() => rotateRing(idx, -1)}
                        className="px-2 py-0.5 bg-[#07090b] hover:bg-slate-900 text-[9px] font-mono text-slate-400 rounded border border-slate-800 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
                      >
                        -1 Notch
                      </button>
                      
                      {/* Elegant gold progress slider */}
                      <div className="flex-1 h-1 bg-[#050608] rounded-full overflow-hidden relative">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: ring.color
                          }}
                        />
                      </div>

                      <button
                        disabled={isSolving || isUnlocked}
                        onClick={() => rotateRing(idx, 1)}
                        className="px-2 py-0.5 bg-[#07090b] hover:bg-slate-900 text-[9px] font-mono text-slate-400 rounded border border-slate-800 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
                      >
                        +1 Notch
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Control Levers */}
          <div className="bg-[#0c0e12] border border-slate-850 rounded-3xl p-6 shadow-md">
            <h3 className="text-xs font-bold font-mono tracking-wider text-slate-350 mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              MECHANICAL DRIVE ACTUATORS
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              
              {/* Alternating Master Lever Button */}
              <button
                disabled={isSolving || isUnlocked || isSpinning}
                onClick={triggerMasterSpin}
                className="group relative flex flex-col items-center justify-center p-4 bg-[#07090b]/40 hover:bg-[#07090b] border border-slate-800 hover:border-slate-700 rounded-2xl transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none active:scale-[0.98]"
              >
                <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <RefreshCw className="w-4.5 h-4.5 text-slate-400 group-hover:rotate-180 transition-transform duration-700" />
                </div>
                <span className="text-[9px] font-bold font-mono tracking-wider text-slate-300">MASTER LEVER</span>
                <span className="text-[7.5px] font-mono text-slate-500 mt-1 uppercase">Coupled Alternate Spin</span>
              </button>

              {/* Auto-Solve Walking Sequence */}
              <button
                disabled={isSolving || isUnlocked || isSpinning}
                onClick={triggerAutoSolve}
                className="group relative flex flex-col items-center justify-center p-4 bg-[#07090b]/40 hover:bg-[#07090b] border border-slate-800 hover:border-slate-700 rounded-2xl transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none active:scale-[0.98]"
              >
                <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Play className="w-4.5 h-4.5 text-amber-500" />
                </div>
                <span className="text-[9px] font-bold font-mono tracking-wider text-slate-300">AUTO-ALIGN</span>
                <span className="text-[7.5px] font-mono text-slate-500 mt-1 uppercase">Lockbox Sequencer</span>
              </button>

            </div>
            
            <div className="mt-4 bg-[#050608] border border-slate-850 p-3.5 rounded-xl flex gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600/80 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] font-mono text-slate-500 leading-normal">
                  In <strong className="text-slate-300">GEARS: COUPLED</strong> mode, rotating one dial drives adjacent ones in alternating directions CW/CCW. Turn coupling off to calibrate tumbler alignments independently.
                </p>
              </div>
            </div>
          </div>

          {/* Secure Session logs console */}
          <div className="bg-[#050608] border border-slate-850 rounded-3xl p-5 font-mono shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">SYSTEM DIAGNOSTICS</span>
              </div>
              <span className="text-[8px] text-slate-650">VAULT_SYSLOG_MONITOR</span>
            </div>
            
            <div className="h-[96px] overflow-y-auto text-[9px] text-slate-500 space-y-1.5 custom-scrollbar">
              {consoleLogs.map((log, idx) => (
                <div key={`log-${idx}`} className="leading-relaxed border-l border-slate-800 pl-2">
                  <span className="text-slate-700 font-semibold">{">"}</span> {log}
                </div>
              ))}
            </div>
          </div>

        </section>
      </main>

      {/* Secret Vault Portal Display Overlay */}
      <AnimatePresence>
        {showConsole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/98 z-[100] flex flex-col items-center justify-center p-4 md:p-10"
          >
            {/* Elegant overlay grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(217,119,6,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(217,119,6,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col relative h-[90vh]"
            >
              {/* Header */}
              <div className="bg-[#0b0d10] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-850 rounded-lg border border-slate-750">
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold tracking-widest text-[#f1f5f9] uppercase font-mono">
                      EXECUTIVE SECURITY TERMINAL ESTABLISHED
                    </h2>
                    <p className="text-[9px] font-mono text-slate-500">AUTHORIZATION KEY VALIDATED // LEVEL_4 ROOT</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 bg-amber-600/10 border border-amber-500/25 text-amber-500 font-mono text-[9px] font-bold px-3 py-1 rounded">
                    DECRYPTED
                  </div>
                  
                  <button
                    onClick={relockVault}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-mono text-[10px] font-bold px-3 py-1.5 rounded border border-slate-700 active:scale-95 transition-all shadow"
                  >
                    <Power className="w-3.5 h-3.5 text-amber-500" />
                    LOCK VAULT
                  </button>
                </div>
              </div>

              {/* Console Dashboard Area */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
                
                {/* Left pane: Vault Status console reports */}
                <div className="md:col-span-8 p-6 flex flex-col overflow-hidden border-r border-slate-800">
                  <h3 className="text-[10px] font-bold font-mono text-slate-400 mb-3 uppercase tracking-wider">
                    AUTHORIZED SECURE MODULES
                  </h3>
                  
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    
                    {/* Database Hub status card */}
                    <div className="bg-[#0b0d10]/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                          <Database className="w-5 h-5 text-slate-450" />
                        </div>
                        <span className="text-[8px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                          SYNCED
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-200">Consensus Ledger Database</h4>
                        <p className="text-[9.5px] text-slate-500 font-mono mt-1 leading-relaxed">
                          Secure relational nodes active. Cross-consensus verified. Replication sync delay is at 4ms.
                        </p>
                      </div>
                      <div className="mt-4 border-t border-slate-800/80 pt-3 flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span>Identifier: secure-ldgr-1</span>
                        <span className="text-emerald-500 font-bold">Consensus 100% OK</span>
                      </div>
                    </div>

                    {/* API Integrations status card */}
                    <div className="bg-[#0b0d10]/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                          <Activity className="w-5 h-5 text-slate-450" />
                        </div>
                        <span className="text-[8px] font-mono bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">
                          STABLE
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-200">System Activity Relay</h4>
                        <p className="text-[9.5px] text-slate-500 font-mono mt-1 leading-relaxed">
                          Reverse routing tunnel established. Load average at 0.12. Dynamic packet decryption active.
                        </p>
                      </div>
                      <div className="mt-4 border-t border-slate-800/80 pt-3 flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span>CPU Latency: 12ms</span>
                        <span className="text-emerald-500 font-bold">247d Uptime</span>
                      </div>
                    </div>

                    {/* System Override Settings card */}
                    <div className="bg-[#0b0d10]/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow col-span-1 sm:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-black text-slate-200">Safety & Diagnostic Override</h4>
                        <span className="text-[8px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                          PRIVILEGED LOGS
                        </span>
                      </div>
                      <p className="text-[9.5px] text-slate-500 font-mono mt-1 leading-relaxed">
                        Execute manual operations. These functions override local session storage states and system tokens directly.
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            localStorage.clear();
                            addLog("Local storage wiped.");
                            alert("Cache cleared successfully. Reloading workspace...");
                            window.location.reload();
                          }}
                          className="py-2 bg-slate-900 hover:bg-slate-800 text-slate-350 font-mono text-[9px] font-bold rounded border border-slate-800 hover:border-slate-700 active:scale-95 transition-all text-center"
                        >
                          WIPE DATA CACHE
                        </button>
                        <button
                          onClick={() => {
                            soundEngine.playError();
                            addLog("Safety systems status tested.");
                            alert("Override active. Simulated diagnostics verified.");
                          }}
                          className="py-2 bg-slate-900 hover:bg-slate-800 text-amber-500 font-mono text-[9px] font-bold rounded border border-slate-800 hover:border-slate-700 active:scale-95 transition-all text-center"
                        >
                          SAFETY OVERRIDE
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right pane: Console Syslog readout */}
                <div className="md:col-span-4 p-6 bg-[#0b0d10] flex flex-col overflow-hidden">
                  <h3 className="text-[10px] font-bold font-mono text-slate-400 mb-3 uppercase tracking-wider">
                    CONSOLE DIAGNOSTIC LOGS
                  </h3>
                  
                  <div className="flex-1 bg-slate-950 border border-slate-900 p-4 rounded-2xl font-mono text-[8.5px] text-slate-400 overflow-y-auto space-y-2 custom-scrollbar shadow-inner leading-relaxed">
                    <div className="text-slate-300"># System Audit:</div>
                    <div className="border-b border-slate-900 pb-2 mb-2 space-y-0.5">
                      <div>OS: SECURE-RELAY-VAULT-V4</div>
                      <div>Entropy status: OK</div>
                      <div>Key: CONCENTRIC-MATH-GEARS</div>
                    </div>
                    {consoleLogs.map((log, idx) => (
                      <div key={`console-log-${idx}`} className="leading-relaxed">
                        <span className="text-slate-700 font-semibold">{">"}</span> {log}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
