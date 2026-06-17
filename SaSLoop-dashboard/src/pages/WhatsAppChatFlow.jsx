import React, { useState, useEffect } from "react";
import { 
  Cpu, Search, RefreshCw, Filter, 
  Plus, ShieldCheck, Database, MessageSquare,
  Globe, Zap, MoreVertical, Edit3, Trash2,
  Terminal, Play, History, ChevronRight, X,
  Check, ToggleLeft, ToggleRight, ArrowDown, MoveDown,
  Clock, UserCheck, AlertCircle, Save, Sparkles, HelpCircle, CheckCircle2
} from "lucide-react";
import API_BASE from "../config";

const WhatsAppChatflow = () => {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Builder View State
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [activeFlow, setActiveFlow] = useState(null); // The flow being edited
  const [activeTab, setActiveTab] = useState("FLOWS"); // FLOWS, HISTORY

  // Demo History Logs
  const historyLogs = [
    { id: 1, flowName: "Welcome Auto-Reply", contact: "+919876543210", stepReached: "End Node", trigger: "hello", time: "May 31, 2026, 03:40 PM", status: "SUCCESS" },
    { id: 2, flowName: "Table Booking Bot", contact: "+918123456789", stepReached: "Question: Guests Count", trigger: "book table", time: "May 31, 2026, 02:15 PM", status: "IN_PROGRESS" },
    { id: 3, flowName: "Welcome Auto-Reply", contact: "+917766554433", stepReached: "Welcome Msg", trigger: "hi", time: "May 30, 2026, 08:30 PM", status: "SUCCESS" },
    { id: 4, flowName: "Feedback Survey", contact: "+919900887766", stepReached: "Agent Notification", trigger: "rating", time: "May 29, 2026, 01:10 PM", status: "SUCCESS" }
  ];

  const getMockFlows = () => [
    {
      id: 1,
      name: "Welcome Auto-Reply",
      description: "Greets new leads when they send standard greetings",
      triggers: ["hello", "hi", "hey", "start"],
      isActive: true,
      runsCount: 382,
      steps: [
        { id: "s1", type: "MESSAGE", text: "Hello! Welcome to FoodHub. 🍔\nHow can we help you today? Please reply with a number or click a button below." },
        { id: "s2", type: "BUTTONS", text: "Choose an option:", buttons: ["View Menu 📝", "Book Table 📅", "Talk to Agent 📞"] },
        { id: "s3", type: "DELAY", value: "3" },
        { id: "s4", type: "MESSAGE", text: "If you need immediate support, our team is always ready!" }
      ]
    },
    {
      id: 2,
      name: "Table Booking Bot",
      description: "Collects table booking details automatically",
      triggers: ["book", "table", "reserve"],
      isActive: true,
      runsCount: 145,
      steps: [
        { id: "tb1", type: "MESSAGE", text: "Awesome! Let's get your table reserved. 📅" },
        { id: "tb2", type: "MESSAGE", text: "How many guests will be joining us today? (Send a number)" },
        { id: "tb3", type: "DELAY", value: "5" },
        { id: "tb4", type: "ASSIGN_AGENT", agentGroup: "Support Pool" }
      ]
    },
    {
      id: 3,
      name: "Feedback Survey",
      description: "Requests review feedback rating from clients",
      triggers: ["feedback", "rating", "review"],
      isActive: false,
      runsCount: 92,
      steps: [
        { id: "f1", type: "MESSAGE", text: "Thank you for dining with us! How would you rate your food? (1-5 stars)" },
        { id: "f2", type: "BUTTONS", text: "Select your rating:", buttons: ["⭐⭐⭐⭐⭐ Excellent", "⭐⭐⭐⭐ Good", "⭐⭐⭐ Average"] }
      ]
    }
  ];

  const fetchFlows = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/whatsapp/chatflows`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setFlows(data.map(f => ({
            id: f.id,
            name: f.name,
            description: f.description,
            triggers: f.triggers || [],
            steps: f.steps || [],
            isActive: f.is_active,
            runsCount: f.runs_count || 0,
            date: f.date
          })));
        } else {
          setFlows(getMockFlows());
        }
      }
    } catch (err) {
      console.error("Failed to load chatflows:", err);
      setFlows(getMockFlows());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleFlow = async (id) => {
    const flow = flows.find(f => f.id === id);
    if (!flow) return;
    const nextStatus = !flow.isActive;

    try {
      const res = await fetch(`${API_BASE}/api/whatsapp/chatflows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          id: flow.id,
          name: flow.name,
          description: flow.description,
          triggers: flow.triggers,
          steps: flow.steps,
          is_active: nextStatus
        })
      });

      if (res.ok) {
        setFlows(flows.map(f => f.id === id ? { ...f, isActive: nextStatus } : f));
        showToast(`Flow "${flow.name}" is now ${nextStatus ? "Active" : "Inactive"}.`);
      }
    } catch (e) {
      console.error("Failed to toggle flow status:", e);
      showToast("Failed to toggle flow status.", "error");
    }
  };

  const handleDeleteFlow = async (id) => {
    if (window.confirm("Are you sure you want to delete this chat automation flow?")) {
      try {
        const res = await fetch(`${API_BASE}/api/whatsapp/chatflows/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
          setFlows(flows.filter(f => f.id !== id));
          showToast("Automation flow deleted successfully.", "error");
        }
      } catch (err) {
        console.error("Error deleting flow:", err);
        showToast("Failed to delete flow.", "error");
      }
    }
  };

  const handleEditFlow = (flow) => {
    setActiveFlow(JSON.parse(JSON.stringify(flow))); // Deep copy
    setIsBuilderOpen(true);
  };

  const handleCreateNewFlow = () => {
    const newFlowObj = {
      id: Date.now(),
      name: "New Custom Automation Flow",
      description: "Trigger automations via customer keywords.",
      triggers: ["help"],
      isActive: true,
      runsCount: 0,
      steps: [
        { id: "init_1", type: "MESSAGE", text: "Thanks for reaching out! How can we assist you?" }
      ]
    };
    setActiveFlow(newFlowObj);
    setIsBuilderOpen(true);
  };

  // BUILDER STEP OPERATIONS
  const addBuilderStep = (type) => {
    let newStep = { id: `step_${Date.now()}`, type };
    if (type === "MESSAGE") {
      newStep.text = "Write your automated message content here...";
    } else if (type === "BUTTONS") {
      newStep.text = "Click one of the options below:";
      newStep.buttons = ["Option 1", "Option 2"];
    } else if (type === "DELAY") {
      newStep.value = "5";
    } else if (type === "ASSIGN_AGENT") {
      newStep.agentGroup = "Support Pool";
    }

    setActiveFlow({
      ...activeFlow,
      steps: [...activeFlow.steps, newStep]
    });
  };

  const deleteBuilderStep = (stepId) => {
    setActiveFlow({
      ...activeFlow,
      steps: activeFlow.steps.filter(s => s.id !== stepId)
    });
  };

  const updateBuilderStepValue = (stepId, field, value) => {
    setActiveFlow({
      ...activeFlow,
      steps: activeFlow.steps.map(s => {
        if (s.id === stepId) {
          return { ...s, [field]: value };
        }
        return s;
      })
    });
  };

  const updateBuilderStepButton = (stepId, btnIdx, val) => {
    setActiveFlow({
      ...activeFlow,
      steps: activeFlow.steps.map(s => {
        if (s.id === stepId) {
          const updatedButtons = [...s.buttons];
          updatedButtons[btnIdx] = val;
          return { ...s, buttons: updatedButtons };
        }
        return s;
      })
    });
  };

  const addBuilderStepButton = (stepId) => {
    setActiveFlow({
      ...activeFlow,
      steps: activeFlow.steps.map(s => {
        if (s.id === stepId) {
          return { ...s, buttons: [...s.buttons, `Option ${s.buttons.length + 1}`] };
        }
        return s;
      })
    });
  };

  const deleteBuilderStepButton = (stepId, btnIdx) => {
    setActiveFlow({
      ...activeFlow,
      steps: activeFlow.steps.map(s => {
        if (s.id === stepId) {
          return { ...s, buttons: s.buttons.filter((_, idx) => idx !== btnIdx) };
        }
        return s;
      })
    });
  };

  const handleSaveFlow = async () => {
    if (!activeFlow.name.trim()) {
      alert("Please specify a flow name.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/whatsapp/chatflows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          id: activeFlow.id,
          name: activeFlow.name,
          description: activeFlow.description,
          triggers: activeFlow.triggers,
          steps: activeFlow.steps,
          is_active: activeFlow.isActive
        })
      });

      if (res.ok) {
        const saved = await res.json();
        const formatted = {
          id: saved.id,
          name: saved.name,
          description: saved.description,
          triggers: saved.triggers || [],
          steps: saved.steps || [],
          isActive: saved.is_active,
          runsCount: saved.runs_count || 0,
          date: saved.date
        };

        const index = flows.findIndex(f => f.id === activeFlow.id);
        if (index !== -1) {
          const updated = [...flows];
          updated[index] = formatted;
          setFlows(updated);
          showToast(`Flow "${activeFlow.name}" updated successfully.`);
        } else {
          setFlows([formatted, ...flows]);
          showToast(`Flow "${activeFlow.name}" created and deployed.`);
        }
        setIsBuilderOpen(false);
      } else {
        showToast("Failed to save flow.", "error");
      }
    } catch (err) {
      console.error("Error saving flow:", err);
      showToast("Error connecting to chatflow service.", "error");
    }
  };

  return (
    <div className="space-y-4 animate-pro-in pb-10">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-white transition-all transform animate-bounce ${
          toast.type === "success" ? "bg-emerald-600 border-emerald-500" : "bg-rose-600 border-rose-500"
        }`}>
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-white" /> : <AlertCircle className="w-5 h-5 text-white" />}
          <span className="text-[12px] font-bold tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-500" />
            Chat-Flow Automation
          </h2>
          <p className="text-[11px] text-slate-500">Construct card-based conversational pathways triggered by user keywords.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Section view switcher */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border">
            <button 
              onClick={() => setActiveTab("FLOWS")}
              className={`px-3 py-1.5 text-[9px] font-black uppercase rounded ${
                activeTab === "FLOWS" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Active Bots
            </button>
            <button 
              onClick={() => setActiveTab("HISTORY")}
              className={`px-3 py-1.5 text-[9px] font-black uppercase rounded ${
                activeTab === "HISTORY" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Execution Logs
            </button>
          </div>

          {activeTab === "FLOWS" && (
            <button 
              onClick={handleCreateNewFlow} 
              className="pro-btn-primary h-9 px-4 font-black flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm text-[11px] uppercase tracking-wider animate-pulse"
            >
              <Plus className="w-4 h-4" /> Provision New Flow
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: FLOWS DIRECTORY LIST */}
      {activeTab === "FLOWS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flows.map((flow) => (
            <div key={flow.id} className="bg-white border border-slate-200/60 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
              <div className="p-4 space-y-3 flex-1">
                {/* Header Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-black text-slate-800 truncate" title={flow.name}>
                      {flow.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-snug line-clamp-2">
                      {flow.description}
                    </p>
                  </div>
                  {/* Status Toggle Switch */}
                  <button 
                    onClick={() => handleToggleFlow(flow.id)}
                    className="shrink-0"
                    title={flow.isActive ? "Deactivate Chatbot" : "Activate Chatbot"}
                  >
                    {flow.isActive ? (
                      <ToggleRight className="w-8 h-8 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-350" />
                    )}
                  </button>
                </div>

                {/* Trigger keywords */}
                <div className="space-y-1 bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block">Trigger Keywords</span>
                  <div className="flex flex-wrap gap-1">
                    {flow.triggers.map(trigger => (
                      <span key={trigger} className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 font-mono font-bold rounded text-[9px]">
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Summary properties */}
                <div className="flex items-center justify-between text-[9px] text-slate-450 font-bold border-t border-slate-50 pt-2 mt-1">
                  <span className="flex items-center gap-0.5"><Zap className="w-3 h-3 text-amber-500" /> Steps: {flow.steps.length} nodes</span>
                  <span>Runs Count: {flow.runsCount} executions</span>
                </div>
              </div>

              {/* Action Toolbar footer */}
              <div className="bg-slate-50 border-t border-slate-100 px-3 py-2 flex items-center justify-end gap-1.5">
                <button 
                  onClick={() => handleDeleteFlow(flow.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 bg-white border border-slate-200 rounded hover:border-rose-100"
                  title="Delete Flow"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleEditFlow(flow)}
                  className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded text-[10px] font-bold flex items-center gap-1 hover:bg-slate-100"
                >
                  <Edit3 className="w-3 h-3 text-slate-400" /> Builder Workspace
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: EXECUTION HISTORY LOGS */}
      {activeTab === "HISTORY" && (
        <div className="bg-white border border-slate-150 rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Historical Logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3">Automation Flow</th>
                  <th className="px-4 py-3">User Contact</th>
                  <th className="px-4 py-3">Trigger Word</th>
                  <th className="px-4 py-3">Fulfillment Status</th>
                  <th className="px-4 py-3">Timeline Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historyLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-800">{log.flowName}</td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{log.contact}</td>
                    <td className="px-4 py-3"><span className="px-1.5 py-0.5 bg-slate-100 border text-slate-600 font-mono rounded text-[9.5px]">{log.trigger}</span></td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                        log.status === "SUCCESS" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-bold">{log.time}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-[9px] font-bold text-blue-500 hover:underline">Inspect Node Logs</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FULL SCREEN CHAT FLOW BUILDER WORKSPACE */}
      {isBuilderOpen && activeFlow && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col h-[90vh]">
            
            {/* Builder Workspace Header */}
            <div className="border-b border-slate-150 px-6 py-4 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-500 animate-spin-slow" />
                <div>
                  <h3 className="text-[13px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                    Flow Builder Workspace: <input type="text" value={activeFlow.name} onChange={(e) => setActiveFlow({ ...activeFlow, name: e.target.value })} className="bg-transparent border-b border-dashed border-slate-350 focus:border-slate-800 px-1 font-bold outline-none text-slate-800 min-w-[200px]" />
                  </h3>
                  <p className="text-[10px] text-slate-500">Edit triggers and arrange the sequence of automated responses below.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleSaveFlow}
                  className="pro-btn-primary h-8.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save & Deploy
                </button>
                <button 
                  onClick={() => setIsBuilderOpen(false)}
                  className="p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-800 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Builder layout columns (Left Side components toolbar, Right Side main interactive canvas) */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Builder Left Toolbar */}
              <div className="w-60 border-r border-slate-250 bg-slate-50 p-4 space-y-4 select-none flex flex-col overflow-y-auto">
                <span className="text-[8.5px] font-black uppercase text-slate-400 tracking-widest block">Add Step Node</span>
                <p className="text-[9.5px] text-slate-450 leading-tight">Click on a step template card below to append it to the active flow hierarchy.</p>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => addBuilderStep("MESSAGE")}
                    className="w-full bg-white border border-slate-200 p-2.5 rounded-lg hover:border-emerald-500 hover:shadow-sm text-left flex items-start gap-2.5 transition-all text-slate-750"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-555 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[10.5px] font-bold">Standard Message</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 leading-snug">Push formatted text bubble payload.</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => addBuilderStep("BUTTONS")}
                    className="w-full bg-white border border-slate-200 p-2.5 rounded-lg hover:border-indigo-500 hover:shadow-sm text-left flex items-start gap-2.5 transition-all text-slate-750"
                  >
                    <Zap className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[10.5px] font-bold">Interactive Buttons</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 leading-snug">Present choices with custom quick links.</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => addBuilderStep("DELAY")}
                    className="w-full bg-white border border-slate-200 p-2.5 rounded-lg hover:border-amber-500 hover:shadow-sm text-left flex items-start gap-2.5 transition-all text-slate-750"
                  >
                    <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[10.5px] font-bold">Introduce Delay</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 leading-snug">Hold execution pipeline for X seconds.</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => addBuilderStep("ASSIGN_AGENT")}
                    className="w-full bg-white border border-slate-200 p-2.5 rounded-lg hover:border-rose-500 hover:shadow-sm text-left flex items-start gap-2.5 transition-all text-slate-750"
                  >
                    <UserCheck className="w-4 h-4 text-rose-555 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[10.5px] font-bold">Assign Agent Lock</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 leading-snug">Halt bot responder; notify support desk.</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Builder Main Canvas area */}
              <div className="flex-1 bg-slate-100 p-6 overflow-y-auto space-y-4 flex flex-col items-center select-none" style={{ backgroundImage: `radial-gradient(#cbd5e1 1.2px, transparent 1.2px)`, backgroundSize: '24px 24px' }}>
                
                {/* 1. KEYWORD TRIGGER CARD */}
                <div className="bg-white border border-emerald-500/35 rounded-xl shadow-md p-4 max-w-md w-full relative border-l-4 border-l-emerald-500">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-[9px] font-black uppercase text-emerald-600 tracking-wider flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> START: Keywords Trigger
                    </span>
                    <span className="text-[8.5px] text-slate-400">Step 0</span>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[8.5px] font-bold text-slate-400 uppercase">Incoming keywords (comma separated)</label>
                    <input 
                      type="text" 
                      value={activeFlow.triggers.join(", ")}
                      onChange={(e) => {
                        const split = e.target.value.split(",").map(kw => kw.trim().toLowerCase());
                        setActiveFlow({ ...activeFlow, triggers: split });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-[11px] font-mono outline-none focus:border-emerald-500 text-slate-800" 
                    />
                  </div>
                </div>

                {/* Connecting arrow */}
                {activeFlow.steps.length > 0 && <MoveDown className="w-5 h-5 text-slate-400" />}

                {/* 2. CHATFLOW STEPS CARDS LOOP */}
                {activeFlow.steps.map((step, idx) => {
                  return (
                    <React.Fragment key={step.id}>
                      <div className="bg-white border border-slate-200 rounded-xl shadow-md p-4 max-w-md w-full relative">
                        {/* Step title bar */}
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                          <span className={`text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                            step.type === "MESSAGE" ? "text-emerald-600" :
                            step.type === "BUTTONS" ? "text-indigo-600" :
                            step.type === "DELAY" ? "text-amber-600" :
                            "text-rose-650"
                          }`}>
                            {step.type === "MESSAGE" && <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />}
                            {step.type === "BUTTONS" && <Zap className="w-3.5 h-3.5 text-indigo-500" />}
                            {step.type === "DELAY" && <Clock className="w-3.5 h-3.5 text-amber-500" />}
                            {step.type === "ASSIGN_AGENT" && <UserCheck className="w-3.5 h-3.5 text-rose-500" />}
                            Step {idx + 1}: {step.type}
                          </span>
                          
                          {/* Step controls */}
                          <button 
                            onClick={() => deleteBuilderStep(step.id)}
                            className="p-1 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded transition-colors"
                            title="Delete this step node"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Step field editor controls */}
                        {step.type === "MESSAGE" && (
                          <div className="space-y-1">
                            <label className="block text-[8px] font-bold text-slate-450 uppercase">Message Text Payload</label>
                            <textarea
                              rows={3}
                              value={step.text}
                              onChange={(e) => updateBuilderStepValue(step.id, "text", e.target.value)}
                              className="w-full bg-slate-50 border border-slate-100 rounded p-2 text-[11px] font-medium outline-none focus:border-emerald-500 text-slate-800 leading-relaxed" 
                            />
                          </div>
                        )}

                        {step.type === "BUTTONS" && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[8px] font-bold text-slate-450 uppercase mb-0.5">Prompt Message Header</label>
                              <input
                                type="text"
                                value={step.text}
                                onChange={(e) => updateBuilderStepValue(step.id, "text", e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded px-2 py-1 text-[11px] font-medium outline-none focus:border-emerald-500 text-slate-800" 
                              />
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center">
                                <label className="block text-[8px] font-bold text-slate-400 uppercase">Button Options List</label>
                                {step.buttons.length < 3 && (
                                  <button 
                                    type="button"
                                    onClick={() => addBuilderStepButton(step.id)}
                                    className="text-[8.5px] font-bold text-indigo-600 hover:underline"
                                  >
                                    + Add Button
                                  </button>
                                )}
                              </div>
                              {step.buttons.map((btn, bIdx) => (
                                <div key={bIdx} className="flex items-center gap-1.5">
                                  <input 
                                    type="text" 
                                    value={btn}
                                    onChange={(e) => updateBuilderStepButton(step.id, bIdx, e.target.value)}
                                    className="flex-1 bg-slate-50 border border-slate-100 rounded px-2 py-1 text-[10.5px] font-medium text-slate-750 outline-none" 
                                  />
                                  <button 
                                    type="button" 
                                    onClick={() => deleteBuilderStepButton(step.id, bIdx)}
                                    className="text-slate-400 hover:text-rose-500"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {step.type === "DELAY" && (
                          <div className="flex items-center gap-2">
                            <label className="block text-[9px] font-black uppercase text-slate-400">Duration Delay:</label>
                            <select
                              value={step.value}
                              onChange={(e) => updateBuilderStepValue(step.id, "value", e.target.value)}
                              className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1 rounded text-[10px] font-black outline-none focus:border-emerald-500 cursor-pointer"
                            >
                              <option value="2">2 seconds</option>
                              <option value="3">3 seconds</option>
                              <option value="5">5 seconds</option>
                              <option value="10">10 seconds</option>
                              <option value="30">30 seconds</option>
                            </select>
                          </div>
                        )}

                        {step.type === "ASSIGN_AGENT" && (
                          <div className="flex items-center gap-2">
                            <label className="block text-[9px] font-black uppercase text-slate-400">Support Routing Pool:</label>
                            <select
                              value={step.agentGroup}
                              onChange={(e) => updateBuilderStepValue(step.id, "agentGroup", e.target.value)}
                              className="bg-slate-50 border border-slate-200 text-slate-750 px-3 py-1 rounded text-[10px] font-black outline-none cursor-pointer"
                            >
                              <option value="Support Pool">General Support Pool</option>
                              <option value="Billing Desk">Billing & Accounts Desk</option>
                              <option value="Kitchen Escalations">Chef / Kitchen Manager</option>
                            </select>
                          </div>
                        )}

                      </div>

                      {/* Connecting down arrow between steps */}
                      {idx < activeFlow.steps.length - 1 && <MoveDown className="w-5 h-5 text-slate-400" />}
                    </React.Fragment>
                  );
                })}

                {/* END CONVERSATION TARGET DOME */}
                {activeFlow.steps.length > 0 && (
                  <>
                    <MoveDown className="w-5 h-5 text-slate-450" />
                    <div className="bg-slate-800 text-white border rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm">
                      END PIPELINE
                    </div>
                  </>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default WhatsAppChatflow;
