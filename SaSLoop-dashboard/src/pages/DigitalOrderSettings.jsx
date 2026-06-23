import React, { useState, useEffect, useRef } from "react";
import { 
  Monitor, Smartphone, Globe, Layers, 
  Plus, Search, RefreshCw, Filter, 
  Settings2, ShieldCheck, Database, Layout, ChevronRight,
  Wrench, Edit3, Trash2, Truck, Check, X, AlertTriangle, Info,
  Image, MapPin, Palette, Coins, Clock
} from "lucide-react";
import API_BASE from "../config";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
});

// Helper component to auto-center map
function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}

// MapEventsHandler helper component
function MapEventsHandler({ onClick }) {
    useMapEvents({
        click(e) {
            if (onClick) onClick(e.latlng.lat, e.latlng.lng);
        }
    });
    return null;
}


const DEFAULT_SETTINGS = {
  openingTime: "10:00 AM",
  closingTime: "10:00 PM",
  everyDay: true,
  openDays: { Sun: true, Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true },
  addressSelectionType: "map",
  showCategoryFirst: false,
  autoFulfillAfterDeliveryDone: false,
  autoAssignDeliveryOn: "",
  timeSlots: [],

  // Outlet Settings
  isDigitalOrderingEnabled: true,
  sendDigitalOrdersNotificationOn: "All",
  reduceInventoryForDigitalOrderPlatform: true,
  whatsappNumber: "",
  deliveryPartner: "Disabled",
  customMessageWhatsApp: "I want to order food>>",

  // Item Level Settings
  itemLevelShowDescription: false,
  itemLevelShowPreparationTime: false,
  itemLevelShowNutritionInfo: false,

  // Other Digital Order Settings
  otherEnableForDelivery: true,
  otherAutoAcceptOrder: false,
  otherAutoAcceptOrderOnCash: false,
  otherSendOtpVia: "SMS",
  otherEnableForPickup: true,
  otherLoginWithTruecaller: false,
  otherEnableForDineIn: false,
  otherDineInTitle: "DINE IN",
  otherDineInTitlePlaceholder: "",
  otherAskOrderTypeBeforePlacing: false,
  otherShowWhatsAppLink: true,
  otherShowGridView: true,
  otherShowListView: false,
  otherEnableCategorySorting: true,
  otherLanguage: "All",
  otherSkipOtpVerification: true,
  otherAutoCompleteOrderAfterAccept: false,
  otherSendEbillAfterComplete: false,
  otherEnableSubCategoryView: false,
  otherEnableCollapsibleViewForItems: false,
  otherEnableCardCategoryFilter: false,
  otherTagline: "",
  otherHideFoodTypeFromUi: false,
  otherLoyaltyPoints: false,
  otherShowInstallAppSuggestion: false,
  otherDisableOrderNow: false,
  otherItemSortBy: "None",

  // Pages
  pageAboutUs: "",
  pagePrivacyPolicy: "",
  pageRefund: "",
  pageTermsAndConditions: "",

  // Customer Level Settings
  custShowLogoDigitalPlatform: true,
  custCustomersCanReject: false,
  custEnablePreOrder: false,
  custDeliveryRadiusKm: 15,
  custDeliveryLimitType: "radius",
  custDeliveryDistanceKm: 15,
  custOfflineMessage: "",

  // Pre Order Settings
  preOrderDaysLimit: 1,
  preOrderStartTime: "",
  preOrderEndTime: "",
  preOrderTimeSlots: [],
  preOrderStartFrom: "Same Day",
  preOrderDetailsMandatory: false,
  preOrderRevenueMode: "FULFILLMENT_DAY",

  // Digital Order Promo Code Settings
  promoEnableDineIn: false,
  promoEnableDelivery: false,
  promoEnablePickup: false,

  // Order Limit
  limitMinDineIn: 0,
  limitMinPickup: 0,
  limitMinDelivery: 0,
  limitCodAfterAmount: 0,

  // Payment Gateway Settings
  pgPayUSuccessUrl: "",
  pgPayUFailureUrl: "",
  pgDineInCash: true,
  pgDineInCod: false,
  pgDineInPayLater: false,
  pgDineInUpi: false,
  pgPickUpCash: true,
  pgPickUpCod: false,
  pgPickUpPayLater: false,
  pgPickUpUpi: false,
  pgDeliveryCash: true,
  pgDeliveryCod: false,
  pgDeliveryPayLater: false,
  pgDeliveryUpi: false,

  // Social media
  socialShowContact: false,
  socialContactNo: "",
  socialShowFacebook: false,
  socialFacebookLink: "",
  socialShowInstagram: false,
  socialInstagramLink: "",
  socialShowWebsite: false,
  socialWebsiteLink: "",
  socialShowPinterest: false,
  socialPinterestLink: "",
  socialShowLinkedIn: false,
  socialLinkedInLink: "",
  socialShowYouTube: false,
  socialYouTubeLink: "",

  // Table ordering
  tableSkipOtp: false,
  tableAllowRequestAssistance: false,
  tableRequestAssistanceTypes: "",
  tableAskCustDetailsCallWaiter: false,
  tableShowPay: false,
  tableAskWaiterTip: false,
  tableShowGetBillButton: false,

  // Order Update Settings
  orderUpdateSendVia: "WhatsApp",
  orderUpdateOnPlaced: false,
  orderUpdateOnAccepted: false,
  orderUpdateOnFulfilled: false,
  orderUpdateOnCancelled: false,
  orderUpdateOnFoodReady: false,
  orderUpdateOnDispatched: false
};

const DEFAULT_THEME = {
  preset: "Custom",
  mainBgText: "Web Page Color",
  mainBgColor: "#000000",
  bgText: "Header / Slider / Items",
  bgColor: "#000000",
  fontText: "Item / Price / Desc",
  fontColor: "#000000",
  fontStyle: "Font Style",
  googleFont: "Google Font",
  primaryText: "Image Placeholder / Button Color",
  primaryColor: "#000000",
  secondaryText: "Category Color",
  secondaryColor: "#000000",
  landingPageText: "Background Color",
  landingPageColor: "#000000",
  landingPageBgImage: ""
};

const THEME_PRESETS = {
  "Custom": {},
  "Default (Emerald)": {
    mainBgText: "Web Page Color",
    mainBgColor: "#f8fafc",
    bgText: "Header / Slider / Items",
    bgColor: "#ffffff",
    fontText: "Item / Price / Desc",
    fontColor: "#0f172a",
    fontStyle: "normal",
    googleFont: "Inter",
    primaryText: "Image Placeholder / Button Color",
    primaryColor: "#10b981",
    secondaryText: "Category Color",
    secondaryColor: "#047857",
    landingPageText: "Background Color",
    landingPageColor: "#ffffff"
  },
  "Sunset Orange": {
    mainBgText: "Web Page Color",
    mainBgColor: "#fffdfa",
    bgText: "Header / Slider / Items",
    bgColor: "#ffffff",
    fontText: "Item / Price / Desc",
    fontColor: "#1e293b",
    fontStyle: "normal",
    googleFont: "Outfit",
    primaryText: "Image Placeholder / Button Color",
    primaryColor: "#f97316",
    secondaryText: "Category Color",
    secondaryColor: "#c2410c",
    landingPageText: "Background Color",
    landingPageColor: "#fffbeb"
  },
  "Ocean Breeze": {
    mainBgText: "Web Page Color",
    mainBgColor: "#f0f9ff",
    bgText: "Header / Slider / Items",
    bgColor: "#ffffff",
    fontText: "Item / Price / Desc",
    fontColor: "#0f172a",
    fontStyle: "normal",
    googleFont: "Roboto",
    primaryText: "Image Placeholder / Button Color",
    primaryColor: "#0ea5e9",
    secondaryText: "Category Color",
    secondaryColor: "#0369a1",
    landingPageText: "Background Color",
    landingPageColor: "#f0fdf4"
  },
  "Midnight Dark": {
    mainBgText: "Web Page Color",
    mainBgColor: "#0f172a",
    bgText: "Header / Slider / Items",
    bgColor: "#1e293b",
    fontText: "Item / Price / Desc",
    fontColor: "#f8fafc",
    fontStyle: "normal",
    googleFont: "Outfit",
    primaryText: "Image Placeholder / Button Color",
    primaryColor: "#38bdf8",
    secondaryText: "Category Color",
    secondaryColor: "#0284c7",
    landingPageText: "Background Color",
    landingPageColor: "#0f172a"
  },
  "Sweet Lavender": {
    mainBgText: "Web Page Color",
    mainBgColor: "#faf5ff",
    bgText: "Header / Slider / Items",
    bgColor: "#ffffff",
    fontText: "Item / Price / Desc",
    fontColor: "#1e293b",
    fontStyle: "normal",
    googleFont: "Inter",
    primaryText: "Image Placeholder / Button Color",
    primaryColor: "#8b5cf6",
    secondaryText: "Category Color",
    secondaryColor: "#6d28d9",
    landingPageText: "Background Color",
    landingPageColor: "#f5f3ff"
  }
};

const Toggle = ({ checked, onChange, disabled }) => (
    <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        className={`${
            checked ? "bg-emerald-600" : "bg-slate-200"
        } relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
    >
        <span
            className={`${
                checked ? "translate-x-5" : "translate-x-0"
            } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
    </button>
);

const DigitalOrderSettings = () => {
    const [bizInfo, setBizInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tiers, setTiers] = useState([]);
    
    // Digital Order Settings modal state
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [settingsForm, setSettingsForm] = useState(DEFAULT_SETTINGS);
    const [settingsError, setSettingsError] = useState("");
    const [settingsSuccess, setSettingsSuccess] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);
    
    // Form state for adding/editing a tier
    const [newMin, setNewMin] = useState("");
    const [newMax, setNewMax] = useState("");
    const [newCharge, setNewCharge] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Banner Modal States & Ref
    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
    const [selectedBannerFile, setSelectedBannerFile] = useState(null);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [bannerError, setBannerError] = useState("");
    const [bannerSuccess, setBannerSuccess] = useState(false);
    const bannerFileInputRef = React.useRef(null);

    // Outlet Location Modal States
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [tempLat, setTempLat] = useState("");
    const [tempLng, setTempLng] = useState("");
    const [tempAddress, setTempAddress] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchingAddress, setSearchingAddress] = useState(false);
    const [savingLocation, setSavingLocation] = useState(false);
    const [locationError, setLocationError] = useState("");
    const [locationSuccess, setLocationSuccess] = useState(false);
    const [mapType, setMapType] = useState("roadmap"); // "roadmap" or "satellite"
    const locationMarkerRef = useRef(null);

    // Themes Settings Modal States
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
    const [themeForm, setThemeForm] = useState(DEFAULT_THEME);
    const [savingTheme, setSavingTheme] = useState(false);
    const [uploadingThemeBg, setUploadingThemeBg] = useState(false);
    const [themeError, setThemeError] = useState("");
    const [themeSuccess, setThemeSuccess] = useState(false);

    // Payment Gateway Settings Modal States
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [savingPayment, setSavingPayment] = useState(false);
    const [paymentError, setPaymentError] = useState("");
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const themeBgFileInputRef = useRef(null);
    const [isColorRefOpen, setIsColorRefOpen] = useState(false);

    const renderColorInputGroup = (labelText, textKey, colorKey) => {
        return (
            <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{labelText}</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="text" 
                        value={themeForm[textKey] || ""} 
                        onChange={(e) => setThemeForm({ ...themeForm, [textKey]: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold outline-none focus:border-emerald-500 transition-all"
                        placeholder={labelText}
                    />
                    <div className="relative flex items-center shrink-0 border border-slate-200 rounded-lg bg-white p-1">
                        <input 
                            type="color" 
                            value={themeForm[colorKey] || "#000000"} 
                            onChange={(e) => setThemeForm({ ...themeForm, [colorKey]: e.target.value })}
                            className="w-8 h-8 rounded-md border-0 cursor-pointer bg-transparent outline-none"
                        />
                        <input
                            type="text"
                            value={themeForm[colorKey] || ""}
                            onChange={(e) => setThemeForm({ ...themeForm, [colorKey]: e.target.value })}
                            className="w-16 text-center text-[10px] font-mono font-bold text-slate-600 outline-none uppercase"
                            maxLength={7}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const fetchBizInfo = async () => {
        setLoading(true);
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const res = await fetch(`${API_BASE}/api/business/status${targetParam}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();
            if (data.business) {
                setBizInfo(data.business);
                const rawTiers = data.business.delivery_tiers;
                const parsedTiers = typeof rawTiers === 'string' ? JSON.parse(rawTiers) : rawTiers;
                setTiers(parsedTiers || []);
            }
        } catch (e) {
            console.error("Error fetching business status:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBizInfo();
    }, []);

    const handleAddTier = () => {
        setErrorMsg("");
        const minVal = parseFloat(newMin);
        const maxVal = parseFloat(newMax);
        const chargeVal = parseFloat(newCharge);

        if (isNaN(minVal) || isNaN(maxVal) || isNaN(chargeVal)) {
            setErrorMsg("All fields must be valid numeric values.");
            return;
        }
        if (minVal < 0 || maxVal < 0 || chargeVal < 0) {
            setErrorMsg("Values cannot be negative.");
            return;
        }
        if (minVal >= maxVal) {
            setErrorMsg("Min distance must be less than Max distance.");
            return;
        }

        // Check for duplicate or overlapping range (optional warnings, but let's allow flexibility and just add it)
        const newTier = { min: minVal, max: maxVal, charge: chargeVal };
        const updated = [...tiers, newTier].sort((a, b) => a.min - b.min);
        setTiers(updated);

        // Reset form inputs
        setNewMin("");
        setNewMax("");
        setNewCharge("");
    };

    const handleRemoveTier = (index) => {
        const updated = tiers.filter((_, i) => i !== index);
        setTiers(updated);
    };

    const handleLoadDefaults = () => {
        const defaultTiers = [
            { min: 0, max: 3, charge: 0 },
            { min: 3, max: 5, charge: 20 },
            { min: 5, max: 10, charge: 50 }
        ];
        setTiers(defaultTiers);
    };

    const handleSaveTiers = async () => {
        setErrorMsg("");
        setSaveSuccess(false);
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            
            const response = await fetch(`${API_BASE}/api/business/setup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    delivery_tiers: tiers,
                    target_user_id: impersonateId || undefined
                })
            });

            if (response.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
                // Refresh local business status
                fetchBizInfo();
            } else {
                const data = await response.json();
                setErrorMsg(data.error || "Failed to save delivery charges.");
            }
        } catch (e) {
            console.error("Error saving business tiers:", e);
            setErrorMsg("Network error. Please try again.");
        }
    };

    const handleOpenSettingsModal = () => {
        const currentSettings = bizInfo.settings || {};
        setSettingsForm({
            ...DEFAULT_SETTINGS,
            ...currentSettings,
            openDays: {
                ...DEFAULT_SETTINGS.openDays,
                ...(currentSettings.openDays || {})
            },
            timeSlots: currentSettings.timeSlots || [],
            preOrderTimeSlots: currentSettings.preOrderTimeSlots || []
        });
        setSettingsError("");
        setSettingsSuccess(false);
        setIsSettingsModalOpen(true);
    };

    const handleSaveSettings = async () => {
        setSettingsError("");
        setSettingsSuccess(false);
        setSavingSettings(true);
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            
            const response = await fetch(`${API_BASE}/api/business/setup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    settings: settingsForm,
                    delivery_radius_km: settingsForm.custDeliveryLimitType === "distance" 
                        ? (parseInt(settingsForm.custDeliveryDistanceKm) || 15) 
                        : (parseInt(settingsForm.custDeliveryRadiusKm) || 15),
                    target_user_id: impersonateId || undefined
                })
            });

            if (response.ok) {
                setSettingsSuccess(true);
                setTimeout(() => setSettingsSuccess(false), 3000);
                fetchBizInfo();
            } else {
                const data = await response.json();
                setSettingsError(data.error || "Failed to save settings.");
            }
        } catch (e) {
            console.error("Error saving business settings:", e);
            setSettingsError("Network error. Please try again.");
        } finally {
            setSavingSettings(false);
        }
    };

    const handleAddTimeSlot = () => {
        setSettingsForm(prev => ({
            ...prev,
            timeSlots: [...prev.timeSlots, { start: "10:00 AM", end: "10:00 PM" }]
        }));
    };

    const handleRemoveTimeSlot = (index) => {
        setSettingsForm(prev => ({
            ...prev,
            timeSlots: prev.timeSlots.filter((_, i) => i !== index)
        }));
    };

    const handleTimeSlotChange = (index, field, value) => {
        setSettingsForm(prev => {
            const updated = [...prev.timeSlots];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, timeSlots: updated };
        });
    };

    const handleAddPreOrderTimeSlot = () => {
        setSettingsForm(prev => ({
            ...prev,
            preOrderTimeSlots: [...(prev.preOrderTimeSlots || []), { start: "10:00 AM", end: "10:00 PM" }]
        }));
    };

    const handleRemovePreOrderTimeSlot = (index) => {
        setSettingsForm(prev => ({
            ...prev,
            preOrderTimeSlots: (prev.preOrderTimeSlots || []).filter((_, i) => i !== index)
        }));
    };

    const handlePreOrderTimeSlotChange = (index, field, value) => {
        setSettingsForm(prev => {
            const updated = [...(prev.preOrderTimeSlots || [])];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, preOrderTimeSlots: updated };
        });
    };

    const handleResetDineInPG = () => {
        setSettingsForm(prev => ({
            ...prev,
            pgDineInCash: true,
            pgDineInCod: false,
            pgDineInPayLater: false,
            pgDineInUpi: false
        }));
    };

    const handleResetPickUpPG = () => {
        setSettingsForm(prev => ({
            ...prev,
            pgPickUpCash: true,
            pgPickUpCod: false,
            pgPickUpPayLater: false,
            pgPickUpUpi: false
        }));
    };

    const handleResetDeliveryPG = () => {
        setSettingsForm(prev => ({
            ...prev,
            pgDeliveryCash: true,
            pgDeliveryCod: false,
            pgDeliveryPayLater: false,
            pgDeliveryUpi: false
        }));
    };

    const handleOpenBannerModal = () => {
        setSelectedBannerFile(null);
        setBannerError("");
        setBannerSuccess(false);
        if (bannerFileInputRef.current) {
            bannerFileInputRef.current.value = "";
        }
        setIsBannerModalOpen(true);
    };

    const handleBannerFileChange = (e) => {
        setBannerError("");
        setBannerSuccess(false);
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith("image/")) {
                setBannerError("Please select an image file.");
                return;
            }
            setSelectedBannerFile(file);
        }
    };

    const handleUploadBanner = async () => {
        if (!selectedBannerFile) {
            setBannerError("Please select a file to upload.");
            return;
        }

        const currentBanners = bizInfo?.settings?.banners || [];
        if (currentBanners.length >= 5) {
            setBannerError("Banner upload limit reached. You can upload up to 5 banners.");
            return;
        }

        setUploadingBanner(true);
        setBannerError("");
        setBannerSuccess(false);

        try {
            const formData = new FormData();
            formData.append("image", selectedBannerFile);

            const uploadRes = await fetch(`${API_BASE}/api/catalog/upload`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: formData
            });

            if (!uploadRes.ok) {
                const errData = await uploadRes.json();
                throw new Error(errData.error || "Failed to upload image.");
            }

            const uploadData = await uploadRes.json();
            const newBannerUrl = uploadData.url;

            const updatedBanners = [...currentBanners, newBannerUrl];
            const impersonateId = sessionStorage.getItem("impersonate_id");

            const setupRes = await fetch(`${API_BASE}/api/business/setup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    settings: {
                        ...(bizInfo?.settings || {}),
                        banners: updatedBanners
                    },
                    banner_url: updatedBanners[0] || null,
                    target_user_id: impersonateId || undefined
                })
            });

            if (!setupRes.ok) {
                const errData = await setupRes.json();
                throw new Error(errData.error || "Failed to update business settings.");
            }

            setBannerSuccess(true);
            setSelectedBannerFile(null);
            if (bannerFileInputRef.current) {
                bannerFileInputRef.current.value = "";
            }
            await fetchBizInfo();
        } catch (e) {
            console.error("Error uploading banner:", e);
            setBannerError(e.message || "Something went wrong during upload.");
        } finally {
            setUploadingBanner(false);
        }
    };

    const handleDeleteBanner = async (bannerToDelete) => {
        setBannerError("");
        setBannerSuccess(false);

        const currentBanners = bizInfo?.settings?.banners || [];
        const updatedBanners = currentBanners.filter(b => b !== bannerToDelete);
        const impersonateId = sessionStorage.getItem("impersonate_id");

        try {
            const setupRes = await fetch(`${API_BASE}/api/business/setup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    settings: {
                        ...(bizInfo?.settings || {}),
                        banners: updatedBanners
                    },
                    banner_url: updatedBanners[0] || null,
                    target_user_id: impersonateId || undefined
                })
            });

            if (!setupRes.ok) {
                const errData = await setupRes.json();
                throw new Error(errData.error || "Failed to delete banner.");
            }

            await fetchBizInfo();
        } catch (e) {
            console.error("Error deleting banner:", e);
            setBannerError(e.message || "Failed to delete banner.");
        }
    };

    const handleOpenLocationModal = () => {
        const lat = bizInfo?.latitude || 34.262590028363;
        const lng = bizInfo?.longitude || 74.903476238251;
        const address = bizInfo?.address || "1st floor Rather Plaza, Kangan, Jammu and Kashmir 191202";
        setTempLat(lat);
        setTempLng(lng);
        setTempAddress(address);
        setSearchQuery("");
        setLocationError("");
        setLocationSuccess(false);
        setIsLocationModalOpen(true);
    };

    const handleReverseGeocode = async (lat, lng) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.display_name) {
                    setTempAddress(data.display_name);
                }
            }
        } catch (e) {
            console.error("Error reverse geocoding:", e);
        }
    };

    const updateCoords = (lat, lng, triggerReverseGeocode = true) => {
        setTempLat(lat);
        setTempLng(lng);
        if (triggerReverseGeocode) {
            handleReverseGeocode(lat, lng);
        }
    };

    const handleSearchAddress = async (e) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;
        setSearchingAddress(true);
        setLocationError("");
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    setTempLat(lat);
                    setTempLng(lon);
                    if (data[0].display_name) {
                        setTempAddress(data[0].display_name);
                    }
                } else {
                    setLocationError("Address not found. Please try a different search term.");
                }
            } else {
                setLocationError("Geocoding service error. Please try again.");
            }
        } catch (e) {
            console.error("Error searching address:", e);
            setLocationError("Failed to search address. Please try again.");
        } finally {
            setSearchingAddress(false);
        }
    };

    const handleCoordinateBlur = () => {
        const latVal = parseFloat(tempLat);
        const lngVal = parseFloat(tempLng);
        if (!isNaN(latVal) && !isNaN(lngVal)) {
            handleReverseGeocode(latVal, lngVal);
        }
    };

    const handleResetLocation = () => {
        const lat = bizInfo?.latitude || 34.262590028363;
        const lng = bizInfo?.longitude || 74.903476238251;
        const address = bizInfo?.address || "1st floor Rather Plaza, Kangan, Jammu and Kashmir 191202";
        setTempLat(lat);
        setTempLng(lng);
        setTempAddress(address);
        setSearchQuery("");
        setLocationError("");
        setLocationSuccess(false);
    };

    const handleSaveLocation = async () => {
        setLocationError("");
        setLocationSuccess(false);
        const latVal = parseFloat(tempLat);
        const lngVal = parseFloat(tempLng);
        if (isNaN(latVal) || isNaN(lngVal)) {
            setLocationError("Latitude and Longitude must be valid numbers.");
            return;
        }
        if (!tempAddress.trim()) {
            setLocationError("Outlet Address cannot be empty.");
            return;
        }
        setSavingLocation(true);
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            
            const response = await fetch(`${API_BASE}/api/business/setup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    latitude: latVal,
                    longitude: lngVal,
                    address: tempAddress,
                    target_user_id: impersonateId || undefined
                })
            });

            if (response.ok) {
                setLocationSuccess(true);
                setTimeout(() => {
                    setLocationSuccess(false);
                    setIsLocationModalOpen(false);
                }, 1500);
                // Refresh local business status
                fetchBizInfo();
            } else {
                const data = await response.json();
                setLocationError(data.error || "Failed to save outlet location.");
            }
        } catch (e) {
            console.error("Error saving location:", e);
            setLocationError("Network error. Please try again.");
        } finally {
            setSavingLocation(false);
        }
    };

    const handleOpenThemeModal = () => {
        const currentTheme = bizInfo?.settings?.theme || {};
        setThemeForm({
            ...DEFAULT_THEME,
            ...currentTheme
        });
        setThemeError("");
        setThemeSuccess(false);
        setIsThemeModalOpen(true);
    };

    const handlePresetChange = (presetName) => {
        const presetColors = THEME_PRESETS[presetName] || {};
        setThemeForm(prev => ({
            ...prev,
            preset: presetName,
            ...presetColors
        }));
    };

    const handleThemeBgFileChange = async (e) => {
        setThemeError("");
        setThemeSuccess(false);
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith("image/")) {
                setThemeError("Please select an image file.");
                return;
            }
            
            setUploadingThemeBg(true);
            try {
                const formData = new FormData();
                formData.append("image", file);

                const res = await fetch(`${API_BASE}/api/catalog/upload`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: formData
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || "Failed to upload theme background image.");
                }

                const uploadData = await res.json();
                setThemeForm(prev => ({
                    ...prev,
                    landingPageBgImage: uploadData.url
                }));
                setThemeSuccess(true);
                setTimeout(() => setThemeSuccess(false), 2000);
            } catch (err) {
                console.error("Theme background upload error:", err);
                setThemeError(err.message || "Something went wrong during image upload.");
            } finally {
                setUploadingThemeBg(false);
            }
        }
    };

    const handleClearThemeBgImage = () => {
        setThemeForm(prev => ({
            ...prev,
            landingPageBgImage: ""
        }));
        if (themeBgFileInputRef.current) {
            themeBgFileInputRef.current.value = "";
        }
    };

    const handleResetLandingColor = () => {
        const presetName = themeForm.preset;
        const presetColors = THEME_PRESETS[presetName] || {};
        setThemeForm(prev => ({
            ...prev,
            landingPageColor: presetColors.landingPageColor || "#ffffff"
        }));
    };

    const handleSaveTheme = async () => {
        setThemeError("");
        setThemeSuccess(false);
        setSavingTheme(true);
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            
            const updatedSettings = {
                ...(bizInfo?.settings || {}),
                theme: themeForm
            };

            const response = await fetch(`${API_BASE}/api/business/setup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    settings: updatedSettings,
                    target_user_id: impersonateId || undefined
                })
            });

            if (response.ok) {
                setThemeSuccess(true);
                await fetchBizInfo();
                setTimeout(() => {
                    setThemeSuccess(false);
                    setIsThemeModalOpen(false);
                }, 1500);
            } else {
                const data = await response.json();
                setThemeError(data.error || "Failed to save theme settings.");
            }
        } catch (e) {
            console.error("Error saving theme settings:", e);
            setThemeError("Network error. Please try again.");
        } finally {
            setSavingTheme(false);
        }
    };

    const handleOpenPaymentModal = () => {
        const currentSettings = bizInfo?.settings || {};
        setSettingsForm({
            ...DEFAULT_SETTINGS,
            ...currentSettings,
            openDays: {
                ...DEFAULT_SETTINGS.openDays,
                ...(currentSettings.openDays || {})
            },
            timeSlots: currentSettings.timeSlots || [],
            preOrderTimeSlots: currentSettings.preOrderTimeSlots || []
        });
        setPaymentError("");
        setPaymentSuccess(false);
        setIsPaymentModalOpen(true);
    };

    const handleSavePaymentSettings = async () => {
        setPaymentError("");
        setPaymentSuccess(false);
        setSavingPayment(true);
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            
            const response = await fetch(`${API_BASE}/api/business/setup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    settings: settingsForm,
                    delivery_radius_km: settingsForm.custDeliveryLimitType === "distance" 
                        ? (parseInt(settingsForm.custDeliveryDistanceKm) || 15) 
                        : (parseInt(settingsForm.custDeliveryRadiusKm) || 15),
                    target_user_id: impersonateId || undefined
                })
            });

            if (response.ok) {
                setPaymentSuccess(true);
                fetchBizInfo();
                setTimeout(() => {
                    setIsPaymentModalOpen(false);
                }, 1500);
            } else {
                const data = await response.json();
                setPaymentError(data.error || "Failed to save payment gateway settings.");
            }
        } catch (e) {
            console.error("Error saving payment gateway settings:", e);
            setPaymentError("Network error. Please try again.");
        } finally {
            setSavingPayment(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                        <Truck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Digital Order Settings</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Configure digital storefront, area delivery charges, and logic layers</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-md shadow-emerald-600/10"
                    >
                        <Plus className="w-3.5 h-3.5" /> Upload Area Charges
                    </button>
                </div>
            </div>

            {/* Architecture Matrix Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[400px] relative">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-3 flex-1 max-w-sm">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Search storefront configurations..." className="bg-transparent text-[11px] font-bold text-slate-600 outline-none w-full uppercase placeholder:text-slate-300" />
                    </div>
                    <button className="p-2 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><Filter className="w-4 h-4" /></button>
                </div>

                <div className="flex-1 overflow-x-auto">
                    {loading ? (
                        <div className="py-24 text-center">
                            <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Retrieving Digital Configurations...</p>
                        </div>
                    ) : bizInfo ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sr. No.</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Outlet Id</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Outlet Name</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4 bg-[#233831] px-3.5 py-2 rounded-lg text-white w-max shadow-sm">
                                            {/* 1. Storefront Configuration */}
                                            <button 
                                                onClick={handleOpenSettingsModal}
                                                title="Storefront Configuration"
                                                className="hover:text-emerald-400 transition-colors focus:outline-none"
                                            >
                                                <Wrench className="w-4 h-4" />
                                            </button>
                                            
                                            {/* 2. Outlet Banners & Logo */}
                                            <button 
                                                onClick={handleOpenBannerModal}
                                                title="Outlet Banners & Logo"
                                                className="hover:text-emerald-400 transition-colors focus:outline-none"
                                            >
                                                <Image className="w-4 h-4" />
                                            </button>

                                            {/* 3. Outlet Location Map */}
                                            <button 
                                                onClick={handleOpenLocationModal}
                                                title="Outlet Location Map"
                                                className="hover:text-emerald-400 transition-colors focus:outline-none"
                                            >
                                                <MapPin className="w-4 h-4" />
                                            </button>


                                            {/* 4. Palette */}
                                            <button 
                                                onClick={handleOpenThemeModal}
                                                title="Branding & Themes"
                                                className="hover:text-emerald-400 transition-colors focus:outline-none"
                                            >
                                                <Palette className="w-4 h-4" />
                                            </button>

                                            {/* 5. Coins */}
                                            <button 
                                                onClick={handleOpenPaymentModal}
                                                title="Payment Gateway Settings"
                                                className="hover:text-emerald-400 transition-colors focus:outline-none"
                                            >
                                                <Coins className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-600">1</td>
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-500">
                                        {bizInfo.phone ? bizInfo.phone.replace(/\D/g, "") : `OUTLET-${bizInfo.id}`}
                                    </td>
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-800">{bizInfo.name}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                <tr>
                                    <td className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <Layout className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Storefront Matrix Clean</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">No Outlets Provisioned</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Fintech Decoration */}
                <ShieldCheck className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
            </div>

            {/* Modal for configuring delivery charges */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <Truck className="w-4.5 h-4.5 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">Delivery Charges Configuration</h3>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Configure distance-based pricing (Road Distance wise)</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
                            {/* Alert/Info banner */}
                            <div className="flex gap-3 p-3.5 bg-blue-50/80 border border-blue-100 rounded-lg text-blue-800">
                                <Info className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                                <div className="text-[10.5px] leading-relaxed font-medium">
                                    Delivery charges are computed automatically using real-road distance via OSRM routing. Distance limits configured here are in Kilometers (KM).
                                </div>
                            </div>

                            {/* Default loader block */}
                            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200/60">
                                <div>
                                    <p className="text-[11px] font-bold text-slate-700 uppercase">Quick Setup Template</p>
                                    <p className="text-[9.5px] text-slate-400 font-medium">Pre-fill standard 3-tier delivery charges structure</p>
                                </div>
                                <button 
                                    onClick={handleLoadDefaults}
                                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-[9px] font-bold uppercase tracking-wider rounded transition-all"
                                >
                                    Load Default Tiers
                                </button>
                            </div>

                            {/* Tiers List */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Configured Distance Tiers</label>
                                
                                {tiers.length === 0 ? (
                                    <div className="border-2 border-dashed border-slate-100 rounded-lg py-10 text-center">
                                        <AlertTriangle className="w-7 h-7 text-amber-400 mx-auto mb-2 opacity-60" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No tiers configured yet</p>
                                        <p className="text-[9px] text-slate-300 font-bold uppercase mt-1">Add your first distance rate below</p>
                                    </div>
                                ) : (
                                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200">
                                                    <th className="px-4 py-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-wider">From (KM)</th>
                                                    <th className="px-4 py-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-wider">To (KM)</th>
                                                    <th className="px-4 py-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-wider">Delivery Charge (₹)</th>
                                                    <th className="px-4 py-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-wider text-right">Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {tiers.map((tier, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50">
                                                        <td className="px-4 py-2 text-[11px] font-bold text-slate-700">{tier.min} km</td>
                                                        <td className="px-4 py-2 text-[11px] font-bold text-slate-700">{tier.max} km</td>
                                                        <td className="px-4 py-2 text-[11px] font-bold text-slate-800">₹ {tier.charge}</td>
                                                        <td className="px-4 py-2 text-right">
                                                            <button 
                                                                onClick={() => handleRemoveTier(idx)}
                                                                className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Add New Tier Inputs */}
                            <div className="p-4 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-3">
                                <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Add Custom Distance Tier</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[8px] font-bold text-slate-400 uppercase">Min Distance (KM)</label>
                                        <input 
                                            type="number" 
                                            value={newMin}
                                            onChange={(e) => setNewMin(e.target.value)}
                                            placeholder="e.g. 0" 
                                            className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded text-[11px] font-bold outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[8px] font-bold text-slate-400 uppercase">Max Distance (KM)</label>
                                        <input 
                                            type="number" 
                                            value={newMax}
                                            onChange={(e) => setNewMax(e.target.value)}
                                            placeholder="e.g. 3" 
                                            className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded text-[11px] font-bold outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[8px] font-bold text-slate-400 uppercase">Charge (₹)</label>
                                        <input 
                                            type="number" 
                                            value={newCharge}
                                            onChange={(e) => setNewCharge(e.target.value)}
                                            placeholder="e.g. 0" 
                                            className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded text-[11px] font-bold outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={handleAddTier}
                                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[9px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Append Distance Tier
                                </button>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div>
                                {errorMsg && (
                                    <p className="text-[9.5px] text-rose-600 font-bold flex items-center gap-1">
                                        <AlertTriangle className="w-3.5 h-3.5" /> {errorMsg}
                                    </p>
                                )}
                                {saveSuccess && (
                                    <p className="text-[9.5px] text-emerald-600 font-bold flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" /> Configuration updated successfully!
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-[9px] font-bold uppercase tracking-widest rounded-md transition-colors"
                                >
                                    Close
                                </button>
                                <button 
                                    onClick={handleSaveTiers}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-md shadow-md shadow-emerald-600/10 transition-colors"
                                >
                                    Save Config
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for configuring digital order settings */}
            {isSettingsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        {/* Sticky Header */}
                        <div className="sticky top-0 z-10 px-6 py-4 border-b border-slate-100 bg-white/95 backdrop-blur flex items-center justify-between shadow-sm">
                            <div className="flex flex-col">
                                <h3 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Update Digital Order Settings</h3>
                                <div className="flex gap-4 mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    <span>Outlet Id: {bizInfo.phone ? bizInfo.phone.replace(/\D/g, "") : `OUTLET-${bizInfo.id}`}</span>
                                    <span>|</span>
                                    <span>Outlet Name: {bizInfo.name}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsSettingsModalOpen(false)}
                                className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar max-h-[calc(85vh-120px)] bg-slate-50/50">
                            {/* Card 1: Outlet Availability Time Slots */}
                            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                                <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">Outlet Availability Time Slots</h4>
                                <p className="text-[9.5px] text-rose-500 font-bold leading-normal">
                                    Note: Please either set specific opening and closing times for each day or create time slots indicating when your restaurant is available for orders.
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Outlet Start Day Time *</label>
                                        <input 
                                            type="text" 
                                            value={settingsForm.openingTime} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, openingTime: e.target.value })}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                            placeholder="10:00 AM"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Outlet Close Day Time *</label>
                                        <input 
                                            type="text" 
                                            value={settingsForm.closingTime} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, closingTime: e.target.value })}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                            placeholder="10:00 PM"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 py-2">
                                    <Toggle 
                                        checked={settingsForm.everyDay} 
                                        onChange={(val) => {
                                            const days = { Sun: val, Mon: val, Tue: val, Wed: val, Thu: val, Fri: val, Sat: val };
                                            setSettingsForm({ ...settingsForm, everyDay: val, openDays: days });
                                        }} 
                                    />
                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Every Day</span>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Store will be open on selected days</label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                            <label key={day} className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors">
                                                <input 
                                                    type="checkbox" 
                                                    checked={settingsForm.openDays[day]} 
                                                    onChange={(e) => {
                                                        const updatedDays = { ...settingsForm.openDays, [day]: e.target.checked };
                                                        const allChecked = Object.values(updatedDays).every(v => v);
                                                        setSettingsForm({ 
                                                            ...settingsForm, 
                                                            openDays: updatedDays,
                                                            everyDay: allChecked
                                                        });
                                                    }}
                                                    className="w-3.5 h-3.5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                                                />
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{day}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Address selection type</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="addressSelectionType" 
                                                    checked={settingsForm.addressSelectionType === "manual"}
                                                    onChange={() => setSettingsForm({ ...settingsForm, addressSelectionType: "manual" })}
                                                    className="text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Manually Select Address</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="addressSelectionType" 
                                                    checked={settingsForm.addressSelectionType === "map"}
                                                    onChange={() => setSettingsForm({ ...settingsForm, addressSelectionType: "map" })}
                                                    className="text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Map location</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Show Category First</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Toggle catalog display</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.showCategoryFirst} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, showCategoryFirst: val })} 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Auto Fulfill after delivery done by partner</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Automated order completion</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.autoFulfillAfterDeliveryDone} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, autoFulfillAfterDeliveryDone: val })} 
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Auto assign delivery on</label>
                                        <select 
                                            value={settingsForm.autoAssignDeliveryOn} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, autoAssignDeliveryOn: e.target.value })}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                        >
                                            <option value="">Disabled</option>
                                            <option value="partner">Delivery Partner</option>
                                            <option value="rider">Own Riders</option>
                                            <option value="both">Both</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Custom Time Slots List */}
                                <div className="border-t border-slate-100 pt-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Custom Availability Time Slots</label>
                                        <button 
                                            type="button"
                                            onClick={handleAddTimeSlot}
                                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-[9px] font-bold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Add Time Slot
                                        </button>
                                    </div>

                                    {settingsForm.timeSlots.length === 0 ? (
                                        <p className="text-[10px] text-slate-400 italic">No custom time slots added. Business relies on standard Start/Close day times.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {settingsForm.timeSlots.map((slot, index) => (
                                                <div key={index} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-[8px] font-bold text-slate-400 uppercase">Start Time</label>
                                                            <div className="relative mt-1">
                                                                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                                                                <input 
                                                                    type="text" 
                                                                    value={slot.start} 
                                                                    onChange={(e) => handleTimeSlotChange(index, "start", e.target.value)}
                                                                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded text-[11px] font-bold outline-none focus:border-emerald-500"
                                                                    placeholder="10:00 AM"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-[8px] font-bold text-slate-400 uppercase">End Time</label>
                                                            <div className="relative mt-1">
                                                                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                                                                <input 
                                                                    type="text" 
                                                                    value={slot.end} 
                                                                    onChange={(e) => handleTimeSlotChange(index, "end", e.target.value)}
                                                                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded text-[11px] font-bold outline-none focus:border-emerald-500"
                                                                    placeholder="10:00 PM"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 shrink-0 mt-4">
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleRemoveTimeSlot(index)}
                                                            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-100 rounded transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            onClick={handleAddTimeSlot}
                                                            className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-transparent hover:border-slate-200 rounded transition-colors"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card 2: Outlet Settings */}
                            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                                <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">Outlet Settings</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Is Digital Ordering Enabled: *</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Activate storefront</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.isDigitalOrderingEnabled} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, isDigitalOrderingEnabled: val })} 
                                        />
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Reduce Inventory</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Deduct stock on digital orders</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.reduceInventoryForDigitalOrderPlatform} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, reduceInventoryForDigitalOrderPlatform: val })} 
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Send Notifications On</label>
                                        <select 
                                            value={settingsForm.sendDigitalOrdersNotificationOn} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, sendDigitalOrdersNotificationOn: e.target.value })}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                        >
                                            <option value="All">All</option>
                                            <option value="SMS">SMS Only</option>
                                            <option value="WhatsApp">WhatsApp Only</option>
                                            <option value="None">None</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">WhatsApp Number</label>
                                        <input 
                                            type="text" 
                                            value={settingsForm.whatsappNumber} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                            placeholder="e.g. 918715000292"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-semibold">Delivery Partner</label>
                                        <select 
                                            value={settingsForm.deliveryPartner} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, deliveryPartner: e.target.value })}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                        >
                                            <option value="Disabled">Disabled</option>
                                            <option value="Dunzo">Dunzo</option>
                                            <option value="Shadowfax">Shadowfax</option>
                                            <option value="Wimo">Wimo</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {settingsForm.deliveryPartner === "Disabled" && (
                                            <p className="text-[9px] text-rose-500 font-bold uppercase mt-1">Delivery partner configuration is not found.</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Customized Message for WhatsApp</label>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                            {settingsForm.customMessageWhatsApp ? settingsForm.customMessageWhatsApp.length : 0} Total Characters / Max 150 Character
                                        </span>
                                    </div>
                                    <textarea 
                                        maxLength={150}
                                        rows={2.5}
                                        value={settingsForm.customMessageWhatsApp} 
                                        onChange={(e) => setSettingsForm({ ...settingsForm, customMessageWhatsApp: e.target.value })}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium outline-none focus:border-emerald-500 transition-all"
                                        placeholder="I want to order food>>"
                                    />
                                </div>
                            </div>

                            {/* Card 3: Item Level Settings */}
                            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                                <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">Item Level Settings</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Show Description On Digital Platform</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.itemLevelShowDescription} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, itemLevelShowDescription: val })} 
                                        />
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Show Preparation Time On Digital Platform</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.itemLevelShowPreparationTime} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, itemLevelShowPreparationTime: val })} 
                                        />
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Show Nutrition Info</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.itemLevelShowNutritionInfo} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, itemLevelShowNutritionInfo: val })} 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Other Digital Order Settings */}
                            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-5">
                                <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">Other Digital Order Settings</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Send OTP Via</label>
                                        <div className="flex gap-4 mt-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="otherSendOtpVia" 
                                                    checked={settingsForm.otherSendOtpVia === "SMS"}
                                                    onChange={() => setSettingsForm({ ...settingsForm, otherSendOtpVia: "SMS" })}
                                                    className="text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">SMS</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="otherSendOtpVia" 
                                                    checked={settingsForm.otherSendOtpVia === "WhatsApp"}
                                                    onChange={() => setSettingsForm({ ...settingsForm, otherSendOtpVia: "WhatsApp" })}
                                                    className="text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">WhatsApp</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Language</label>
                                        <select 
                                            value={settingsForm.otherLanguage} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, otherLanguage: e.target.value })}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                        >
                                            <option value="All">All</option>
                                            <option value="en">English</option>
                                            <option value="ar">Arabic</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Item Sort By</label>
                                        <select 
                                            value={settingsForm.otherItemSortBy} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, otherItemSortBy: e.target.value })}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                        >
                                            <option value="None">None</option>
                                            <option value="Alphabetical">Alphabetical</option>
                                            <option value="PriceLowToHigh">Price: Low to High</option>
                                            <option value="PriceHighToLow">Price: High to Low</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dine In Title</label>
                                        <input 
                                            type="text" 
                                            value={settingsForm.otherDineInTitle} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, otherDineInTitle: e.target.value })}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                            placeholder="DINE IN"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dine In Title Placeholder</label>
                                        <input 
                                            type="text" 
                                            value={settingsForm.otherDineInTitlePlaceholder} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, otherDineInTitlePlaceholder: e.target.value })}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                            placeholder="Enter placeholder"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tagline</label>
                                        <input 
                                            type="text" 
                                            value={settingsForm.otherTagline} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, otherTagline: e.target.value })}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                            placeholder="Your store tagline"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4 space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Storefront Behaviors & Flags</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {[
                                            { key: "otherEnableForDelivery", label: "Enable For Delivery" },
                                            { key: "otherAutoAcceptOrder", label: "Auto Accept Order" },
                                            { key: "otherAutoAcceptOrderOnCash", label: "Auto Accept Order on Cash Payment" },
                                            { key: "otherEnableForPickup", label: "Enable For Pickup" },
                                            { key: "otherLoginWithTruecaller", label: "Login with Truecaller" },
                                            { key: "otherEnableForDineIn", label: "Enable For Dine DineIn" },
                                            { key: "otherAskOrderTypeBeforePlacing", label: "Ask for Order Type Before Placing Order" },
                                            { key: "otherShowWhatsAppLink", label: "Show WhatsApp Link On Digital Platform" },
                                            { key: "otherShowGridView", label: "Show Grid View On Digital Platform" },
                                            { key: "otherShowListView", label: "Show List View On Digital Platform" },
                                            { key: "otherEnableCategorySorting", label: "Enable For Category Sorting On Digital Platform" },
                                            { key: "otherSkipOtpVerification", label: "Skip OTP Verification" },
                                            { key: "otherAutoCompleteOrderAfterAccept", label: "Auto Complete Order After Accept" },
                                            { key: "otherSendEbillAfterComplete", label: "Send Ebill After Complete" },
                                            { key: "otherEnableSubCategoryView", label: "Enable Sub Category View" },
                                            { key: "otherEnableCollapsibleViewForItems", label: "Enable Collapsible View for Items" },
                                            { key: "otherEnableCardCategoryFilter", label: "Enable Card Category Filter" },
                                            { key: "otherHideFoodTypeFromUi", label: "Hide Food Type From UI" },
                                            { key: "otherLoyaltyPoints", label: "Loyalty Points" },
                                            { key: "otherShowInstallAppSuggestion", label: "Show Install App Suggestion" },
                                            { key: "otherDisableOrderNow", label: "Disable Order Now" }
                                        ].map((toggle) => (
                                            <div key={toggle.key} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200/50">
                                                <span className="text-[10.5px] font-bold text-slate-700">{toggle.label}</span>
                                                <Toggle 
                                                    checked={settingsForm[toggle.key]} 
                                                    onChange={(val) => setSettingsForm({ ...settingsForm, [toggle.key]: val })} 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Card 5: Pages */}
                            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                                <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">Pages</h4>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">About Us</label>
                                        <textarea 
                                            rows={4}
                                            value={settingsForm.pageAboutUs || ""} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, pageAboutUs: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium outline-none focus:border-emerald-500 transition-all"
                                            placeholder="Enter about us details..."
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Privacy Policy</label>
                                        <textarea 
                                            rows={4}
                                            value={settingsForm.pagePrivacyPolicy || ""} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, pagePrivacyPolicy: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium outline-none focus:border-emerald-500 transition-all"
                                            placeholder="privacy policy"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Refund</label>
                                        <textarea 
                                            rows={4}
                                            value={settingsForm.pageRefund || ""} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, pageRefund: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium outline-none focus:border-emerald-500 transition-all"
                                            placeholder="Refund"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Terms and Conditions</label>
                                        <textarea 
                                            rows={4}
                                            value={settingsForm.pageTermsAndConditions || ""} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, pageTermsAndConditions: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium outline-none focus:border-emerald-500 transition-all"
                                            placeholder="Enter terms and conditions"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 6: Customer Level Settings */}
                            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                                <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">Customer Level Settings</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Show Logo Digital Platform</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.custShowLogoDigitalPlatform} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, custShowLogoDigitalPlatform: val })} 
                                        />
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Customers Can Reject Order</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.custCustomersCanReject} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, custCustomersCanReject: val })} 
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4 space-y-3">
                                    <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">GPS Fencing for Delivery</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col space-y-2">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Fencing Limit Mode</label>
                                            <div className="flex bg-slate-100 p-1 rounded-lg w-max border border-slate-200">
                                                <button
                                                    type="button"
                                                    onClick={() => setSettingsForm({ ...settingsForm, custDeliveryLimitType: "radius" })}
                                                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                                                        settingsForm.custDeliveryLimitType === "radius"
                                                            ? "bg-white text-slate-800 shadow-sm"
                                                            : "text-slate-400 hover:text-slate-600"
                                                    }`}
                                                >
                                                    By Radius
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSettingsForm({ ...settingsForm, custDeliveryLimitType: "distance" })}
                                                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                                                        settingsForm.custDeliveryLimitType === "distance"
                                                            ? "bg-white text-slate-800 shadow-sm"
                                                            : "text-slate-400 hover:text-slate-600"
                                                    }`}
                                                >
                                                    By Distance
                                                </button>
                                            </div>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase">
                                            {settingsForm.custDeliveryLimitType === "distance" 
                                                ? "Enforces a limit based on actual driving road distance (via OSRM routing)."
                                                : "Enforces a straight-line radial circular boundary around the outlet."}
                                        </p>
                                    </div>

                                    <div>
                                        {settingsForm.custDeliveryLimitType === "distance" ? (
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Max Road Distance Limit (In KM)</label>
                                                <input 
                                                    type="number" 
                                                    value={settingsForm.custDeliveryDistanceKm} 
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, custDeliveryDistanceKm: parseInt(e.target.value) || 0 })}
                                                    className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                                    placeholder="15"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Delivery Radius Limit (In KM)</label>
                                                <input 
                                                    type="number" 
                                                    value={settingsForm.custDeliveryRadiusKm} 
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, custDeliveryRadiusKm: parseInt(e.target.value) || 0 })}
                                                    className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                                    placeholder="15"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Customized Message to Show When Outlet is Offline</label>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                            {settingsForm.custOfflineMessage ? settingsForm.custOfflineMessage.length : 0} Total Characters / Max 100 Character
                                        </span>
                                    </div>
                                    <textarea 
                                        maxLength={100}
                                        rows={2.5}
                                        value={settingsForm.custOfflineMessage || ""} 
                                        onChange={(e) => setSettingsForm({ ...settingsForm, custOfflineMessage: e.target.value })}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium outline-none focus:border-emerald-500 transition-all"
                                        placeholder="Custom Message"
                                    />
                                </div>
                            </div>

                            {/* Card 8: Digital Order Promo Code Settings */}
                            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                                <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">Digital Order Promo Code Settings</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Enable Promo Code Dine In</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.promoEnableDineIn} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, promoEnableDineIn: val })} 
                                        />
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Enable Promo Code Delivery</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.promoEnableDelivery} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, promoEnableDelivery: val })} 
                                        />
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Enable Promo Code Pickup</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.promoEnablePickup} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, promoEnablePickup: val })} 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 9: Order Limit */}
                            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                                <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">Order Limit</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Min Order Limit For Dine In:</label>
                                        <input 
                                            type="number" 
                                            value={settingsForm.limitMinDineIn} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, limitMinDineIn: parseFloat(e.target.value) || 0 })}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Min Order Limit For Pickup:</label>
                                        <input 
                                            type="number" 
                                            value={settingsForm.limitMinPickup} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, limitMinPickup: parseFloat(e.target.value) || 0 })}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Min Order Limit For Delivery:</label>
                                        <input 
                                            type="number" 
                                            value={settingsForm.limitMinDelivery} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, limitMinDelivery: parseFloat(e.target.value) || 0 })}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Apply COD After Amount:</label>
                                        <input 
                                            type="number" 
                                            value={settingsForm.limitCodAfterAmount} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, limitCodAfterAmount: parseFloat(e.target.value) || 0 })}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 10: Payment Gateway Settings */}
                            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-5">
                                <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">Payment Gateway Settings</h4>
                                
                                <div className="space-y-4">
                                    <div className="border border-slate-100 rounded-lg p-4 bg-slate-50/30 space-y-3">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Webhooks Redirect URL</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[9px] font-bold text-slate-400 uppercase">PayU Success URL:</label>
                                                <input 
                                                    type="text" 
                                                    value={settingsForm.pgPayUSuccessUrl} 
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, pgPayUSuccessUrl: e.target.value })}
                                                    className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                                    placeholder="PayU success url"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-bold text-slate-400 uppercase">PayU Failure URL:</label>
                                                <input 
                                                    type="text" 
                                                    value={settingsForm.pgPayUFailureUrl} 
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, pgPayUFailureUrl: e.target.value })}
                                                    className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                                    placeholder="PayU failure url"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* PG Dine In */}
                                    <div className="border border-slate-100 rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Payment Gateway Setting For Dine In</p>
                                            <button 
                                                type="button" 
                                                onClick={handleResetDineInPG}
                                                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[9px] font-bold uppercase tracking-widest transition-colors shadow-sm"
                                            >
                                                Reset Dine In
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-6 pt-1">
                                            {[
                                                { key: "pgDineInCash", label: "Cash" },
                                                { key: "pgDineInCod", label: "COD" },
                                                { key: "pgDineInPayLater", label: "Pay Later" },
                                                { key: "pgDineInUpi", label: "UPI" }
                                            ].map((pg) => (
                                                <label key={pg.key} className="flex items-center gap-2 cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={settingsForm[pg.key]} 
                                                        onChange={(e) => setSettingsForm({ ...settingsForm, [pg.key]: e.target.checked })}
                                                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                                                    />
                                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{pg.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* PG Pick Up */}
                                    <div className="border border-slate-100 rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Payment Gateway Setting For Pick Up</p>
                                            <button 
                                                type="button" 
                                                onClick={handleResetPickUpPG}
                                                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[9px] font-bold uppercase tracking-widest transition-colors shadow-sm"
                                            >
                                                Reset Pick Up
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-6 pt-1">
                                            {[
                                                { key: "pgPickUpCash", label: "Cash" },
                                                { key: "pgPickUpCod", label: "COD" },
                                                { key: "pgPickUpPayLater", label: "Pay Later" },
                                                { key: "pgPickUpUpi", label: "UPI" }
                                            ].map((pg) => (
                                                <label key={pg.key} className="flex items-center gap-2 cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={settingsForm[pg.key]} 
                                                        onChange={(e) => setSettingsForm({ ...settingsForm, [pg.key]: e.target.checked })}
                                                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                                                    />
                                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{pg.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* PG Delivery */}
                                    <div className="border border-slate-100 rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Payment Gateway Setting For Delivery</p>
                                            <button 
                                                type="button" 
                                                onClick={handleResetDeliveryPG}
                                                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[9px] font-bold uppercase tracking-widest transition-colors shadow-sm"
                                            >
                                                Reset Delivery
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-6 pt-1">
                                            {[
                                                { key: "pgDeliveryCash", label: "Cash" },
                                                { key: "pgDeliveryCod", label: "COD" },
                                                { key: "pgDeliveryPayLater", label: "Pay Later" },
                                                { key: "pgDeliveryUpi", label: "UPI" }
                                            ].map((pg) => (
                                                <label key={pg.key} className="flex items-center gap-2 cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={settingsForm[pg.key]} 
                                                        onChange={(e) => setSettingsForm({ ...settingsForm, [pg.key]: e.target.checked })}
                                                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                                                    />
                                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{pg.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 11: Social media */}
                            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                                <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">Social media</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { showKey: "socialShowContact", valKey: "socialContactNo", labelShow: "Show Contact No.", labelVal: "Enter Contact No.", placeholder: "e.g. 917006089744" },
                                        { showKey: "socialShowFacebook", valKey: "socialFacebookLink", labelShow: "Show Facebook Link", labelVal: "Add Facebook Link", placeholder: "https://www.facebook.com/..." },
                                        { showKey: "socialShowInstagram", valKey: "socialInstagramLink", labelShow: "Show Instagram Link", labelVal: "Add Instagram Link", placeholder: "https://www.instagram.com/..." },
                                        { showKey: "socialShowWebsite", valKey: "socialWebsiteLink", labelShow: "Show Website Link", labelVal: "Add Website Link", placeholder: "https://www.website.com/..." },
                                        { showKey: "socialShowPinterest", valKey: "socialPinterestLink", labelShow: "Show Pinterest Link", labelVal: "Add Pinterest Link", placeholder: "https://www.pinterest.com/..." },
                                        { showKey: "socialShowLinkedIn", valKey: "socialLinkedInLink", labelShow: "Show LinkedIn Link", labelVal: "Add LinkedIn Link", placeholder: "https://www.linkedin.com/..." },
                                        { showKey: "socialShowYouTube", valKey: "socialYouTubeLink", labelShow: "Show YouTube Link", labelVal: "Add YouTube Link", placeholder: "https://www.youtube.com/..." }
                                    ].map((social) => (
                                        <div key={social.showKey} className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-lg border border-slate-200/50">
                                            <div className="flex flex-col gap-1.5 shrink-0">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{social.labelShow}</span>
                                                <Toggle 
                                                    checked={settingsForm[social.showKey]} 
                                                    onChange={(val) => setSettingsForm({ ...settingsForm, [social.showKey]: val })} 
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{social.labelVal}</span>
                                                <input 
                                                    type="text" 
                                                    value={settingsForm[social.valKey] || ""} 
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, [social.valKey]: e.target.value })}
                                                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                                    placeholder={social.placeholder}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card 12: Table ordering */}
                            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                                <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">Table ordering</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50 h-[58px]">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Skip OTP</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.tableSkipOtp} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, tableSkipOtp: val })} 
                                        />
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50 h-[58px]">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Allow Request Assistance</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.tableAllowRequestAssistance} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, tableAllowRequestAssistance: val })} 
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Request Assistance Types</label>
                                        <select 
                                            value={settingsForm.tableRequestAssistanceTypes} 
                                            onChange={(e) => setSettingsForm({ ...settingsForm, tableRequestAssistanceTypes: e.target.value })}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer h-[38px]"
                                        >
                                            <option value="">Select type</option>
                                            <option value="Call Waiter">Call Waiter</option>
                                            <option value="Water">Water</option>
                                            <option value="Get Bill">Get Bill</option>
                                            <option value="Clean Table">Clean Table</option>
                                            <option value="General Help">General Help</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Ask Customer Details In Call Waiter Option</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.tableAskCustDetailsCallWaiter} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, tableAskCustDetailsCallWaiter: val })} 
                                        />
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Show Pay</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.tableShowPay} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, tableShowPay: val })} 
                                        />
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Ask For Waiter Tip</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.tableAskWaiterTip} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, tableAskWaiterTip: val })} 
                                        />
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Show Get Bill Button</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.tableShowGetBillButton} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, tableShowGetBillButton: val })} 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 13: Order Update Settings */}
                            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                                <h4 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">Order Update Settings</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Send Updates Via</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="orderUpdateSendVia" 
                                                    value="SMS"
                                                    checked={settingsForm.orderUpdateSendVia === "SMS"}
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, orderUpdateSendVia: e.target.value })}
                                                    className="text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">SMS</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="orderUpdateSendVia" 
                                                    value="WhatsApp"
                                                    checked={settingsForm.orderUpdateSendVia === "WhatsApp"}
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, orderUpdateSendVia: e.target.value })}
                                                    className="text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">WhatsApp</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Send Message To Customer On Order Placed</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.orderUpdateOnPlaced} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, orderUpdateOnPlaced: val })} 
                                        />
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Send Message To Customer On Accepted</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.orderUpdateOnAccepted} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, orderUpdateOnAccepted: val })} 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Send Message To Customer On Order Fulfilled</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.orderUpdateOnFulfilled} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, orderUpdateOnFulfilled: val })} 
                                        />
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Send Message To Customer On Order Cancelled</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.orderUpdateOnCancelled} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, orderUpdateOnCancelled: val })} 
                                        />
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Send Message To Customer On Order Food Ready</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.orderUpdateOnFoodReady} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, orderUpdateOnFoodReady: val })} 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Send Message To Customer On Order Dispatched</p>
                                        </div>
                                        <Toggle 
                                            checked={settingsForm.orderUpdateOnDispatched} 
                                            onChange={(val) => setSettingsForm({ ...settingsForm, orderUpdateOnDispatched: val })} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <div className="sticky bottom-0 z-10 px-6 py-4 border-t border-slate-100 bg-white/95 backdrop-blur flex items-center justify-between shadow-inner">
                            <div>
                                {settingsError && (
                                    <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                                        <AlertTriangle className="w-3.5 h-3.5" /> {settingsError}
                                    </p>
                                )}
                                {settingsSuccess && (
                                    <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" /> Settings updated successfully!
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2.5">
                                <button 
                                    type="button"
                                    onClick={() => setIsSettingsModalOpen(false)}
                                    className="px-5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleSaveSettings}
                                    disabled={savingSettings}
                                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-md shadow-emerald-600/10 transition-colors flex items-center gap-1.5"
                                >
                                    {savingSettings ? (
                                        <>
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        "Update Setting"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for configuring banners */}
            {isBannerModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <Image className="w-4.5 h-4.5 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">Banner Add / Update</h3>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Upload and manage storefront banner images</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsBannerModalOpen(false)}
                                className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                            {/* Red Instruction Label */}
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                                <p style={{ color: "#d9534f" }} className="text-[10px] font-bold uppercase tracking-wider text-center">
                                    Banner upload limit: 5 and Image size: 600x400
                                </p>
                            </div>

                            {/* Banner Display Section */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Configured Storefront Banners</label>
                                {(() => {
                                    const currentBanners = bizInfo?.settings?.banners || [];
                                    if (currentBanners.length === 0) {
                                        return (
                                            <div className="border-2 border-dashed border-slate-100 rounded-lg py-12 text-center flex flex-col items-center justify-center bg-slate-50/30">
                                                <div className="w-12 h-12 text-slate-400 mb-3 flex items-center justify-center">
                                                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <rect x="11" y="10" width="2" height="7" fill="white" />
                                                        <circle cx="12" cy="7" r="1.5" fill="white" />
                                                    </svg>
                                                </div>
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No Banner image found</p>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border border-slate-100 p-4 rounded-lg bg-slate-50/30">
                                            {currentBanners.map((banner, idx) => {
                                                const bannerSrc = banner.startsWith('http') ? banner : `${API_BASE}${banner}`;
                                                return (
                                                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-[3/2] bg-slate-100 flex items-center justify-center shadow-sm">
                                                        <img 
                                                            src={bannerSrc} 
                                                            alt={`Banner ${idx + 1}`} 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteBanner(banner)}
                                                                className="p-2 bg-white/90 hover:bg-white text-rose-600 rounded-full shadow-lg hover:scale-110 transition-all"
                                                                title="Delete Banner"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* File Upload Section */}
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Select and Upload Banner</label>
                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                    {/* Text display with red border */}
                                    <div className="flex-1 w-full px-3 py-2 border border-red-500 rounded-lg text-slate-500 text-[11px] font-bold bg-white min-h-[38px] flex items-center justify-between">
                                        <span className="truncate">
                                            {selectedBannerFile ? selectedBannerFile.name : "Choose a File or Drop it Here"}
                                        </span>
                                    </div>
                                    
                                    {/* Buttons */}
                                    <div className="flex gap-2 w-full sm:w-auto shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => bannerFileInputRef.current?.click()}
                                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors border border-slate-200"
                                        >
                                            Browse
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleUploadBanner}
                                            disabled={!selectedBannerFile || uploadingBanner}
                                            style={{ backgroundColor: "#4f5d5b" }}
                                            className="px-4 py-2 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                                        >
                                            {uploadingBanner ? (
                                                <>
                                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading...
                                                </>
                                            ) : (
                                                "Upload"
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedBannerFile(null);
                                                if (bannerFileInputRef.current) bannerFileInputRef.current.value = "";
                                                setBannerError("");
                                                setBannerSuccess(false);
                                                setIsBannerModalOpen(false);
                                            }}
                                            style={{ backgroundColor: "#d9534f" }}
                                            className="px-4 py-2 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all hover:opacity-90"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div>
                                {bannerError && (
                                    <p className="text-[9.5px] text-rose-600 font-bold flex items-center gap-1">
                                        <AlertTriangle className="w-3.5 h-3.5" /> {bannerError}
                                    </p>
                                )}
                                {bannerSuccess && (
                                    <p className="text-[9.5px] text-emerald-600 font-bold flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" /> Banner updated successfully!
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => {
                                        setSelectedBannerFile(null);
                                        if (bannerFileInputRef.current) bannerFileInputRef.current.value = "";
                                        setBannerError("");
                                        setBannerSuccess(false);
                                        setIsBannerModalOpen(false);
                                    }}
                                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-[9px] font-bold uppercase tracking-widest rounded-md transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for configuring outlet location */}
            {isLocationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex flex-col">
                                <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                    <MapPin className="w-4.5 h-4.5 text-emerald-600" /> Outlet Location Configuration
                                </h3>
                                <div className="flex gap-4 mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    <span>Outlet Id: {bizInfo?.phone ? bizInfo.phone.replace(/\D/g, "") : `OUTLET-${bizInfo?.id}`}</span>
                                    <span>|</span>
                                    <span>Outlet Name: {bizInfo?.name}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsLocationModalOpen(false)}
                                className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[480px]">
                            {/* Left Panel: Search & Map */}
                            <div className="flex-1 p-6 flex flex-col space-y-4 border-r border-slate-100">
                                {/* Search address bar */}
                                <form onSubmit={handleSearchAddress} className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                        <input 
                                            type="text" 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search address" 
                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all uppercase placeholder:text-slate-300"
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={searchingAddress}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm"
                                    >
                                        {searchingAddress ? "Searching..." : "Search"}
                                    </button>
                                </form>

                                {/* Interactive Leaflet Map */}
                                <div className="flex-1 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative min-h-[300px]">
                                    {/* Map/Satellite overlay toggle */}
                                    <div className="absolute top-3 left-3 z-[1000] bg-white border border-slate-200 rounded-lg shadow-md flex overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setMapType("roadmap")}
                                            className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider transition-colors ${mapType === 'roadmap' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                                        >
                                            Map
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMapType("satellite")}
                                            className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider transition-colors ${mapType === 'satellite' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                                        >
                                            Satellite
                                        </button>
                                    </div>

                                    {(() => {
                                        const centerLat = parseFloat(tempLat) || 34.262590028363;
                                        const centerLng = parseFloat(tempLng) || 74.903476238251;
                                        const markerPosition = [centerLat, centerLng];

                                        const markerEventHandlers = {
                                            dragend() {
                                                const marker = locationMarkerRef.current;
                                                if (marker != null) {
                                                    const latLng = marker.getLatLng();
                                                    updateCoords(latLng.lat, latLng.lng);
                                                }
                                            }
                                        };

                                        return (
                                            <MapContainer 
                                                center={markerPosition} 
                                                zoom={15} 
                                                style={{ height: '100%', width: '100%' }}
                                                zoomControl={true}
                                            >
                                                <TileLayer 
                                                    url={mapType === 'satellite' 
                                                        ? "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" 
                                                        : "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                                    } 
                                                    attribution='&copy; Google' 
                                                />
                                                <ChangeView center={markerPosition} />
                                                <MapEventsHandler 
                                                    onClick={(lat, lng) => updateCoords(lat, lng)} 
                                                />
                                                <Marker 
                                                    position={markerPosition} 
                                                    draggable={true}
                                                    eventHandlers={markerEventHandlers}
                                                    ref={locationMarkerRef}
                                                />
                                            </MapContainer>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Right Panel: Fields & Actions */}
                            <div className="w-full md:w-96 p-6 flex flex-col justify-between bg-slate-50/50">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Latitude: *</label>
                                        <input 
                                            type="text" 
                                            value={tempLat} 
                                            onChange={(e) => setTempLat(e.target.value)}
                                            onBlur={handleCoordinateBlur}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                            placeholder="Latitude"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Longitude: *</label>
                                        <input 
                                            type="text" 
                                            value={tempLng} 
                                            onChange={(e) => setTempLng(e.target.value)}
                                            onBlur={handleCoordinateBlur}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                                            placeholder="Longitude"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Outlet Address:</label>
                                        <textarea 
                                            rows={4}
                                            value={tempAddress} 
                                            onChange={(e) => setTempAddress(e.target.value)}
                                            className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold outline-none focus:border-emerald-500 transition-all"
                                            placeholder="Outlet Address"
                                        />
                                    </div>

                                    {locationError && (
                                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2 text-rose-700">
                                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                            <p className="text-[10px] font-bold uppercase tracking-wide leading-tight">{locationError}</p>
                                        </div>
                                    )}

                                    {locationSuccess && (
                                        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-2 text-emerald-700 animate-pulse">
                                            <Check className="w-4 h-4 shrink-0 mt-0.5" />
                                            <p className="text-[10px] font-bold uppercase tracking-wide leading-tight">Location updated successfully!</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions panel */}
                                <div className="grid grid-cols-1 gap-2 pt-6 border-t border-slate-200/60">
                                    <button 
                                        type="button"
                                        onClick={handleSaveLocation}
                                        disabled={savingLocation}
                                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-md shadow-emerald-600/10 transition-all flex items-center justify-center gap-1.5"
                                    >
                                        {savingLocation ? (
                                            <>
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Updating...
                                            </>
                                        ) : (
                                            "Update Location"
                                        )}
                                    </button>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            type="button"
                                            onClick={handleResetLocation}
                                            className="py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors shadow-sm"
                                        >
                                            Reset
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setIsLocationModalOpen(false)}
                                            className="py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors shadow-sm"
                                        >
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal for Themes Settings */}
            {isThemeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <Palette className="w-4.5 h-4.5 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">Themes Settings</h3>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Configure storefront styling, colors, and layout aesthetics</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    type="button"
                                    onClick={() => window.open("https://fonts.google.com/", "_blank")}
                                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-[9px] font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1"
                                >
                                    Google Font Link
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setIsColorRefOpen(!isColorRefOpen)}
                                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-[9px] font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1"
                                >
                                    Color Reference
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setIsThemeModalOpen(false)}
                                    className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                            {/* Color Reference Section */}
                            {isColorRefOpen && (
                                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-3 animate-in slide-in-from-top-4 duration-200">
                                    <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
                                        <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Standard Palette Recommendations</p>
                                        <button 
                                            type="button" 
                                            onClick={() => setIsColorRefOpen(false)}
                                            className="text-emerald-600 hover:text-emerald-800 text-[10px] font-bold uppercase tracking-wider"
                                        >
                                            Hide
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-sm space-y-1">
                                            <span className="text-[8px] font-bold text-slate-400 uppercase">Emerald (Default)</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-3.5 h-3.5 rounded bg-[#10b981] inline-block border border-slate-200"></span>
                                                <span className="text-[10px] font-mono font-bold text-slate-600">#10B981</span>
                                            </div>
                                        </div>
                                        <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-sm space-y-1">
                                            <span className="text-[8px] font-bold text-slate-400 uppercase">Sunset Orange</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-3.5 h-3.5 rounded bg-[#f97316] inline-block border border-slate-200"></span>
                                                <span className="text-[10px] font-mono font-bold text-slate-600">#F97316</span>
                                            </div>
                                        </div>
                                        <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-sm space-y-1">
                                            <span className="text-[8px] font-bold text-slate-400 uppercase">Ocean Breeze</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-3.5 h-3.5 rounded bg-[#0ea5e9] inline-block border border-slate-200"></span>
                                                <span className="text-[10px] font-mono font-bold text-slate-600">#0EA5E9</span>
                                            </div>
                                        </div>
                                        <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-sm space-y-1">
                                            <span className="text-[8px] font-bold text-slate-400 uppercase">Sweet Lavender</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-3.5 h-3.5 rounded bg-[#8b5cf6] inline-block border border-slate-200"></span>
                                                <span className="text-[10px] font-mono font-bold text-slate-600">#8B5CF6</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3-Column Inputs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Column 1 */}
                                <div className="space-y-4">
                                    {/* Theme Presets */}
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Theme Presets</label>
                                        <select 
                                            value={themeForm.preset || "Custom"} 
                                            onChange={(e) => handlePresetChange(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                        >
                                            <option value="Custom">Custom</option>
                                            <option value="Default (Emerald)">Default (Emerald)</option>
                                            <option value="Sunset Orange">Sunset Orange</option>
                                            <option value="Ocean Breeze">Ocean Breeze</option>
                                            <option value="Midnight Dark">Midnight Dark</option>
                                            <option value="Sweet Lavender">Sweet Lavender</option>
                                        </select>
                                    </div>

                                    {/* Font / Text Color */}
                                    {renderColorInputGroup("Font / Text Color", "fontText", "fontColor")}

                                    {/* Secondary Color */}
                                    {renderColorInputGroup("Secondary Color", "secondaryText", "secondaryColor")}
                                </div>

                                {/* Column 2 */}
                                <div className="space-y-4">
                                    {/* Main Background Color */}
                                    {renderColorInputGroup("Main Background Color", "mainBgText", "mainBgColor")}

                                    {/* Google Font Style */}
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Google Font Style</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input 
                                                type="text" 
                                                value={themeForm.fontStyle || ""} 
                                                onChange={(e) => setThemeForm({ ...themeForm, fontStyle: e.target.value })}
                                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold outline-none focus:border-emerald-500 transition-all"
                                                placeholder="Font Style"
                                            />
                                            <input 
                                                type="text" 
                                                value={themeForm.googleFont || ""} 
                                                onChange={(e) => setThemeForm({ ...themeForm, googleFont: e.target.value })}
                                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold outline-none focus:border-emerald-500 transition-all"
                                                placeholder="Google Font"
                                            />
                                        </div>
                                    </div>

                                    {/* Landing Page Color */}
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Landing Page Color</label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="text" 
                                                value={themeForm.landingPageText || ""} 
                                                onChange={(e) => setThemeForm({ ...themeForm, landingPageText: e.target.value })}
                                                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold outline-none focus:border-emerald-500 transition-all"
                                                placeholder="Background Color"
                                            />
                                            <div className="relative flex items-center shrink-0 border border-slate-200 rounded-lg bg-white p-1">
                                                <input 
                                                    type="color" 
                                                    value={themeForm.landingPageColor || "#ffffff"} 
                                                    onChange={(e) => setThemeForm({ ...themeForm, landingPageColor: e.target.value })}
                                                    className="w-8 h-8 rounded-md border-0 cursor-pointer bg-transparent outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    value={themeForm.landingPageColor || ""}
                                                    onChange={(e) => setThemeForm({ ...themeForm, landingPageColor: e.target.value })}
                                                    className="w-16 text-center text-[10px] font-mono font-bold text-slate-600 outline-none uppercase"
                                                    maxLength={7}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleResetLandingColor}
                                                className="px-2.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-[9px] uppercase tracking-wider transition-colors shrink-0"
                                            >
                                                Reset Color
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 3 */}
                                <div className="space-y-4">
                                    {/* Background Color */}
                                    {renderColorInputGroup("Background Color", "bgText", "bgColor")}

                                    {/* Primary Color */}
                                    {renderColorInputGroup("Primary Color", "primaryText", "primaryColor")}

                                    {/* Landing Page Background Image */}
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Landing Page Background Image</label>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-slate-500 text-[11px] font-semibold bg-white min-h-[38px] flex items-center justify-between overflow-hidden">
                                                    <span className="truncate">
                                                        {themeForm.landingPageBgImage ? themeForm.landingPageBgImage.split('/').pop() : "Choose a file or drop it here..."}
                                                    </span>
                                                    {themeForm.landingPageBgImage && (
                                                        <button 
                                                            type="button" 
                                                            onClick={handleClearThemeBgImage}
                                                            className="text-slate-400 hover:text-rose-600 transition-colors"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => themeBgFileInputRef.current?.click()}
                                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors border border-slate-200 shrink-0"
                                                >
                                                    Browse
                                                </button>
                                            </div>
                                            
                                            {/* Thumbnail Preview */}
                                            {themeForm.landingPageBgImage && (
                                                <div className="relative w-20 h-20 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 group">
                                                    <img 
                                                        src={themeForm.landingPageBgImage.startsWith('http') ? themeForm.landingPageBgImage : `${API_BASE}${themeForm.landingPageBgImage}`} 
                                                        alt="Theme BG Preview" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={handleClearThemeBgImage}
                                                            className="p-1 bg-white/90 hover:bg-white text-rose-600 rounded-full shadow"
                                                            title="Remove Image"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div>
                                {themeError && (
                                    <p className="text-[9.5px] text-rose-600 font-bold flex items-center gap-1">
                                        <AlertTriangle className="w-3.5 h-3.5" /> {themeError}
                                    </p>
                                )}
                                {themeSuccess && (
                                    <p className="text-[9.5px] text-emerald-600 font-bold flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" /> Theme updated successfully!
                                    </p>
                                )}
                                {uploadingThemeBg && (
                                    <p className="text-[9.5px] text-blue-600 font-bold flex items-center gap-1 animate-pulse">
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading background image...
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsThemeModalOpen(false)}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-bold uppercase tracking-widest rounded-md transition-colors"
                                >
                                    Back
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleSaveTheme}
                                    disabled={savingTheme}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white text-[9px] font-bold uppercase tracking-widest rounded-md shadow-md shadow-emerald-600/10 transition-colors flex items-center gap-1.5"
                                >
                                    {savingTheme ? (
                                        <>
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden Theme Background File Input */}
            <input 
                type="file" 
                ref={themeBgFileInputRef} 
                onChange={handleThemeBgFileChange} 
                style={{ display: "none" }} 
                accept="image/*" 
            />

            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={bannerFileInputRef} 
                onChange={handleBannerFileChange} 
                style={{ display: "none" }} 
                accept="image/*" 
            />

            {/* Modal for Payment Gateway Settings */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <Coins className="w-4.5 h-4.5 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">Payment Gateway Settings</h3>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Configure redirect URLs and payment methods per fulfillment mode</p>
                                </div>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setIsPaymentModalOpen(false)}
                                className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                {/* Webhooks Redirect URL */}
                                <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/30 space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <Globe className="w-4 h-4 text-emerald-600" />
                                        <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Webhooks Redirect URL</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase">PayU Success URL:</label>
                                            <input 
                                                type="text" 
                                                value={settingsForm.pgPayUSuccessUrl || ""} 
                                                onChange={(e) => setSettingsForm({ ...settingsForm, pgPayUSuccessUrl: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all text-slate-850"
                                                placeholder="PayU success url"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase">PayU Failure URL:</label>
                                            <input 
                                                type="text" 
                                                value={settingsForm.pgPayUFailureUrl || ""} 
                                                onChange={(e) => setSettingsForm({ ...settingsForm, pgPayUFailureUrl: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all text-slate-850"
                                                placeholder="PayU failure url"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* PG Dine In */}
                                <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Payment Methods for Dine In</p>
                                        <button 
                                            type="button" 
                                            onClick={handleResetDineInPG}
                                            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[9px] font-bold uppercase tracking-widest transition-colors shadow-sm"
                                        >
                                            Reset Dine In
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-6 pt-1">
                                        {[
                                            { key: "pgDineInCash", label: "Cash" },
                                            { key: "pgDineInCod", label: "COD" },
                                            { key: "pgDineInPayLater", label: "Pay Later" },
                                            { key: "pgDineInUpi", label: "UPI" }
                                        ].map((pg) => (
                                            <label key={pg.key} className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={!!settingsForm[pg.key]} 
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, [pg.key]: e.target.checked })}
                                                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                                                />
                                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{pg.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* PG Pick Up */}
                                <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Payment Methods for Pick Up</p>
                                        <button 
                                            type="button" 
                                            onClick={handleResetPickUpPG}
                                            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[9px] font-bold uppercase tracking-widest transition-colors shadow-sm"
                                        >
                                            Reset Pick Up
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-6 pt-1">
                                        {[
                                            { key: "pgPickUpCash", label: "Cash" },
                                            { key: "pgPickUpCod", label: "COD" },
                                            { key: "pgPickUpPayLater", label: "Pay Later" },
                                            { key: "pgPickUpUpi", label: "UPI" }
                                        ].map((pg) => (
                                            <label key={pg.key} className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={!!settingsForm[pg.key]} 
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, [pg.key]: e.target.checked })}
                                                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                                                />
                                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{pg.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* PG Delivery */}
                                <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Payment Methods for Delivery</p>
                                        <button 
                                            type="button" 
                                            onClick={handleResetDeliveryPG}
                                            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[9px] font-bold uppercase tracking-widest transition-colors shadow-sm"
                                        >
                                            Reset Delivery
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-6 pt-1">
                                        {[
                                            { key: "pgDeliveryCash", label: "Cash" },
                                            { key: "pgDeliveryCod", label: "COD" },
                                            { key: "pgDeliveryPayLater", label: "Pay Later" },
                                            { key: "pgDeliveryUpi", label: "UPI" }
                                        ].map((pg) => (
                                            <label key={pg.key} className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={!!settingsForm[pg.key]} 
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, [pg.key]: e.target.checked })}
                                                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                                                />
                                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{pg.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div>
                                {paymentError && (
                                    <p className="text-[9.5px] text-rose-600 font-bold flex items-center gap-1">
                                        <AlertTriangle className="w-3.5 h-3.5" /> {paymentError}
                                    </p>
                                )}
                                {paymentSuccess && (
                                    <p className="text-[9.5px] text-emerald-600 font-bold flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" /> Payment gateway settings saved successfully!
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsPaymentModalOpen(false)}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-bold uppercase tracking-widest rounded-md transition-colors"
                                >
                                    Back
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleSavePaymentSettings}
                                    disabled={savingPayment}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white text-[9px] font-bold uppercase tracking-widest rounded-md shadow-md shadow-emerald-600/10 transition-colors flex items-center gap-1.5"
                                >
                                    {savingPayment ? (
                                        <>
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DigitalOrderSettings;
