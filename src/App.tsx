/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { Compass, Sparkles, Calculator, Layers, ClipboardList, Info, HelpCircle, Megaphone, Globe, Briefcase, ChevronRight, Home, Lock, Unlock, KeyRound, Eye, EyeOff, LogOut, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [loteos, setLoteos] = useState<Loteo[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [banners, setBanners] = useState<AdBanner[]>([]);
  const [selectedLoteo, setSelectedLoteo] = useState<Loteo | null>(null);
  const [activeTab, setActiveTab] = useState<'loteos' | 'chat' | 'simulator' | 'inquiries'>('loteos');
  const [adminSubTab, setAdminSubTab] = useState<'leads' | 'loteos' | 'banners'>('leads');
  
  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>(() => localStorage.getItem('lotear_admin_password') || '');
  const [verifyingAuth, setVerifyingAuth] = useState<boolean>(false);

  // Form input and login state
  const [loginPasswordInput, setLoginPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [loginSubmitting, setLoginSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPasswordInput.trim()) {
      setLoginError('Por favor ingresá la contraseña.');
      return;
    }

    setLoginSubmitting(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPasswordInput })
      });

      if (res.ok) {
        setIsAdminLoggedIn(true);
        setAdminPassword(loginPasswordInput);
        localStorage.setItem('lotear_admin_password', loginPasswordInput);
        await fetchInquiriesWithPassword(loginPasswordInput);
        setLoginPasswordInput('');
      } else {
        const data = await res.json();
        setLoginError(data.error || 'Contraseña incorrecta.');
      }
    } catch (err) {
      setLoginError('Error de red al verificar la contraseña.');
    } finally {
      setLoginSubmitting(false);
    }
  };

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

  // Load Loteos catalog and sponsor banners on mount, and verify stored password if present
  useEffect(() => {
    fetchLoteos();
    fetchBanners();
    
    const savedPassword = localStorage.getItem('lotear_admin_password');
    if (savedPassword) {
      verifyStoredPassword(savedPassword);
    }
  }, []);

  const verifyStoredPassword = async (pwd: string) => {
    setVerifyingAuth(true);
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd })
      });
      if (res.ok) {
        setIsAdminLoggedIn(true);
        setAdminPassword(pwd);
        fetchInquiriesWithPassword(pwd);
      } else {
        localStorage.removeItem('lotear_admin_password');
        setAdminPassword('');
        setIsAdminLoggedIn(false);
      }
    } catch (err) {
      console.error("Error verifying stored admin password:", err);
    } finally {
      setVerifyingAuth(false);
    }
  };

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

  const fetchInquiriesWithPassword = async (pwd: string) => {
    try {
      const res = await fetch('/api/inquiries', {
        headers: {
          'X-Admin-Password': pwd
        }
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error("Error loading inquiries:", err);
    }
  };

  const fetchInquiries = async () => {
    const pwd = localStorage.getItem('lotear_admin_password') || adminPassword;
    if (pwd) {
      await fetchInquiriesWithPassword(pwd);
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
        // Refresh inquiry session count ONLY if admin is authenticated
        if (isAdminLoggedIn) {
          await fetchInquiries();
        }
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
              {!isAdminLoggedIn ? (
                // Beautiful Login Barrier
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-xl mt-12 relative overflow-hidden text-center"
                >
                  {/* Decorative top border */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                  
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                    <Lock className="w-8 h-8" />
                  </div>
                  
                  <h3 className="font-sans font-extrabold text-slate-900 text-xl tracking-tight mb-2">Panel de Acceso Restringido</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto mb-6">
                    Ingresá la clave de administrador de LoteAR para visualizar consultas de clientes, dar de alta nuevos desarrollos y actualizar banners de sponsors.
                  </p>

                  <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Contraseña del Panel"
                        value={loginPasswordInput}
                        onChange={(e) => {
                          setLoginPasswordInput(e.target.value);
                          setLoginError('');
                        }}
                        className="w-full pl-10 pr-10 py-3 bg-slate-50 text-slate-800 text-sm border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono"
                        autoFocus
                      />
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {loginError && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xs text-red-600 font-semibold bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 justify-center"
                      >
                        {loginError}
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={loginSubmitting}
                      className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-xs py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loginSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Verificando...
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          Ingresar al Panel
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-slate-100 text-left space-y-3">
                    <div className="flex gap-2.5 items-start">
                      <span className="text-base">💡</span>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">Clave por Defecto</span>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                          Para testing local, usá la clave temporal: <code className="bg-slate-100 text-emerald-700 font-mono font-bold px-1.5 py-0.5 rounded border border-slate-200">loteArAdmin2026</code>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="text-base">🔒</span>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">Configuración Segura</span>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                          Para producción en Render, definí la variable de entorno <code className="bg-slate-100 text-slate-700 font-mono px-1 py-0.5 rounded border border-slate-200">ADMIN_PASSWORD</code>.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">Panel de Control LoteAR</h2>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                          <ShieldCheck className="w-3 h-3" /> Conectado
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">Cargá loteos y banners publicitarios manualmente, monitoreá consultas y controlá estadísticas.</p>
                    </div>
                    
                    {/* Admin Actions and Navigation */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                      <button
                        onClick={() => {
                          localStorage.removeItem('lotear_admin_password');
                          setAdminPassword('');
                          setIsAdminLoggedIn(false);
                          setInquiries([]);
                        }}
                        className="px-3.5 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer self-end sm:self-auto"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Cerrar Sesión
                      </button>

                      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
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
                </>
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
