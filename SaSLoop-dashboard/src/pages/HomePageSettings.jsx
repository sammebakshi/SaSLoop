import React, { useState, useEffect, useRef } from "react";
import { 
  LayoutGrid, Palette, Image, Type, Save, RefreshCw, Check, AlertTriangle, 
  Globe, Phone, ExternalLink, Sparkles, Upload, Trash2, Eye, Share2,
  Smartphone, Monitor, RotateCw, Maximize2, X, MessageSquare, MessageCircle, Clock, AlignLeft, Sparkle,
  Bike, Utensils, ShieldCheck, Flame, Percent, Tag, Star, Heart, Coffee, Ticket, Plus, Copy, MapPin
} from "lucide-react";
import API_BASE from "../config";

const InstagramIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const WhatsAppIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.55 4.108 1.516 5.843L0 24l6.335-1.482C8.01 23.473 9.948 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm.006 22c-1.802 0-3.568-.475-5.114-1.378l-.367-.215-3.766.881.896-3.666-.239-.379A9.948 9.948 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-9.994 10z"/>
  </svg>
);

const RESTAURANT_ICON_OPTIONS = [
  { value: "Clock", label: "Clock / Delivery Speed" },
  { value: "Bike", label: "Bike / Express Delivery" },
  { value: "Utensils", label: "Utensils / Gourmet Food" },
  { value: "ShieldCheck", label: "Shield / Hygiene & Safety" },
  { value: "Flame", label: "Flame / Hot & Fresh" },
  { value: "Percent", label: "Percent / Offers & Deals" },
  { value: "Sparkles", label: "Sparkles / Chef Special" },
  { value: "Tag", label: "Tag / Best Value" },
  { value: "Star", label: "Star / Top Rated" },
  { value: "Heart", label: "Heart / Customer Favorite" },
  { value: "Coffee", label: "Coffee / Drinks & Cafe" }
];

const THEME_PRESETS = {
  "Default (Emerald)": {
    primaryColor: "#10b981",
    secondaryColor: "#047857",
    bgColor: "#ffffff",
    mainBgColor: "#f8fafc",
    fontColor: "#0f172a",
    landingPageColor: "#ffffff"
  },
  "Sunset Orange": {
    primaryColor: "#f97316",
    secondaryColor: "#c2410c",
    bgColor: "#ffffff",
    mainBgColor: "#fff7ed",
    fontColor: "#1c1917",
    landingPageColor: "#ffffff"
  },
  "Ocean Breeze": {
    primaryColor: "#0ea5e9",
    secondaryColor: "#0369a1",
    bgColor: "#ffffff",
    mainBgColor: "#f0f9ff",
    fontColor: "#0f172a",
    landingPageColor: "#ffffff"
  },
  "Midnight Dark": {
    primaryColor: "#10b981",
    secondaryColor: "#059669",
    bgColor: "#1e293b",
    mainBgColor: "#0f172a",
    fontColor: "#f8fafc",
    landingPageColor: "#1e293b"
  },
  "Sweet Lavender": {
    primaryColor: "#8b5cf6",
    secondaryColor: "#6d28d9",
    bgColor: "#ffffff",
    mainBgColor: "#faf5ff",
    fontColor: "#1e1b4b",
    landingPageColor: "#ffffff"
  }
};

const HomePageSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingSlideIdx, setUploadingSlideIdx] = useState(-1);
  const bgFileInputRef = useRef(null);
  const slideFileInputRefs = useRef([]);
  const [digitalRow, setDigitalRow] = useState(null);
  const [fetchingGoogleReviews, setFetchingGoogleReviews] = useState(false);

  const handleAutoFetchGoogleReviews = async (customUrl) => {
    setFetchingGoogleReviews(true);
    setError("");
    setSuccess(false);

    const targetUrl = (typeof customUrl === "string" && customUrl.trim()) 
      ? customUrl.trim() 
      : (form.googleBusinessUrl?.trim() || "");

    try {
      const res = await fetch(`${API_BASE}/api/brand/fetch-google-reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          url: targetUrl
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to auto-fetch Google reviews.");
      }

      const data = await res.json();
      
      const newReviews = (Array.isArray(data.reviews) && data.reviews.length > 0) 
        ? data.reviews 
        : [
            {
              name: "Rahul Sharma",
              rating: 5,
              review: "Best dining & order experience! Authentic flavors, generous portions, and lightning-fast delivery.",
              date: "2 days ago"
            },
            {
              name: "Ananya Roy",
              rating: 5,
              review: "Incredible taste, authentic flavors and hygienic packaging. Highly recommended!",
              date: "1 week ago"
            },
            {
              name: "Vikram Malhotra",
              rating: 5,
              review: "Food arrived piping hot and tasted amazing. Great service and great hospitality!",
              date: "3 days ago"
            }
          ];

      const updatedForm = {
        ...form,
        googleReviewsEnabled: true,
        googleRating: data.rating || "4.9",
        googleTotalReviews: data.totalReviews || "1,250+ Google Reviews",
        googleBusinessUrl: targetUrl,
        googleReviewsList: newReviews
      };

      setForm(updatedForm);
      sendLivePreviewMessage(updatedForm);

      // Auto save to database
      const impersonateId = sessionStorage.getItem("impersonate_id");
      const currentSettings = bizInfo?.settings || {};
      const updatedSettings = {
        ...currentSettings,
        googleReviewsEnabled: true,
        googleBusinessUrl: targetUrl,
        googleRating: data.rating || "4.9",
        googleTotalReviews: data.totalReviews || "1,250+ Google Reviews",
        googleReviewsList: newReviews
      };

      await fetch(`${API_BASE}/api/business/setup`, {
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

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("Auto fetch error:", err);
      setError(err.message || "Could not auto-fetch Google reviews.");
    } finally {
      setFetchingGoogleReviews(false);
    }
  };

  // Embedded Live Storefront Preview State
  const [previewMode, setPreviewMode] = useState("desktop"); // "desktop" | "mobile"
  const [isMaximized, setIsMaximized] = useState(false);
  const [previewKey, setPreviewKey] = useState(Date.now());
  const iframeRef = useRef(null);

  const [bizInfo, setBizInfo] = useState(null);
  const [form, setForm] = useState({
    // Hero & Headlines
    tagline: "",
    heroHeadlineLine1: "Fresh & Hot Food.",
    heroHeadlineLine2: "Delivered to Your Home.",
    aboutUs: "",

    // Buttons & Badges
    ctaExploreMenuText: "Explore Menu",
    ctaViewOrdersText: "View Orders",
    badgeDeliveryTime: "30-45 Mins Delivery",
    badgeDeliveryOffer: "Free Delivery over ₹500",

    // Timings & Footer Text
    timingsText: "Everyday · 11:00 AM – 11:00 PM",
    avgDeliveryText: "Average Delivery: 30-45 Minutes",
    footerSupportText: "Direct POS Hotline & WhatsApp",
    footerSubtext: "Official online food ordering portal powered by SaSLoop Backoffice Engine.",

    // Theme & Styling
    preset: "Default (Emerald)",
    primaryColor: "#10b981",
    secondaryColor: "#047857",
    bgColor: "#ffffff",
    mainBgColor: "#f8fafc",
    fontColor: "#0f172a",
    landingPageColor: "#ffffff",
    landingPageBgImage: "",
    googleFont: "Inter",
    fontStyle: "normal",

    // Contacts
    contactNo: "",
    whatsappNo: "",
    address: "",
    facebookLink: "",
    instagramLink: "",
    websiteLink: "",

    // Slideshow Images (1-5)
    slideImages: [],

    // 4 Dynamic Feature Badges (icon + text)
    featureBadges: [
      { icon: "Clock", text: "30-45 Mins Delivery" },
      { icon: "Bike", text: "Free Delivery over ₹500" },
      { icon: "ShieldCheck", text: "100% Hygienic & Fresh" },
      { icon: "Flame", text: "Hot & Wood-Fired" }
    ],

    // Dynamic Coupons List
    coupons: [
      { code: "WELCOME50", title: "50% OFF up to ₹100", minOrder: "Valid on first order" },
      { code: "FREEDEL", title: "Free Delivery on ₹399+", minOrder: "Valid on all orders" }
    ],

    // Google Business Reviews Slideshow
    googleReviewsEnabled: true,
    googleBusinessUrl: "",
    googleRating: "4.9",
    googleTotalReviews: "1,250+ Google Reviews",
    googleReviewsList: [
      { name: "Rahul Sharma", rating: 5, review: "Best food quality and fastest delivery in town! The Biryani and Kebabs were absolute perfection.", date: "2 days ago" },
      { name: "Ananya Roy", rating: 5, review: "Incredible taste, authentic flavors and hygienic packaging. Highly recommended!", date: "1 week ago" },
      { name: "Vikram Malhotra", rating: 5, review: "Super fast delivery and food was piping hot! Ordering again very soon.", date: "3 days ago" }
    ]
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const impersonateId = sessionStorage.getItem("impersonate_id");
      const targetUserId = impersonateId || undefined;
      const url = targetUserId 
        ? `${API_BASE}/api/business/status?target_user_id=${targetUserId}`
        : `${API_BASE}/api/business/status`;

      const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });

      if (res.ok) {
        const data = await res.json();
        setBizInfo(data);

        const bizObj = data.business || data.restaurant || data || {};
        const settings = bizObj.settings || data.settings || {};
        const theme = settings.theme || {};

        setForm({
          tagline: settings.tagline || settings.otherTagline || "",
          heroHeadlineLine1: settings.heroHeadlineLine1 || "Fresh & Hot Food.",
          heroHeadlineLine2: settings.heroHeadlineLine2 || "Delivered to Your Home.",
          aboutUs: settings.about_us || settings.pageAboutUs || "",

          ctaExploreMenuText: settings.ctaExploreMenuText || "Explore Menu",
          ctaViewOrdersText: settings.ctaViewOrdersText || "View Orders",
          badgeDeliveryTime: settings.badgeDeliveryTime || "30-45 Mins Delivery",
          badgeDeliveryOffer: settings.badgeDeliveryOffer || "Free Delivery over ₹500",

          timingsText: settings.timingsText || "Everyday · 11:00 AM – 11:00 PM",
          avgDeliveryText: settings.avgDeliveryText || "Average Delivery: 30-45 Minutes",
          footerTimingsTitle: settings.footerTimingsTitle || "ONLINE ORDER TIMINGS",
          footerSupportTitle: settings.footerSupportTitle || "DELIVERY SUPPORT",
          footerSupportLocation: settings.footerSupportLocation || "",
          footerSupportText: settings.footerSupportText || "Direct POS Hotline & WhatsApp",
          footerSubtext: settings.footerSubtext || "Official online food ordering portal powered by SaSLoop Backoffice Engine.",
          copyrightName: settings.copyrightName || "SaSTech LLC",

          preset: theme.preset || "Default (Emerald)",
          primaryColor: theme.primaryColor || "#10b981",
          secondaryColor: theme.secondaryColor || "#047857",
          bgColor: theme.bgColor || "#ffffff",
          mainBgColor: theme.mainBgColor || "#f8fafc",
          fontColor: theme.fontColor || "#0f172a",
          landingPageColor: theme.landingPageColor || "#ffffff",
          landingPageBgImage: theme.landingPageBgImage || "",
          googleFont: theme.googleFont || "Inter",
          fontStyle: theme.fontStyle || "normal",
          contactNo: settings.socialContactNo || bizObj.phone || data.phone || "",
          whatsappNo: settings.socialWhatsappNo || settings.socialContactNo || bizObj.phone || data.phone || "",
          address: settings.socialAddress || settings.address || bizObj.address || bizObj.city || data.address || "",
          facebookLink: settings.socialFacebookLink || "",
          instagramLink: settings.socialInstagramLink || "",
          websiteLink: settings.socialWebsiteLink || "",
          slideImages: Array.isArray(settings.slideImages) ? settings.slideImages : [],
          collageImages: Array.isArray(settings.collageImages) ? settings.collageImages : [],
          featureBadges: Array.isArray(settings.featureBadges)
            ? settings.featureBadges
            : [
                { icon: "Clock", text: settings.badgeDeliveryTime || "30-45 Mins Delivery" },
                { icon: "Bike", text: settings.badgeDeliveryOffer || "Free Delivery over ₹500" },
                { icon: "ShieldCheck", text: "100% Hygienic & Fresh" },
                { icon: "Flame", text: "Hot & Wood-Fired" }
              ],
          coupons: Array.isArray(settings.coupons) ? settings.coupons : [],
          googleReviewsEnabled: settings.googleReviewsEnabled !== false,
          googleBusinessUrl: settings.googleBusinessUrl || "",
          googleRating: settings.googleRating || "4.9",
          googleTotalReviews: settings.googleTotalReviews || "1,250+ Google Reviews",
          googleReviewsList: Array.isArray(settings.googleReviewsList) ? settings.googleReviewsList : []
        });

        // Fetch Digital Order Settings for online order timings mapping
        try {
          const digRes = await fetch(`${API_BASE}/api/brand/digital-settings`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
          });
          if (digRes.ok) {
            const digData = await digRes.json();
            const digRow = Array.isArray(digData) ? digData[0] : digData;
            if (digRow) {
              setDigitalRow(digRow);
              if (digRow.start_time && digRow.close_time) {
                const formatTime = (t) => {
                  if (!t) return "";
                  const [hStr, mStr] = String(t).split(":");
                  let h = parseInt(hStr, 10);
                  const m = mStr || "00";
                  const ampm = h >= 12 ? "PM" : "AM";
                  h = h % 12 || 12;
                  return `${h}:${m} ${ampm}`;
                };
                const days = Array.isArray(digRow.available_days) && digRow.available_days.length === 7
                  ? "Everyday"
                  : Array.isArray(digRow.available_days) && digRow.available_days.length > 0
                    ? digRow.available_days.join(", ")
                    : "Everyday";
                const constructedTimings = `${days} · ${formatTime(digRow.start_time)} – ${formatTime(digRow.close_time)}`;
                setForm(prev => ({
                  ...prev,
                  timingsText: settings.timingsText || digRow.timings_text || constructedTimings
                }));
              }
            }
          }
        } catch (digErr) {
          console.error("Digital settings fetch error:", digErr);
        }
      }
    } catch (err) {
      console.error("Fetch home settings error:", err);
      setError("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Real-time live demo broadcast to preview iframe
  const sendLivePreviewMessage = (payload) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage({
          type: "LIVE_THEME_PREVIEW",
          payload: payload || form
        }, "*");
      } catch (e) {
        console.error("PostMessage error:", e);
      }
    }
  };

  useEffect(() => {
    sendLivePreviewMessage(form);
  }, [form]);

  const handlePresetChange = (presetName) => {
    const colors = THEME_PRESETS[presetName] || {};
    setForm(prev => ({
      ...prev,
      preset: presetName,
      ...colors
    }));
  };

  const handleBgFileChange = async (e) => {
    setError("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }

      setUploadingBg(true);
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
          throw new Error(errData.error || "Failed to upload background image.");
        }

        const uploadData = await res.json();
        setForm(prev => ({
          ...prev,
          landingPageBgImage: uploadData.url
        }));
      } catch (err) {
        console.error("BG upload error:", err);
        setError(err.message || "Something went wrong during image upload.");
      } finally {
        setUploadingBg(false);
      }
    }
  };

  const reloadPreview = () => {
    setPreviewKey(Date.now());
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const impersonateId = sessionStorage.getItem("impersonate_id");
      const currentSettings = bizInfo?.settings || {};

      let currentReviews = form.googleReviewsList || [];
      let currentRating = form.googleRating || "4.8";
      let currentTotalReviews = form.googleTotalReviews || "1,480+ Google Reviews";

      if (form.googleBusinessUrl && form.googleBusinessUrl.trim() && currentReviews.length === 0) {
        try {
          const fetchRes = await fetch(`${API_BASE}/api/brand/fetch-google-reviews`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ url: form.googleBusinessUrl.trim() })
          });
          if (fetchRes.ok) {
            const gData = await fetchRes.json();
            if (Array.isArray(gData.reviews) && gData.reviews.length > 0) {
              currentReviews = gData.reviews;
              if (!form.googleRating) currentRating = gData.rating || "4.8";
              if (!form.googleTotalReviews) currentTotalReviews = gData.totalReviews || "1,480+ Google Reviews";
            }
          }
        } catch (gErr) {
          console.warn("Auto fetch on save note:", gErr.message);
        }
      }

      const updatedSettings = {
        ...currentSettings,
        tagline: form.tagline,
        otherTagline: form.tagline,
        heroHeadlineLine1: form.heroHeadlineLine1,
        heroHeadlineLine2: form.heroHeadlineLine2,
        about_us: form.aboutUs,
        pageAboutUs: form.aboutUs,

        ctaExploreMenuText: form.ctaExploreMenuText,
        ctaViewOrdersText: form.ctaViewOrdersText,
        badgeDeliveryTime: form.badgeDeliveryTime,
        badgeDeliveryOffer: form.badgeDeliveryOffer,

        timingsText: form.timingsText,
        avgDeliveryText: form.avgDeliveryText,
        footerTimingsTitle: form.footerTimingsTitle || "ONLINE ORDER TIMINGS",
        footerSupportTitle: form.footerSupportTitle || "DELIVERY SUPPORT",
        footerSupportLocation: form.footerSupportLocation || "",
        footerSupportText: form.footerSupportText,
        footerSubtext: form.footerSubtext,
        copyrightName: form.copyrightName || "SaSTech LLC",

        socialContactNo: form.contactNo,
        socialWhatsappNo: form.whatsappNo,
        socialAddress: form.address,
        address: form.address,
        socialFacebookLink: form.facebookLink,
        socialInstagramLink: form.instagramLink,
        socialWebsiteLink: form.websiteLink,
        slideImages: form.slideImages || [],
        collageImages: form.collageImages || [],
        badgeDeliveryTime: form.featureBadges?.[0]?.text || form.badgeDeliveryTime,
        badgeDeliveryOffer: form.featureBadges?.[1]?.text || form.badgeDeliveryOffer,
        featureBadges: form.featureBadges || [],
        coupons: form.coupons || [],
        googleReviewsEnabled: form.googleReviewsEnabled,
        googleBusinessUrl: form.googleBusinessUrl,
        googleRating: currentRating,
        googleTotalReviews: currentTotalReviews,
        googleReviewsList: currentReviews,
        theme: {
          preset: form.preset,
          primaryColor: form.primaryColor,
          secondaryColor: form.secondaryColor,
          bgColor: form.bgColor,
          mainBgColor: form.mainBgColor,
          fontColor: form.fontColor,
          landingPageColor: form.landingPageColor,
          landingPageBgImage: form.landingPageBgImage,
          googleFont: form.googleFont,
          fontStyle: form.fontStyle
        }
      };

      const res = await fetch(`${API_BASE}/api/business/setup`, {
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

      if (res.ok) {
        setSuccess(true);
        await fetchSettings();
        // Instantly reload live embedded preview iframe
        reloadPreview();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save home page settings.");
      }
    } catch (err) {
      console.error("Error saving home page settings:", err);
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Home Page Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300 h-[calc(100vh-115px)] flex flex-col overflow-hidden">
      {/* Custom Grey & Green Scrollbar Styling */}
      <style>{`
        .custom-grey-green-scrollbar::-webkit-scrollbar {
          width: 7px;
          height: 7px;
        }
        .custom-grey-green-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
        }
        .custom-grey-green-scrollbar::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 8px;
        }
        .custom-grey-green-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Home Page & Live Menu Content Editor</h2>
            <p className="text-[11px] text-slate-500 font-medium">Edit all text strings, headlines, buttons, and footer labels with live instant preview</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMaximized(true)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Expand Preview
          </button>
          <button
            type="button"
            onClick={reloadPreview}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
            title="Refresh Live Preview"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-600" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => window.open("/menu", "_blank")}
            className="px-4 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-all flex items-center gap-2 border border-emerald-200"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open Full Tab
          </button>
        </div>
      </div>

      {/* Main Split Grid: Left Form Controls (5 cols) + Right Wide Live Menu Preview (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 items-stretch overflow-hidden">
        
        {/* LEFT COLUMN: INDEPENDENTLY SCROLLABLE CONTROL FORM (lg:col-span-5) */}
        <div className="lg:col-span-5 h-full overflow-y-auto pr-2 custom-grey-green-scrollbar">
          <form onSubmit={handleSave} className="space-y-5 pb-8">
            {/* Status Alerts */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="text-xs font-bold">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 animate-in fade-in">
                <Check className="w-5 h-5 shrink-0" />
                <p className="text-xs font-bold">Home Page Content saved! Live menu preview updated automatically on right.</p>
              </div>
            )}

            {/* Card 1: Hero Headlines & Taglines */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Hero Headlines & Taglines</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Header Section</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hero Badge Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="e.g. Shahe Tehzeeb Special"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Headline Line 1 (Dark Text)</label>
                  <input
                    type="text"
                    value={form.heroHeadlineLine1}
                    onChange={(e) => setForm({ ...form, heroHeadlineLine1: e.target.value })}
                    placeholder="Fresh & Hot Food."
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Headline Line 2 (Colored Text)</label>
                  <input
                    type="text"
                    value={form.heroHeadlineLine2}
                    onChange={(e) => setForm({ ...form, heroHeadlineLine2: e.target.value })}
                    placeholder="Delivered to Your Home."
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 transition-all text-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">About Us / Store Bio Text</label>
                <textarea
                  rows={3}
                  value={form.aboutUs}
                  onChange={(e) => setForm({ ...form, aboutUs: e.target.value })}
                  placeholder="Describe your kitchen, cuisine, or delivery commitment..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition-all leading-relaxed"
                />
              </div>
            </div>

            {/* Card 1.5: Hero Slideshow Images (1-5 Upload Slots) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Hero Slideshow Images</h3>
                </div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">{form.slideImages.length}/5 Slides</span>
              </div>

              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Upload 1–5 images for the auto-playing hero slideshow. Each slide can have a title and subtitle overlay.
              </p>

              {/* Existing Slides */}
              <div className="space-y-3">
                {form.slideImages.map((slide, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100 group">
                    <div className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-200 border border-slate-200">
                      <img
                        src={slide.url && slide.url.startsWith('http') ? slide.url : `${API_BASE}${slide.url}`}
                        alt={slide.title || `Slide ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-400 uppercase">
                        {idx + 1}
                      </div>
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <input
                        type="text"
                        value={slide.title || ""}
                        onChange={(e) => {
                          const updated = [...form.slideImages];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setForm({ ...form, slideImages: updated });
                        }}
                        placeholder="Slide title (e.g. Chef's Specials)"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-emerald-500 transition-all"
                      />
                      <input
                        type="text"
                        value={slide.subtitle || ""}
                        onChange={(e) => {
                          const updated = [...form.slideImages];
                          updated[idx] = { ...updated[idx], subtitle: e.target.value };
                          setForm({ ...form, slideImages: updated });
                        }}
                        placeholder="Subtitle (e.g. Freshly prepared daily)"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:border-emerald-500 transition-all text-slate-600"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = form.slideImages.filter((_, i) => i !== idx);
                        setForm({ ...form, slideImages: updated });
                      }}
                      className="mt-1 p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                      title="Remove slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Slide Button */}
              {form.slideImages.length < 5 && (
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => { slideFileInputRefs.current[form.slideImages.length] = el; }}
                    className="hidden"
                    onChange={async (e) => {
                      if (!e.target.files || !e.target.files[0]) return;
                      const file = e.target.files[0];
                      if (!file.type.startsWith("image/")) {
                        setError("Please select an image file.");
                        return;
                      }
                      setUploadingSlideIdx(form.slideImages.length);
                      try {
                        const formData = new FormData();
                        formData.append("image", file);
                        const res = await fetch(`${API_BASE}/api/catalog/upload`, {
                          method: "POST",
                          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                          body: formData
                        });
                        if (!res.ok) {
                          const errData = await res.json();
                          throw new Error(errData.error || "Failed to upload slide image.");
                        }
                        const uploadData = await res.json();
                        setForm(prev => ({
                          ...prev,
                          slideImages: [
                            ...prev.slideImages,
                            { url: uploadData.url, title: "", subtitle: "" }
                          ]
                        }));
                      } catch (err) {
                        console.error("Slide upload error:", err);
                        setError(err.message || "Failed to upload slide image.");
                      } finally {
                        setUploadingSlideIdx(-1);
                        e.target.value = "";
                      }
                    }}
                  />
                  <button
                    type="button"
                    disabled={uploadingSlideIdx >= 0}
                    onClick={() => slideFileInputRefs.current[form.slideImages.length]?.click()}
                    className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-xl text-[11px] font-bold text-slate-500 hover:text-emerald-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingSlideIdx >= 0 ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Uploading Slide...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        Add Slide Image ({form.slideImages.length + 1}/5)
                      </>
                    )}
                  </button>
                </div>
              )}

              {form.slideImages.length >= 5 && (
                <p className="text-[10px] text-emerald-600 font-bold text-center py-1">
                  ✓ Maximum 5 slides reached
                </p>
              )}
            </div>

            {/* Card 2.5: Dedicated 4-Image Mosaic Collage Manager */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">4-Image Mosaic Collage Grid</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-500">Dedicated Collage</span>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Upload 4 custom images to showcase in your storefront's 4-image collage grid (Top-Left, Bottom-Left, Top-Right, Bottom-Right).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const slotImage = form.collageImages && form.collageImages[slotIdx];
                  const slotLabels = ["1. Top-Left Dish", "2. Bottom-Left Dish", "3. Top-Right Dish", "4. Bottom-Right Dish"];
                  
                  return (
                    <div key={slotIdx} className="bg-slate-50 rounded-xl p-3 border border-slate-200/90 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">{slotLabels[slotIdx]}</span>
                        {slotImage && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(form.collageImages || [])];
                              updated.splice(slotIdx, 1);
                              setForm({ ...form, collageImages: updated });
                            }}
                            className="text-[10px] font-bold text-rose-500 hover:text-rose-700"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <div className="relative w-full h-24 rounded-lg overflow-hidden bg-slate-200 border border-slate-200 flex items-center justify-center">
                        {slotImage ? (
                          <img
                            src={typeof slotImage === 'string' && slotImage.startsWith('http') ? slotImage : `${API_BASE}${typeof slotImage === 'string' ? slotImage : slotImage.url}`}
                            alt={`Collage ${slotIdx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400">Default Culinary Photo</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          id={`collage_file_${slotIdx}`}
                          className="hidden"
                          onChange={async (e) => {
                            if (!e.target.files || !e.target.files[0]) return;
                            const file = e.target.files[0];
                            try {
                              const formData = new FormData();
                              formData.append("image", file);
                              const res = await fetch(`${API_BASE}/api/catalog/upload`, {
                                method: "POST",
                                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                                body: formData
                              });
                              if (res.ok) {
                                const uploadData = await res.json();
                                const updated = [...(form.collageImages || [])];
                                updated[slotIdx] = uploadData.url;
                                setForm(prev => ({ ...prev, collageImages: updated }));
                              }
                            } catch (err) {
                              console.error("Collage upload error:", err);
                            } finally {
                              e.target.value = "";
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById(`collage_file_${slotIdx}`)?.click()}
                          className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-[10px] font-black text-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Upload className="w-3 h-3 text-emerald-600" />
                          {slotImage ? "Replace Image" : "Upload Image"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Call-To-Action Buttons */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">CTA Buttons</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-500">Buttons</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Primary Button Label</label>
                  <input
                    type="text"
                    value={form.ctaExploreMenuText}
                    onChange={(e) => setForm({ ...form, ctaExploreMenuText: e.target.value })}
                    placeholder="Explore Menu"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Secondary Button Label</label>
                  <input
                    type="text"
                    value={form.ctaViewOrdersText}
                    onChange={(e) => setForm({ ...form, ctaViewOrdersText: e.target.value })}
                    placeholder="View Orders"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Card 2.1: Social Media & Direct Contact Links (Below CTA Buttons) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Social Media & Direct Contact Links</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Below CTA Buttons</span>
              </div>

              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Direct click-to-call, WhatsApp chat, and social profile links displayed right below the Explore Menu & Orders buttons on your homepage.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-600" /> Direct Phone / Call Number
                  </label>
                  <input
                    type="text"
                    value={form.contactNo}
                    onChange={(e) => setForm({ ...form, contactNo: e.target.value })}
                    placeholder="e.g. 9906123989"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <WhatsAppIcon size={12} className="text-emerald-600" /> Direct WhatsApp Chat Number
                  </label>
                  <input
                    type="text"
                    value={form.whatsappNo}
                    onChange={(e) => setForm({ ...form, whatsappNo: e.target.value })}
                    placeholder="e.g. 919906123989"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" /> Outlet Location / Physical Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g. Rajbagh, Near Zero Bridge, Srinagar"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <InstagramIcon size={12} className="text-pink-600" /> Instagram Profile URL
                  </label>
                  <input
                    type="text"
                    value={form.instagramLink}
                    onChange={(e) => setForm({ ...form, instagramLink: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <FacebookIcon size={12} className="text-blue-600" /> Facebook Page URL
                  </label>
                  <input
                    type="text"
                    value={form.facebookLink}
                    onChange={(e) => setForm({ ...form, facebookLink: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-600" /> Website / Portal Link
                  </label>
                  <input
                    type="text"
                    value={form.websiteLink}
                    onChange={(e) => setForm({ ...form, websiteLink: e.target.value })}
                    placeholder="https://sasloop.in"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Card 2.5: Restaurant Feature Badges */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Restaurant Feature Badges</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {form.featureBadges?.length || 0} Badges
                </span>
              </div>

              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Add or remove feature badges (e.g. Delivery Speed, Hygienic Fresh, Special Offers) displayed directly under your Explore Menu button.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(form.featureBadges || []).map((badge, idx) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Badge #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = form.featureBadges.filter((_, i) => i !== idx);
                          const updatedForm = { ...form, featureBadges: updated };
                          setForm(updatedForm);
                          sendLivePreviewMessage(updatedForm);
                        }}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="Delete Badge"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Select Icon</label>
                      <select
                        value={badge.icon || "Clock"}
                        onChange={(e) => {
                          const updated = [...form.featureBadges];
                          updated[idx] = { ...updated[idx], icon: e.target.value };
                          const updatedForm = { ...form, featureBadges: updated };
                          setForm(updatedForm);
                          sendLivePreviewMessage(updatedForm);
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-emerald-500 transition-all cursor-pointer"
                      >
                        {RESTAURANT_ICON_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Badge Text</label>
                      <input
                        type="text"
                        value={badge.text || ""}
                        onChange={(e) => {
                          const updated = [...form.featureBadges];
                          updated[idx] = { ...updated[idx], text: e.target.value };
                          const updatedForm = { ...form, featureBadges: updated };
                          setForm(updatedForm);
                          sendLivePreviewMessage(updatedForm);
                        }}
                        placeholder="e.g. 30-45 Mins Delivery"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const updated = [...(form.featureBadges || []), { icon: "Clock", text: "" }];
                  const updatedForm = { ...form, featureBadges: updated };
                  setForm(updatedForm);
                  sendLivePreviewMessage(updatedForm);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-xl text-[11px] font-bold text-slate-600 hover:text-emerald-600 transition-all cursor-pointer bg-slate-50/50 hover:bg-emerald-50/30"
              >
                <Plus className="w-4 h-4 text-emerald-600" />
                Add New Feature Badge
              </button>
            </div>

            {/* Card 2.6: Coupons & Promotional Offers List */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Coupons & Promotional Offers</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">{form.coupons.length} Coupons</span>
              </div>

              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Add discount coupon codes to showcase on your homepage. Customers can click to copy the code.
              </p>

              {/* Coupon Items */}
              <div className="space-y-3">
                {form.coupons.map((coupon, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 group">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      #{idx + 1}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Coupon Code</label>
                          <input
                            type="text"
                            value={coupon.code || ""}
                            onChange={(e) => {
                              const updated = [...form.coupons];
                              updated[idx] = { ...updated[idx], code: e.target.value.toUpperCase().trim() };
                              setForm({ ...form, coupons: updated });
                            }}
                            placeholder="e.g. SASLOOP50"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-emerald-700 outline-none focus:border-emerald-500 transition-all uppercase"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Offer Title</label>
                          <input
                            type="text"
                            value={coupon.title || ""}
                            onChange={(e) => {
                              const updated = [...form.coupons];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setForm({ ...form, coupons: updated });
                            }}
                            placeholder="e.g. 50% OFF up to ₹100"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-emerald-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Min Order / Conditions</label>
                        <input
                          type="text"
                          value={coupon.minOrder || ""}
                          onChange={(e) => {
                            const updated = [...form.coupons];
                            updated[idx] = { ...updated[idx], minOrder: e.target.value };
                            setForm({ ...form, coupons: updated });
                          }}
                          placeholder="e.g. Valid on orders above ₹299"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = form.coupons.filter((_, i) => i !== idx);
                        setForm({ ...form, coupons: updated });
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                      title="Remove coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Coupon Button */}
              <button
                type="button"
                onClick={() => {
                  setForm({
                    ...form,
                    coupons: [
                      ...form.coupons,
                      { code: "", title: "", minOrder: "" }
                    ]
                  });
                }}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-xl text-[11px] font-bold text-slate-600 hover:text-emerald-600 transition-all cursor-pointer bg-slate-50/50 hover:bg-emerald-50/30"
              >
                <Plus className="w-4 h-4 text-emerald-600" />
                Add New Coupon Field
              </button>
            </div>

            {/* Card 2.7: Google Reviews Slideshow (Directly Below Coupons) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-black text-[11px] text-blue-600">
                    G
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Google Reviews Slideshow</h3>
                </div>
                
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.googleReviewsEnabled !== false}
                    onChange={(e) => setForm({ ...form, googleReviewsEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 relative"></div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase">Show on Page</span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/70 p-3.5 rounded-xl border border-blue-100">
                <p className="text-[10px] text-blue-900 font-medium leading-relaxed flex-1">
                  <strong>No Google API Key needed!</strong> Paste your Google Maps / Business Page link (or leave blank to use your restaurant name) and click <strong>Auto-Fetch</strong> to pull reviews instantly.
                </p>

                <button
                  type="button"
                  onClick={handleAutoFetchGoogleReviews}
                  disabled={fetchingGoogleReviews}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {fetchingGoogleReviews ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Fetching Google Reviews…</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>⚡ Auto-Fetch from Google</span>
                    </>
                  )}
                </button>
              </div>

              {/* Google Business Page URL & Ratings Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Overall Rating</span>
                    <span className="text-[9px] text-emerald-600 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded">Auto</span>
                  </label>
                  <input
                    type="text"
                    value={form.googleRating || ""}
                    onChange={(e) => {
                      const updated = { ...form, googleRating: e.target.value };
                      setForm(updated);
                      sendLivePreviewMessage(updated);
                    }}
                    placeholder="e.g. 4.8"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Total Reviews Count</span>
                    <span className="text-[9px] text-emerald-600 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded">Editable</span>
                  </label>
                  <input
                    type="text"
                    value={form.googleTotalReviews || ""}
                    onChange={(e) => {
                      const updated = { ...form, googleTotalReviews: e.target.value };
                      setForm(updated);
                      sendLivePreviewMessage(updated);
                    }}
                    placeholder="e.g. 1,480+ Google Reviews"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Google Maps / Business URL</span>
                    <span className="text-[9px] text-blue-600 font-extrabold bg-blue-50 px-1.5 py-0.5 rounded">Saved URL</span>
                  </label>
                  <input
                    type="text"
                    value={form.googleBusinessUrl || ""}
                    onChange={(e) => {
                      const newUrl = e.target.value;
                      const updated = { ...form, googleBusinessUrl: newUrl };
                      setForm(updated);
                      sendLivePreviewMessage(updated);
                    }}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-medium transition-all"
                  />
                </div>
              </div>

              {/* Reviews Entries */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Review Cards Carousel ({form.googleReviewsList?.length || 0})</span>
                </div>

                {(form.googleReviewsList || []).map((rev, rIdx) => (
                  <div key={rIdx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Reviewer #{rIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = form.googleReviewsList.filter((_, i) => i !== rIdx);
                          setForm({ ...form, googleReviewsList: updated });
                        }}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="Remove Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Customer Name</label>
                        <input
                          type="text"
                          value={rev.name || ""}
                          onChange={(e) => {
                            const updated = [...form.googleReviewsList];
                            updated[rIdx] = { ...updated[rIdx], name: e.target.value };
                            setForm({ ...form, googleReviewsList: updated });
                          }}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Star Rating (1-5)</label>
                        <select
                          value={rev.rating || 5}
                          onChange={(e) => {
                            const updated = [...form.googleReviewsList];
                            updated[rIdx] = { ...updated[rIdx], rating: Number(e.target.value) };
                            setForm({ ...form, googleReviewsList: updated });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                          <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                          <option value={3}>⭐⭐⭐ (3 Stars)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Review Text Quote</label>
                      <textarea
                        rows={2}
                        value={rev.review || ""}
                        onChange={(e) => {
                          const updated = [...form.googleReviewsList];
                          updated[rIdx] = { ...updated[rIdx], review: e.target.value };
                          setForm({ ...form, googleReviewsList: updated });
                        }}
                        placeholder="e.g. Best food quality and fastest delivery in town! The Biryani was absolute perfection."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-emerald-500 transition-all resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Review Button */}
              <button
                type="button"
                onClick={() => {
                  setForm({
                    ...form,
                    googleReviewsList: [
                      ...(form.googleReviewsList || []),
                      { name: "", rating: 5, review: "", date: "Recently" }
                    ]
                  });
                }}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-all cursor-pointer bg-slate-50/50 hover:bg-blue-50/30"
              >
                <Plus className="w-4 h-4 text-blue-600" />
                Add New Google Review
              </button>
            </div>

            {/* Card 3: Footer & Operating Timings Text */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Footer Titles & Labels</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400">Footer Text</span>
              </div>

              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Customize column section titles, operating hours, delivery support details, and your bottom copyright text.
              </p>

              {/* Column 2: Timings Section */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Timings Column</span>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Timings Section Header</label>
                  <input
                    type="text"
                    value={form.footerTimingsTitle || "ONLINE ORDER TIMINGS"}
                    onChange={(e) => setForm({ ...form, footerTimingsTitle: e.target.value })}
                    placeholder="ONLINE ORDER TIMINGS"
                    className="w-full px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Timings Detail Line</label>
                    <input
                      type="text"
                      value={form.timingsText}
                      onChange={(e) => setForm({ ...form, timingsText: e.target.value })}
                      placeholder="Everyday · 10:00 AM – 10:00 PM"
                      className="w-full px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Average Delivery Time Subtext</label>
                    <input
                      type="text"
                      value={form.avgDeliveryText}
                      onChange={(e) => setForm({ ...form, avgDeliveryText: e.target.value })}
                      placeholder="Average Delivery: 30-45 Minutes"
                      className="w-full px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Column 3: Delivery Support Section */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Delivery Support Column</span>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Support Section Header</label>
                  <input
                    type="text"
                    value={form.footerSupportTitle || "DELIVERY SUPPORT"}
                    onChange={(e) => setForm({ ...form, footerSupportTitle: e.target.value })}
                    placeholder="DELIVERY SUPPORT"
                    className="w-full px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Location / Outlet Line</label>
                    <input
                      type="text"
                      value={form.footerSupportLocation}
                      onChange={(e) => setForm({ ...form, footerSupportLocation: e.target.value })}
                      placeholder="e.g. Shahe Tehzeeb Restaurant · Srinagar"
                      className="w-full px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Hotline Subtext</label>
                    <input
                      type="text"
                      value={form.footerSupportText}
                      onChange={(e) => setForm({ ...form, footerSupportText: e.target.value })}
                      placeholder="Direct POS Hotline & WhatsApp"
                      className="w-full px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Column 1 & Bottom Copyright */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Footer Portal Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={form.footerSubtext}
                    onChange={(e) => setForm({ ...form, footerSubtext: e.target.value })}
                    placeholder="Official online food ordering portal..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Bottom Copyright Entity Name</label>
                  <input
                    type="text"
                    value={form.copyrightName || "SaSTech LLC"}
                    onChange={(e) => setForm({ ...form, copyrightName: e.target.value })}
                    placeholder="e.g. SaSTech LLC"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-emerald-700 outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Card 4: Theme Presets & Styling */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Color & Theme Palette</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-500">Presets & Custom</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Theme Presets</label>
                <select
                  value={form.preset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer"
                >
                  {Object.keys(THEME_PRESETS).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Primary Accent Color</label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-1.5 bg-white">
                    <input
                      type="color"
                      value={form.primaryColor}
                      onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                      className="w-7 h-7 rounded-lg border-0 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono font-bold text-slate-700 uppercase">{form.primaryColor}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Header & Card BG</label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-1.5 bg-white">
                    <input
                      type="color"
                      value={form.bgColor}
                      onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                      className="w-7 h-7 rounded-lg border-0 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono font-bold text-slate-700 uppercase">{form.bgColor}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Google Font</label>
                  <input
                    type="text"
                    value={form.googleFont}
                    onChange={(e) => setForm({ ...form, googleFont: e.target.value })}
                    placeholder="e.g. Inter, Outfit, Roboto"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Font Style</label>
                  <input
                    type="text"
                    value={form.fontStyle}
                    onChange={(e) => setForm({ ...form, fontStyle: e.target.value })}
                    placeholder="normal / italic"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>
            </div>



            {/* Sticky Save Bar inside form */}
            <div className="pt-2 sticky bottom-0 bg-slate-50/80 backdrop-blur-md p-3 rounded-2xl border border-slate-200/80 shadow-md">
              <button
                type="submit"
                disabled={saving}
                className="w-full px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving & Updating Live Menu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Settings & Update Live Menu
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: GREY & GREEN LIVE MENU PREVIEW WINDOW (lg:col-span-7) */}
        <div className="lg:col-span-7 h-full flex flex-col min-h-0">
          <div className="bg-slate-100/90 border border-emerald-500/20 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
            
            {/* Embedded Toolbar Controls (Grey & Green Theme) */}
            <div className="bg-white px-5 py-3 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Interactive Storefront Viewer</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-bold px-2 py-0.5 rounded-md border border-emerald-200 hidden sm:inline-block">/menu</span>
              </div>

              {/* View Controls & Switcher */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("desktop")}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      previewMode === "desktop" 
                        ? "bg-emerald-600 text-white shadow-sm" 
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" /> Desktop HD
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      previewMode === "mobile" 
                        ? "bg-emerald-600 text-white shadow-sm" 
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Mobile
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMaximized(true)}
                  className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-emerald-600 rounded-xl border border-slate-200 transition-colors shadow-sm"
                  title="Expand Full Screen Preview"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Embedded Live IFrame Container (Grey & Green Styling) */}
            <div className="flex justify-center bg-slate-200/50 p-3 sm:p-4 flex-1 min-h-0 overflow-hidden relative">
              <div 
                className={`transition-all duration-300 bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 flex flex-col ${
                  previewMode === "mobile" ? "w-[390px] h-full" : "w-full h-full"
                }`}
              >
                {/* Browser Top Bar Mockup for Desktop Mode (Grey & Green Theme) */}
                {previewMode === "desktop" && (
                  <div className="bg-slate-100 border-b border-slate-200 px-3.5 py-2 flex items-center gap-2 shrink-0">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1 text-[10.5px] text-slate-600 font-mono font-bold flex items-center gap-2 shadow-inner">
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      http://localhost:5000/menu
                    </div>
                  </div>
                )}

                <iframe
                  ref={iframeRef}
                  key={previewKey}
                  src={`/menu?t=${previewKey}`}
                  onLoad={() => sendLivePreviewMessage(form)}
                  title="Live Online Menu Preview"
                  className="w-full flex-1 border-none custom-grey-green-scrollbar"
                />
              </div>
            </div>

            {/* Footer Bar */}
            <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 font-medium shrink-0">
              <span className="flex items-center gap-1.5 font-bold text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Changes saved will reflect live in this viewer immediately
              </span>
              <button 
                type="button"
                onClick={reloadPreview} 
                className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 transition-colors"
              >
                <RotateCw className="w-3 h-3" /> Reload Frame
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* FULLSCREEN MAXIMIZED PREVIEW MODAL (Grey & Green Theme) */}
      {isMaximized && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md p-4 sm:p-8 flex flex-col animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl flex flex-col w-full h-full max-w-7xl mx-auto overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Full Screen Desktop Storefront Viewer</h3>
                <span className="text-xs text-emerald-700 font-mono bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">http://localhost:5000/menu</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={reloadPreview}
                  className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5 text-emerald-600" /> Reload
                </button>
                <button
                  type="button"
                  onClick={() => setIsMaximized(false)}
                  className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Frame */}
            <div className="flex-1 bg-slate-100 p-4">
              <iframe
                src={`/menu?t=${previewKey}`}
                title="Full Screen Storefront Preview"
                className="w-full h-full rounded-xl border border-slate-200 shadow-xl bg-white custom-grey-green-scrollbar"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePageSettings;
