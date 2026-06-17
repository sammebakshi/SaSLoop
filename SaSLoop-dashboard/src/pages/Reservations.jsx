import React, { useState, useEffect } from "react";
import { 
  Calendar, Clock, User, Phone, 
  CheckCircle2, AlertCircle, RefreshCw, 
  Plus, Search, Filter, History
} from "lucide-react";
import API_BASE from "../config";

const Reservations = () => {
    return (
        <div className="space-y-3 animate-pro-in">
            {/* Precision Reservation Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="pro-heading uppercase tracking-tighter">Table Reservations</h2>
                    <p className="pro-subheading uppercase tracking-widest text-[9px]">AI-driven bookings and manual seat orchestration</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button className="pro-btn-secondary h-7 px-2"><History className="w-3 h-3" /> History</button>
                    <button className="pro-btn-primary h-7 px-3"><Plus className="w-3 h-3" /> New Booking</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Pending Protocol */}
                <div className="pro-card min-h-[300px] flex flex-col">
                    <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Action Required
                        </h3>
                        <span className="text-[9px] font-black text-slate-400">0 PENDING</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-30">
                        <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center mb-3">
                            <RefreshCw className="w-5 h-5 text-slate-300" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No pending protocols</p>
                    </div>
                </div>

                {/* Scheduled Matrix */}
                <div className="pro-card min-h-[300px] flex flex-col">
                    <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Upcoming
                        </h3>
                        <span className="text-[9px] font-black text-slate-400">0 SCHEDULED</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-30">
                        <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center mb-3">
                            <Clock className="w-5 h-5 text-slate-300" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No upcoming reservations</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reservations;
