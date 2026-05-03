import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ChevronRight, Terminal, Smartphone } from "lucide-react";
import API_BASE from "../config";
import { useNavigate } from "react-router-dom";

const POSLogin = () => {
    const [phone, setPhone] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_BASE}/api/auth/pos-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, pin })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("pos_token", data.token);
                localStorage.setItem("pos_user", JSON.stringify(data.user));
                navigate("/pos");
            } else {
                setError(data.error || "Invalid Credentials");
            }
        } catch (err) {
            setError("Connection Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050608] flex items-center justify-center p-6 font-sans">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-12 relative z-10 shadow-2xl"
            >
                <div className="flex flex-col items-center mb-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-8 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Terminal className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic italic-shadow">POS Terminal</h1>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mt-3">Elite Access Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Staff Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-sm font-bold text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/10"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                            <input 
                                type="password"
                                placeholder="Access PIN"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-sm font-bold text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/10"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-rose-500 text-[10px] font-black uppercase text-center tracking-widest bg-rose-500/10 py-3 rounded-xl border border-rose-500/20"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        {loading ? "Authenticating..." : (
                            <>Initialize Session <ChevronRight className="w-5 h-5" /></>
                        )}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Contact Business Admin for credentials</p>
                </div>
            </motion.div>
        </div>
    );
};

export default POSLogin;
