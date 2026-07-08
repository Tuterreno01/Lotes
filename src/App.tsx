/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Loteo, FilterState, Inquiry, AdBanner } from './types';
import Hero from './components/Hero';
import LoteoFilters from './components/LoteoFilters';
import LoteoCard from './components/LoteoCard';
import LoteoModal from './components/LoteoModal';
import CacSimulator from './components/CacSimulator';
import AsesorIA from './components/AsesorIA';
import AdminInquiries from './components/AdminInquiries';
import SponsorBanner from './components/SponsorBanner';
import AdminBanners from './components/AdminBanners';
import AdminLoteos from './components/AdminLoteos';
import { Compass, Sparkles, Calculator, Layers, ClipboardList, Info, HelpCircle, Megaphone, Globe, Briefcase, ChevronRight, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [loteos, setLoteos] = useState<Loteo[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [banners, setBanners] = useState<AdBanner[]>([]);
  const [selectedLoteo, setSelectedLoteo] = useState<Loteo | null>(null);
  const [activeTab, setActiveTab] = useState<'loteos' | 'chat' | 'simulator' | 'inquiries'>('loteos');
  const [adminSubTab, setAdminSubTab] = useState<'leads' | 'loteos' | 'banners'>('leads');
  
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    location: 'all',
    stage: 'all',
    scope: 'all',
    developer: 'all',
    maxPrice: 120000,
    minSize: 300,
    hasGas: false,
    hasWater: false,
    hasSewer: false,
    hasInternet: false,
  });

  // Load Loteos catalog, current session inquiries, and sponsor banners
  useEffect(() => {
    fetchLoteos();
    fetchInquiries();
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners');
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      }
    } catch (err) {
      console.error("Error loading banners:", err);
    }
  };

  const fetchLoteos = async () => {
    try {
      const res = await fetch('/api/loteos');
      if (res.ok) {
        const data = await res.json();
        setLoteos(data);
      }
    } catch (err) {
      console.error("Error loading loteos:", err);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error("Error loading inquiries:", err);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      location: 'all',
      stage: 'all',
      scope: 'all',
      developer: 'all',
      maxPrice: 120000,
      minSize: 300,
      hasGas: false,
      hasWater: false,
      hasSewer: false,
      hasInternet: false,
    });
  };

  // Submit inquiry to backend
  const handleInquirySubmit = async (inquiryData: Omit<Inquiry, 'id' | 'timestamp'>) => {
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
      if (res.ok) {
        // Refresh inquiry session count
        await fetchInquiries();
        return true;
      }
    } catch (err) {
      console.error("Error submitting inquiry:", err);
    }
    return false;
  };

  // Filter loteos logic
  const filteredLoteos = loteos.filter(l => {
    const matchQuery = l.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                       l.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                       l.location.toLowerCase().includes(filters.searchQuery.toLowerCase());
    const matchLoc = filters.location === 'all' || l.location === filters.location;
    const matchStage = filters.stage === 'all' || l.stage === filters.stage;
    const matchScope = filters.scope === 'all' || l.scope === filters.scope;
    const matchDev = filters.developer === 'all' || l.developer === filters.developer;
    const matchPrice = l.priceUSD <= filters.maxPrice;
    const matchSize = l.sizeMax >= filters.minSize;
    
    // Services check
    const matchGas = !filters.hasGas || l.services.gas;
    const matchWater = !filters.hasWater || l.services.water;
    const matchSewer = !filters.hasSewer || l.services.sewer;
    const matchInternet = !filters.hasInternet || l.services.internet;

    return matchQuery && matchLoc && matchStage && matchScope && matchDev && matchPrice && matchSize && matchGas && matchWater && matchSewer && matchInternet;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Header bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('loteos')}>
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Lote<span className="text-emerald-600">AR</span>
                </span>
                <span className="block text-[9px] font-bold text-slate-400 tracking-wider uppercase -mt-1">
                  Rosario & Región
                </span>
              </div>
            </div>

            {/* Primary Tab Navigation */}
            <nav className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('loteos')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'loteos' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-950'
                }`}
                id="tab-nav-loteos"
              >
                <Layers className="w-3.5 h-3.5" />
                Lotes
              </button>
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer relative border border-emerald-100 bg-emerald-50/40 ${
                  activeTab === 'inquiries' ? 'bg-emerald-700 text-white border-transparent shadow-xs' : 'text-emerald-800 hover:bg-emerald-50'
                }`}
                id="tab-nav-inquiries"
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                Panel Admin
                {inquiries.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {inquiries.length}
                  </span>
                )}
              </button>
            </nav>

          </div>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1">
        
        {/* Render Hero element solely on Loteos home directory tab */}
        {activeTab === 'loteos' && (
          <Hero
            onSearchClick={() => {
              const el = document.getElementById('catalogo-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            totalLoteos={loteos.length}
          />
        )}

        {/* Content Wrapper */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* TAB 1: LOTEOS DIRECTORY */}
          {activeTab === 'loteos' && (
            <div className="space-y-8" id="catalogo-section">
              
              <div className="flex flex-col md:flex-row items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">Catálogo de Loteos Certificados</h2>
                  <p className="text-sm text-slate-500">Filtrá por zona, servicios públicos, plazos de posesión y planes de pago.</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <span>Todos los precios están expresados en dólares estadounidenses (USD)</span>
                </div>
              </div>

              {/* Sponsor Slot 1: Billboard Top */}
              <SponsorBanner slot="billboard_top" onBannerStatsUpdate={fetchBanners} banners={banners} />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Filters (4 columns) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Sponsor Slot 2: Sidebar Top */}
                  <SponsorBanner slot="sidebar_top" onBannerStatsUpdate={fetchBanners} banners={banners} />
                  
                  <LoteoFilters
                    filters={filters}
                    onChange={setFilters}
                    onClear={handleClearFilters}
                    loteos={loteos}
                  />

                  {/* Sponsor Slot 3: Sidebar Bottom */}
                  <SponsorBanner slot="sidebar_bottom" onBannerStatsUpdate={fetchBanners} banners={banners} />
                </div>

                {/* Directory List Grid (8 columns) */}
                <div className="lg:col-span-8 space-y-6">
                  {filteredLoteos.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Compass className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">No encontramos loteos coincidentes</h3>
                      <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                        Probá flexibilizar los filtros de precio máximo, superficie mínima, o seleccionando "Todas las ciudades" para ver más alternativas.
                      </p>
                      <button
                        onClick={handleClearFilters}
                        className="mt-5 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                        id="btn-no-results-reset"
                      >
                        Restablecer todos los filtros
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Show first 2 cards */}
                      {filteredLoteos.slice(0, 2).map((loteo) => (
                        <LoteoCard
                          key={loteo.id}
                          loteo={loteo}
                          onSelect={(l) => setSelectedLoteo(l)}
                          onInquire={(l) => {
                            setSelectedLoteo(l);
                          }}
                        />
                      ))}

                      {/* Sponsor Slot 4: In-Feed Banner (rendered inside the listing grid after card 2) */}
                      {filteredLoteos.length > 2 && (
                        <SponsorBanner slot="in_feed" onBannerStatsUpdate={fetchBanners} banners={banners} />
                      )}

                      {/* Show remaining cards */}
                      {filteredLoteos.slice(2).map((loteo) => (
                        <LoteoCard
                          key={loteo.id}
                          loteo={loteo}
                          onSelect={(l) => setSelectedLoteo(l)}
                          onInquire={(l) => {
                            setSelectedLoteo(l);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sponsor Slot 5: Footer Brand Banner */}
              <SponsorBanner slot="footer_brand" onBannerStatsUpdate={fetchBanners} banners={banners} />

            </div>
          )}

          {/* TAB 2: ASESOR IA */}
          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">Preguntale al Asesor Inteligente</h2>
                <p className="text-sm text-slate-500">Un experto virtual que te asesora al instante con toda la información técnica sobre cada loteo.</p>
              </div>
              <AsesorIA />
            </div>
          )}

          {/* TAB 3: SIMULATOR CAC */}
          {activeTab === 'simulator' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">Simulador de Índices de Ajuste</h2>
                <p className="text-sm text-slate-500">Herramienta técnica para comprender cómo influye el índice de la Cámara Argentina de la Construcción (CAC) en las cuotas en pesos de tu lote.</p>
              </div>
              <CacSimulator />
            </div>
          )}

          {/* TAB 4: ADMIN CONTROL PANEL (LEADS & SPONSORS PUBLICIDAD) */}
          {activeTab === 'inquiries' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">Panel de Control LoteAR</h2>
                  <p className="text-sm text-slate-500">Cargá loteos y banners publicitarios manualmente, monitoreá consultas y controlá estadísticas.</p>
                </div>
                {/* Admin Sub-navigation Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto border border-slate-200">
                  <button
                    onClick={() => setAdminSubTab('leads')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      adminSubTab === 'leads' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    <ClipboardList className="w-3.5 h-3.5 animate-pulse" />
                    Consultas ({inquiries.length})
                  </button>
                  <button
                    onClick={() => setAdminSubTab('loteos')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      adminSubTab === 'loteos' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5 text-emerald-600" />
                    Cargar Lotes ({loteos.length})
                  </button>
                  <button
                    onClick={() => setAdminSubTab('banners')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      adminSubTab === 'banners' ? 'bg-white text-slate-950 shadow-xs text-emerald-700' : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    <Megaphone className="w-3.5 h-3.5 text-emerald-600" />
                    Publicidad ({banners.length})
                  </button>
                </div>
              </div>

              {adminSubTab === 'leads' && (
                <AdminInquiries
                  inquiries={inquiries}
                  onRefresh={fetchInquiries}
                />
              )}

              {adminSubTab === 'loteos' && (
                <AdminLoteos
                  loteos={loteos}
                  onRefresh={fetchLoteos}
                />
              )}

              {adminSubTab === 'banners' && (
                <AdminBanners
                  banners={banners}
                  onRefresh={fetchBanners}
                />
              )}
            </div>
          )}

        </div>
      </main>

      {/* Footer branding */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-800 pb-8 gap-6">
            <div>
              <span className="text-xl font-bold text-white tracking-tight block">
                Lote<span className="text-emerald-500">AR</span>
              </span>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                La plataforma líder en corretaje virtual y promoción de desarrollos inmobiliarios abiertos y cerrados para la región metropolitana de Rosario.
              </p>
            </div>
            
            <div className="flex gap-4 text-xs font-semibold text-slate-300">
              <button onClick={() => setActiveTab('loteos')} className="hover:text-emerald-400 cursor-pointer">Lotes</button>
              <button onClick={() => setActiveTab('inquiries')} className="hover:text-emerald-400 cursor-pointer">Panel Admin</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} LoteAR S.R.L. — Todos los derechos reservados. Rosario, Santa Fe, Argentina.</p>
            <p className="flex items-center gap-1 font-mono text-[10px]">
              Powered by <span className="text-emerald-500 font-bold">Gemini 3.5 Flash</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Pop-up detail Modal */}
      <LoteoModal
        loteo={selectedLoteo}
        onClose={() => setSelectedLoteo(null)}
        onSubmitInquiry={handleInquirySubmit}
      />

    </div>
  );
}
