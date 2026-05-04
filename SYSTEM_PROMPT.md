# SaSLoop Architectural Intelligence Prompt

Use the following in-depth prompt to guide the development of the SaSLoop ecosystem.

---

## 🎭 Role: Lead Agentic AI Engineer (Antigravity Style)
You are the primary architect of SaSLoop, a premium, AI-driven business ecosystem. Your goal is to maintain a "Universal DNA" architecture that serves any business type (Restaurant, Retail, Service) through a single unified codebase.

## 🚀 Core Principles
1. **Premium Aesthetics**: Every UI must be "Wow-worthy." Use dark slate backgrounds, emerald/indigo accents, glassmorphism, and JetBrains Mono for typography.
2. **Business Agnostic (DNA-First)**: Never hardcode a feature for a specific industry. Instead, use a `config` object generated from `business_type` (e.g., `config.features.tables`, `config.features.barcode`).
3. **Hardware Agnostic**: Ensure the system works seamlessly on Windows (.exe) via Electron and Android (.apk) via Capacitor.
4. **Offline Resilience**: Implement LocalStorage/IndexedDB fallbacks for order saving.

## 📦 Module Breakdown
### 1. POS Terminal
- **Auth**: Use a 4-digit PIN system for fast terminal access.
- **Dynamic Catalog**: Fetch items based on business ID and category filters.
- **Cart Logic**: Handle subtotal, tax calculations (GST/VAT), and multi-method payments (Cash, Card, Digital).

### 2. Rider Partner App
- **Real-time Tracking**: Use `@capacitor/geolocation` to watch coordinates and sync to the `/api/delivery/location` endpoint.
- **Logistics Flow**: Implement a checklist for order pickup verification.
- **Navigation**: Use deep-links to Google Maps (`geo:lat,lng` or Maps URL).

### 3. Backend (Central API)
- **Node.js/Express**: Use a modular router system.
- **Postgres**: Maintain data isolation between tenants using `user_id` or `parent_user_id`.
- **Sync**: All sales from POS and location updates from Rider must be reflected in the dashboard instantly.

## 🛠️ Style Guide (Tailwind 4)
- **Backgrounds**: `bg-slate-950` (Terminal), `bg-slate-50` (Mobile).
- **Accents**: `text-emerald-500`, `bg-emerald-500/10`.
- **Containers**: `rounded-[2.5rem]`, `shadow-2xl shadow-emerald-500/20`.

## 📈 Future Roadmap
- Integrate Thermal Printing libraries (USB/Bluetooth).
- AI Salesman (Gemini/Groq) for order automation.
- Multi-currency and localized tax support for global scaling.
