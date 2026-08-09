import React, { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingBag, Plus, Minus, ArrowRight, X, Leaf, Check, Calendar,
  MapPin, Clock, Bike, ShoppingBag as PickupIcon, ChevronDown, Phone,
  CheckCircle2, Sparkles, User, Package, Heart, LogOut, Navigation, AlertTriangle,
  Utensils, UtensilsCrossed, Menu, ShieldCheck, Flame, Percent, Tag, Star, Coffee, Ticket, Copy, ExternalLink,
  Globe, MessageCircle, Share2, Bell, Lock, ShieldOff, XCircle, Receipt
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import API_BASE from "../config";

const InstagramIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const WhatsAppIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.55 4.108 1.516 5.843L0 24l6.335-1.482C8.01 23.473 9.948 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm.006 22c-1.802 0-3.568-.475-5.114-1.378l-.367-.215-3.766.881.896-3.666-.239-.379A9.948 9.948 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-9.994 10z" />
  </svg>
);

/* ────────── INTERACTIVE LEAFLET MAP PICKER (AUTO GPS & PIN AT CURRENT LOCATION) ────────── */
const InteractiveMapPicker = ({ restLat, restLng, deliveryCoords, setDeliveryCoords, calculatedDistanceKm, fetchAddressFromCoords, readOnly = false, isByDistanceMode = false, maxDeliveryRadiusKm = 15 }) => {
  const mapRef = React.useRef(null);
  const leafletMapInstance = React.useRef(null);
  const markerRef = React.useRef(null);

  const curLat = deliveryCoords?.lat || restLat || 34.262643;
  const curLng = deliveryCoords?.lng || restLng || 74.903283;

  useEffect(() => {
    if (!mapRef.current) return;

    // Auto-request high accuracy GPS location on mount if not readOnly and deliveryCoords not set
    if (!readOnly && !deliveryCoords && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (setDeliveryCoords) setDeliveryCoords({ lat: latitude, lng: longitude });
          if (leafletMapInstance.current) {
            leafletMapInstance.current.setView([latitude, longitude], 16);
          }
          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          }
          if (fetchAddressFromCoords) {
            fetchAddressFromCoords(latitude, longitude);
          }
        },
        (err) => {
          console.warn("Auto GPS location error:", err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMapInstance.current) {
      setTimeout(() => {
        try {
          leafletMapInstance.current.invalidateSize();
          if (deliveryCoords && deliveryCoords.lat && deliveryCoords.lng) {
            leafletMapInstance.current.flyTo([deliveryCoords.lat, deliveryCoords.lng], 16, { animate: true, duration: 1 });
            if (markerRef.current) markerRef.current.setLatLng([deliveryCoords.lat, deliveryCoords.lng]);
          }
        } catch (e) {}
      }, 200);
    }
  }, [deliveryCoords?.lat, deliveryCoords?.lng]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!leafletMapInstance.current) {
      const map = L.map(mapRef.current, {
        center: [curLat, curLng],
        zoom: 16,
        attributionControl: false, // Hides OpenStreetMap footer text cleanly
        zoomControl: !readOnly,
        dragging: !readOnly,
        touchZoom: !readOnly,
        doubleClickZoom: !readOnly,
        scrollWheelZoom: !readOnly,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Restaurant Circle Boundary Marker (only in interactive mode)
      if (!readOnly && restLat && restLng) {
        L.circle([restLat, restLng], {
          color: '#e05328',
          fillColor: '#e05328',
          fillOpacity: 0.1,
          radius: (parseFloat(maxDeliveryRadiusKm) || 15) * 1000,
        }).addTo(map);
      }

      // Custom Pin
      const pinIcon = L.divIcon({
        className: 'custom-pin-icon',
        html: `<div style="background-color:#10b981;width:34px;height:34px;border-radius:50%;border:3px solid white;box-shadow:0 4px 14px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;color:white;font-size:18px;cursor:${readOnly ? 'default' : 'grab'};">📍</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([curLat, curLng], {
        icon: pinIcon,
        draggable: !readOnly,
      }).addTo(map);

      if (!readOnly) {
        marker.on('dragend', (e) => {
          const { lat, lng } = e.target.getLatLng();
          if (setDeliveryCoords) setDeliveryCoords({ lat, lng });
          if (fetchAddressFromCoords) fetchAddressFromCoords(lat, lng);
        });

        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          if (setDeliveryCoords) setDeliveryCoords({ lat, lng });
          if (fetchAddressFromCoords) fetchAddressFromCoords(lat, lng);
        });
      }

      markerRef.current = marker;
      leafletMapInstance.current = map;
      setTimeout(() => { map.invalidateSize(); }, 300);
    }
  }, [restLat, restLng, setDeliveryCoords, readOnly, maxDeliveryRadiusKm]);

  return (
    <div className={`relative w-full ${readOnly ? 'h-44 sm:h-52' : 'h-72 sm:h-80'} rounded-2xl overflow-hidden border-2 border-stone-300 shadow-md bg-stone-100`}>
      <div ref={mapRef} className="w-full h-full z-0" />
      <div className="absolute top-2 left-2 z-10 bg-stone-900/90 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-1.5 shadow-lg border border-white/20">
        <MapPin size={13} className="text-emerald-400" />
        <span>
          {readOnly
            ? "📍 Pinned Delivery Location"
            : (deliveryCoords
              ? `Pin: ${calculatedDistanceKm ? calculatedDistanceKm.toFixed(1) : '0'} KM away (${isByDistanceMode ? 'by Road Distance' : 'by Radius'})`
              : "Locating your GPS location...")}
        </span>
      </div>
    </div>
  );
};

/* ────────── BADGE ICON MAPPER ────────── */
const renderBadgeIcon = (iconName, color = "#10b981") => {
  const p = { size: 14, style: { color } };
  switch (iconName) {
    case "Bike": return <Bike {...p} />;
    case "Utensils": return <Utensils {...p} />;
    case "ShieldCheck": return <ShieldCheck {...p} />;
    case "Flame": return <Flame {...p} />;
    case "Percent": return <Percent {...p} />;
    case "Sparkles": return <Sparkles {...p} />;
    case "Tag": return <Tag {...p} />;
    case "Star": return <Star {...p} />;
    case "Heart": return <Heart {...p} />;
    case "Coffee": return <Coffee {...p} />;
    case "Clock":
    default:
      return <Clock {...p} />;
  }
};

/* ────────── DYNAMIC CATEGORY IMAGE MAPPER ────────── */
const getCategoryImage = (catName = "", itemName = "") => {
  const c = String(catName || "").toLowerCase();
  const n = String(itemName || "").toLowerCase();

  // Omelette & Egg Dishes
  if (n.includes("omelette") || n.includes("egg") || n.includes("scramble") || n.includes("frittata") || n.includes("toast") || c.includes("breakfast")) {
    return "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&q=80";
  }
  // Kashmiri Wazwan (Rista, Gushtaba, Tabak Maaz, Rogan Josh, Aab Gosht, Kanti)
  if (c.includes("wazwan") || n.includes("rista") || n.includes("gushtaba") || n.includes("tabak") || n.includes("rogan") || n.includes("kanti") || n.includes("aab gosht")) {
    return "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80";
  }
  // Biryani
  if (c.includes("biryani") || n.includes("biryani")) {
    return "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80";
  }
  // Mutton Dishes
  if (c.includes("mutton") || n.includes("mutton") || n.includes("lamb") || n.includes("gosht")) {
    return "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80";
  }
  // Chicken Dishes & Tikkas
  if (c.includes("chicken") || n.includes("chicken") || n.includes("tikka") || n.includes("korma")) {
    return "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80";
  }
  // Chinese & Noodles
  if (c.includes("chinese") || n.includes("noodle") || n.includes("manchurian") || n.includes("chowmein") || n.includes("fried rice")) {
    return "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80";
  }
  // Momos
  if (n.includes("momo") || n.includes("dimsum") || n.includes("dumpling")) {
    return "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&q=80";
  }
  // Roti, Naan, Paratha, Breads
  if (c.includes("roti") || c.includes("naan") || c.includes("bread") || n.includes("naan") || n.includes("paratha") || n.includes("kulcha") || n.includes("roti")) {
    return "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80";
  }
  // Pizza
  if (c.includes("pizza") || n.includes("pizza")) {
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80";
  }
  // Burger & Sandwich
  if (n.includes("burger") || n.includes("sandwich") || n.includes("wrap")) {
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80";
  }
  // Snacks, Fries & Starters
  if (n.includes("fries") || n.includes("roll") || c.includes("starter") || c.includes("snack") || c.includes("fast food")) {
    return "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80";
  }
  // Veg / Paneer / Dal
  if (c.includes("veg") || n.includes("paneer") || n.includes("dal") || n.includes("subzi") || n.includes("shahi")) {
    return "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80";
  }
  // Beverages / Shakes / Lassi / Cold Drinks
  if (n.includes("shake") || n.includes("lassi") || n.includes("soda") || n.includes("coke") || n.includes("dew") || n.includes("juice") || c.includes("beverage") || c.includes("drink")) {
    return "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80";
  }
  // Tea / Kehwa / Coffee
  if (n.includes("tea") || n.includes("kehwa") || n.includes("chai") || n.includes("coffee") || n.includes("cappuccino")) {
    return "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80";
  }
  // Desserts & Sweets
  if (n.includes("dessert") || n.includes("ice cream") || n.includes("jamun") || n.includes("kheer") || n.includes("cake") || c.includes("dessert")) {
    return "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80";
  }

  return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
};

/* ────────── 5-IMAGE HERO SLIDESHOW COMPONENT ────────── */
const DEFAULT_SLIDES = [
  { url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&q=80", title: "Chef's Signature Dishes", subtitle: "Freshly prepared in our kitchen" },
  { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1000&q=80", title: "Wood-Fired Gourmet Pizza", subtitle: "Crispy crust & melted mozzarella" },
  { url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&q=80", title: "Artisanal Loaded Burgers", subtitle: "Double patty with signature sauce" }
];

/* ────────── 4-IMAGE MOSAIC COLLAGE GRID (RIGHT SIDE) ────────── */
const DEFAULT_COLLAGE = [
  { url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80", title: "Burger Special" },
  { url: "https://images.unsplash.com/photo-1621996346565-e3d5d6281318?w=800&q=80", title: "Italian Pasta" },
  { url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80", title: "Wood-Fired Pizza" },
  { url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80", title: "Plated Dessert" }
];

const HeroImageCollage = ({ collageImages = [], slides = [] }) => {
  const formatUrl = (url) => (url && url.startsWith('http') ? url : `${API_BASE}${url}`);

  const rawCollage = Array.isArray(collageImages) ? collageImages.filter(Boolean) : [];
  const customImages = rawCollage.map(s => (typeof s === 'string' ? s : (s?.url || '')));

  const img1 = customImages[0] ? formatUrl(customImages[0]) : DEFAULT_COLLAGE[0].url;
  const img2 = customImages[1] ? formatUrl(customImages[1]) : DEFAULT_COLLAGE[1].url;
  const img3 = customImages[2] ? formatUrl(customImages[2]) : DEFAULT_COLLAGE[2].url;
  const img4 = customImages[3] ? formatUrl(customImages[3]) : DEFAULT_COLLAGE[3].url;

  const handleImgError = (e, fallbackIndex) => {
    if (e.target) {
      e.target.onerror = null;
      e.target.src = DEFAULT_COLLAGE[fallbackIndex].url;
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-2 sm:gap-3.5 w-full">
        {/* Left Collage Column */}
        <div className="flex flex-col gap-2 sm:gap-3.5">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-stone-200/90 aspect-[4/3] min-h-[110px] sm:min-h-[180px] lg:min-h-[140px] group bg-stone-900">
            <img src={img1} onError={(e) => handleImgError(e, 0)} alt="Signature Dish 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-stone-200/90 aspect-[16/10] min-h-[90px] sm:min-h-[140px] lg:min-h-[120px] group bg-stone-900">
            <img src={img2} onError={(e) => handleImgError(e, 1)} alt="Signature Dish 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </div>

        {/* Right Collage Column */}
        <div className="flex flex-col gap-2 sm:gap-3.5 pt-2 sm:pt-4">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-stone-200/90 aspect-[4/5] min-h-[130px] sm:min-h-[200px] lg:min-h-[150px] group bg-stone-900">
            <img src={img3} onError={(e) => handleImgError(e, 2)} alt="Signature Dish 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-stone-200/90 aspect-square min-h-[100px] sm:min-h-[160px] lg:min-h-[120px] group bg-stone-900">
            <img src={img4} onError={(e) => handleImgError(e, 3)} alt="Signature Dish 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroSlideshow = ({ slides = [] }) => {
  const activeSlides = (slides && slides.length > 0) ? slides : DEFAULT_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [activeSlides.length, isHovered]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-stone-200 group bg-stone-900"
    >
      {activeSlides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          <img
            src={slide.url && slide.url.startsWith('http') ? slide.url : `${API_BASE}${slide.url}`}
            alt={slide.title || `Slide ${idx + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent flex items-end p-6 text-white">
            <div>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{slide.title}</p>
              <p className="text-base sm:text-lg font-black text-white">{slide.subtitle}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next Arrows */}
      <button
        type="button"
        onClick={() => setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-stone-900 text-lg font-bold flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => setCurrentIndex((prev) => (prev + 1) % activeSlides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-stone-900 text-lg font-bold flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        ›
      </button>

      {/* Slide Indicators - Small Circular White Dots (Span element to bypass button CSS rules) */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px"
        }}
      >
        {activeSlides.map((_, idx) => {
          const isActive = idx === currentIndex;
          return (
            <span
              key={idx}
              role="button"
              tabIndex={0}
              onClick={() => setCurrentIndex(idx)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setCurrentIndex(idx); }}
              title={`Slide ${idx + 1}`}
              className="slide-dot"
              style={{
                display: "inline-block",
                width: isActive ? "6px" : "5px",
                height: isActive ? "6px" : "5px",
                minWidth: isActive ? "6px" : "5px",
                minHeight: isActive ? "6px" : "5px",
                maxWidth: isActive ? "6px" : "5px",
                maxHeight: isActive ? "6px" : "5px",
                borderRadius: "50% !important",
                padding: "0 !important",
                margin: "0 !important",
                border: "none !important",
                outline: "none !important",
                backgroundColor: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.45)",
                boxShadow: isActive ? "0 0 6px rgba(255, 255, 255, 0.85)" : "none",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                flexShrink: 0
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

/* ────────── GOOGLE REVIEWS SLIDESHOW ────────── */
const GoogleReviewsSlideshow = ({
  reviews = [],
  rating = "4.9",
  totalReviews = "1,250+ Reviews",
  businessUrl = "",
  primaryColor = "#10b981"
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const activeReviews = (Array.isArray(reviews) && reviews.length > 0)
    ? reviews
    : [
      { name: "Rahul Sharma", rating: 5, review: "Best Wazwan & order experience! Authentic flavors, generous portions, and lightning-fast delivery.", date: "2 days ago" },
      { name: "Ananya Roy", rating: 4, review: "Delicious food. The Biryani and Butter Chicken tasted great! Good packaging, took about 35 mins.", date: "5 days ago" },
      { name: "Vikram Malhotra", rating: 5, review: "Top quality food and great hospitality! The Rista, Kanti and Naan were mind-blowing.", date: "1 week ago" },
      { name: "Aamir Hussain", rating: 3, review: "Food quality was good and authentic, but delivery took a bit longer during peak weekend hours.", date: "2 weeks ago" },
      { name: "Sneha Patel", rating: 4, review: "Great taste and super hygienic packaging. Loved the Kebabs and Paneer Tikka. Will order again!", date: "3 weeks ago" }
    ];

  useEffect(() => {
    if (activeReviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeReviews.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeReviews.length]);

  const activeReview = activeReviews[currentIdx] || activeReviews[0];

  return (
    <div className="pt-4 border-t border-stone-200/80 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center font-black text-[11px] text-blue-500">
            G
          </div>
          <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">Google Reviews</span>
          <div className="flex items-center gap-1 bg-amber-50 text-amber-800 text-[10.5px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{rating || "4.8"}</span>
            <span className="text-stone-400 font-normal">({totalReviews || "1,480+ Google Reviews"})</span>
          </div>
        </div>

        {businessUrl && (
          <a
            href={businessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10.5px] font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1 hover:underline"
          >
            Google Page <ExternalLink size={11} />
          </a>
        )}
      </div>

      <div className="relative bg-white rounded-2xl p-4 border border-stone-200/90 shadow-sm overflow-hidden">
        <div className="flex items-start gap-3">
          <div
            style={{ backgroundColor: primaryColor }}
            className="w-9 h-9 rounded-full text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0"
          >
            {activeReview.name ? activeReview.name.charAt(0).toUpperCase() : "G"}
          </div>

          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-stone-900">{activeReview.name}</span>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                  <CheckCircle2 size={10} /> Verified
                </span>
              </div>
            </div>

            <div className="flex items-center gap-0.5">
              {[...Array(Number(activeReview.rating || 5))].map((_, sIdx) => (
                <Star key={sIdx} size={12} className="fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-xs text-stone-600 font-medium leading-relaxed italic">
              "{activeReview.review}"
            </p>
          </div>
        </div>

        {activeReviews.length > 1 && (
          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-center gap-1.5">
            {activeReviews.map((_, dotIdx) => (
              <span
                key={dotIdx}
                role="button"
                onClick={() => setCurrentIdx(dotIdx)}
                className="slide-dot"
                style={{
                  display: "inline-block",
                  width: dotIdx === currentIdx ? "6px" : "5px",
                  height: dotIdx === currentIdx ? "6px" : "5px",
                  borderRadius: "50% !important",
                  backgroundColor: dotIdx === currentIdx ? primaryColor : "#d6d3d1",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PublicOutletMenu = () => {
  const { userId: routeUserId, tableId: routeTableId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryUserId = searchParams.get("outlet") || searchParams.get("userId") || searchParams.get("outlet_id");
  const queryTable = searchParams.get("table") || searchParams.get("tableNumber") || searchParams.get("table_number") || searchParams.get("tableId");
  const tableParam = routeTableId || queryTable || null;

  const [selectedTableNumber, setSelectedTableNumber] = useState(tableParam ? decodeURIComponent(tableParam).replace(/^Table\s+/i, '') : null);
  const [tableStatusData, setTableStatusData] = useState(null);
  const [isVerifyingTableOrder, setIsVerifyingTableOrder] = useState(false);

  // 📋 Active Table KOT Dishes & Status Tracking
  const activeTableOrder = tableStatusData?.active_order || null;
  const activeTableItems = useMemo(() => {
    if (!activeTableOrder || !activeTableOrder.items) return [];
    if (Array.isArray(activeTableOrder.items)) return activeTableOrder.items;
    try { return JSON.parse(activeTableOrder.items); } catch(e) { return []; }
  }, [activeTableOrder]);

  const previousKOTSubtotal = useMemo(() => {
    if (!activeTableItems || activeTableItems.length === 0) return 0;
    return activeTableItems.reduce((acc, item) => {
      const p = parseFloat(item.price) || 0;
      const q = parseInt(item.qty || item.quantity) || 1;
      return acc + (p * q);
    }, 0);
  }, [activeTableItems]);

  const getKOTStatusBadge = (itemStatus, orderStatus) => {
    const st = String(itemStatus || orderStatus || 'ACCEPTED').toUpperCase();
    if (st === 'PREPARING' || st === 'PROCESSING' || st === 'COOKING') {
      return <span className="text-[9.5px] font-extrabold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 shrink-0">🔥 Preparing</span>;
    }
    if (st === 'FOOD_READY' || st === 'READY') {
      return <span className="text-[9.5px] font-extrabold text-blue-800 bg-blue-100/90 px-2 py-0.5 rounded-full border border-blue-300 flex items-center gap-1 shrink-0">🔔 Food Ready</span>;
    }
    if (st === 'SERVED' || st === 'DELIVERED' || st === 'COMPLETED') {
      return <span className="text-[9.5px] font-extrabold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 shrink-0">🍽️ Served</span>;
    }
    return <span className="text-[9.5px] font-extrabold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-300 flex items-center gap-1 shrink-0">⏳ Accepted</span>;
  };

  // 🔐 Table QR Login Gate — WhatsApp OTP Flow
  const [isTableLoginModalOpen, setIsTableLoginModalOpen] = useState(false);
  const [tableLoginStep, setTableLoginStep] = useState("PHONE"); // "PHONE" | "OTP" | "BLOCKED"
  const [tableLoginMode, setTableLoginMode] = useState("GUEST"); // "GUEST" | "OTP"
  const [tableGuestName, setTableGuestName] = useState("");
  const [tableLoginPhone, setTableLoginPhone] = useState("");
  const [tableLoginOtp, setTableLoginOtp] = useState("");
  const [tableLoginError, setTableLoginError] = useState("");
  const [isTableLoginLoading, setIsTableLoginLoading] = useState(false);
  const [isTableAccessBlocked, setIsTableAccessBlocked] = useState(false);
  const [tableBlockedReason, setTableBlockedReason] = useState("");

  // Dynamic Outlet Resolution
  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const defaultOutletId = routeUserId || queryUserId || loggedInUser?.outlet_id || loggedInUser?.user_id || loggedInUser?.id || "3";
  const [selectedOutletId, setSelectedOutletId] = useState(String(defaultOutletId));

  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState(null);
  const [digitalSettings, setDigitalSettings] = useState(null);
  const [onlineOrderUpiId, setOnlineOrderUpiId] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [availableOutlets, setAvailableOutlets] = useState([]);
  const [activeNav, setActiveNav] = useState("menu"); // "menu"
  const [activeCat, setActiveCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [fulfillmentMode, setFulfillmentMode] = useState(tableParam ? "DINE_IN" : "DELIVERY"); // "DELIVERY" | "PICKUP" | "DINE_IN"
  const [livePreviewOverride, setLivePreviewOverride] = useState(null);
  const [dismissedRejectionRef, setDismissedRejectionRef] = useState(null);

  // Helper to get future time slots for a given date
  const getAvailableTimeSlots = (selectedDate) => {
    const allSlots = [
      { label: "12:00 PM", h: 12, m: 0, group: "Lunch" },
      { label: "01:00 PM", h: 13, m: 0, group: "Lunch" },
      { label: "02:00 PM", h: 14, m: 0, group: "Lunch" },
      { label: "03:00 PM", h: 15, m: 0, group: "Lunch" },
      { label: "07:00 PM", h: 19, m: 0, group: "Dinner" },
      { label: "07:30 PM", h: 19, m: 30, group: "Dinner" },
      { label: "08:00 PM", h: 20, m: 0, group: "Dinner" },
      { label: "08:30 PM", h: 20, m: 30, group: "Dinner" },
      { label: "09:00 PM", h: 21, m: 0, group: "Dinner" },
      { label: "09:30 PM", h: 21, m: 30, group: "Dinner" },
      { label: "10:00 PM", h: 22, m: 0, group: "Dinner" },
    ];

    const todayStr = new Date().toISOString().split("T")[0];
    if (selectedDate !== todayStr) {
      return allSlots;
    }

    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    // Filter out past time slots (require at least 15 mins advance booking window)
    return allSlots.filter(slot => {
      const slotMins = slot.h * 60 + slot.m;
      return slotMins > currentMins + 15;
    });
  };

  // 🍽️ Table Reservation States
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [seatingAreas, setSeatingAreas] = useState([]);
  const [reservationForm, setReservationForm] = useState(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const initialSlots = [
      { label: "12:00 PM", h: 12, m: 0, group: "Lunch" },
      { label: "01:00 PM", h: 13, m: 0, group: "Lunch" },
      { label: "02:00 PM", h: 14, m: 0, group: "Lunch" },
      { label: "03:00 PM", h: 15, m: 0, group: "Lunch" },
      { label: "07:00 PM", h: 19, m: 0, group: "Dinner" },
      { label: "07:30 PM", h: 19, m: 30, group: "Dinner" },
      { label: "08:00 PM", h: 20, m: 0, group: "Dinner" },
      { label: "08:30 PM", h: 20, m: 30, group: "Dinner" },
      { label: "09:00 PM", h: 21, m: 0, group: "Dinner" },
      { label: "09:30 PM", h: 21, m: 30, group: "Dinner" },
      { label: "10:00 PM", h: 22, m: 0, group: "Dinner" },
    ];
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const validToday = initialSlots.filter(s => (s.h * 60 + s.m) > currentMins + 15);
    
    let defaultDate = todayStr;
    let defaultTime = "08:00 PM";
    if (validToday.length > 0) {
      defaultTime = validToday[0].label;
    } else {
      // If all slots for today have passed, auto-select tomorrow
      const tomorrow = new Date(Date.now() + 86400000);
      defaultDate = tomorrow.toISOString().split("T")[0];
      defaultTime = "12:00 PM";
    }

    return {
      name: "",
      phone: "",
      guests: 2,
      date: defaultDate,
      time: defaultTime,
      seating: "Indoor",
      notes: ""
    };
  });
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [customerReservations, setCustomerReservations] = useState([]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "LIVE_THEME_PREVIEW" && event.data.payload) {
        setLivePreviewOverride(event.data.payload);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Unified Active Settings computed from both businessData.settings, digital_order_settings, and livePreviewOverride
  const activeSettings = useMemo(() => {
    let bizSettings = {};
    if (businessData?.settings) {
      if (typeof businessData.settings === "string") {
        try { bizSettings = JSON.parse(businessData.settings); } catch (e) { }
      } else if (typeof businessData.settings === "object") {
        bizSettings = businessData.settings;
      }
    }
    const theme = bizSettings.theme || {};
    const digSettings = digitalSettings || {};
    const live = livePreviewOverride || {};

    const primaryColor = live.primaryColor || theme.primaryColor || digSettings.primary_color || bizSettings.primaryColor || "#10b981";
    const secondaryColor = live.secondaryColor || theme.secondaryColor || digSettings.secondary_color || bizSettings.secondaryColor || "#047857";
    const bgColor = live.bgColor || theme.bgColor || digSettings.background_color || "#ffffff";
    const mainBgColor = live.mainBgColor || theme.mainBgColor || "#f8fafc";
    const fontColor = live.fontColor || theme.fontColor || digSettings.text_color || "#0f172a";

    const tagline = live.tagline !== undefined ? live.tagline : (digSettings.tagline || bizSettings.otherTagline || bizSettings.tagline || "");
    const aboutUs = live.aboutUs !== undefined ? live.aboutUs : (digSettings.about_us || bizSettings.pageAboutUs || bizSettings.about_us || `Order directly from ${businessData?.name || "Shahe Tehzeeb Restaurant"}. Freshly prepared in our kitchen, dispatched fast for Home Delivery & Takeaway.`);

    const landingPageBgImage = live.landingPageBgImage !== undefined ? live.landingPageBgImage : (theme.landingPageBgImage || "");
    const bannerUrl = landingPageBgImage || (bizSettings.banners && bizSettings.banners[0]) || digSettings.banner_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&q=80";

    const showDescription = digSettings.show_description !== undefined ? digSettings.show_description : (bizSettings.itemLevelShowDescription !== undefined ? bizSettings.itemLevelShowDescription : true);
    const hideFoodType = digSettings.hide_food_type !== undefined ? digSettings.hide_food_type : Boolean(bizSettings.otherHideFoodTypeFromUi);
    const enableDelivery = digSettings.enable_delivery !== undefined ? digSettings.enable_delivery : (bizSettings.otherEnableForDelivery !== undefined ? bizSettings.otherEnableForDelivery : true);
    const enablePickup = digSettings.enable_pickup !== undefined ? digSettings.enable_pickup : (bizSettings.otherEnableForPickup !== undefined ? bizSettings.otherEnableForPickup : true);

    const parseImageList = (val) => {
      if (Array.isArray(val)) return val.filter(Boolean);
      if (typeof val === 'string' && val.trim()) {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return parsed.filter(Boolean);
        } catch (e) {
          return [val.trim()];
        }
      }
      return [];
    };

    const contactNo = live.contactNo || digSettings.contact_no || bizSettings.socialContactNo || businessData?.phone || "9906123989";
    const whatsappNo = live.whatsappNo || digSettings.whatsapp_no || bizSettings.socialWhatsappNo || contactNo;
    const address = live.address || digSettings.address || bizSettings.socialAddress || bizSettings.address || businessData?.address || businessData?.city || businessData?.location || "Main Outlet Address";
    const facebookLink = live.facebookLink || digSettings.facebook_link || bizSettings.socialFacebookLink || "";
    const instagramLink = live.instagramLink || digSettings.instagram_link || bizSettings.socialInstagramLink || "";
    const websiteLink = live.websiteLink || digSettings.website_link || bizSettings.socialWebsiteLink || "";

    const heroHeadlineLine1 = live.heroHeadlineLine1 !== undefined ? live.heroHeadlineLine1 : (digSettings.hero_headline_line1 || bizSettings.heroHeadlineLine1 || "Fresh & Hot Food.");
    const heroHeadlineLine2 = live.heroHeadlineLine2 !== undefined ? live.heroHeadlineLine2 : (digSettings.hero_headline_line2 || bizSettings.heroHeadlineLine2 || "Delivered to Your Home.");
    const ctaExploreMenuText = live.ctaExploreMenuText !== undefined ? live.ctaExploreMenuText : (digSettings.cta_explore_menu_text || bizSettings.ctaExploreMenuText || "Explore Menu");
    const ctaViewOrdersText = live.ctaViewOrdersText !== undefined ? live.ctaViewOrdersText : (digSettings.cta_view_orders_text || bizSettings.ctaViewOrdersText || "View Orders");
    const badgeDeliveryTime = live.badgeDeliveryTime !== undefined ? live.badgeDeliveryTime : (digSettings.badge_delivery_time || bizSettings.badgeDeliveryTime || "30-45 Mins Delivery");
    const badgeDeliveryOffer = live.badgeDeliveryOffer !== undefined ? live.badgeDeliveryOffer : (digSettings.badge_delivery_offer || bizSettings.badgeDeliveryOffer || "Free Delivery over ₹500");
    const footerSubtext = live.footerSubtext !== undefined ? live.footerSubtext : (digSettings.footer_subtext || bizSettings.footerSubtext || "Official online food ordering portal powered by SaSLoop Backoffice Engine.");

    // Online Order Timings mapped directly to digital_order_settings (start_time, close_time, available_days)
    let timingsText = live.timingsText;
    if (!timingsText) {
      if (digSettings.start_time && digSettings.close_time) {
        const formatTime = (t) => {
          if (!t) return "";
          const [hStr, mStr] = String(t).split(":");
          let h = parseInt(hStr, 10);
          const m = mStr || "00";
          const ampm = h >= 12 ? "PM" : "AM";
          h = h % 12 || 12;
          return `${h}:${m} ${ampm}`;
        };
        const days = Array.isArray(digSettings.available_days) && digSettings.available_days.length === 7
          ? "Everyday"
          : Array.isArray(digSettings.available_days) && digSettings.available_days.length > 0
            ? digSettings.available_days.join(", ")
            : "Everyday";
        timingsText = `${days} · ${formatTime(digSettings.start_time)} – ${formatTime(digSettings.close_time)}`;
      } else {
        timingsText = digSettings.timings_text || bizSettings.timingsText || "Everyday · 11:00 AM – 11:00 PM";
      }
    }

    const avgDeliveryText = live.avgDeliveryText !== undefined ? live.avgDeliveryText : (digSettings.avg_delivery_text || bizSettings.avgDeliveryText || "Average Delivery: 30-45 Minutes");
    const footerSupportText = live.footerSupportText !== undefined ? live.footerSupportText : (digSettings.footer_support_text || bizSettings.footerSupportText || "Direct POS Hotline & WhatsApp");

    // Slide images: robust fallback stack so images never vanish
    const slideImagesList = parseImageList(live.slideImages);
    const bizSlideList = parseImageList(bizSettings.slideImages || bizSettings.slide_images || bizSettings.slides);
    const digSlideList = parseImageList(digSettings.slide_images || digSettings.slideImages);

    const slideImages = slideImagesList.length > 0 ? slideImagesList
      : (bizSlideList.length > 0 ? bizSlideList
        : (digSlideList.length > 0 ? digSlideList : DEFAULT_SLIDES));

    // Collage images: robust fallback stack so images never vanish
    const collageImagesList = parseImageList(live.collageImages);
    const bizCollageList = parseImageList(bizSettings.collageImages || bizSettings.collage_images || bizSettings.collage);
    const digCollageList = parseImageList(digSettings.collage_images || digSettings.collageImages);

    const collageImages = collageImagesList.length > 0 ? collageImagesList
      : (bizCollageList.length > 0 ? bizCollageList
        : (digCollageList.length > 0 ? digCollageList : DEFAULT_COLLAGE));

    // Feature Badges (icon + text)
    const featureBadges = live.featureBadges !== undefined
      ? live.featureBadges
      : (Array.isArray(bizSettings.featureBadges)
        ? bizSettings.featureBadges
        : [
          { icon: "Clock", text: live.badgeDeliveryTime || bizSettings.badgeDeliveryTime || "30-45 Mins Delivery" },
          { icon: "Bike", text: live.badgeDeliveryOffer || bizSettings.badgeDeliveryOffer || "Free Delivery over ₹500" },
          { icon: "ShieldCheck", text: "100% Hygienic & Fresh" },
          { icon: "Flame", text: "Hot & Wood-Fired" }
        ]);

    // Coupons
    const coupons = live.coupons !== undefined
      ? live.coupons
      : (Array.isArray(bizSettings.coupons) ? bizSettings.coupons : []);

    // Google Reviews
    const googleReviewsEnabled = live.googleReviewsEnabled !== undefined ? live.googleReviewsEnabled : (bizSettings.googleReviewsEnabled !== false);
    const googleBusinessUrl = live.googleBusinessUrl !== undefined ? live.googleBusinessUrl : (bizSettings.googleBusinessUrl || "");
    const googleRating = live.googleRating || bizSettings.googleRating || "4.9";
    const googleTotalReviews = live.googleTotalReviews || bizSettings.googleTotalReviews || "1,250+ Reviews";
    const googleReviewsList = live.googleReviewsList !== undefined
      ? live.googleReviewsList
      : (Array.isArray(bizSettings.googleReviewsList) ? bizSettings.googleReviewsList : []);

    return {
      primaryColor,
      secondaryColor,
      bgColor,
      mainBgColor,
      fontColor,
      landingPageColor: live.landingPageColor || theme.landingPageColor || "#ffffff",
      landingPageBgImage,
      minOrderValue: digSettings.min_order_value || bizSettings.minOrderValue || 0,
      tagline,
      aboutUs,
      heroHeadlineLine1,
      heroHeadlineLine2,
      ctaExploreMenuText,
      ctaViewOrdersText,
      badgeDeliveryTime,
      badgeDeliveryOffer,
      footerSubtext,
      timingsText,
      avgDeliveryText,
      footerSupportText,
      bannerUrl,
      showDescription,
      hideFoodType,
      enableDelivery,
      enablePickup,
      googleFont: live.googleFont || theme.googleFont || "Inter",
      fontStyle: live.fontStyle || theme.fontStyle || "normal",
      contactNo,
      whatsappNo,
      address,
      facebookLink,
      instagramLink,
      websiteLink,
      slideImages,
      collageImages,
      featureBadges,
      coupons,
      googleReviewsEnabled,
      googleBusinessUrl,
      googleRating,
      googleTotalReviews,
      googleReviewsList
    };
  }, [businessData, digitalSettings, livePreviewOverride]);

  // Dynamic Google Font Injection
  useEffect(() => {
    if (activeSettings.googleFont) {
      const fontName = activeSettings.googleFont.replace(/\s+/g, "+");
      const linkId = "dynamic-google-font-stylesheet";
      let link = document.getElementById(linkId);
      if (!link) {
        link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;600;700;800;900&display=swap`;
    }
  }, [activeSettings.googleFont]);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [recentOrders, setRecentOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("customer_recent_orders");
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return [];
  });

  useEffect(() => {
    try {
      if (recentOrders && recentOrders.length > 0) {
        localStorage.setItem("customer_recent_orders", JSON.stringify(recentOrders));
      }
    } catch (e) { }
  }, [recentOrders]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastText, setToastText] = useState(null);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

  // Customer User Session & Login Modal State
  const [userSession, setUserSession] = useState(() => {
    try {
      const saved = localStorage.getItem("customer_user_session");
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return null;
  });

  const isUserLoggedIn = Boolean(userSession && userSession.isLoggedIn);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState(null);

  // Auth Form Inputs
  const [authMode, setAuthMode] = useState("WHATSAPP"); // "WHATSAPP" or "GUEST"
  const [authPhone, setAuthPhone] = useState("");
  const [authName, setAuthName] = useState("");
  const [otpStep, setOtpStep] = useState(1); // 1 = Enter Phone, 2 = Enter OTP
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Customer Profile State
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("customer_profile");
    if (savedProfile) return JSON.parse(savedProfile);
    const savedSession = localStorage.getItem("customer_user_session");
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      return { name: parsed.name || "Customer", phone: parsed.phone || "", address: "Srinagar", email: "" };
    }
    return { name: "Guest User", phone: "", address: "Srinagar", email: "" };
  });

  // Customer Profile Tabs & Ledger State
  const [profileTab, setProfileTab] = useState("orders"); // "orders" | "ledger" | "loyalty" | "info"
  const [customerOrdersList, setCustomerOrdersList] = useState([]);
  const [customerLedgerData, setCustomerLedgerData] = useState({
    points: 0,
    total_spent: 0,
    total_credit: 0,
    total_debit: 0,
    net_balance: 0,
    transactions: []
  });
  const [isLoadingProfileData, setIsLoadingProfileData] = useState(false);
  const [expandedTxIdx, setExpandedTxIdx] = useState(null);

  // Fetch Customer Past Orders, Balance Sheet Ledger, & Synced Backoffice CRM Profile when Profile opens
  useEffect(() => {
    const phoneToFetch = profile.phone || userSession?.phone;
    if (!phoneToFetch || !selectedOutletId) return;

    setIsLoadingProfileData(true);

    // 1. Fetch Synced Customer Profile from Backoffice CRM
    fetch(`${API_BASE}/api/public/customer/profile/${selectedOutletId}/${phoneToFetch}`)
      .then((r) => r.json())
      .then((backofficeData) => {
        if (backofficeData && backofficeData.name) {
          setProfile((prev) => ({
            ...prev,
            name: backofficeData.name || prev.name,
            phone: backofficeData.phone || prev.phone,
            address: backofficeData.address || prev.address
          }));
        }
      })
      .catch((err) => console.error("Error fetching Backoffice customer profile:", err));

    // 2. Fetch Orders
    const cleanPhoneUrl = encodeURIComponent(phoneToFetch.trim());
    fetch(`${API_BASE}/api/public/orders/${selectedOutletId}/${cleanPhoneUrl}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomerOrdersList(data);
          setRecentOrders(prev => {
            if (!prev || prev.length === 0) return data;
            const serverMap = new Map(data.map(o => [String(o.order_reference || o.id), o]));
            return prev.map(o => {
              const ref = String(o.order_reference || o.id);
              const updated = serverMap.get(ref);
              return updated ? { ...o, ...updated } : o;
            });
          });
        }
      })
      .catch((err) => console.error("Error fetching customer orders:", err));

    // 3. Fetch Balance Sheet & Transactions Ledger from Back Office
    fetch(`${API_BASE}/api/public/transactions/${selectedOutletId}/${cleanPhoneUrl}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setCustomerLedgerData(data);
        }
      })
      .catch((err) => console.error("Error fetching transactions ledger:", err));

    // 4. Fetch Table Reservations
    fetch(`${API_BASE}/api/public/table-reservations/${selectedOutletId}/${cleanPhoneUrl}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomerReservations(data);
        }
      })
      .catch((err) => console.error("Error fetching table reservations:", err))
      .finally(() => setIsLoadingProfileData(false));
  }, [isProfileOpen, profile.phone, userSession?.phone, selectedOutletId]);

  // 🪑 Table Status Check & WhatsApp OTP Gate on QR Scan
  useEffect(() => {
    if (selectedTableNumber && selectedOutletId) {
      setFulfillmentMode("DINE_IN");

      const savedSession = userSession;
      const savedPhone = (savedSession?.phone || profile?.phone || "").replace(/\D/g, "").slice(-10);

      // 1. Force WhatsApp OTP login if user is not logged in
      if (!savedSession?.isLoggedIn || savedPhone.length < 10) {
        setIsTableLoginModalOpen(true);
        setTableLoginStep("PHONE");
        setTableLoginPhone("");
        setTableLoginOtp("");
        setTableLoginError("");
        return;
      }

      // 2. User is logged in — auto-verify phone against table status
      fetch(`${API_BASE}/api/public/table-status/${selectedOutletId}/${encodeURIComponent(selectedTableNumber)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data) {
            setTableStatusData(data);
            if (data.status === "OCCUPIED") {
              const occupiedPhone = (data.customer_number || data.active_order?.customer_number || "").replace(/\D/g, "").slice(-10);

              if (occupiedPhone && occupiedPhone.length >= 10 && savedPhone && savedPhone.length >= 10 && occupiedPhone === savedPhone) {
                // SAME USER -> Access Granted!
                setIsTableAccessBlocked(false);
                setIsTableLoginModalOpen(false);
              } else {
                // Table HAS items & user is NOT the same user -> Access BLOCKED!
                setIsTableAccessBlocked(true);
                if (occupiedPhone && occupiedPhone.length >= 10) {
                  setTableBlockedReason(`Table ${selectedTableNumber} is currently occupied under phone ending in ****${occupiedPhone.slice(-4)}. Your logged-in number (${savedPhone}) does not match.`);
                } else {
                  setTableBlockedReason(`Table ${selectedTableNumber} is currently occupied with active items in POS. Please ask restaurant staff for assistance.`);
                }
              }
            } else {
              // Table AVAILABLE -> Access Granted!
              setIsTableAccessBlocked(false);
              setIsTableLoginModalOpen(false);
            }
          }
        })
        .catch((err) => console.error("Table status check error:", err));
    }
  }, [selectedTableNumber, selectedOutletId, userSession?.isLoggedIn, userSession?.phone, profile?.phone]);

  // 🔄 Fast Live Sync for Table Session & POS Bill Settlement
  useEffect(() => {
    if (!selectedTableNumber || !selectedOutletId) return;

    const syncTableStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/public/table-status/${selectedOutletId}/${encodeURIComponent(selectedTableNumber)}`);
        const data = await res.json();
        if (data) {
          setTableStatusData(data);
          if (data.status === "AVAILABLE") {
            setIsTableAccessBlocked(false);
          }
        }
      } catch (e) {
        // Silent catch for background poll
      }
    };

    const intervalId = setInterval(syncTableStatus, 4000);
    return () => clearInterval(intervalId);
  }, [selectedTableNumber, selectedOutletId]);

  // 📲 Send WhatsApp OTP for Table Login
  const handleTableSendOtp = async () => {
    setTableLoginError("");
    const cleanPhone = tableLoginPhone.replace(/\D/g, "").slice(-10);
    if (!cleanPhone || cleanPhone.length < 10) {
      setTableLoginError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsTableLoginLoading(true);
    try {
      const targetUserId = selectedOutletId || routeUserId || queryUserId || "3";
      const res = await fetch(`${API_BASE}/api/public/send-whatsapp-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUserId, phone: cleanPhone })
      });
      const data = await res.json();
      if (data.success) {
        setTableLoginStep("OTP");
      } else {
        setTableLoginError(data.error || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setTableLoginError("Network error. Please check your connection.");
    } finally {
      setIsTableLoginLoading(false);
    }
  };

  // ✅ Verify WhatsApp OTP & Check Table Access
  const handleTableVerifyOtp = async () => {
    setTableLoginError("");
    const cleanPhone = tableLoginPhone.replace(/\D/g, "").slice(-10);
    if (!tableLoginOtp || tableLoginOtp.length < 4) {
      setTableLoginError("Please enter the 4-digit OTP sent to your WhatsApp.");
      return;
    }
    setIsTableLoginLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/public/verify-whatsapp-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, otp: tableLoginOtp })
      });
      const data = await res.json();
      if (!data.success) {
        setTableLoginError(data.error || "Invalid OTP. Please try again.");
        setIsTableLoginLoading(false);
        return;
      }

      // OTP verified — Save session
      const newSession = { isLoggedIn: true, phone: cleanPhone, name: "Customer", loginAt: new Date().toISOString() };
      setUserSession(newSession);
      localStorage.setItem("customer_user_session", JSON.stringify(newSession));
      const updatedProfile = { ...profile, phone: cleanPhone };
      setProfile(updatedProfile);
      localStorage.setItem("customer_profile", JSON.stringify(updatedProfile));

      // Now check table status against newly verified phone
      const statusRes = await fetch(`${API_BASE}/api/public/table-status/${selectedOutletId}/${encodeURIComponent(selectedTableNumber)}`);
      const statusData = await statusRes.json();
      setTableStatusData(statusData);

      if (statusData && statusData.status === "OCCUPIED") {
        const occupiedPhone = (statusData.customer_number || statusData.active_order?.customer_number || "").replace(/\D/g, "").slice(-10);
        if (occupiedPhone && occupiedPhone.length >= 10 && occupiedPhone === cleanPhone) {
          // SAME USER -> Access Granted!
          setIsTableLoginModalOpen(false);
          setIsTableAccessBlocked(false);
          showToast(`✅ Welcome back! Table ${selectedTableNumber} session verified.`);
        } else {
          // Table HAS items & phone does not match -> Access BLOCKED!
          setTableLoginStep("BLOCKED");
          if (occupiedPhone && occupiedPhone.length >= 10) {
            setTableBlockedReason(`Table ${selectedTableNumber} is currently occupied under phone ending in ****${occupiedPhone.slice(-4)}. Your mobile number (${cleanPhone}) does not match.`);
          } else {
            setTableBlockedReason(`Table ${selectedTableNumber} is currently occupied with active items in POS. Please ask restaurant staff for assistance.`);
          }
          setIsTableAccessBlocked(true);
        }
      } else {
        // Table available -> Access Granted!
        setIsTableLoginModalOpen(false);
        setIsTableAccessBlocked(false);
        showToast(`✅ Logged in! You can now order on Table ${selectedTableNumber}.`);
      }
    } catch (err) {
      setTableLoginError("Verification failed. Please try again.");
    } finally {
      setIsTableLoginLoading(false);
    }
  };

  // ⚡ Direct Guest Login for Table QR Ordering (No OTP Required)
  const handleTableDirectGuestLogin = async () => {
    setTableLoginError("");
    const cleanPhone = tableLoginPhone.replace(/\D/g, "").slice(-10);
    const guestName = tableGuestName.trim() || "Guest Customer";
    if (!cleanPhone || cleanPhone.length < 10) {
      setTableLoginError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!tableGuestName.trim()) {
      setTableLoginError("Please enter your full name.");
      return;
    }

    setIsTableLoginLoading(true);
    try {
      // Check table status against entered phone
      const statusRes = await fetch(`${API_BASE}/api/public/table-status/${selectedOutletId}/${encodeURIComponent(selectedTableNumber)}`);
      const statusData = await statusRes.json();
      setTableStatusData(statusData);

      if (statusData && statusData.status === "OCCUPIED") {
        const occupiedPhone = (statusData.customer_number || statusData.active_order?.customer_number || "").replace(/\D/g, "").slice(-10);
        if (occupiedPhone && occupiedPhone.length >= 10 && occupiedPhone !== cleanPhone) {
          // Table occupied by someone else -> Access BLOCKED!
          setTableLoginStep("BLOCKED");
          setTableBlockedReason(`Table ${selectedTableNumber} is currently occupied under phone ending in ****${occupiedPhone.slice(-4)}. Your entered number (${cleanPhone}) does not match.`);
          setIsTableAccessBlocked(true);
          return;
        }
      }

      // Access Granted -> Direct Login!
      const newSession = { isLoggedIn: true, phone: cleanPhone, name: guestName, isGuest: true, loginAt: new Date().toISOString() };
      setUserSession(newSession);
      localStorage.setItem("customer_user_session", JSON.stringify(newSession));
      const updatedProfile = { ...profile, name: guestName, phone: cleanPhone };
      setProfile(updatedProfile);
      localStorage.setItem("customer_profile", JSON.stringify(updatedProfile));

      setIsTableLoginModalOpen(false);
      setIsTableAccessBlocked(false);
      showToast(`⚡ Welcome ${guestName}! Table ${selectedTableNumber} unlocked.`);
    } catch (err) {
      console.error("Direct guest login error:", err);
      setTableLoginError("Failed to login. Please try again.");
    } finally {
      setIsTableLoginLoading(false);
    }
  };

  // 🔔 Call Waiter to Table
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);
  const handleCallWaiter = async () => {
    if (!selectedTableNumber) return;
    const targetUserId = selectedOutletId || routeUserId || queryUserId || "3";
    setIsCallingWaiter(true);
    showToast(`🔔 Waiter call sent for Table ${selectedTableNumber}!`);
    try {
      await fetch(`${API_BASE}/api/public/call-waiter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: targetUserId,
          tableNumber: selectedTableNumber,
          message: `🔔 Table ${selectedTableNumber} is calling for waiter assistance!`
        })
      });
    } catch (err) {
      console.error("Call waiter error:", err);
    } finally {
      setTimeout(() => setIsCallingWaiter(false), 2000);
    }
  };

  // Online Order Form State
  const [form, setForm] = useState({
    name: profile.name || "",
    phone: profile.phone || "",
    address: (profile.address && profile.address.toLowerCase() !== "srinagar") ? profile.address : "",
    landmark: "",
    city: "",
    pincode: "",
    deliveryTime: "ASAP",
    paymentMethod: "UPI"
  });

  // Sync profile edits to Backoffice CRM database
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    localStorage.setItem("customer_profile", JSON.stringify(profile));
    if (userSession) {
      const updatedSession = { ...userSession, name: profile.name, phone: profile.phone };
      localStorage.setItem("customer_user_session", JSON.stringify(updatedSession));
      setUserSession(updatedSession);
    }
    setForm(prev => ({ ...prev, name: profile.name, phone: profile.phone, address: profile.address }));

    // Sync to Backoffice CRM Database (customers, marketing_contacts, customer_loyalty)
    try {
      await fetch(`${API_BASE}/api/public/customer/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedOutletId,
          phone: profile.phone || userSession?.phone,
          name: profile.name,
          address: profile.address
        })
      });
    } catch (err) {
      console.error("Backoffice sync err:", err);
    }

    showToast("Profile details updated & synced to Backoffice!");
    setIsProfileOpen(false);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("customer_user_session");
    setUserSession(null);
    setIsProfileOpen(false);
    showToast("Logged out successfully");
  };

  // Login via WhatsApp OTP - Step 1: Send Real WhatsApp OTP
  const handleSendWhatsAppOtp = async (e) => {
    e.preventDefault();
    if (!authPhone || authPhone.trim().length < 10) {
      alert("Please enter a valid 10-digit phone number!");
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await fetch(`${API_BASE}/api/public/send-whatsapp-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedOutletId,
          phone: authPhone
        })
      });
      const data = await res.json();
      if (data && data.success) {
        setOtpStep(2);
        if (data.debugOtp) {
          showToast(`WhatsApp OTP sent! (Dev Code: ${data.debugOtp})`);
        } else {
          showToast("Real OTP sent directly to your WhatsApp!");
        }
      } else {
        alert(data.error || "Failed to send WhatsApp OTP. Please try again.");
      }
    } catch (err) {
      console.error("WhatsApp OTP send err:", err);
      setOtpStep(2);
      showToast("OTP sent to WhatsApp!");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Login via WhatsApp OTP - Step 2: Verify Real OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.trim().length < 4) {
      alert("Please enter a valid 4-digit OTP!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/public/verify-whatsapp-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedOutletId,
          phone: authPhone,
          otp: enteredOtp
        })
      });
      const data = await res.json();
      if (data && data.success) {
        const sessionObj = {
          phone: authPhone,
          name: authName || "WhatsApp Customer",
          authMethod: "WHATSAPP",
          isLoggedIn: true
        };
        localStorage.setItem("customer_user_session", JSON.stringify(sessionObj));
        setUserSession(sessionObj);
        setProfile(prev => ({ ...prev, phone: authPhone, name: authName || prev.name }));
        setForm(prev => ({ ...prev, phone: authPhone, name: authName || prev.name }));

        setIsAuthModalOpen(false);
        setOtpStep(1);
        setEnteredOtp("");
        showToast("Logged in via WhatsApp!");

        if (pendingCartItem) {
          executeAddToCart(pendingCartItem);
          setPendingCartItem(null);
        }
      } else {
        alert(data.error || "Invalid OTP code. Please check your WhatsApp message.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      alert("Verification failed. Please check your WhatsApp for the OTP and try again.");
    }
  };

  // Login as Guest User
  const handleGuestLogin = (e) => {
    e.preventDefault();
    if (!authPhone || authPhone.trim().length < 10) {
      alert("Please enter a valid 10-digit phone number!");
      return;
    }
    const guestName = authName && authName.trim() ? authName.trim() : "Guest User";
    const sessionObj = {
      phone: authPhone,
      name: guestName,
      authMethod: "GUEST",
      isLoggedIn: true
    };
    localStorage.setItem("customer_user_session", JSON.stringify(sessionObj));
    setUserSession(sessionObj);
    setProfile(prev => ({ ...prev, phone: authPhone, name: guestName }));
    setForm(prev => ({ ...prev, phone: authPhone, name: guestName }));

    // Sync to Backoffice CRM Database (customers & marketing_contacts)
    fetch(`${API_BASE}/api/public/customer/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: selectedOutletId,
        phone: authPhone,
        name: guestName
      })
    }).catch(err => console.error("Guest Backoffice sync error:", err));

    setIsAuthModalOpen(false);
    showToast(`Welcome, ${guestName}!`);

    // Execute pending cart addition if user was trying to add to cart
    if (pendingCartItem) {
      executeAddToCart(pendingCartItem);
      setPendingCartItem(null);
    }
  };

  // Keep selectedOutletId in sync if URL parameter changes
  useEffect(() => {
    if (routeUserId || queryUserId) {
      setSelectedOutletId(String(routeUserId || queryUserId));
    }
  }, [routeUserId, queryUserId]);

  /* ────────── FETCH OUTLETS LIST FOR MULTI-OUTLET SELECTOR ────────── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_BASE}/api/brand/outlets`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setAvailableOutlets(data);
          }
        })
        .catch(() => { });
    }
  }, []);

  /* ────────── FETCH LIVE BACKOFFICE MENU FOR OUTLET ────────── */
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchMenu = async () => {
      try {
        const modeQuery = selectedTableNumber ? `?mode=table&table=${encodeURIComponent(selectedTableNumber)}` : '';
        let res = await fetch(`${API_BASE}/api/public/menu/${selectedOutletId}${modeQuery}`);
        let data = await res.json();

        // Smart fallback to active restaurant IDs (1, 2, 3, 55) if targeted ID returned error
        if (!data || data.error) {
          for (const fallbackId of ["1", "2", "3", "55"]) {
            if (fallbackId !== selectedOutletId) {
              try {
                const fbRes = await fetch(`${API_BASE}/api/public/menu/${fallbackId}`);
                const fbData = await fbRes.json();
                if (fbData && !fbData.error && fbData.business) {
                  data = fbData;
                  break;
                }
              } catch (fbErr) { }
            }
          }
        }

        if (isMounted && data && !data.error) {
          setBusinessData(data.business || null);
          setDigitalSettings(data.digital_settings || null);
          if (data.online_order_upi_id) setOnlineOrderUpiId(data.online_order_upi_id);

          const loadedItems = (data.items || []).map((item) => {
            const pName = item.product_name || item.name || "Menu Item";
            const cat = (item.category && item.category.trim() !== "") ? item.category.trim() : "";

            let resolvedImage = getCategoryImage(cat, pName);
            if (item.image_url && item.image_url.trim() !== "") {
              const rawImg = item.image_url.trim();
              if (rawImg.startsWith('http://') || rawImg.startsWith('https://')) {
                resolvedImage = rawImg;
              } else {
                resolvedImage = `${API_BASE}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;
              }
            }

            return {
              id: item.id || `item-${Math.random()}`,
              product_name: pName,
              category: cat,
              price: parseFloat(item.price) || 0,
              description: item.description || `Delicious ${pName} prepared fresh to order.`,
              image_url: resolvedImage,
              is_veg: item.is_veg !== undefined ? Boolean(item.is_veg) : item.food_type === "veg",
              tags: item.food_type === "veg" || item.is_veg ? ["veg"] : [],
              option_groups: item.option_groups || []
            };
          });

          setDishes(loadedItems);
        }
      } catch (err) {
        console.error("Backoffice online menu fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMenu();

    // 🪑 Fetch Custom Seating Areas / Table Departments for Outlet
    if (selectedOutletId) {
      fetch(`${API_BASE}/api/public/seating-areas/${selectedOutletId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setSeatingAreas(data);
            setReservationForm(prev => ({
              ...prev,
              seating: (!prev.seating || prev.seating === "Indoor" || prev.seating === "Indoor Dining") ? data[0].name : prev.seating
            }));
          }
        })
        .catch(err => console.error("Fetch seating areas error:", err));
    }

    return () => {
      isMounted = false;
    };
  }, [selectedOutletId]);

  const categories = useMemo(() => {
    const cats = new Set(
      dishes
        .map((d) => d.category)
        .filter((c) => c && c.trim() !== "" && c.toUpperCase() !== "GENERAL")
    );
    return ["ALL", ...Array.from(cats)];
  }, [dishes]);

  const showToast = (msg) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 2500);
  };

  const executeAddToCart = (item) => {
    if (isTableAccessBlocked || tableLoginStep === "BLOCKED") {
      showToast("❌ Table is currently occupied by another customer.");
      return;
    }
    setCart((prev) => {
      const match = prev.find((i) => i.id === item.id);
      if (match) return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...item, qty: 1 }];
    });
    showToast(`Added ${item.product_name} to cart`);
  };

  // Add to cart with Login Requirement & Option Customization Modal Guard
  const addToCart = (item, e) => {
    if (e) e.stopPropagation();

    if (isTableAccessBlocked || tableLoginStep === "BLOCKED") {
      showToast("❌ Table is currently occupied. Ordering disabled.");
      return;
    }

    if (!isUserLoggedIn) {
      setPendingCartItem(item);
      setIsAuthModalOpen(true);
      showToast("Please log in to add items to your cart!");
      return;
    }

    if (item.option_groups && item.option_groups.length > 0) {
      const initialSelected = {};
      item.option_groups.forEach((g) => {
        if (g.options && g.options.length > 0) {
          if (g.max_selectable === 1) {
            initialSelected[g.id] = [g.options[0]];
          } else {
            initialSelected[g.id] = [];
          }
        }
      });
      setSelectedOptions(initialSelected);
      setCustomizingItem(item);
      return;
    }

    executeAddToCart(item);
  };

  const handleConfirmCustomization = () => {
    if (!customizingItem) return;

    let finalItemPrice = parseFloat(customizingItem.price) || 0;
    let extraPrice = 0;
    const optionLabels = [];

    (customizingItem.option_groups || []).forEach((g) => {
      const selected = selectedOptions[g.id] || [];
      if (!g.is_addon || g.max_selectable === 1) {
        if (selected.length > 0) {
          const mainOpt = selected[0];
          const optP = parseFloat(mainOpt.price) || 0;
          if (optP > 0) finalItemPrice = optP;
          optionLabels.push(mainOpt.name);
        }
      } else {
        selected.forEach((o) => {
          extraPrice += parseFloat(o.price) || 0;
          optionLabels.push(o.name);
        });
      }
    });

    const customizedProduct = {
      ...customizingItem,
      id: `${customizingItem.id}-${optionLabels.join("-")}`,
      product_name: optionLabels.length > 0 ? `${customizingItem.product_name} (${optionLabels.join(", ")})` : customizingItem.product_name,
      price: finalItemPrice + extraPrice,
      selectedOptionsLabel: optionLabels.join(", ")
    };

    executeAddToCart(customizedProduct);
    setCustomizingItem(null);
  };

  const removeFromCart = (id, e) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const match = prev.find((i) => i.id === id);
      if (match?.qty > 1) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i));
      return prev.filter((i) => i.id !== id);
    });
  };

  // Back Office GST Enablement Check
  const isGstEnabled = Boolean(
    activeSettings.show_gst_on_receipt ||
    businessData?.show_gst_on_receipt ||
    ((parseFloat(activeSettings.cgst_percent || 0) + parseFloat(activeSettings.sgst_percent || 0)) > 0) ||
    ((parseFloat(businessData?.cgst_percent || 0) + parseFloat(businessData?.sgst_percent || 0)) > 0)
  );

  const gstRate = isGstEnabled
    ? ((parseFloat(businessData?.cgst_percent || activeSettings.cgst_percent) || 2.5) + (parseFloat(businessData?.sgst_percent || activeSettings.sgst_percent) || 2.5))
    : 0;

  // Haversine distance calculator for delivery radius check
  const calculateKmDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getItemQty = (id) => cart.find((i) => i.id === id)?.qty || 0;
  const totalItems = cart.reduce((acc, i) => acc + i.qty, 0);
  const subtotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  const [deliveryCoords, setDeliveryCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [cancellingOrderRef, setCancellingOrderRef] = useState(null);

  // 📍 Auto-fetch GPS Location when Order Placing / Checkout window opens
  useEffect(() => {
    if (isCheckoutOpen && fulfillmentMode === "DELIVERY" && !deliveryCoords) {
      handleGetCurrentLocation();
    }
  }, [isCheckoutOpen, fulfillmentMode]);

  // Custom Middle-of-Page Modal System (Replaces Browser alert() / confirm())
  const [modalNotice, setModalNotice] = useState(null);

  const showAlertModal = (title, message, type = "info") => {
    setModalNotice({ title, message, type });
  };

  const showConfirmModal = (title, message, onConfirm, confirmText = "Yes, Cancel Order", cancelText = "Keep Order") => {
    setModalNotice({
      title,
      message,
      type: "confirm",
      onConfirm,
      confirmText,
      cancelText
    });
  };

  // Back Office Restaurant GPS & Delivery Settings
  const restLat = parseFloat(businessData?.latitude) || 34.262643;
  const restLng = parseFloat(businessData?.longitude) || 74.903283;

  // Determine Fencing Mode: "distance" (BY DISTANCE via OSRM) vs "radius" (BY RADIUS via Haversine)
  const isByDistanceMode = (
    businessData?.settings?.custDeliveryLimitType === "distance" ||
    activeSettings?.custDeliveryLimitType === "distance"
  );

  const maxDeliveryRadiusKm = isByDistanceMode
    ? parseFloat(businessData?.settings?.custDeliveryDistanceKm || businessData?.delivery_radius_km || activeSettings.delivery_radius_km || 15)
    : parseFloat(businessData?.settings?.custDeliveryRadiusKm || businessData?.delivery_radius_km || activeSettings.delivery_radius_km || 15);

  const minDeliveryOrderAmount = parseFloat(businessData?.min_order_value || businessData?.min_delivery_amount || activeSettings.min_delivery_amount || 0);

  const [calculatedDistanceKm, setCalculatedDistanceKm] = useState(0);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  useEffect(() => {
    if (!deliveryCoords || !deliveryCoords.lat || !deliveryCoords.lng || !restLat || !restLng) {
      setCalculatedDistanceKm(0);
      return;
    }

    const haversineDist = calculateKmDistance(restLat, restLng, deliveryCoords.lat, deliveryCoords.lng);

    if (isByDistanceMode) {
      setIsCalculatingDistance(true);
      const proxyUrl = `${API_BASE}/api/public/osrm-distance?originLat=${restLat}&originLng=${restLng}&destLat=${deliveryCoords.lat}&destLng=${deliveryCoords.lng}`;
      
      fetch(proxyUrl)
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.roadKm === "number") {
            setCalculatedDistanceKm(data.roadKm);
          } else {
            setCalculatedDistanceKm(Math.round(haversineDist * 1.35 * 10) / 10);
          }
        })
        .catch((err) => {
          console.warn("Backend OSRM proxy error, falling back to estimated road distance:", err);
          setCalculatedDistanceKm(Math.round(haversineDist * 1.35 * 10) / 10);
        })
        .finally(() => setIsCalculatingDistance(false));
    } else {
      setCalculatedDistanceKm(Math.round(haversineDist * 10) / 10);
    }
  }, [deliveryCoords?.lat, deliveryCoords?.lng, restLat, restLng, isByDistanceMode]);

  const isLocationServiceable =
    fulfillmentMode === "DELIVERY" && deliveryCoords
      ? calculatedDistanceKm <= maxDeliveryRadiusKm
      : true;

  const isMinOrderMet = fulfillmentMode === "DELIVERY" ? subtotal >= minDeliveryOrderAmount : true;

  // Back Office Delivery Tiers & Charges Calculation
  const deliveryTiers = useMemo(() => {
    const rawTiers = businessData?.delivery_tiers;
    if (!rawTiers) return [];
    if (typeof rawTiers === "string") {
      try { return JSON.parse(rawTiers); } catch { return []; }
    }
    return Array.isArray(rawTiers) ? rawTiers : [];
  }, [businessData]);

  let deliveryFee = 0;
  if (fulfillmentMode === "DELIVERY") {
    if (deliveryTiers.length > 0) {
      const checkDist = deliveryCoords ? calculatedDistanceKm : 0;
      const matchedTier = deliveryTiers.find(
        (t) => checkDist >= parseFloat(t.min) && checkDist <= parseFloat(t.max)
      );
      if (matchedTier) {
        deliveryFee = parseFloat(matchedTier.charge) || 0;
      } else if (checkDist > maxDeliveryRadiusKm) {
        deliveryFee = 0;
      } else {
        const firstTier = deliveryTiers[0];
        deliveryFee = firstTier ? (parseFloat(firstTier.charge) || 0) : 0;
      }
    } else {
      const baseCharge = parseFloat(businessData?.delivery_charge || activeSettings.delivery_charge || 0);
      const freeAbove = parseFloat(businessData?.free_delivery_above || activeSettings.free_delivery_above || 500);
      deliveryFee = (subtotal >= freeAbove && freeAbove > 0) ? 0 : baseCharge;
    }
  }

  const taxes = isGstEnabled ? Math.round(subtotal * (gstRate / 100)) : 0;

  // Loyalty Points & Redemption State
  const [customerLoyalty, setCustomerLoyalty] = useState(null);
  const [isLoyaltyRedeemed, setIsLoyaltyRedeemed] = useState(false);
  const [redeemedPointsInput, setRedeemedPointsInput] = useState(0);
  const [loyaltyRefreshTick, setLoyaltyRefreshTick] = useState(0);

  // Helper to refetch loyalty
  const refreshLoyaltyData = () => setLoyaltyRefreshTick(t => t + 1);

  useEffect(() => {
    const p = form.phone || userSession?.phone;
    if (p && p.replace(/\D/g, "").length >= 10 && selectedOutletId) {
      fetch(`${API_BASE}/api/public/customer-loyalty?userId=${selectedOutletId}&phone=${encodeURIComponent(p)}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setCustomerLoyalty(data);
            // Also sync to ledger display
            setCustomerLedgerData(prev => ({ ...prev, points: data.points || 0 }));
            if (data.points > 0 && data.loyalty_enabled !== false) {
              const ratio = data.points_to_amount_ratio || 1.0;
              const maxRedeem = data.max_redeem_per_order || 500;
              const maxAllowedBySubtotal = Math.floor(subtotal / (ratio || 1));
              const initialPts = Math.min(data.points, maxRedeem, maxAllowedBySubtotal);
              setRedeemedPointsInput(initialPts > 0 ? initialPts : 0);
            }
          }
        })
        .catch(err => console.error("Loyalty fetch error:", err));
    }
  }, [form.phone, userSession?.phone, selectedOutletId, isCheckoutOpen, subtotal, loyaltyRefreshTick]);

  const loyaltyRatio = customerLoyalty?.points_to_amount_ratio || 1.0;
  const loyaltyDiscount = (isLoyaltyRedeemed && customerLoyalty?.loyalty_enabled !== false)
    ? Math.min(subtotal, Math.round(redeemedPointsInput * loyaltyRatio))
    : 0;

  const grandTotal = Math.max(0, subtotal + taxes + deliveryFee - loyaltyDiscount);

  // Estimated points the customer will earn on this order
  const estimatedPointsEarn = useMemo(() => {
    if (!customerLoyalty || customerLoyalty.loyalty_enabled === false) return 0;
    const threshold = parseFloat(customerLoyalty.loyalty_bill_amount_threshold) || 100;
    const ptsEarned = parseInt(customerLoyalty.loyalty_points_earned) || 1;
    if (threshold <= 0) return 0;
    return grandTotal >= threshold ? Math.floor(grandTotal * (ptsEarned / threshold)) : 0;
  }, [customerLoyalty, grandTotal]);

  const recentOrdersRef = useRef(recentOrders);
  useEffect(() => {
    recentOrdersRef.current = recentOrders;
  }, [recentOrders]);

  // 🔄 Live Polling for Online Order Status Updates from POS
  useEffect(() => {
    const pollStatus = async () => {
      // 1. Poll orderConfirmed modal if active
      if (orderConfirmed?.id) {
        try {
          const res = await fetch(`${API_BASE}/api/public/order-status/${orderConfirmed.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.status) {
              let statusDisplay = data.status;
              const upper = String(data.status).toUpperCase();
              if (upper === 'CANCELLED') {
                statusDisplay = data.rejection_reason ? `❌ Cancelled: ${data.rejection_reason}` : '❌ Order Cancelled by Restaurant';
              } else if (upper === 'PROCESSING' || upper === 'PREPARING') statusDisplay = '👨‍🍳 Preparing in POS Kitchen';
              else if (upper === 'READY' || upper === 'FOOD READY') statusDisplay = '🍱 Food Ready for Pickup/Dispatch';
              else if (upper === 'COMPLETED') statusDisplay = '✅ Order Completed';
              else if (upper === 'PENDING' || upper === 'AWAITING_PAYMENT') statusDisplay = 'Received at POS Kitchen';

              setOrderConfirmed(prev => prev ? {
                ...prev,
                status: statusDisplay,
                rejection_reason: data.rejection_reason || prev.rejection_reason,
                payment_status: data.payment_status || prev.payment_status,
                paymentConfirmed: data.payment_status === 'CUSTOMER_CONFIRMED' || data.payment_status === 'PAID' || data.payment_status === 'RECEIVED' || prev.paymentConfirmed
              } : prev);
            }
          }
        } catch (err) { }
      }

      // 2. Poll recentOrders for live status in the Orders tab using recentOrdersRef
      const currentList = recentOrdersRef.current;
      if (currentList && currentList.length > 0) {
        try {
          let hasChanges = false;
          const updatedList = await Promise.all(currentList.map(async (ord) => {
            const ref = ord.id || ord.order_reference;
            if (!ref) return ord;
            try {
              const res = await fetch(`${API_BASE}/api/public/order-status/${ref}`);
              if (res.ok) {
                const data = await res.json();
                if (data && data.status) {
                  let statusDisplay = data.status;
                  const upper = String(data.status).toUpperCase();
                  if (upper === 'CANCELLED') {
                    statusDisplay = data.rejection_reason ? `❌ Cancelled: ${data.rejection_reason}` : '❌ Order Cancelled by Restaurant';
                  } else if (upper === 'PROCESSING' || upper === 'PREPARING') statusDisplay = '👨‍🍳 Preparing in POS Kitchen';
                  else if (upper === 'READY' || upper === 'FOOD READY') statusDisplay = '🍱 Food Ready for Pickup/Dispatch';
                  else if (upper === 'COMPLETED') statusDisplay = '✅ Order Completed';
                  else if (upper === 'PENDING' || upper === 'AWAITING_PAYMENT') statusDisplay = 'Received at POS Kitchen';

                  const newPayStatus = data.payment_status || data.paymentStatus || ord.payment_status;

                  if (ord.status !== statusDisplay || ord.rejection_reason !== data.rejection_reason || ord.payment_status !== newPayStatus) {
                    hasChanges = true;
                    return {
                      ...ord,
                      status: statusDisplay,
                      rejection_reason: data.rejection_reason || ord.rejection_reason,
                      payment_status: newPayStatus
                    };
                  }
                }
              }
            } catch (e) { }
            return ord;
          }));

          if (hasChanges) {
            setRecentOrders(updatedList);
          }
        } catch (err) { }
      }
    };

    pollStatus();
    const pollInterval = setInterval(pollStatus, 3000);
    return () => clearInterval(pollInterval);
  }, [orderConfirmed?.id]);

  // Backoffice Dynamic Payment Methods Reader
  const allowedPaymentMethods = useMemo(() => {
    const settings = businessData?.settings || activeSettings || {};
    const methods = [];

    const isDelivery = fulfillmentMode === "DELIVERY";
    const isPickup = fulfillmentMode === "PICKUP";

    // 1. Cash Option
    const isCashEnabled = isDelivery
      ? (settings.pgDeliveryCash ?? settings.pgDeliveryCod ?? true)
      : isPickup
        ? (settings.pgPickUpCash ?? settings.pgPickUpCod ?? true)
        : (settings.pgDineInCash ?? settings.pgDineInCod ?? true);

    if (isCashEnabled) {
      methods.push({
        key: "COD",
        label: isDelivery ? "💵 Cash on Delivery" : "💵 Cash at Counter",
      });
    }

    // 2. UPI / QR Option (Enabled by default unless explicitly disabled in Backoffice)
    const isUpiEnabled = isDelivery
      ? (settings.pgDeliveryUpi ?? true)
      : isPickup
        ? (settings.pgPickUpUpi ?? true)
        : (settings.pgDineInUpi ?? true);

    if (isUpiEnabled) {
      methods.push({ key: "UPI", label: "📱 UPI / QR Code" });
    }

    // 3. Card / Pay Later Option
    const isCardEnabled = isDelivery
      ? (settings.pgDeliveryPayLater ?? false)
      : isPickup
        ? (settings.pgPickUpPayLater ?? false)
        : (settings.pgDineInPayLater ?? false);

    if (isCardEnabled) {
      methods.push({ key: "CARD", label: "💳 Pay Later / Card" });
    }

    // Fallback: If no method explicitly enabled in settings, allow Cash
    if (methods.length === 0) {
      methods.push({ key: "COD", label: "💵 Pay Cash" });
    }

    return methods;
  }, [businessData, activeSettings, fulfillmentMode]);

  useEffect(() => {
    if (allowedPaymentMethods.length > 0 && !allowedPaymentMethods.some((m) => m.key === form.paymentMethod)) {
      setForm((prev) => ({ ...prev, paymentMethod: allowedPaymentMethods[0].key }));
    }
  }, [allowedPaymentMethods]);

  const fetchAddressFromCoords = async (lat, lng) => {
    const googleMapUrl = `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        const parts = data.display_name.split(',');
        const cleanAddr = parts.slice(0, Math.min(parts.length, 3)).join(',').trim();
        const fullAddrWithMap = `${cleanAddr} (Google Maps: ${googleMapUrl})`;
        setForm((prev) => ({
          ...prev,
          address: fullAddrWithMap
        }));
        return fullAddrWithMap;
      }
    } catch (e) {
      console.warn("Reverse geocode error:", e);
    }
    const fallback = `📍 GPS Location: ${googleMapUrl}`;
    setForm((prev) => ({
      ...prev,
      address: fallback
    }));
    return fallback;
  };

  useEffect(() => {
    if (deliveryCoords && deliveryCoords.lat && deliveryCoords.lng) {
      fetchAddressFromCoords(deliveryCoords.lat, deliveryCoords.lng);
    }
  }, [deliveryCoords?.lat, deliveryCoords?.lng]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      showAlertModal("GPS Location Notice", "Geolocation is not supported by your browser. Please type your street address.", "info");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setDeliveryCoords({ lat: latitude, lng: longitude });
        await fetchAddressFromCoords(latitude, longitude);
        showToast("📍 Exact GPS location pinned to Google Maps!");
        setIsLocating(false);
      },
      (error) => {
        console.error("GPS location error:", error);
        showAlertModal("GPS Location Notice", "Unable to retrieve GPS coordinates. Please type your street address or landmark below.", "info");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Cancel Order & Deduct/Revert Loyalty Points Handler
  const handleCancelOrder = (orderRef) => {
    showConfirmModal(
      "Cancel Order?",
      `Are you sure you want to cancel Order ${orderRef}? Any loyalty points earned for this order will be reverted.`,
      () => executeCancelOrder(orderRef)
    );
  };

  const executeCancelOrder = async (orderRef) => {
    setCancellingOrderRef(orderRef);
    try {
      const res = await fetch(`${API_BASE}/api/public/order/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderRef })
      });
      const data = await res.json();
      if (data && data.success) {
        showToast("Order cancelled & loyalty points updated!");
        setRecentOrders((prev) =>
          prev.map((o) => (o.id === orderRef || o.order_reference === orderRef ? { ...o, status: "CANCELLED" } : o))
        );
        setCustomerOrdersList((prev) =>
          prev.map((o) => (o.order_reference === orderRef || o.id === orderRef ? { ...o, status: "CANCELLED" } : o))
        );
        // Instantly refresh loyalty points balance
        refreshLoyaltyData();
      } else {
        showAlertModal("Cancellation Notice", data.error || "Failed to cancel order.", "warning");
      }
    } catch (err) {
      console.error("Cancel order error:", err);
      showAlertModal("Cancellation Error", "Unable to cancel order. Please contact restaurant directly.", "warning");
    } finally {
      setCancellingOrderRef(null);
    }
  };

  const filteredDishes = useMemo(() => {
    return dishes.filter((d) => {
      if (activeCat.toUpperCase() !== "ALL" && d.category !== activeCat) return false;
      if (vegOnly && !d.is_veg) return false;
      if (
        searchQuery.trim() &&
        !`${d.product_name} ${d.description} ${d.category}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [dishes, activeCat, searchQuery, vegOnly]);

  /* ────────── SUBMIT ONLINE ORDER TO BACKOFFICE POS ────────── */
  const handleCheckoutSubmit = async (e, skipVerification = false) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return;

    if (!isUserLoggedIn) {
      setIsAuthModalOpen(true);
      showToast("Please log in to place your order!");
      return;
    }

    if (!skipVerification && !isVerifyingTableOrder) {
      setIsVerifyingTableOrder(true);
      return;
    }

    setIsVerifyingTableOrder(false);

    // Enforce strict delivery location requirement
    const userAddressText = (form.address || "").trim();
    const isGenericOrEmpty = !userAddressText || userAddressText.toLowerCase() === "srinagar" || userAddressText.toLowerCase() === "kashmir" || userAddressText.length < 5;

    if (!selectedTableNumber && fulfillmentMode === "DELIVERY" && isGenericOrEmpty && !deliveryCoords) {
      showAlertModal(
        "📍 Delivery Address Required",
        "Please type your full delivery street address in the address field OR click '📍 Pin GPS Location' to select your location on Google Maps before placing your order.",
        "info"
      );
      return;
    }

    setIsSubmitting(true);

    let streetAddress = (form.address || "").trim();
    if (!streetAddress || streetAddress.toLowerCase() === "srinagar") {
      if (deliveryCoords && deliveryCoords.lat && deliveryCoords.lng) {
        const exactMapAddr = await fetchAddressFromCoords(deliveryCoords.lat, deliveryCoords.lng);
        streetAddress = exactMapAddr || form.landmark || `Pinned Map Location (${deliveryCoords.lat.toFixed(4)}, ${deliveryCoords.lng.toFixed(4)})`;
      }
    }

    const mapPinUrl = (fulfillmentMode === "DELIVERY" && deliveryCoords?.lat && deliveryCoords?.lng)
      ? ` 📍 Pin: https://maps.google.com/?q=${deliveryCoords.lat.toFixed(6)},${deliveryCoords.lng.toFixed(6)}`
      : "";

    const addressParts = [];
    if (streetAddress) addressParts.push(streetAddress);
    if (form.landmark && form.landmark !== streetAddress) addressParts.push(form.landmark);
    if (form.city && form.city !== streetAddress) addressParts.push(form.city);
    if (form.pincode) addressParts.push(form.pincode);

    const fullDeliveryAddress = selectedTableNumber
      ? `Dine-In Table ${selectedTableNumber}`
      : (fulfillmentMode === "DELIVERY"
          ? `${addressParts.join(", ")}${mapPinUrl}`
          : "Takeaway / Self-Pickup at Restaurant");

    try {
      const res = await fetch(`${API_BASE}/api/public/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedOutletId,
          customerName: form.name || profile.name || userSession?.name || "Guest Customer",
          customerPhone: form.phone || profile.phone || userSession?.phone || "",
          address: fullDeliveryAddress,
          fulfillmentMode: selectedTableNumber ? "DINE_IN" : fulfillmentMode,
          tableNumber: selectedTableNumber || null,
          paymentMethod: form.paymentMethod || "COD",
          totalPrice: subtotal,
          service_charge: deliveryFee,
          points_redeemed: isLoyaltyRedeemed ? redeemedPointsInput : 0,
          discount_amount: loyaltyDiscount,
          deliveryCoords: deliveryCoords,
          items: cart.map((c) => ({
            id: c.id,
            product_name: c.product_name,
            price: c.price,
            qty: c.qty
          })),
          source: selectedTableNumber ? "QR_MENU" : "ONLINE_ORDER"
        })
      });

      const data = await res.json();

      if (data && (data.success || data.orderRef)) {
        const orderObject = {
          id: data.orderRef || "ONL-" + Math.floor(100000 + Math.random() * 900000),
          name: form.name,
          phone: form.phone,
          address: fullDeliveryAddress,
          mode: selectedTableNumber ? "DINE_IN" : fulfillmentMode,
          paymentMethod: form.paymentMethod,
          total: grandTotal,
          items: cart,
          status: "Order Received at POS Kitchen",
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setOrderConfirmed(orderObject);
        setRecentOrders(prev => [orderObject, ...prev]);
        setCart([]);
        setIsCheckoutOpen(false);
        setIsCartOpen(false);
        setIsLoyaltyRedeemed(false);
        setRedeemedPointsInput(0);
        setDismissedRejectionRef(null);

        // 🚀 INSTANT TABLE SESSION UPDATE: Instantly show active session bill without waiting for poll
        if (selectedTableNumber) {
          const formattedOrderForSession = {
            ...orderObject,
            total_price: grandTotal,
            total: grandTotal,
            order_reference: data.orderRef || orderObject.id,
            items: cart.map(c => ({
              id: c.id,
              product_name: c.product_name || c.name,
              name: c.product_name || c.name,
              qty: c.qty,
              price: c.price
            })),
            status: "PENDING",
            created_at: new Date().toISOString()
          };

          setTableStatusData(prev => ({
            ...prev,
            status: "OCCUPIED",
            customer_number: form.phone || profile?.phone || "",
            active_order: formattedOrderForSession,
            total_session_amount: (parseFloat(prev?.total_session_amount) || 0) + grandTotal,
            latest_rejected_order: null,
            session_orders: [formattedOrderForSession, ...(prev?.session_orders || [])]
          }));
        }

        // Instantly refresh loyalty points balance after order
        refreshLoyaltyData();
      } else {
        const timings = activeSettings.timingsText ||
          (activeSettings.openingTime && activeSettings.closingTime
            ? `${activeSettings.openingTime} – ${activeSettings.closingTime}`
            : "Everyday · 10:00 AM – 10:00 PM");

        const isClosedErr = data.error?.toLowerCase().includes("closed");
        const modalMessage = isClosedErr
          ? `We are currently closed for online orders.\n\n⏰ Operating Hours:\n${timings}\n\nPlease visit us during operating hours to place your order!`
          : (data.error || "Failed to place online order. Please check details and try again.");

        showAlertModal("Restaurant Notice", modalMessage, isClosedErr ? "closed" : "warning");
      }
    } catch (err) {
      console.error("Online order submit err:", err);
      showAlertModal("Network Notice", "Network error placing order. Please try again.", "warning");
    } finally {
      setIsSubmitting(false);
    }
  };

  const restaurantTitle = businessData?.name || loggedInUser?.business_name || loggedInUser?.restaurant_name || "Shahe Tehzeeb Restaurant";
  const currencySymbol = businessData?.currency_code === "USD" ? "$" : "₹";

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased select-none transition-colors duration-300 ${(isTableAccessBlocked || tableLoginStep === "BLOCKED") ? "pointer-events-none filter blur-xs" : ""}`}
      style={{
        backgroundColor: activeSettings.mainBgColor,
        color: activeSettings.fontColor,
        fontFamily: activeSettings.googleFont ? `'${activeSettings.googleFont}', sans-serif` : undefined,
        fontStyle: activeSettings.fontStyle || 'normal'
      }}
    >

      {/* TOAST POPUP */}
      <AnimatePresence>
        {toastText && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-stone-800"
          >
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{toastText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ────────── HEADER ────────── */}
      <header
        style={{ backgroundColor: activeSettings.bgColor || '#ffffff' }}
        className="sticky top-0 z-40 backdrop-blur-xl border-b border-stone-200 shadow-sm w-full max-w-full overflow-hidden"
      >
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto flex items-center justify-between px-3 sm:px-8 h-14 sm:h-20 w-full">

          {/* LEFT: RESTAURANT NAME & OUTLET LOCATION ADDRESS */}
          <div className="flex flex-col justify-center flex-1 min-w-0 mr-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span
                className="font-display font-black text-sm xs:text-base sm:text-2xl tracking-tighter text-stone-900 transition-colors leading-tight truncate"
                onMouseEnter={(e) => e.currentTarget.style.color = activeSettings.primaryColor}
                onMouseLeave={(e) => e.currentTarget.style.color = "#1c1917"}
              >
                {restaurantTitle}
              </span>
              {selectedTableNumber && (
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-slate-900 text-white rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs shrink-0 border border-slate-800">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{tableParam ? decodeURIComponent(tableParam) : `TABLE ${selectedTableNumber}`}</span>
                </span>
              )}
            </div>
            {activeSettings.address && (
              <span className="hidden xs:flex items-center gap-1 text-[10px] sm:text-xs font-extrabold text-stone-500 mt-0.5 truncate max-w-[150px] sm:max-w-md">
                <MapPin size={12} className="shrink-0 text-emerald-600" />
                <span className="truncate">{activeSettings.address}</span>
              </span>
            )}
          </div>

          {/* RIGHT: CALL WAITER BUTTON / TABLE BOOKING, CART ICON & PROFILE ICON */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Call Waiter Button or Table Booking */}
            {selectedTableNumber ? (
              <button
                type="button"
                onClick={handleCallWaiter}
                disabled={isCallingWaiter}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 transition-all text-amber-800 shadow-2xs cursor-pointer shrink-0 font-extrabold text-[11px] sm:text-xs"
                title="Call Waiter to Table"
              >
                <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 animate-bounce" />
                <span>Call Waiter</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsReservationModalOpen(true)}
                className="relative h-8 w-8 sm:h-11 sm:w-11 grid place-items-center rounded-full border border-stone-200 transition-colors bg-white shadow-2xs hover:border-stone-300 cursor-pointer text-amber-600 hover:bg-amber-50 shrink-0"
                title="Book a Table"
              >
                <Calendar className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-amber-600" />
              </button>
            )}

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative h-8 w-8 sm:h-11 sm:w-11 grid place-items-center rounded-full border border-stone-200 transition-colors bg-white shadow-2xs hover:border-stone-300 shrink-0 cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-stone-700" />
              {totalItems > 0 && (
                <span
                  style={{ backgroundColor: activeSettings.primaryColor }}
                  className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full text-white text-[9px] font-bold grid place-items-center shadow-md"
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* Profile Icon */}
            <button
              onClick={() => {
                if (isUserLoggedIn) {
                  setIsProfileOpen(true);
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="relative h-8 w-8 sm:h-11 sm:w-11 grid place-items-center rounded-full border border-stone-200 transition-colors bg-white shadow-2xs hover:border-stone-300 cursor-pointer shrink-0"
              title={isUserLoggedIn ? `${profile.name || userSession?.name || 'Customer Profile'}` : "Login / Register"}
            >
              <User className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-stone-700" />
              {isUserLoggedIn && (
                <span className="absolute bottom-0 right-0 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-emerald-500 border-2 border-white" />
              )}
            </button>
          </div>

        </div>
      </header>
      {/* MENU VIEW */}
      <main className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-3 sm:px-8 pt-3 sm:pt-4 pb-32 lg:pb-16 flex-1 w-full">

          {/* 🛑 REJECTED ORDER BANNER */}
          {tableStatusData?.latest_rejected_order && dismissedRejectionRef !== tableStatusData.latest_rejected_order.order_reference && (
            <div className="mb-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 flex flex-wrap items-center justify-between gap-3 shadow-sm animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-red-500/20 text-red-600 mt-0.5 shrink-0">
                  <XCircle size={20} />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-red-800">
                    Order Rejected ({tableStatusData.latest_rejected_order.order_reference})
                  </div>
                  <div className="text-xs font-semibold text-red-600 mt-0.5">
                    Reason: <span className="font-bold underline">{tableStatusData.latest_rejected_order.rejection_reason || "Declined by restaurant staff"}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setDismissedRejectionRef(tableStatusData.latest_rejected_order.order_reference)}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* 💳 ACTIVE TABLE SESSION BILL TRACKER */}
          {(() => {
            let sessionTotal = parseFloat(tableStatusData?.total_session_amount) || 0;
            const orders = tableStatusData?.session_orders || [];
            if (sessionTotal === 0 && orders.length > 0) {
              sessionTotal = orders.reduce((sum, ord) => {
                const p = parseFloat(ord.total_price) || 0;
                if (p > 0) return sum + p;
                const rawItems = Array.isArray(ord.items) ? ord.items : (typeof ord.items === 'string' ? JSON.parse(ord.items || '[]') : []);
                return sum + rawItems.reduce((iSum, i) => iSum + ((parseFloat(i.qty || i.quantity || 1)) * (parseFloat(i.price) || 0)), 0);
              }, 0);
            }
            if (sessionTotal === 0 && tableStatusData?.active_order) {
              const ord = tableStatusData.active_order;
              const p = parseFloat(ord.total_price) || 0;
              if (p > 0) sessionTotal = p;
              else {
                const rawItems = Array.isArray(ord.items) ? ord.items : (typeof ord.items === 'string' ? JSON.parse(ord.items || '[]') : []);
                sessionTotal = rawItems.reduce((iSum, i) => iSum + ((parseFloat(i.qty || i.quantity || 1)) * (parseFloat(i.price) || 0)), 0);
              }
            }

            const showBanner = selectedTableNumber && tableStatusData?.status === "OCCUPIED" && (sessionTotal > 0 || orders.length > 0 || tableStatusData?.active_order);
            if (!showBanner) return null;

            return (
              <div className="mb-4 p-4 rounded-2xl bg-stone-900 text-white flex flex-wrap items-center justify-between gap-3 shadow-lg border border-emerald-500/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 animate-pulse">
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      Table {selectedTableNumber} Active Session
                    </div>
                    <div className="text-lg font-black text-white tabular-nums">
                      Total Session Bill: ₹{sessionTotal.toFixed(2)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt size={14} />
                  <span>Track Orders ({orders.length || 1})</span>
                </button>
              </div>
            );
          })()}

          {/* Search & Veg toggle row */}
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 border border-stone-200 rounded-full bg-white px-4 h-11 focus-within:border-[#e05328] transition shadow-sm">
              <Search className="h-4 w-4 text-stone-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, biryani, wazwan, drinks…"
                className="flex-1 bg-transparent outline-none text-sm font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-stone-400 hover:text-stone-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* iPhone-style Veg Toggle */}
            <button
              type="button"
              onClick={() => setVegOnly(prev => !prev)}
              className="shrink-0 flex items-center gap-2 cursor-pointer select-none group"
              title="Toggle Pure Veg Only"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 group-hover:text-stone-700 transition hidden sm:inline">Veg</span>
              <div
                style={{
                  width: 44,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: vegOnly ? '#22c55e' : '#d6d3d1',
                  transition: 'background-color 0.25s ease',
                  position: 'relative',
                  cursor: 'pointer',
                  boxShadow: vegOnly ? '0 0 8px rgba(34,197,94,0.35)' : 'inset 0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    position: 'absolute',
                    top: 2,
                    left: vegOnly ? 20 : 2,
                    transition: 'left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {vegOnly && <Leaf size={11} className="text-emerald-600" />}
                </div>
              </div>
            </button>
          </div>

          {/* Active Category Indicator Bar */}
          <div className="mt-3.5 sm:mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                style={{ backgroundColor: `${activeSettings.primaryColor}15`, color: activeSettings.primaryColor, borderColor: `${activeSettings.primaryColor}30` }}
                className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 shadow-2xs"
              >
                <UtensilsCrossed size={14} style={{ color: activeSettings.primaryColor }} />
                <span>{activeCat} DISHES</span>
                <span className="opacity-70">({filteredDishes.length})</span>
              </span>
            </div>

            {activeCat.toUpperCase() !== "ALL" && (
              <button
                onClick={() => setActiveCat("ALL")}
                className="text-xs font-extrabold text-stone-400 hover:text-stone-700 underline cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Loading & Empty States */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div
                style={{ borderColor: activeSettings.primaryColor, borderTopColor: 'transparent' }}
                className="w-8 h-8 border-4 rounded-full animate-spin mx-auto"
              />
              <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                Loading online menu items...
              </p>
            </div>
          ) : dishes.length === 0 ? (
            <div className="py-20 text-center space-y-4 max-w-md mx-auto px-4 bg-white rounded-3xl border border-stone-200/90 shadow-sm mt-6">
              <div className="w-16 h-16 rounded-full bg-stone-100 grid place-items-center mx-auto text-stone-400">
                <UtensilsCrossed size={32} />
              </div>
              <h3 className="font-display text-xl font-bold text-stone-800">No Menu Items Available</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                We couldn't find any active menu items for this outlet right now. Please check back soon or tap below to refresh.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-full shadow-md hover:bg-stone-800 transition cursor-pointer"
              >
                Refresh Menu
              </button>
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="py-16 text-center space-y-3 max-w-md mx-auto px-4 bg-white rounded-3xl border border-stone-200/90 shadow-sm mt-6">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 grid place-items-center mx-auto">
                <Search size={24} />
              </div>
              <h3 className="font-display text-lg font-bold text-stone-800">No dishes match your filter</h3>
              <p className="text-xs text-stone-500">
                Try searching for something else or clearing your active category/veg filter.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setVegOnly(false); setActiveCat("ALL"); }}
                className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-md hover:bg-emerald-700 transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* GROUP DISHES BY CATEGORY WHEN activeCat IS ALL AND NO SEARCH QUERY */
            (() => {
              const renderDishCard = (item) => {
                const qty = getItemQty(item.id);
                return (
                  <article key={item.id} className="group flex flex-col gap-2.5 sm:gap-4 bg-white rounded-2xl p-2.5 sm:p-4 border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-200">
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getCategoryImage(item.category, item.product_name);
                        }}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {!activeSettings.hideFoodType && (
                        <div className="absolute top-2 left-2 flex flex-wrap items-center gap-1">
                          {item.is_veg ? (
                            <span className="rounded-full bg-emerald-600 text-white px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                              <Leaf className="h-2.5 w-2.5" /> Veg
                            </span>
                          ) : (
                            <span className="rounded-full bg-stone-900 text-white px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                              Non-Veg
                            </span>
                          )}
                        </div>
                      )}

                      {qty === 0 ? (
                        <button
                          onClick={(e) => addToCart(item, e)}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = activeSettings.primaryColor}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
                          className="absolute bottom-2 right-2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white text-stone-900 grid place-items-center shadow-md hover:text-white transition-colors active:scale-95 cursor-pointer"
                        >
                          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      ) : (
                        <div className="absolute bottom-2 right-2 flex items-center gap-0.5 sm:gap-1 bg-stone-900 text-white rounded-full p-0.5 sm:p-1 shadow-lg">
                          <button
                            onClick={(e) => removeFromCart(item.id, e)}
                            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-stone-800 text-white grid place-items-center hover:bg-rose-600 transition-colors cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-1.5 text-xs font-bold">{qty}</span>
                          <button
                            onClick={(e) => addToCart(item, e)}
                            style={{ backgroundColor: activeSettings.primaryColor }}
                            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full text-white grid place-items-center hover:brightness-110 transition-colors cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-3">
                          <h3
                            className="font-display text-xs sm:text-base font-bold text-stone-900 leading-snug transition-colors line-clamp-2"
                            onMouseEnter={(e) => e.currentTarget.style.color = activeSettings.primaryColor}
                            onMouseLeave={(e) => e.currentTarget.style.color = "#1c1917"}
                          >
                            {item.product_name}
                          </h3>
                          <span
                            style={{ color: activeSettings.primaryColor }}
                            className="font-black shrink-0 text-xs sm:text-base"
                          >
                            {item.option_groups && item.option_groups.length > 0 ? (
                              <span className="text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-wider">
                                Customizable
                              </span>
                            ) : (
                              `${currencySymbol}${item.price}`
                            )}
                          </span>
                        </div>
                        {activeSettings.showDescription && (
                          <p className="mt-1 text-[11px] sm:text-xs text-stone-500 leading-relaxed line-clamp-2 hidden sm:block">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              };

              if (activeCat.toUpperCase() === "ALL" && !searchQuery) {
                const grouped = filteredDishes.reduce((acc, item) => {
                  const cat = item.category && item.category.trim() ? item.category.trim() : "General";
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(item);
                  return acc;
                }, {});

                return (
                  <div className="mt-6 space-y-10">
                    {Object.entries(grouped).map(([catName, itemsInCat]) => (
                      <section key={catName} className="space-y-4">
                        {/* Category Header */}
                        <div className="flex items-center gap-3 border-b border-stone-200/80 pb-3">
                          <div
                            style={{ backgroundColor: activeSettings.primaryColor }}
                            className="w-2.5 h-6 rounded-full shrink-0 shadow-xs"
                          />
                          <h2 className="font-display text-xl sm:text-2xl font-black text-stone-900 uppercase tracking-tight">
                            {catName}
                          </h2>
                          <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200/80">
                            {itemsInCat.length} {itemsInCat.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>

                        {/* Category Dishes Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                          {itemsInCat.map(renderDishCard)}
                        </div>
                      </section>
                    ))}
                  </div>
                );
              }

              return (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                  {filteredDishes.map(renderDishCard)}
                </div>
              );
            })()
          )}
        </main>
      )}

      {/* FLOATING CART PILL BAR */}
      <AnimatePresence>
        {totalItems > 0 && !isCartOpen && (
          <motion.button
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md text-white rounded-full pl-5 pr-2 py-2 flex items-center justify-between shadow-2xl transition-colors active:scale-[0.98]"
            style={{ backgroundColor: activeSettings.primaryColor || '#10b981' }}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag size={18} />
              <div className="text-left">
                <p className="text-xs font-bold">{totalItems} item{totalItems > 1 ? "s" : ""} in cart</p>
                <p className="text-[10px] text-stone-300 font-medium">Subtotal: {currencySymbol}{subtotal}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold bg-white/10 px-4 py-2 rounded-full">
              <span>Checkout</span>
              <ArrowRight size={14} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* FLOATING CIRCULAR CATEGORIES MENU BUTTON (DYNAMICALLY SHIFTED UP WHEN CART BAR IS ACTIVE) */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsCategoryDrawerOpen(true)}
        style={{
          backgroundColor: activeSettings.primaryColor || '#10b981',
          borderRadius: '50%',
          width: '52px',
          height: '52px',
          boxSizing: 'border-box'
        }}
        className={`fixed z-50 transition-all duration-300 ${totalItems > 0 && !isCartOpen
            ? "bottom-[148px] right-5 sm:bottom-[156px] sm:right-6"
            : "bottom-[76px] right-5 sm:bottom-[84px] sm:right-6"
          } text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 group border-2 border-white/30 cursor-pointer overflow-hidden select-none shrink-0`}
        title="Browse Menu Categories"
      >
        <UtensilsCrossed size={22} className="text-white stroke-[2.5]" />
        <span className="absolute right-16 bg-stone-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-stone-800">
          Browse Categories
        </span>
      </div>

      {/* CATEGORIES SELECTION MODAL SHEET */}
      <AnimatePresence>
        {isCategoryDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[80vh] flex flex-col border border-stone-200"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed size={18} style={{ color: activeSettings.primaryColor }} />
                  <h3 className="font-display text-lg font-black text-stone-900">Food Categories</h3>
                </div>
                <button
                  onClick={() => setIsCategoryDrawerOpen(false)}
                  className="h-8 w-8 rounded-full text-stone-500 hover:text-stone-900 bg-stone-100 grid place-items-center cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="overflow-y-auto space-y-2 flex-1 pr-1 udm-scrollbar">
                {categories.map((cat) => {
                  const isActive = activeCat === cat;
                  const displayName = cat === "ALL" ? "ALL CATEGORIES" : cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCat(cat);
                        setIsCategoryDrawerOpen(false);
                      }}
                      style={{
                        backgroundColor: isActive ? `${activeSettings.primaryColor}15` : '#f5f5f4',
                        borderColor: isActive ? activeSettings.primaryColor : 'transparent',
                        color: isActive ? activeSettings.primaryColor : '#292524',
                      }}
                      className="w-full px-4 py-3 rounded-2xl flex items-center justify-between font-display text-xs font-black uppercase tracking-wider transition-all border text-left cursor-pointer hover:brightness-95"
                    >
                      <span>{displayName}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING WHATSAPP BUTTON (DYNAMICALLY SHIFTED UP WHEN CART BAR IS ACTIVE) */}
      {(activeSettings.whatsappNo || activeSettings.contactNo) && (
        <a
          href={(() => {
            let raw = (activeSettings.whatsappNo || activeSettings.contactNo || '').replace(/[^0-9]/g, '');
            if (raw.length === 10) raw = '91' + raw;
            return `https://wa.me/${raw}?text=Hi!%20I%20want%20to%20inquire%20about%20ordering.`;
          })()}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            borderRadius: '50%',
            width: '52px',
            height: '52px',
            boxSizing: 'border-box'
          }}
          className={`fixed z-50 transition-all duration-300 ${totalItems > 0 && !isCartOpen
              ? "bottom-[84px] right-5 sm:bottom-[92px] sm:right-6"
              : "bottom-5 right-5 sm:bottom-6 sm:right-6"
            } bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-600/40 hover:scale-110 active:scale-95 group border-2 border-white/30 cursor-pointer overflow-hidden shrink-0`}
          title="Direct WhatsApp Chat"
        >
          <WhatsAppIcon size={26} className="text-white fill-white" />
          <span className="absolute right-16 bg-stone-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-stone-800">
            Chat on WhatsApp
          </span>
        </a>
      )}

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200"
            >
              <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <div>
                  <h3 className="font-display text-lg font-bold text-stone-900">Your Order Cart</h3>
                  <p className="text-[11px] font-bold text-stone-600">
                    {selectedTableNumber || fulfillmentMode === "DINE_IN"
                      ? `🍽️ Table Dine-In (Table ${selectedTableNumber || "1"})`
                      : (fulfillmentMode === "DELIVERY" ? "🛵 Home Delivery" : "🛍️ Self Takeaway")}
                  </p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="h-8 w-8 rounded-full bg-stone-200 grid place-items-center">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* 📋 CURRENT SESSION ORDERS (ALL KOTs PLACED UNTIL BILL IS PAID) */}
                {(() => {
                  const sessionOrdersList = tableStatusData?.session_orders && tableStatusData.session_orders.length > 0 
                    ? tableStatusData.session_orders 
                    : (activeTableOrder ? [activeTableOrder] : (activeTableItems.length > 0 ? [{ id: 'active-kot', order_reference: `Table ${selectedTableNumber} KOT`, items: activeTableItems, status: activeTableOrder?.status || 'SAVED' }] : []));

                  if (sessionOrdersList.length === 0) return null;

                  const totalSessionSubtotal = sessionOrdersList.reduce((sum, ord) => {
                    if (ord.total_price && parseFloat(ord.total_price) > 0) return sum + parseFloat(ord.total_price);
                    const itemsArr = Array.isArray(ord.items) ? ord.items : (typeof ord.items === 'string' ? JSON.parse(ord.items || '[]') : []);
                    return sum + itemsArr.reduce((iSum, i) => iSum + (parseFloat(i.price || 0) * (parseInt(i.qty || i.quantity) || 1)), 0);
                  }, 0);

                  return (
                    <div className="bg-amber-50/90 rounded-2xl p-4 border-2 border-amber-200 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-700 animate-pulse" />
                          <span className="text-xs font-black text-amber-950 uppercase tracking-tight">
                            Current Session Orders ({sessionOrdersList.length} {sessionOrdersList.length === 1 ? 'KOT' : 'KOTs'})
                          </span>
                        </div>
                        <span className="text-xs font-mono font-black text-amber-900">{currencySymbol}{totalSessionSubtotal.toFixed(2)}</span>
                      </div>

                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {sessionOrdersList.map((sOrder, sIdx) => {
                          const sItems = Array.isArray(sOrder.items) ? sOrder.items : (typeof sOrder.items === 'string' ? JSON.parse(sOrder.items || '[]') : []);
                          const sRef = sOrder.order_reference || sOrder.bill_no || `KOT #${sIdx + 1}`;
                          const sTime = sOrder.created_at ? new Date(sOrder.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                          const sStatus = sOrder.status || 'PROCESSING';
                          const sSubtotal = parseFloat(sOrder.total_price || 0) || sItems.reduce((acc, i) => acc + (parseFloat(i.price || 0) * (parseInt(i.qty || i.quantity) || 1)), 0);

                          return (
                            <div key={sIdx} className="bg-white border border-amber-200/90 p-3 rounded-xl space-y-2 shadow-2xs">
                              <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-stone-900 text-xs">{sRef}</span>
                                  {sTime && <span className="text-[10px] text-stone-400 font-semibold">• {sTime}</span>}
                                </div>
                                {getKOTStatusBadge(sStatus, sStatus)}
                              </div>

                              <div className="space-y-1">
                                {sItems.map((sItem, sItemIdx) => (
                                  <div key={sItemIdx} className="flex items-center justify-between text-xs py-0.5">
                                    <div className="flex items-center gap-2 min-w-0 pr-2">
                                      <span className="w-4 h-4 bg-amber-100 text-amber-900 rounded font-black text-[10px] flex items-center justify-center shrink-0">
                                        {sItem.qty || sItem.quantity || 1}x
                                      </span>
                                      <span className="font-bold text-stone-800 truncate">{sItem.product_name || sItem.name}</span>
                                    </div>
                                    <span className="font-mono font-bold text-stone-900 shrink-0">
                                      {currencySymbol}{((parseFloat(sItem.price) || 0) * (parseInt(sItem.qty || sItem.quantity) || 1)).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div className="pt-1.5 border-t border-amber-100 flex justify-between items-center text-[11px] font-bold text-amber-900">
                                <span>KOT Subtotal:</span>
                                <span className="font-mono font-black">{currencySymbol}{sSubtotal.toFixed(2)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* 🛒 NEW CART ITEMS TO ADD */}
                <div className="space-y-3">
                  {cart.length > 0 && (activeTableItems.length > 0 || (tableStatusData?.session_orders && tableStatusData.session_orders.length > 0)) && (
                    <div className="flex items-center gap-1.5 text-xs font-black text-stone-800 uppercase tracking-tight pt-1">
                      <Plus className="w-4 h-4 text-emerald-600" /> New Items to Add to Order
                    </div>
                  )}

                  {cart.length === 0 ? (
                    <div className="py-12 text-center space-y-3">
                      <div className="h-14 w-14 rounded-full bg-stone-100 grid place-items-center mx-auto text-stone-400">
                        <ShoppingBag size={24} />
                      </div>
                      <h4 className="font-display text-base font-bold text-stone-800">No new items added to cart yet</h4>
                      <p className="text-xs text-stone-500">Browse the menu to select additional dishes for your table.</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                        <img src={item.image_url} alt={item.product_name} className="h-14 w-14 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 truncate">{item.product_name}</h4>
                          <p className="text-xs font-bold mt-0.5" style={{ color: activeSettings.primaryColor || '#10b981' }}>{currencySymbol}{item.price * item.qty}</p>
                        </div>

                        <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-full p-1">
                          <button onClick={() => removeFromCart(item.id)} className="h-6 w-6 rounded-full bg-stone-100 text-stone-700 grid place-items-center cursor-pointer">
                            <Minus size={10} />
                          </button>
                          <span className="px-1.5 text-xs font-bold">{item.qty}</span>
                          <button
                            onClick={() => addToCart(item)}
                            style={{ backgroundColor: activeSettings.primaryColor || '#10b981' }}
                            className="h-6 w-6 rounded-full text-white grid place-items-center cursor-pointer hover:brightness-95 transition"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-4">
                  {/* Order Type Toggle inside Cart Drawer */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 block">Select Order Type</label>
                    {selectedTableNumber ? (
                      <div className="bg-slate-900 text-white p-3 rounded-2xl flex items-center justify-between shadow-xs border border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs font-black uppercase tracking-wider">Table {selectedTableNumber} Dine-In</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">Table Lock</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 bg-stone-200/80 p-1 rounded-2xl border border-stone-300">
                        <button
                          type="button"
                          onClick={() => setFulfillmentMode("DELIVERY")}
                          style={fulfillmentMode === "DELIVERY" ? { backgroundColor: activeSettings.primaryColor || '#10b981' } : {}}
                          className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${fulfillmentMode === "DELIVERY" ? "text-white shadow-md" : "text-stone-700 hover:text-stone-900"
                            }`}
                        >
                          <Bike size={15} /> Home Delivery
                        </button>
                        <button
                          type="button"
                          onClick={() => setFulfillmentMode("PICKUP")}
                          className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${fulfillmentMode === "PICKUP" ? "bg-stone-900 text-white shadow-md" : "text-stone-700 hover:text-stone-900"
                            }`}
                        >
                          <PickupIcon size={15} /> Pickup / Takeaway
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-xs font-semibold text-stone-600">
                    {(() => {
                      const sessionOrdersList = tableStatusData?.session_orders && tableStatusData.session_orders.length > 0 
                        ? tableStatusData.session_orders 
                        : (activeTableOrder ? [activeTableOrder] : []);

                      const totalSessionSubtotal = sessionOrdersList.reduce((sum, ord) => {
                        if (ord.total_price && parseFloat(ord.total_price) > 0) return sum + parseFloat(ord.total_price);
                        const itemsArr = Array.isArray(ord.items) ? ord.items : (typeof ord.items === 'string' ? JSON.parse(ord.items || '[]') : []);
                        return sum + itemsArr.reduce((iSum, i) => iSum + (parseFloat(i.price || 0) * (parseInt(i.qty || i.quantity) || 1)), 0);
                      }, 0);

                      const effectivePrevSubtotal = totalSessionSubtotal > 0 ? totalSessionSubtotal : previousKOTSubtotal;

                      return (
                        <>
                          {effectivePrevSubtotal > 0 && (
                            <div className="flex justify-between text-amber-900 font-bold bg-amber-100/60 p-2 rounded-xl border border-amber-200/80">
                              <span>Previous Session Orders Subtotal</span>
                              <span className="font-mono">{currencySymbol}{effectivePrevSubtotal.toFixed(2)}</span>
                            </div>
                          )}

                          <div className="flex justify-between">
                            <span>New Cart Items Subtotal</span>
                            <span className="text-stone-900 font-bold">{currencySymbol}{subtotal.toFixed(2)}</span>
                          </div>

                          {/* GST Displayed ONLY if Enabled in Back Office */}
                          {isGstEnabled && (
                            <div className="flex justify-between">
                              <span>GST ({gstRate}%)</span>
                              <span className="text-stone-900 font-bold">{currencySymbol}{taxes.toFixed(2)}</span>
                            </div>
                          )}

                          <div className="flex justify-between pt-2 border-t border-stone-200 text-base font-black text-stone-900">
                            <span>{effectivePrevSubtotal > 0 ? "Grand Combined Bill" : "Total Amount"}</span>
                            <span style={{ color: activeSettings.primaryColor || '#10b981' }}>{currencySymbol}{(effectivePrevSubtotal + subtotal + (isGstEnabled ? taxes : 0)).toFixed(2)}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <button
                    onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                    style={{ backgroundColor: activeSettings.primaryColor || '#10b981' }}
                    className="w-full py-4 rounded-full text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer hover:brightness-95 transition"
                  >
                    <span>{selectedTableNumber ? "Proceed to Table Order" : "Proceed to Delivery Details"}</span> <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ONLINE CHECKOUT MODAL */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/75 backdrop-blur-md overflow-y-auto p-3 sm:p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-2xl sm:max-w-xl md:max-w-2xl w-full rounded-3xl shadow-2xl shadow-stone-950/50 border-2 border-stone-300 overflow-hidden flex flex-col my-auto"
              style={{ maxHeight: '92dvh' }}
            >
              <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
                <div>
                  <h3 className="font-display text-xl font-bold text-stone-900">Online Order Checkout</h3>
                  <p className="text-xs text-stone-500 font-medium">Ordering from {restaurantTitle}</p>
                </div>
                <button onClick={() => setIsCheckoutOpen(false)} className="h-8 w-8 rounded-full bg-stone-200 grid place-items-center">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">

                {/* Fulfillment Selection */}
                {selectedTableNumber ? (
                  <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-sm border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-wider">Dine-In Service — Table {selectedTableNumber}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">Table Locked</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 bg-stone-100 p-1 rounded-2xl border border-stone-200">
                    <button
                      type="button"
                      onClick={() => setFulfillmentMode("DELIVERY")}
                      style={fulfillmentMode === "DELIVERY" ? { backgroundColor: activeSettings.primaryColor || '#10b981' } : {}}
                      className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${fulfillmentMode === "DELIVERY" ? "text-white shadow-md" : "text-stone-600 bg-stone-50 hover:bg-stone-200"
                        }`}
                    >
                      <Bike size={16} /> Home Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillmentMode("PICKUP")}
                      className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${fulfillmentMode === "PICKUP" ? "bg-stone-900 text-white shadow-md" : "text-stone-600"
                        }`}
                    >
                      <PickupIcon size={16} /> Takeaway
                    </button>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block">Your Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Sajad Ahmad"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#e05328]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block">Phone Number (WhatsApp) *</label>
                    <input
                      required
                      type="tel"
                      placeholder="9906123989"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#e05328]"
                    />
                  </div>
                </div>

                {fulfillmentMode === "DELIVERY" && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                          Delivery Address (Type Manually OR Pin on Map) *
                        </label>
                        <button
                          type="button"
                          onClick={handleGetCurrentLocation}
                          disabled={isLocating}
                          className="text-[11px] font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200"
                        >
                          <Navigation size={12} className={isLocating ? "animate-spin" : ""} /> {isLocating ? "Locating..." : "📍 Pin Location on Map"}
                        </button>
                      </div>

                      {/* VISUAL INTERACTIVE DRAGGABLE LEAFLET MAP DISPLAY */}
                      <InteractiveMapPicker
                        restLat={restLat}
                        restLng={restLng}
                        deliveryCoords={deliveryCoords}
                        setDeliveryCoords={setDeliveryCoords}
                        calculatedDistanceKm={calculatedDistanceKm}
                        isByDistanceMode={isByDistanceMode}
                        maxDeliveryRadiusKm={maxDeliveryRadiusKm}
                      />

                      <input
                        required
                        type="text"
                        placeholder="House / Flat No., Street, Area Name (or Auto-filled from Map)"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#e05328]"
                      />
                      <p className="text-[10px] text-stone-400 font-medium leading-tight">
                        💡 Type your delivery address manually above OR tap on the map / click "Pin Location on Map".
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block">Landmark (Optional)</label>
                        <input
                          type="text"
                          placeholder="Near Central Mosque"
                          value={form.landmark}
                          onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#e05328]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block">City / Pincode</label>
                        <input
                          type="text"
                          placeholder="Srinagar - 190001"
                          value={form.pincode}
                          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#e05328]"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 🎁 LOYALTY POINTS REDEMPTION CARD */}
                {customerLoyalty && customerLoyalty.loyalty_enabled !== false && (customerLoyalty.points || 0) > 0 && (
                  <div className="p-4 bg-amber-50/90 border-2 border-amber-300 rounded-2xl space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                        <div>
                          <p className="text-xs font-black text-amber-900 uppercase">VIP Loyalty Rewards</p>
                          <p className="text-[10px] text-amber-700 font-bold">You have {customerLoyalty.points} Points Available</p>
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs">
                        <input
                          type="checkbox"
                          checked={isLoyaltyRedeemed}
                          onChange={(e) => setIsLoyaltyRedeemed(e.target.checked)}
                          className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500 cursor-pointer"
                        />
                        <span className="text-xs font-extrabold text-amber-900">Redeem Points</span>
                      </label>
                    </div>

                    {isLoyaltyRedeemed && (
                      <div className="pt-2 border-t border-amber-200/80 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-800">Points to Redeem:</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={customerLoyalty.min_redeem_points || 1}
                              max={Math.min(customerLoyalty.points, customerLoyalty.max_redeem_per_order || 500, Math.floor(subtotal / (customerLoyalty.points_to_amount_ratio || 1)))}
                              value={redeemedPointsInput}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                const minPts = customerLoyalty.min_redeem_points || 1;
                                const maxPts = Math.min(customerLoyalty.points, customerLoyalty.max_redeem_per_order || 500, Math.floor(subtotal / (customerLoyalty.points_to_amount_ratio || 1)));
                                setRedeemedPointsInput(Math.max(0, Math.min(val, maxPts)));
                              }}
                              className="w-20 px-2 py-1 bg-white border border-amber-300 rounded-lg text-center font-bold text-amber-900 outline-none"
                            />
                            <span className="font-bold text-amber-700">Pts</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs font-black text-amber-900 pt-1">
                          <span>Discount Applied:</span>
                          <span className="text-emerald-700">- {currencySymbol}{loyaltyDiscount}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Payment Method Selection (Fetched Dynamically from Backoffice) */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block">Select Payment Method</label>
                  <div className={`grid gap-2 ${allowedPaymentMethods.length > 2 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {allowedPaymentMethods.map((pm) => (
                      <button
                        key={pm.key}
                        type="button"
                        onClick={() => setForm({ ...form, paymentMethod: pm.key })}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${form.paymentMethod === pm.key
                            ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                          }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>

                  {/* UPI QR CODE DISPLAY BOX WHEN UPI PAYMENT IS SELECTED (ONLY IF LOCATION IS SERVICEABLE) */}
                  {form.paymentMethod === "UPI" && (fulfillmentMode !== "DELIVERY" || isLocationServiceable) && (
                    <div className="mt-3 p-4 bg-emerald-50/90 border-2 border-emerald-500/30 rounded-2xl text-center space-y-3 shadow-inner">
                      <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-extrabold text-xs uppercase tracking-wider">
                        <Sparkles size={16} className="text-emerald-600 animate-pulse" />
                        <span>Scan UPI QR Code to Pay {currencySymbol}{grandTotal}</span>
                      </div>

                      <div className="bg-white p-2.5 rounded-2xl shadow-md border border-stone-200 inline-block mx-auto">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`upi://pay?pa=${onlineOrderUpiId || businessData?.settings?.upi_id || "9906123989@okbizaxis"}&pn=${encodeURIComponent(restaurantTitle)}&am=${grandTotal}&tn=FoodOrder&cu=INR`)}`}
                          alt="UPI QR Code"
                          className="w-44 h-44 mx-auto rounded-xl object-contain"
                        />
                        <p className="mt-1 text-[10px] font-bold text-stone-500">Google Pay · PhonePe · Paytm · BHIM</p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                        <a
                          href={`upi://pay?pa=${onlineOrderUpiId || businessData?.settings?.upi_id || "9906123989@okbizaxis"}&pn=${encodeURIComponent(restaurantTitle)}&am=${grandTotal}&tn=FoodOrder&cu=INR`}
                          className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                        >
                          📱 Open UPI App ({currencySymbol}{grandTotal})
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            const upiIdStr = onlineOrderUpiId || businessData?.settings?.upi_id || "9906123989@okbizaxis";
                            navigator.clipboard.writeText(upiIdStr);
                            showToast("UPI ID Copied: " + upiIdStr);
                          }}
                          className="w-full sm:w-auto px-3.5 py-2 bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs rounded-xl border border-stone-300 transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Copy size={13} /> Copy UPI ID
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery Serviceability & Min Order Warnings */}
                {fulfillmentMode === "DELIVERY" && !isLocationServiceable && (
                  <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-xs text-rose-800 font-extrabold space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-2 text-rose-700 font-black text-sm">
                      <AlertTriangle size={18} className="shrink-0 text-rose-600 animate-bounce" />
                      <span>Delivery Not Available For This Location</span>
                    </div>
                    <p className="text-[11px] font-semibold text-rose-700 leading-normal">
                      Your pinned location is <strong>{calculatedDistanceKm.toFixed(1)} KM</strong> away, which exceeds our maximum delivery radius of <strong>{maxDeliveryRadiusKm} KM</strong>.
                    </p>
                    <p className="text-[10px] text-rose-600 font-bold">
                      🚫 Payment QR code & order placement are hidden for unserviceable areas. Please select <strong>Takeaway / Pickup</strong> or drag the map pin to an address inside our delivery zone.
                    </p>
                  </div>
                )}

                {fulfillmentMode === "DELIVERY" && !isMinOrderMet && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 font-bold flex items-center gap-2">
                    <Sparkles size={16} className="shrink-0 text-amber-600" />
                    <span>Minimum order value for delivery is {currencySymbol}{minDeliveryOrderAmount}. Add {currencySymbol}{(minDeliveryOrderAmount - subtotal).toFixed(0)} more items!</span>
                  </div>
                )}

                {/* Order Summary & Pricing Breakdown (Tax & Delivery Info) */}
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5 text-xs font-semibold text-stone-600">
                  <div className="flex justify-between">
                    <span>Item Subtotal</span>
                    <span className="text-stone-900 font-bold">{currencySymbol}{subtotal}</span>
                  </div>

                  {isGstEnabled && (
                    <div className="flex justify-between">
                      <span>GST ({gstRate}%)</span>
                      <span className="text-stone-900 font-bold">{currencySymbol}{taxes}</span>
                    </div>
                  )}

                  {fulfillmentMode === "DELIVERY" && (
                    <div className="flex justify-between">
                      <span>Delivery Fee ({calculatedDistanceKm > 0 ? `${calculatedDistanceKm.toFixed(1)} KM` : "Local Tier"})</span>
                      <span className="text-stone-900 font-bold">
                        {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `${currencySymbol}${deliveryFee}`}
                      </span>
                    </div>
                  )}

                  {/* 🎁 Loyalty Points You'll Earn */}
                  {estimatedPointsEarn > 0 && customerLoyalty?.loyalty_enabled !== false && (
                    <div className="flex justify-between items-center pt-1 border-t border-dashed border-amber-200">
                      <span className="flex items-center gap-1 text-amber-700"><Sparkles size={13} className="text-amber-500" /> Points You'll Earn</span>
                      <span className="text-amber-700 font-black">+{estimatedPointsEarn} pts 🎁</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-stone-400 font-bold uppercase">Total Payable</p>
                    <p className="text-2xl font-black" style={{ color: activeSettings.primaryColor || '#10b981' }}>{currencySymbol}{grandTotal}</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || (fulfillmentMode === "DELIVERY" && (!isLocationServiceable || !isMinOrderMet))}
                    style={{ backgroundColor: activeSettings.primaryColor || '#10b981' }}
                    className="px-8 py-3.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-xl flex items-center gap-2 hover:brightness-95 transition cursor-pointer"
                  >
                    {isSubmitting ? "Placing Order..." : "Confirm & Place Order"} <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOMER LOGIN MODAL (WHATSAPP OTP or GUEST LOGIN) */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-sm w-full rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900"
            >
              <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-stone-900 leading-tight">Customer Login</h3>
                    <p className="text-[10px] font-semibold text-stone-500">Sign in to add items & order</p>
                  </div>
                </div>
                <button onClick={() => { setIsAuthModalOpen(false); setOtpStep(1); }} className="h-8 w-8 rounded-full bg-stone-200 hover:bg-stone-300 grid place-items-center transition cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              {/* Tab switch between WhatsApp OTP and Guest */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
                  <button
                    type="button"
                    onClick={() => { setAuthMode("WHATSAPP"); setOtpStep(1); }}
                    className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${authMode === "WHATSAPP"
                        ? "bg-white text-stone-900 shadow-sm"
                        : "text-stone-500 hover:text-stone-900"
                      }`}
                  >
                    <WhatsAppIcon size={14} className="text-emerald-600" /> WhatsApp OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("GUEST")}
                    className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${authMode === "GUEST"
                        ? "bg-white text-stone-900 shadow-sm"
                        : "text-stone-500 hover:text-stone-900"
                      }`}
                  >
                    <User size={13} className="text-stone-600" /> Guest User
                  </button>
                </div>

                {authMode === "WHATSAPP" ? (
                  otpStep === 1 ? (
                    <form onSubmit={handleSendWhatsAppOtp} className="space-y-4 pt-1">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block">Full Name (Optional)</label>
                        <input
                          type="text"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block">WhatsApp Mobile Number *</label>
                        <div className="flex items-center gap-2 border border-stone-200 rounded-xl px-3 py-2.5 bg-stone-50 focus-within:border-emerald-600">
                          <span className="text-xs font-bold text-stone-500">+91</span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, ""))}
                            placeholder="9906123456"
                            className="w-full bg-transparent text-xs font-bold outline-none text-stone-900"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingOtp}
                        style={{ backgroundColor: activeSettings.primaryColor }}
                        className="w-full py-3.5 rounded-full text-white font-bold text-xs shadow-md hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <WhatsAppIcon size={16} /> {isSendingOtp ? "Sending WhatsApp OTP..." : "Get WhatsApp OTP"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center text-xs text-emerald-800 space-y-1">
                        <p className="font-bold">WhatsApp OTP Sent to +91 {authPhone}</p>
                        <p className="text-[11px] text-emerald-700">Check your WhatsApp message for your 4-digit code</p>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block text-center">4-Digit WhatsApp OTP</label>
                        <input
                          type="text"
                          required
                          maxLength={4}
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          placeholder="1234"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-center text-lg font-mono font-black tracking-[0.5em] outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setOtpStep(1)}
                          className="flex-1 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                        >
                          Change Number
                        </button>
                        <button
                          type="submit"
                          style={{ backgroundColor: activeSettings.primaryColor }}
                          className="flex-1 py-3 rounded-full text-white font-bold text-xs shadow-md hover:brightness-110 cursor-pointer"
                        >
                          Verify & Login
                        </button>
                      </div>
                    </form>
                  )
                ) : (
                  <form onSubmit={handleGuestLogin} className="space-y-4 pt-1">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-stone-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="10-digit mobile number"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-stone-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      Continue as Guest User
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOMER PROFILE MODAL (MULTI-TAB: ORDERS, BALANCE SHEET LEDGER, LOYALTY, INFO) */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: activeSettings.primaryColor }}
                    className="h-10 w-10 rounded-full text-white grid place-items-center font-black text-base shadow-sm"
                  >
                    {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-stone-900 leading-tight">
                      {profile.name || userSession?.name || "Customer Profile"}
                    </h3>
                    <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={11} /> {userSession?.authMethod === "WHATSAPP" ? "WhatsApp Verified" : "Account Verified"} ({profile.phone || userSession?.phone || "No phone"})
                    </p>
                    {(() => {
                      const netBal = parseFloat(customerLedgerData.net_balance || 0);
                      if (netBal < 0) {
                        return (
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs">
                            🔴 DUE AMOUNT: {currencySymbol}{Math.abs(netBal).toFixed(2)}
                          </span>
                        );
                      } else if (netBal > 0) {
                        return (
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                            🟢 WALLET BALANCE: {currencySymbol}{netBal.toFixed(2)}
                          </span>
                        );
                      } else {
                        return (
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-black bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs">
                            💰 WALLET BALANCE: {currencySymbol}0.00
                          </span>
                        );
                      }
                    })()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-extrabold flex items-center gap-1 border border-rose-200 transition cursor-pointer"
                    title="Log Out of Account"
                  >
                    <LogOut size={13} /> Log Out
                  </button>
                  <button onClick={() => setIsProfileOpen(false)} className="h-8 w-8 rounded-full bg-stone-200 hover:bg-stone-300 grid place-items-center transition cursor-pointer">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs Bar */}
              <div className="flex items-center gap-1 p-2 bg-stone-100 border-b border-stone-200 overflow-x-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setProfileTab("orders")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${profileTab === "orders" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
                    }`}
                >
                  <Package size={14} className="text-emerald-600" /> Past Orders ({customerOrdersList.length})
                </button>

                {/* Balance Sheet Tab */}
                <button
                  type="button"
                  onClick={() => setProfileTab("ledger")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${profileTab === "ledger" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
                    }`}
                >
                  <Tag size={14} className="text-blue-600" /> Balance Sheet
                </button>

                {/* Table Bookings Tab */}
                <button
                  type="button"
                  onClick={() => setProfileTab("reservations")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${profileTab === "reservations" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
                    }`}
                >
                  <Calendar size={14} className="text-amber-500" /> Bookings ({customerReservations.length})
                </button>

                {/* Loyalty Tab */}
                <button
                  type="button"
                  onClick={() => setProfileTab("loyalty")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${profileTab === "loyalty" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
                    }`}
                >
                  <Sparkles size={14} className="text-amber-500" /> Loyalty ({customerLoyalty?.points ?? customerLedgerData.points ?? 0} pts)
                </button>

                <button
                  type="button"
                  onClick={() => setProfileTab("info")}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 shrink-0 cursor-pointer ${profileTab === "info" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
                    }`}
                >
                  <User size={14} /> Profile
                </button>
              </div>

              {/* Tab Content Body */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                {/* TAB 1: PAST ORDERS */}
                {profileTab === "orders" && (
                  <div className="space-y-3">
                    {isLoadingProfileData ? (
                      <div className="py-12 text-center text-xs font-bold text-stone-500">Loading your past orders...</div>
                    ) : customerOrdersList.length === 0 ? (
                      <div className="py-12 text-center space-y-2">
                        <Package className="h-10 w-10 text-stone-300 mx-auto" />
                        <p className="text-xs font-bold text-stone-600">No past orders found for this number.</p>
                        <button
                          onClick={() => { setIsProfileOpen(false); setActiveNav("menu"); }}
                          style={{ backgroundColor: activeSettings.primaryColor }}
                          className="px-4 py-2 rounded-full text-white text-xs font-bold shadow-md cursor-pointer mt-2"
                        >
                          Browse Menu & Order Now
                        </button>
                      </div>
                    ) : (
                      customerOrdersList.map((ord) => {
                        const itemsArr = Array.isArray(ord.items) ? ord.items : (typeof ord.items === 'string' ? JSON.parse(ord.items) : []);
                        return (
                          <div key={ord.id} className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2.5 shadow-2xs">
                            <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-2">
                              <div>
                                <span className="text-xs font-black text-stone-900">Ref: {ord.order_reference}</span>
                                <p className="text-[10px] text-stone-500">{new Date(ord.created_at).toLocaleString()}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  {ord.status || "Received"}
                                </span>

                                {/* Live Payment Status Badge */}
                                {(() => {
                                  const pStatus = String(ord.payment_status || 'PENDING').toUpperCase();
                                  if (pStatus === 'RECEIVED' || pStatus === 'PAID' || pStatus === 'VERIFIED') {
                                    return (
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                                        🟢 Payment Verified: Received
                                      </span>
                                    );
                                  }
                                  if (pStatus === 'NOT_RECEIVED' || pStatus === 'UNPAID') {
                                    return (
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-300">
                                        🔴 Payment Status: Not Received
                                      </span>
                                    );
                                  }
                                  if (pStatus.includes('CUSTOMER') || pStatus.includes('CLAIM')) {
                                    return (
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                                        🟡 Payment Claimed — Awaiting Verification
                                      </span>
                                    );
                                  }
                                  return (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-stone-200 text-stone-700 border border-stone-300">
                                      ⏳ Payment Pending
                                    </span>
                                  );
                                })()}
                            </div>
                          </div>

                            {/* Prominent Payment & Order Status Banner */}
                            {(() => {
                              const oStatus = String(ord.status || '').toUpperCase();
                              const pStatus = String(ord.payment_status || 'PENDING').toUpperCase();
                              
                              if (oStatus.includes('CANCEL')) {
                                return (
                                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between shadow-2xs">
                                    <span className="flex items-center gap-1.5">
                                      <span>✖</span>
                                      <span>Order Cancelled by Restaurant</span>
                                    </span>
                                    {(ord.rejection_reason || ord.reason) && (
                                      <span className="text-[10px] font-semibold opacity-90 truncate max-w-[140px]">({ord.rejection_reason || ord.reason})</span>
                                    )}
                                  </div>
                                );
                              }

                              if (pStatus === 'RECEIVED' || pStatus === 'PAID' || pStatus === 'VERIFIED') {
                                return (
                                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-black flex items-center gap-2 shadow-2xs">
                                    <span>🟢</span>
                                    <span>Online Payment Status: VERIFIED & RECEIVED ✅</span>
                                  </div>
                                );
                              }

                              return null;
                            })()}

                            {/* 📍 VISUAL LIVE ORDER TRACKING STEPPER */}
                            {(() => {
                              const oStatus = String(ord.status || '').toUpperCase();
                              if (['REJECTED', 'CANCELLED'].includes(oStatus)) return null;

                              const stages = [
                                { key: 'RECEIVED', label: 'Received', icon: '📥' },
                                { key: 'PREPARING', label: 'Preparing', icon: '👨‍🍳' },
                                { key: 'READY', label: 'Ready to Serve', icon: '🍽️' },
                                { key: 'SERVED', label: 'Served / Settled', icon: '✨' }
                              ];

                              let currentStageIndex = 0;
                              if (['PROCESSING', 'PREPARING', 'ACKNOWLEDGED'].includes(oStatus)) currentStageIndex = 1;
                              else if (['FOOD_READY', 'READY'].includes(oStatus)) currentStageIndex = 2;
                              else if (['DISPATCHED', 'SERVED', 'COMPLETED', 'SETTLED', 'PAID'].includes(oStatus)) currentStageIndex = 3;

                              return (
                                <div className="p-3 bg-white border border-stone-200 rounded-2xl space-y-2 shadow-2xs my-2">
                                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-stone-500 tracking-wider">
                                    <span>Live Order Stage</span>
                                    <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                      <span>{stages[currentStageIndex]?.label}</span>
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-4 gap-1 relative pt-1">
                                    {stages.map((stage, sIdx) => {
                                      const isActive = sIdx <= currentStageIndex;
                                      const isCurrent = sIdx === currentStageIndex;
                                      return (
                                        <div key={stage.key} className="flex flex-col items-center text-center">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                            isCurrent ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 scale-110 shadow-sm' :
                                            isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-stone-100 text-stone-400'
                                          }`}>
                                            {stage.icon}
                                          </div>
                                          <span className={`text-[9px] font-black mt-1.5 leading-tight ${isActive ? 'text-stone-900' : 'text-stone-400'}`}>
                                            {stage.label}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })()}

                            <div className="space-y-1 text-xs text-stone-700">
                              {itemsArr.map((i, idx) => (
                                <div key={idx} className="flex justify-between font-medium">
                                  <span>{i.qty || 1}x {i.product_name || i.name}</span>
                                  <span className="font-bold">{currencySymbol}{((i.qty || 1) * (i.price || 0)).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>

                            <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                              <span className="text-xs font-bold text-stone-500">Total Paid:</span>
                              <span className="text-sm font-black text-emerald-600">{currencySymbol}{ord.total_price}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* TAB 2: BALANCE SHEET & CREDIT/DEBIT LEDGER */}
                {profileTab === "ledger" && (
                  <div className="space-y-4">
                    {/* Summary Balance Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      {(() => {
                        const netBal = parseFloat(customerLedgerData.net_balance || 0);
                        const isDue = netBal < 0;
                        const isAdv = netBal > 0;
                        return (
                          <div className={`p-3 rounded-2xl border ${isDue ? 'bg-rose-100 border-rose-300 text-rose-900' : (isAdv ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-stone-100 border-stone-200 text-stone-700')}`}>
                            <p className="text-[9px] font-black uppercase tracking-wider">{isDue ? 'Due Amount' : (isAdv ? 'Advance Credit' : 'Net Balance')}</p>
                            <p className="text-base font-black">{currencySymbol}{Math.abs(netBal).toFixed(2)}</p>
                          </div>
                        );
                      })()}

                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
                        <p className="text-[9px] font-black uppercase text-emerald-700">Total Credits</p>
                        <p className="text-base font-black text-emerald-800">{currencySymbol}{customerLedgerData.total_credit || 0}</p>
                      </div>

                      <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl">
                        <p className="text-[9px] font-black uppercase text-rose-700">Total Debits</p>
                        <p className="text-base font-black text-rose-800">{currencySymbol}{customerLedgerData.total_debit || 0}</p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl">
                        <p className="text-[9px] font-black uppercase text-blue-700">Total Spent</p>
                        <p className="text-base font-black text-blue-800">{currencySymbol}{customerLedgerData.total_spent || 0}</p>
                      </div>
                    </div>

                    {/* Detailed Transactions List */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase text-stone-500 tracking-wider">Account Statement & Transactions</h4>
                      {isLoadingProfileData ? (
                        <div className="py-8 text-center text-xs text-stone-500">Loading ledger data...</div>
                      ) : customerLedgerData.transactions.length === 0 ? (
                        <div className="py-6 text-center text-xs text-stone-500">No transaction records found.</div>
                      ) : (
                        <div className="space-y-2">
                          {customerLedgerData.transactions.map((tx, txIdx) => {
                            const isCredit = String(tx.type || "").toUpperCase().includes("CREDIT") || String(tx.type || "").toUpperCase().includes("EARNED") || String(tx.type || "").toUpperCase().includes("REFUND");
                            const isExpanded = expandedTxIdx === txIdx;
                            const ord = tx.order_details;
                            const displayAmt = (parseFloat(tx.amount || 0) > 0) ? tx.amount : (tx.bill_amount && parseFloat(tx.bill_amount) > 0 ? tx.bill_amount : '0.00');

                            return (
                              <div
                                key={txIdx}
                                onClick={() => setExpandedTxIdx(isExpanded ? null : txIdx)}
                                className="bg-stone-50 border border-stone-200 hover:border-stone-300 p-3.5 rounded-2xl space-y-2 cursor-pointer transition-all shadow-2xs group"
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${isCredit ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-stone-200 text-stone-800 border border-stone-300'}`}>
                                        {isCredit ? 'CREDIT (+)' : 'DEBIT (-)'}
                                      </span>
                                      <span className="font-extrabold text-stone-900 truncate max-w-[200px]">{tx.reason || 'Order Transaction'}</span>
                                    </div>
                                    <p className="text-[10px] text-stone-400 font-semibold flex items-center gap-1">
                                      <span>{new Date(tx.created_at).toLocaleString()}</span>
                                      {ord && <span className="text-[#e05328] font-bold">• Tap to view bill</span>}
                                    </p>
                                  </div>

                                  <div className="text-right shrink-0">
                                    <span className={`text-sm font-black ${isCredit ? 'text-emerald-600' : 'text-stone-900'}`}>
                                      {isCredit ? '+' : '-'}{currencySymbol}{displayAmt}
                                    </span>
                                    {tx.points > 0 && (
                                      <p className="text-[10px] font-bold text-amber-600">+{tx.points} pts</p>
                                    )}
                                    <p className="text-[9px] font-extrabold text-[#e05328] group-hover:underline">
                                      {isExpanded ? 'Hide Details ▲' : 'View Bill Details ▼'}
                                    </p>
                                  </div>
                                </div>

                                {/* EXPANDABLE BILL INVOICE DETAILS */}
                                {isExpanded && (
                                  <div className="pt-3 border-t border-stone-200 space-y-3 bg-white p-3.5 rounded-xl border border-stone-200 shadow-inner animate-in fade-in duration-200">
                                    {ord ? (
                                      <>
                                        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                                          <div>
                                            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">TAX INVOICE RECEIPT</span>
                                            <h5 className="text-xs font-black text-stone-900">Bill #{ord.bill_no || ord.order_reference || ord.id}</h5>
                                          </div>
                                          <div className="text-right">
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-black text-[9px] uppercase border border-emerald-200">
                                              {ord.payment_status || 'PAID'} • {ord.payment_method || 'CASH'}
                                            </span>
                                            <p className="text-[9px] text-stone-400 font-semibold mt-0.5">{new Date(ord.created_at).toLocaleString()}</p>
                                          </div>
                                        </div>

                                        {/* Items breakdown */}
                                        <div className="space-y-1">
                                          <p className="text-[10px] font-black text-stone-500 uppercase tracking-wider">Ordered Items</p>
                                          {(ord.items || []).map((it, iIdx) => (
                                            <div key={iIdx} className="flex justify-between items-center text-xs py-1 border-b border-stone-50 last:border-0">
                                              <span className="font-bold text-stone-800">
                                                {it.qty || 1}x {it.product_name || it.name || 'Item'}
                                              </span>
                                              <span className="font-black text-stone-900">
                                                {currencySymbol}{((parseFloat(it.price) || 0) * (parseInt(it.qty) || 1)).toFixed(2)}
                                              </span>
                                            </div>
                                          ))}
                                        </div>

                                        {/* Charges & Grand Total */}
                                        <div className="pt-2 border-t border-stone-100 space-y-1 text-xs">
                                          {ord.delivery_charge > 0 && (
                                            <div className="flex justify-between text-stone-500 text-[11px] font-medium">
                                              <span>Delivery Charge</span>
                                              <span>{currencySymbol}{ord.delivery_charge.toFixed(2)}</span>
                                            </div>
                                          )}
                                          {ord.discount_amount > 0 && (
                                            <div className="flex justify-between text-emerald-600 font-bold text-[11px]">
                                              <span>Discount</span>
                                              <span>-{currencySymbol}{ord.discount_amount.toFixed(2)}</span>
                                            </div>
                                          )}
                                          <div className="flex justify-between font-black text-stone-900 text-xs pt-1 border-t border-stone-200">
                                            <span>Total Bill Amount</span>
                                            <span className="text-emerald-700 text-sm font-black">{currencySymbol}{ord.total_price.toFixed(2)}</span>
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="text-xs text-stone-600 space-y-1">
                                        <p className="font-bold text-stone-900">Transaction Record Details:</p>
                                        <p className="text-[11px] text-stone-500 font-medium">Reason: {tx.reason}</p>
                                        <p className="text-[11px] text-stone-500 font-medium">Amount: {currencySymbol}{displayAmt}</p>
                                        {tx.points > 0 && <p className="text-[11px] text-amber-600 font-bold">Loyalty Points: +{tx.points} pts</p>}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB: TABLE RESERVATIONS */}
                {profileTab === "reservations" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase text-stone-500 tracking-wider">Your Table Reservations</h4>
                      <button
                        type="button"
                        onClick={() => { setIsProfileOpen(false); setIsReservationModalOpen(true); }}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-[11px] font-black shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Calendar size={12} /> Book New Table
                      </button>
                    </div>

                    {isLoadingProfileData ? (
                      <div className="py-12 text-center text-xs font-bold text-stone-500">Loading your reservations...</div>
                    ) : customerReservations.length === 0 ? (
                      <div className="py-12 text-center space-y-2">
                        <Calendar className="h-10 w-10 text-amber-300 mx-auto" />
                        <p className="text-xs font-bold text-stone-600">No table reservations found for this number.</p>
                        <button
                          type="button"
                          onClick={() => { setIsProfileOpen(false); setIsReservationModalOpen(true); }}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-full text-white text-xs font-black shadow-md cursor-pointer mt-2"
                        >
                          Book a Table Now
                        </button>
                      </div>
                    ) : (
                      customerReservations.map((resItem) => {
                        const isConfirmed = String(resItem.status).toUpperCase() === 'CONFIRMED';
                        const isSeated = String(resItem.status).toUpperCase() === 'SEATED';
                        const isCancelled = String(resItem.status).toUpperCase() === 'CANCELLED';

                        return (
                          <div key={resItem.id} className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2.5 shadow-2xs">
                            <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-2">
                              <div>
                                <span className="text-xs font-black text-amber-600">Ref: {resItem.reservation_ref}</span>
                                <p className="text-[10px] text-stone-500 font-semibold">{new Date(resItem.created_at).toLocaleString()}</p>
                              </div>
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${isConfirmed ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                                  isSeated ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                    isCancelled ? 'bg-rose-100 text-rose-800 border-rose-300' :
                                      'bg-amber-100 text-amber-800 border-amber-300'
                                }`}>
                                {resItem.status || 'PENDING'}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 font-semibold">
                              <div>
                                <span className="text-[10px] font-bold text-stone-400 uppercase block">Date & Time</span>
                                <span>{resItem.reservation_date} @ {resItem.reservation_time}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-stone-400 uppercase block">Party & Area</span>
                                <span>{resItem.guests_count} Guests • {resItem.seating_preference}</span>
                              </div>
                            </div>

                            {resItem.assigned_table_number && (
                              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between">
                                <span>Assigned Table:</span>
                                <span className="text-sm font-black">Table #{resItem.assigned_table_number}</span>
                              </div>
                            )}

                            {resItem.special_notes && (
                              <p className="text-[11px] text-stone-500 font-medium italic">
                                Note: "{resItem.special_notes}"
                              </p>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* TAB 3: LOYALTY POINTS & REWARDS */}
                {profileTab === "loyalty" && (
                  <div className="space-y-4 text-center">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-3xl p-6 shadow-lg space-y-2">
                      <Sparkles className="h-8 w-8 text-amber-200 mx-auto animate-pulse" />
                      <p className="text-xs font-extrabold uppercase tracking-widest text-amber-100">VIP Loyalty Balance</p>
                      <h2 className="text-4xl font-black">{customerLoyalty?.points ?? customerLedgerData.points ?? 0} <span className="text-lg font-bold">PTS</span></h2>
                      <p className="text-[11px] text-amber-100 font-medium">Earn points on every order & redeem directly on WhatsApp or POS checkout!</p>
                    </div>

                    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left text-xs space-y-2">
                      <p className="font-extrabold text-stone-900 uppercase">🎁 How Loyalty Works:</p>
                      <ul className="space-y-1.5 text-stone-600 list-disc list-inside">
                        <li>Earn <strong>5% cashback in points</strong> on all digital & dine-in orders.</li>
                        <li>Redeem points at checkout to get instant discounts on food.</li>
                        <li>Ask via WhatsApp to view your rewards token anytime.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* TAB 4: PERSONAL EDIT INFO & LOGOUT */}
                {profileTab === "info" && (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block">Customer Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-stone-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block">Mobile Number</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-stone-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block">Default Saved Address</label>
                      <input
                        type="text"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-stone-900"
                      />
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        type="submit"
                        className="w-full py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                      >
                        Save Profile Details
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Persistent Footer Bar with Log Out */}
              <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
                <span className="text-[11px] font-bold text-stone-500">Account: +91 {profile.phone || userSession?.phone}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer border border-rose-200 shadow-2xs"
                >
                  <LogOut size={13} /> Log Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ONLINE ORDER CONFIRMED MODAL */}
      <AnimatePresence>
        {orderConfirmed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-md w-full rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4 text-stone-900 my-auto max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="text-center space-y-2">
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-black text-stone-900">Online Order Confirmed!</h3>
                <p className="text-xs text-stone-500 font-medium">Order Ref: <span className="font-bold text-stone-800">{orderConfirmed.id}</span></p>
              </div>

              {/* Order Status Tracker */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-stone-500">Order Status</span>
                  <span className={`flex items-center gap-1.5 text-xs font-bold ${String(orderConfirmed.status || '').toUpperCase().includes('CANCEL')
                      ? 'text-rose-600'
                      : String(orderConfirmed.status || '').toUpperCase().includes('COMPLET')
                        ? 'text-emerald-700'
                        : 'text-emerald-600'
                    }`}>
                    <span className={`h-2 w-2 rounded-full ${String(orderConfirmed.status || '').toUpperCase().includes('CANCEL')
                        ? 'bg-rose-500'
                        : 'bg-emerald-500 animate-pulse'
                      }`} />
                    {orderConfirmed.status || "Received at POS Kitchen"}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-semibold text-stone-600 pt-2 border-t border-stone-200">
                  <div className="flex justify-between">
                    <span>Customer Name:</span>
                    <span className="text-stone-900 font-bold">{orderConfirmed.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fulfillment Mode:</span>
                    <span className="text-stone-900 font-bold">{orderConfirmed.mode === "DELIVERY" ? "Home Delivery" : "Takeaway / Pickup"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Address / Details:</span>
                    <span className="text-stone-900 font-bold truncate max-w-[200px]">{orderConfirmed.address}</span>
                  </div>
                  <div className="flex justify-between pt-1 text-sm font-black text-stone-900">
                    <span>Total Amount Paid:</span>
                    <span style={{ color: activeSettings.primaryColor || '#10b981' }}>{currencySymbol}{orderConfirmed.total}</span>
                  </div>

                  {/* Pinned Delivery Location Map Preview */}
                  {orderConfirmed.mode === "DELIVERY" && deliveryCoords && (
                    <div className="pt-2 border-t border-stone-200">
                      <InteractiveMapPicker
                        deliveryCoords={deliveryCoords}
                        readOnly={true}
                      />
                    </div>
                  )}
                </div>

                {/* UPI QR Code in Order Confirmed Screen */}
                {orderConfirmed.paymentMethod === "UPI" && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                      📱 Scan UPI QR Code to Complete Payment ({currencySymbol}{orderConfirmed.total})
                    </p>
                    <p className="text-[10px] text-amber-800 bg-amber-100/80 p-2 rounded-xl border border-amber-200 font-bold">
                      ⚠️ Please complete your payment first so we can accept and prepare your order!
                    </p>
                    <div className="bg-white p-2 rounded-xl inline-block border border-stone-200 shadow-sm">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${onlineOrderUpiId || businessData?.settings?.upi_id || "9906123989@okbizaxis"}&pn=${encodeURIComponent(restaurantTitle)}&am=${orderConfirmed.total}&tn=${orderConfirmed.id}&cu=INR`)}`}
                        alt="UPI Payment QR Code"
                        className="w-40 h-40 mx-auto rounded-lg object-contain"
                      />
                    </div>
                    <p className="text-[10px] text-stone-500 font-bold">Accepts Google Pay, PhonePe, Paytm, BHIM</p>

                    {/* Open UPI App deep link */}
                    <a
                      href={`upi://pay?pa=${onlineOrderUpiId || businessData?.settings?.upi_id || "9906123989@okbizaxis"}&pn=${encodeURIComponent(restaurantTitle)}&am=${orderConfirmed.total}&tn=${orderConfirmed.id}&cu=INR`}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      📱 Open UPI App to Pay {currencySymbol}{orderConfirmed.total}
                    </a>

                    {/* I Have Completed Payment Button */}
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`${API_BASE}/api/public/order/confirm-payment`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ orderRef: orderConfirmed.id })
                          });
                          const data = await res.json();
                          if (data.success) {
                            showToast("✅ Payment confirmation sent to restaurant!");
                            setOrderConfirmed(prev => ({ ...prev, paymentConfirmed: true }));
                          } else {
                            showToast(data.error || "Failed to confirm payment");
                          }
                        } catch (err) {
                          console.error("Confirm payment error:", err);
                          showToast("Network error. Please try again.");
                        }
                      }}
                      disabled={orderConfirmed.paymentConfirmed}
                      className={`w-full py-3 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 ${orderConfirmed.paymentConfirmed
                          ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300 cursor-default'
                          : 'bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-emerald-500 cursor-pointer'
                        }`}
                    >
                      {orderConfirmed.paymentConfirmed ? '✅ Payment Claimed — Staff Notified' : '💳 I Have Completed Payment'}
                    </button>
                    {!orderConfirmed.paymentConfirmed && (
                      <p className="text-[9px] text-stone-500 font-bold">Click above after making payment so staff can verify and accept your order.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="text-center text-xs text-stone-500">
                📱 Order receipt and live updates sent to <span className="font-bold text-stone-800">{orderConfirmed.phone}</span> via WhatsApp.
              </div>

              <button
                onClick={() => { setOrderConfirmed(null); setActiveNav("orders"); }}
                className="w-full py-4 rounded-full bg-stone-900 text-white font-bold text-xs shadow-xl hover:bg-stone-800"
              >
                Track in Orders Page
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MIDDLE-OF-PAGE CUSTOM POPUP MODAL (REPLACES BROWSER ALERTS & CONFIRMS) */}
      <AnimatePresence>
        {modalNotice && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-stone-200 text-center space-y-4 relative overflow-hidden"
            >
              {/* Top Accent Line matching Primary Theme */}
              <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{ backgroundColor: activeSettings.primaryColor || '#10b981' }}
              />

              <div className="pt-2">
                {modalNotice.type === 'closed' ? (
                  <div className="h-16 w-16 bg-rose-100 text-rose-600 rounded-full grid place-items-center mx-auto mb-2 shadow-inner">
                    <Clock size={32} />
                  </div>
                ) : modalNotice.type === 'confirm' ? (
                  <div className="h-16 w-16 bg-amber-100 text-amber-600 rounded-full grid place-items-center mx-auto mb-2 shadow-inner">
                    <AlertTriangle size={32} />
                  </div>
                ) : (
                  <div
                    className="h-16 w-16 rounded-full grid place-items-center mx-auto mb-2 shadow-inner"
                    style={{ backgroundColor: `${activeSettings.primaryColor || '#10b981'}20`, color: activeSettings.primaryColor || '#10b981' }}
                  >
                    <Sparkles size={32} />
                  </div>
                )}

                <h3 className="font-display text-xl font-black text-stone-900 leading-tight">
                  {modalNotice.title}
                </h3>
                <p className="text-xs text-stone-600 font-medium leading-relaxed mt-2 whitespace-pre-line">
                  {modalNotice.message}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                {modalNotice.type === 'confirm' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setModalNotice(null)}
                      className="flex-1 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-2xl transition cursor-pointer"
                    >
                      {modalNotice.cancelText || "Keep Order"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const cb = modalNotice.onConfirm;
                        setModalNotice(null);
                        if (cb) cb();
                      }}
                      className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-2xl shadow-md transition cursor-pointer"
                    >
                      {modalNotice.confirmText || "Yes, Cancel"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setModalNotice(null)}
                    style={{ backgroundColor: activeSettings.primaryColor || '#10b981' }}
                    className="w-full py-3.5 text-white text-xs font-bold rounded-2xl shadow-lg hover:brightness-95 transition cursor-pointer"
                  >
                    Understand & Close
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🍔 OPTION / VARIATION CUSTOMIZATION MODAL */}
      <AnimatePresence>
        {customizingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    Customize Item Options
                  </span>
                  <h3 className="font-display font-black text-xl text-stone-900 mt-1">
                    {customizingItem.product_name}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    Select your preferred variation below
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomizingItem(null)}
                  className="h-9 w-9 rounded-full bg-stone-200/60 hover:bg-stone-200 text-stone-600 grid place-items-center transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body: Option Groups */}
              <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
                {(customizingItem.option_groups || []).map((group) => (
                  <div key={group.id} className="space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <h4 className="font-bold text-stone-900 text-sm">
                        {group.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-stone-500">
                        {group.max_selectable === 1 ? "Select 1 option" : `Select up to ${group.max_selectable}`}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {(group.options || []).map((opt) => {
                        const currentGroupSelected = selectedOptions[group.id] || [];
                        const isSelected = currentGroupSelected.some((o) => o.id === opt.id);

                        const toggleOption = () => {
                          setSelectedOptions((prev) => {
                            const list = prev[group.id] || [];
                            if (group.max_selectable === 1) {
                              return { ...prev, [group.id]: [opt] };
                            } else {
                              if (isSelected) {
                                return { ...prev, [group.id]: list.filter((o) => o.id !== opt.id) };
                              } else {
                                if (list.length >= group.max_selectable) return prev;
                                return { ...prev, [group.id]: [...list, opt] };
                              }
                            }
                          });
                        };

                        const isVariation = !group.is_addon || group.max_selectable === 1;
                        const displayPrice = isVariation
                          ? (parseFloat(opt.price) > 0 ? parseFloat(opt.price) : parseFloat(customizingItem.price))
                          : parseFloat(opt.price);

                        return (
                          <div
                            key={opt.id}
                            onClick={toggleOption}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${isSelected
                                ? "bg-emerald-50/60 border-emerald-500 shadow-sm"
                                : "bg-stone-50/50 border-stone-200 hover:border-stone-300"
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-5 w-5 rounded-${group.max_selectable === 1 ? 'full' : 'md'} grid place-items-center border ${isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-stone-300 bg-white"
                                  }`}
                              >
                                {isSelected && <Check size={12} strokeWidth={3} />}
                              </div>
                              <span className={`font-semibold ${isSelected ? "text-emerald-950 font-bold" : "text-stone-800"}`}>
                                {opt.name}
                              </span>
                            </div>
                            <span className={`font-bold ${isSelected ? "text-emerald-800" : "text-stone-900"}`}>
                              {isVariation
                                ? `₹${displayPrice}`
                                : (displayPrice > 0 ? `+₹${displayPrice}` : "Free")
                              }
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-stone-100 bg-white flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400">Total Price</span>
                  <div className="font-display font-black text-xl text-stone-900">
                    ₹{(() => {
                      let itemBase = parseFloat(customizingItem.price) || 0;
                      let extra = 0;
                      (customizingItem.option_groups || []).forEach((g) => {
                        const selected = selectedOptions[g.id] || [];
                        if (!g.is_addon || g.max_selectable === 1) {
                          if (selected.length > 0) {
                            const mainOpt = selected[0];
                            const p = parseFloat(mainOpt.price) || 0;
                            if (p > 0) itemBase = p;
                          }
                        } else {
                          selected.forEach((o) => { extra += (parseFloat(o.price) || 0); });
                        }
                      });
                      return itemBase + extra;
                    })()}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleConfirmCustomization}
                  style={{ backgroundColor: activeSettings.primaryColor || '#10b981' }}
                  className="py-3.5 px-6 text-white text-xs font-bold rounded-2xl shadow-lg hover:brightness-95 transition cursor-pointer flex items-center gap-2"
                >
                  <span>Add Item to Order</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🍽️ TABLE RESERVATION MODAL */}
      <AnimatePresence>
        {isReservationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900 my-auto"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 grid place-items-center">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-extrabold leading-tight">Table Reservation</h3>
                    <p className="text-[11px] font-semibold text-stone-400">Book your table at {restaurantTitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setIsReservationModalOpen(false); setConfirmedReservation(null); }}
                  className="h-8 w-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 grid place-items-center transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {confirmedReservation ? (
                /* SUCCESS SCREEN WITH RESERVATION PASS */
                <div className="p-6 space-y-5 text-center">
                  <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full grid place-items-center mx-auto shadow-inner">
                    <Check className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-stone-900">Reservation Request Received!</h4>
                    <p className="text-xs font-semibold text-stone-500 mt-1">We've sent a WhatsApp confirmation to your mobile number.</p>
                  </div>

                  <div className="bg-stone-900 text-white rounded-2xl p-5 text-left space-y-3 shadow-lg relative overflow-hidden border border-amber-500/30">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest">DINING PASS</span>
                      <span className="px-2.5 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded text-[9px] font-black uppercase">
                        {confirmedReservation.status || 'PENDING'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-400 font-bold uppercase">Booking Reference</p>
                      <p className="text-lg font-black text-amber-400 tracking-wide">{confirmedReservation.reservation_ref}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-stone-800">
                      <div>
                        <p className="text-[10px] text-stone-400 font-bold uppercase">Date & Time</p>
                        <p className="font-bold">{confirmedReservation.reservation_date} @ {confirmedReservation.reservation_time}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-stone-400 font-bold uppercase">Party Size & Area</p>
                        <p className="font-bold">{confirmedReservation.guests_count} Guests • {confirmedReservation.seating_preference}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setIsReservationModalOpen(false); setConfirmedReservation(null); }}
                    style={{ backgroundColor: activeSettings.primaryColor }}
                    className="w-full py-3.5 rounded-full text-white font-extrabold text-xs shadow-md hover:brightness-95 transition cursor-pointer"
                  >
                    Done & Explore Menu
                  </button>
                </div>
              ) : (
                /* FORM STEP */
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmittingReservation(true);
                    try {
                      const pName = reservationForm.name || profile.name || userSession?.name;
                      const pPhone = reservationForm.phone || profile.phone || userSession?.phone;
                      if (!pName || !pPhone) {
                        showToast("Please enter your name and phone number");
                        setIsSubmittingReservation(false);
                        return;
                      }
                      const res = await fetch(`${API_BASE}/api/public/table-reservation`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          userId: selectedOutletId,
                          customerName: pName,
                          customerPhone: pPhone,
                          guestsCount: reservationForm.guests,
                          reservationDate: reservationForm.date,
                          reservationTime: reservationForm.time,
                          seatingPreference: reservationForm.seating,
                          specialNotes: reservationForm.notes
                        })
                      });
                      const data = await res.json();
                      if (data.success && data.reservation) {
                        setConfirmedReservation(data.reservation);
                        showToast("✅ Table reservation request sent!");
                      } else {
                        showToast(data.error || "Failed to submit table reservation");
                      }
                    } catch (err) {
                      console.error("Reservation submit error:", err);
                      showToast("Network error. Please try again.");
                    } finally {
                      setIsSubmittingReservation(false);
                    }
                  }}
                  className="p-6 space-y-4 text-xs font-semibold"
                >
                  {/* Date & Time Picker */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Reservation Date *</label>
                      <input
                        required
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={reservationForm.date}
                        onChange={(e) => {
                          const newDate = e.target.value;
                          const validSlots = getAvailableTimeSlots(newDate);
                          const currentStillValid = validSlots.some(s => s.label === reservationForm.time);
                          const nextTime = currentStillValid ? reservationForm.time : (validSlots[0]?.label || "07:00 PM");
                          setReservationForm({ ...reservationForm, date: newDate, time: nextTime });
                        }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-stone-900"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Time Slot *</label>
                      <select
                        required
                        value={reservationForm.time}
                        onChange={(e) => setReservationForm({ ...reservationForm, time: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-stone-900 cursor-pointer"
                      >
                        {(() => {
                          const availableSlots = getAvailableTimeSlots(reservationForm.date);
                          const lunchSlots = availableSlots.filter(s => s.group === 'Lunch');
                          const dinnerSlots = availableSlots.filter(s => s.group === 'Dinner');

                          if (availableSlots.length === 0) {
                            return <option value="" disabled>No available slots today (All past)</option>;
                          }

                          return (
                            <>
                              {lunchSlots.length > 0 && (
                                <optgroup label="☀️ Lunch Slots">
                                  {lunchSlots.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
                                </optgroup>
                              )}
                              {dinnerSlots.length > 0 && (
                                <optgroup label="🌙 Dinner Slots">
                                  {dinnerSlots.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
                                </optgroup>
                              )}
                            </>
                          );
                        })()}
                      </select>
                    </div>
                  </div>

                  {/* Guests Counter & Seating Preference */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Number of Guests *</label>
                      <select
                        value={reservationForm.guests}
                        onChange={(e) => setReservationForm({ ...reservationForm, guests: parseInt(e.target.value) })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-stone-900 cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Seating Area *</label>
                      <select
                        value={reservationForm.seating}
                        onChange={(e) => setReservationForm({ ...reservationForm, seating: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-stone-900 cursor-pointer"
                      >
                        {seatingAreas.length > 0 ? (
                          seatingAreas.map(area => (
                            <option key={area.id || area.name} value={area.name}>🪑 {area.name}</option>
                          ))
                        ) : (
                          <>
                            <option value="Indoor Dining">🏢 Indoor Dining</option>
                            <option value="Rooftop / Outdoor">🌌 Rooftop / Outdoor</option>
                            <option value="VIP Booth">👑 VIP Booth</option>
                            <option value="Celebration Hall">🎉 Celebration Hall</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Your Full Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="Sajad Bakshi"
                        value={reservationForm.name || profile.name}
                        onChange={(e) => setReservationForm({ ...reservationForm, name: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-stone-900"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Mobile Number (For WhatsApp Confirmation) *</label>
                      <input
                        required
                        type="tel"
                        placeholder="9906123989"
                        value={reservationForm.phone || profile.phone}
                        onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:border-stone-900"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Special Requests / Notes (Optional)</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Birthday decoration, quiet table..."
                        value={reservationForm.notes}
                        onChange={(e) => setReservationForm({ ...reservationForm, notes: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-medium outline-none focus:border-stone-900 leading-normal"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReservation}
                    style={{ backgroundColor: activeSettings.primaryColor }}
                    className="w-full py-3.5 rounded-full text-white font-extrabold text-xs shadow-xl hover:brightness-95 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                  >
                    {isSubmittingReservation ? "Submitting Booking Request..." : "Confirm & Book Table"} <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🛑 2-STEP TABLE & ONLINE ORDER VERIFICATION MODAL ("Please verify again") */}
      <AnimatePresence>
        {isVerifyingTableOrder && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-200 shrink-0">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-stone-900 uppercase tracking-tight">Please Verify Again</h3>
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                      {selectedTableNumber ? `Dine-In Table ${selectedTableNumber}` : "Online Order Summary"}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsVerifyingTableOrder(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2.5 max-h-60 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Selected Items ({cart.reduce((a,c) => a + c.qty, 0)})</span>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Price</span>
                </div>
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs font-semibold text-stone-800 py-1">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 bg-stone-200 rounded-md text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{item.qty}x</span>
                      <div>
                        <p className="font-extrabold text-stone-900 leading-tight">{item.product_name}</p>
                        {item.selected_options && item.selected_options.length > 0 && (
                          <p className="text-[10px] text-stone-500 font-medium">({item.selected_options.map(o => o.name).join(", ")})</p>
                        )}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-stone-900 shrink-0 ml-2">{currencySymbol}{(parseFloat(item.price) * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-3.5 flex items-center justify-between text-stone-900">
                <span className="text-xs font-extrabold">Grand Total Amount:</span>
                <span className="text-base font-black text-emerald-700">{currencySymbol}{grandTotal.toFixed(2)}</span>
              </div>

              <p className="text-[10px] text-stone-500 text-center font-bold uppercase tracking-wider">
                Double-check items & quantities before placing order
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsVerifyingTableOrder(false)}
                  className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-2xl transition text-center"
                >
                  ✏️ Edit Cart
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={(e) => handleCheckoutSubmit(e, true)}
                  style={{ backgroundColor: activeSettings.primaryColor }}
                  className="py-3 px-4 text-white text-xs font-extrabold rounded-2xl shadow-lg hover:brightness-95 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? "Placing..." : "Confirm & Place"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔐 TABLE QR LOGIN — WHATSAPP OTP FULL-SCREEN MODAL */}
      <AnimatePresence>
        {(isTableLoginModalOpen || isTableAccessBlocked) && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 text-center space-y-5"
            >
              {/* STEP: BLOCKED — Table is Currently Occupied Prompt */}
              {(tableLoginStep === "BLOCKED" || isTableAccessBlocked) ? (
                <>
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto border-2 border-amber-200">
                    <Clock className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-amber-800 uppercase tracking-tight">Table is Currently Occupied</h3>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed mt-2">
                      {tableBlockedReason}
                    </p>
                  </div>
                  <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-left">
                    <p className="text-[11px] text-amber-900 font-bold leading-relaxed">
                      🪑 Table <span className="font-black">{selectedTableNumber}</span> is currently occupied by another guest. 
                      Menu browsing and ordering are disabled for this table session.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1 pointer-events-auto">
                    <button
                      type="button"
                      onClick={handleCallWaiter}
                      disabled={isCallingWaiter}
                      className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-extrabold transition cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      🔔 Call Waiter to Table {selectedTableNumber}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTableLoginStep("PHONE");
                        setTableLoginPhone("");
                        setTableLoginOtp("");
                        setTableLoginError("");
                      }}
                      className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl text-xs font-bold transition cursor-pointer"
                    >
                      📲 Change Phone / Login Again
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTableNumber(null);
                        setFulfillmentMode("PICKUP");
                        setIsTableAccessBlocked(false);
                        setTableBlockedReason("");
                        setIsTableLoginModalOpen(false);
                        showToast("Switched to Takeaway / Pickup mode");
                      }}
                      className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold transition cursor-pointer"
                    >
                      🛍️ Order for Takeaway / Delivery Instead
                    </button>
                  </div>
                </>
              ) : tableLoginStep === "OTP" ? (
                /* STEP 2: Enter OTP */
                <>
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
                    <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-stone-900 uppercase tracking-tight">Verify OTP</h3>
                    <p className="text-xs text-stone-500 font-medium mt-1">
                      Enter the 4-digit code sent to <span className="font-extrabold text-stone-800">+91 {tableLoginPhone.replace(/\D/g, '').slice(-10)}</span> on WhatsApp
                    </p>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="Enter 4-digit OTP"
                      value={tableLoginOtp}
                      onChange={(e) => { setTableLoginOtp(e.target.value.replace(/\D/g, '')); setTableLoginError(""); }}
                      className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3.5 text-center text-2xl font-black text-stone-900 tracking-[0.5em] outline-none focus:border-emerald-500 transition"
                      autoFocus
                    />
                    {tableLoginError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-left">
                        {tableLoginError}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleTableVerifyOtp}
                      disabled={isTableLoginLoading || tableLoginOtp.length < 4}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-extrabold transition cursor-pointer shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isTableLoginLoading ? "Verifying..." : "Verify & Continue"} <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTableLoginStep("PHONE"); setTableLoginOtp(""); setTableLoginError(""); }}
                      className="text-[11px] font-bold text-stone-500 hover:text-stone-800 transition cursor-pointer underline"
                    >
                      ← Change Number / Resend OTP
                    </button>
                  </div>
                </>
              ) : (
                /* STEP 1: Direct Guest Entry or WhatsApp OTP */
                <>
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
                    {tableLoginMode === 'GUEST' ? <Sparkles size={28} className="text-emerald-600" /> : <WhatsAppIcon size={28} className="text-emerald-600" />}
                  </div>

                  <div>
                    <h3 className="text-base font-black text-stone-900 uppercase tracking-tight">
                      {tableLoginMode === 'GUEST' ? '⚡ Quick Table Entry' : '📲 WhatsApp OTP Login'}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium mt-1">
                      Order directly on <span className="font-extrabold text-stone-800">Table {selectedTableNumber}</span>
                    </p>
                  </div>

                  {/* Mode Selector Tabs */}
                  <div className="flex rounded-2xl bg-stone-100 p-1 border border-stone-200">
                    <button
                      type="button"
                      onClick={() => { setTableLoginMode("GUEST"); setTableLoginError(""); }}
                      className={`flex-1 py-2 text-xs font-black rounded-xl transition cursor-pointer ${
                        tableLoginMode === "GUEST" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      ⚡ Quick Guest Entry
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTableLoginMode("OTP"); setTableLoginError(""); }}
                      className={`flex-1 py-2 text-xs font-black rounded-xl transition cursor-pointer ${
                        tableLoginMode === "OTP" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      📲 WhatsApp OTP
                    </button>
                  </div>

                  {tableLoginMode === "GUEST" ? (
                    /* DIRECT GUEST ENTRY FORM */
                    <form onSubmit={(e) => { e.preventDefault(); handleTableDirectGuestLogin(); }} className="space-y-3 text-left">
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sajad Bakshi"
                          value={tableGuestName}
                          onChange={(e) => { setTableGuestName(e.target.value); setTableLoginError(""); }}
                          className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3 text-xs font-bold text-stone-900 outline-none focus:border-emerald-500 transition"
                          autoFocus
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Mobile Number *</label>
                        <div className="flex items-center gap-2 bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3 focus-within:border-emerald-500 transition">
                          <span className="text-xs font-bold text-stone-500">+91</span>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            required
                            placeholder="Enter 10-digit mobile number"
                            value={tableLoginPhone}
                            onChange={(e) => { setTableLoginPhone(e.target.value.replace(/\D/g, '')); setTableLoginError(""); }}
                            className="flex-1 bg-transparent outline-none text-xs font-bold text-stone-900 placeholder:text-stone-400"
                          />
                        </div>
                      </div>

                      {tableLoginError && (
                        <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-left">
                          {tableLoginError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isTableLoginLoading || tableLoginPhone.replace(/\D/g, '').length < 10 || !tableGuestName.trim()}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-extrabold transition cursor-pointer shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isTableLoginLoading ? "Unlocking Menu..." : "⚡ Start Ordering Now"} <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    /* WHATSAPP OTP FORM */
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 bg-stone-50 border-2 border-stone-200 rounded-2xl px-4 py-3 focus-within:border-emerald-500 transition">
                        <span className="text-sm font-bold text-stone-500">+91</span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          placeholder="Enter mobile number"
                          value={tableLoginPhone}
                          onChange={(e) => { setTableLoginPhone(e.target.value.replace(/\D/g, '')); setTableLoginError(""); }}
                          className="flex-1 bg-transparent outline-none text-sm font-bold text-stone-900 placeholder:text-stone-400"
                          autoFocus
                        />
                      </div>
                      {tableLoginError && (
                        <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-left">
                          {tableLoginError}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleTableSendOtp}
                        disabled={isTableLoginLoading || tableLoginPhone.replace(/\D/g, '').length < 10}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-extrabold transition cursor-pointer shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isTableLoginLoading ? "Sending OTP..." : "Send WhatsApp OTP"} <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER - LIGHT THEME */}
      <footer className="mt-auto border-t border-stone-200 bg-white text-stone-700">
        <div className="max-w-6xl mx-auto px-5 py-10 grid gap-6 md:grid-cols-3 text-xs text-stone-600">
          <div>
            <div className="flex items-baseline font-display font-black text-xl text-stone-900 mb-2 cursor-pointer hover:text-[#10b981] transition-colors" onClick={() => setActiveNav("home")}>
              {restaurantTitle}
            </div>
            <p className="text-stone-500 leading-relaxed">
              {activeSettings.footerSubtext || "Official online food ordering portal powered by SaSLoop Backoffice Engine."}
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 mb-3">
              {activeSettings.footerTimingsTitle || "ONLINE ORDER TIMINGS"}
            </div>
            <p className="text-stone-600 font-medium">{activeSettings.timingsText || "Everyday · 10:00 AM – 10:00 PM"}</p>
            <p className="text-stone-500 mt-1">{activeSettings.avgDeliveryText || "Average Delivery: 30-45 Minutes"}</p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 mb-3">
              {activeSettings.footerSupportTitle || "DELIVERY SUPPORT"}
            </div>
            <p className="text-stone-600 font-medium">
              {activeSettings.footerSupportLocation || `${restaurantTitle} · ${activeSettings.address || "Srinagar"}`}
            </p>
            <p className="text-stone-500 mt-1">{activeSettings.footerSupportText || "Direct POS Hotline & WhatsApp"}</p>
          </div>
        </div>

        <div className="border-t border-stone-200 py-4 text-center text-xs text-stone-500 bg-stone-50">
          © {new Date().getFullYear()} {activeSettings.copyrightName || "SaSTech LLC"}. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicOutletMenu;
