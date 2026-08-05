import React, { useState, useEffect } from "react";
import { 
  ChefHat, Search, RefreshCw, Layers, 
  Plus, Package, Trash2, Edit3, 
  ArrowRight, Beaker, Save, DollarSign, AlertCircle
} from "lucide-react";
import API_BASE from "../config";

const RecipeMaster = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [loadingMenu, setLoadingMenu] = useState(true);
    const [loadingRecipe, setLoadingRecipe] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const getAuthHeaders = () => {
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        };
    };

    const getImpersonateParam = () => {
        const impId = sessionStorage.getItem("impersonate_id");
        return impId && impId !== "global" ? `?target_user_id=${impId}` : "";
    };

    const fetchInitialData = async () => {
        setLoadingMenu(true);
        try {
            const q = getImpersonateParam();
            const [itemsRes, rawRes] = await Promise.all([
                fetch(`${API_BASE}/api/business-items${q}`, { headers: getAuthHeaders() }),
                fetch(`${API_BASE}/api/inventory/raw${q}`, { headers: getAuthHeaders() })
            ]);

            const [itemsData, rawData] = await Promise.all([
                itemsRes.json(), rawRes.json()
            ]);

            const itemsArr = Array.isArray(itemsData) ? itemsData : (itemsData.items || []);
            setMenuItems(itemsArr);
            setRawMaterials(Array.isArray(rawData) ? rawData : []);
            
            if (itemsArr.length > 0 && !selectedMenuItem) {
                handleSelectMenuItem(itemsArr[0]);
            }
        } catch (e) {
            console.error("Failed to load recipe initial data:", e);
        } finally {
            setLoadingMenu(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleSelectMenuItem = async (item) => {
        setSelectedMenuItem(item);
        setLoadingRecipe(true);
        try {
            const q = getImpersonateParam();
            const res = await fetch(`${API_BASE}/api/inventory/recipes/${item.id}${q}`, {
                headers: getAuthHeaders()
            });
            const d = await res.json();
            if (Array.isArray(d)) {
                setRecipeIngredients(d.map(r => ({
                    raw_item_id: r.raw_item_id,
                    quantity: r.quantity,
                    unit: r.unit || 'Kg',
                    item_name: r.item_name,
                    unit_cost: parseFloat(r.unit_cost || r.last_purchase_price || 0)
                })));
            } else {
                setRecipeIngredients([]);
            }
        } catch (e) {
            console.error("Fetch recipe error:", e);
            setRecipeIngredients([]);
        } finally {
            setLoadingRecipe(false);
        }
    };

    const handleAddIngredientRow = () => {
        if (rawMaterials.length === 0) return alert("Please create raw material items first!");
        const firstRaw = rawMaterials[0];
        setRecipeIngredients(prev => [
            ...prev,
            {
                raw_item_id: firstRaw.id,
                quantity: 0.1,
                unit: firstRaw.unit || 'Kg',
                item_name: firstRaw.item_name,
                unit_cost: parseFloat(firstRaw.unit_cost || firstRaw.last_purchase_price || 0)
            }
        ]);
    };

    const handleIngredientChange = (index, field, value) => {
        setRecipeIngredients(prev => {
            const copy = [...prev];
            if (field === 'raw_item_id') {
                const rawObj = rawMaterials.find(r => String(r.id) === String(value));
                if (rawObj) {
                    copy[index] = {
                        ...copy[index],
                        raw_item_id: rawObj.id,
                        unit: rawObj.unit || 'Kg',
                        item_name: rawObj.item_name,
                        unit_cost: parseFloat(rawObj.unit_cost || rawObj.last_purchase_price || 0)
                    };
                }
            } else {
                copy[index] = { ...copy[index], [field]: value };
            }
            return copy;
        });
    };

    const handleRemoveIngredient = (index) => {
        setRecipeIngredients(prev => prev.filter((_, i) => i !== index));
    };

    const handleSaveRecipe = async () => {
        if (!selectedMenuItem) return;
        setSaving(true);
        try {
            const q = getImpersonateParam();
            const body = {
                menu_item_id: selectedMenuItem.id,
                ingredients: recipeIngredients.map(ing => ({
                    raw_item_id: ing.raw_item_id,
                    quantity: parseFloat(ing.quantity || 0),
                    unit: ing.unit
                }))
            };

            const res = await fetch(`${API_BASE}/api/inventory/recipes${q}`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            });

            if (res.ok) {
                alert("Recipe saved successfully!");
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || "Failed to save recipe"}`);
            }
        } catch (e) {
            console.error("Save recipe error:", e);
            alert("Error saving recipe.");
        } finally {
            setSaving(false);
        }
    };

    const filteredMenuItems = menuItems.filter(m => 
        (m.product_name || m.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate dish food cost
    const totalDishFoodCost = recipeIngredients.reduce((sum, ing) => {
        const qty = parseFloat(ing.quantity || 0);
        const rawObj = rawMaterials.find(r => String(r.id) === String(ing.raw_item_id));
        const cost = rawObj ? parseFloat(rawObj.unit_cost || rawObj.last_purchase_price || 0) : parseFloat(ing.unit_cost || 0);
        return sum + (qty * cost);
    }, 0);

    const dishSellingPrice = parseFloat(selectedMenuItem?.price || 0);
    const foodCostPercentage = dishSellingPrice > 0 ? ((totalDishFoodCost / dishSellingPrice) * 100) : 0;

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-3 animate-pro-in pb-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
                <div>
                    <h2 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Recipe Master & Bill of Materials (BOM)</h2>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Link menu items to raw materials for automated stock depletion & dish cost analysis</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchInitialData} className="px-3 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingMenu ? 'animate-spin text-emerald-500' : ''}`} /> Sync Menu
                    </button>
                    {selectedMenuItem && (
                        <button onClick={handleSaveRecipe} disabled={saving} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-600/20">
                            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Recipe"}
                        </button>
                    )}
                </div>
            </div>

            {/* Main Dual Pane Layout */}
            <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-hidden">
                {/* Left Pane: Menu Catalog */}
                <div className="w-full md:w-80 bg-white dark:bg-[#1e2129] rounded-xl border border-slate-100 dark:border-white/5 flex flex-col overflow-hidden shadow-sm">
                    <div className="p-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
                        <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-lg">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                placeholder="Search menu dishes..." 
                                className="bg-transparent text-[11px] font-bold outline-none w-full text-slate-800 dark:text-white uppercase tracking-tight"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                        {loadingMenu ? (
                            <div className="p-8 text-center text-slate-400 text-[11px] font-bold animate-pulse">Loading menu items...</div>
                        ) : filteredMenuItems.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-[11px] font-bold">No menu dishes found</div>
                        ) : filteredMenuItems.map(item => {
                            const isSelected = selectedMenuItem && selectedMenuItem.id === item.id;

                            return (
                                <button 
                                    key={item.id}
                                    onClick={() => handleSelectMenuItem(item)}
                                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${isSelected ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'}`}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0 text-left">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                                            <ChefHat className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[12px] font-black uppercase truncate tracking-tight">{item.product_name || item.name}</p>
                                            <p className={`text-[9px] font-bold uppercase tracking-widest ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>{item.category || 'General'}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[11px] font-black ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>₹{item.price || 0}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Pane: Recipe Editor */}
                <div className="flex-1 bg-white dark:bg-[#1e2129] rounded-xl border border-slate-100 dark:border-white/5 flex flex-col overflow-hidden shadow-sm">
                    {!selectedMenuItem ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                            <Beaker className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                            <h3 className="text-[14px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Select a Menu Item</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Choose a dish from the left catalog to map raw ingredient proportions</p>
                        </div>
                    ) : (
                        <>
                            {/* Selected Dish Header */}
                            <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                                        <ChefHat className="w-5 h-5 text-emerald-500" /> {selectedMenuItem.product_name || selectedMenuItem.name}
                                    </h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Selling Price: ₹{dishSellingPrice.toFixed(2)} | Category: {selectedMenuItem.category || 'General'}</p>
                                </div>

                                {/* Food Cost Badge */}
                                <div className="flex items-center gap-3 bg-white dark:bg-black/40 px-3 py-2 rounded-xl border border-slate-100 dark:border-white/5">
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Est. Food Cost</p>
                                        <p className="text-[14px] font-black text-emerald-600 dark:text-emerald-500">₹{totalDishFoodCost.toFixed(2)}</p>
                                    </div>
                                    <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Cost %</p>
                                        <p className={`text-[14px] font-black ${foodCostPercentage > 40 ? 'text-rose-500' : 'text-indigo-500'}`}>{foodCostPercentage.toFixed(1)}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Ingredient Table */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Required Raw Ingredients ({recipeIngredients.length})</h4>
                                    <button onClick={handleAddIngredientRow} className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                        <Plus className="w-3.5 h-3.5" /> Add Ingredient
                                    </button>
                                </div>

                                {loadingRecipe ? (
                                    <div className="p-12 text-center text-slate-400 text-[11px] font-bold animate-pulse">Loading recipe ingredients...</div>
                                ) : recipeIngredients.length === 0 ? (
                                    <div className="p-12 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-xl text-slate-400 text-[11px] font-bold">
                                        No raw materials configured for this dish. Click "Add Ingredient" to create the recipe.
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {recipeIngredients.map((ing, idx) => {
                                            const rawObj = rawMaterials.find(r => String(r.id) === String(ing.raw_item_id));
                                            const unitCost = rawObj ? parseFloat(rawObj.unit_cost || rawObj.last_purchase_price || 0) : 0;
                                            const lineCost = parseFloat(ing.quantity || 0) * unitCost;

                                            return (
                                                <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-100 dark:border-white/5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                                                    <div className="flex-1 w-full sm:w-auto">
                                                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Raw Ingredient</label>
                                                        <select 
                                                            value={ing.raw_item_id} 
                                                            onChange={(e) => handleIngredientChange(idx, 'raw_item_id', e.target.value)} 
                                                            className="w-full bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 outline-none text-slate-900 dark:text-white uppercase font-bold cursor-pointer"
                                                        >
                                                            {rawMaterials.map(rm => (
                                                                <option key={rm.id} value={rm.id}>{rm.item_name} ({rm.unit || 'Kg'}) - ₹{rm.unit_cost || rm.last_purchase_price || 0}/unit</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="w-full sm:w-32">
                                                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Quantity</label>
                                                        <input 
                                                            type="number" 
                                                            step="0.001"
                                                            value={ing.quantity} 
                                                            onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)} 
                                                            className="w-full bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 outline-none text-slate-900 dark:text-white font-bold"
                                                        />
                                                    </div>

                                                    <div className="w-full sm:w-24">
                                                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit</label>
                                                        <input 
                                                            type="text" 
                                                            disabled
                                                            value={ing.unit || 'Kg'} 
                                                            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-slate-400 uppercase font-bold"
                                                        />
                                                    </div>

                                                    <div className="w-full sm:w-32 text-right">
                                                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Cost</label>
                                                        <p className="py-1.5 font-black text-emerald-600 dark:text-emerald-500">₹{lineCost.toFixed(2)}</p>
                                                    </div>

                                                    <div className="pt-3 sm:pt-0">
                                                        <button onClick={() => handleRemoveIngredient(idx)} className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-rose-400 hover:text-rose-600">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeMaster;
