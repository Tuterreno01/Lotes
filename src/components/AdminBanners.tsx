/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AdBanner } from '../types';
import { Megaphone, Eye, MousePointerClick, TrendingUp, RefreshCw, CheckCircle2, AlertCircle, ExternalLink, Plus, Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminBannersProps {
  banners: AdBanner[];
  onRefresh: () => void;
}

export default function AdminBanners({ banners, onRefresh }: AdminBannersProps) {
  const [simulating, setSimulating] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [newBanner, setNewBanner] = useState({
    title: '',
    advertiserName: '',
    imageUrl: '',
    targetUrl: '',
    slot: 'in_feed'
  });

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.title || !newBanner.advertiserName || !newBanner.imageUrl) {
      setErrorMsg('Por favor, completá los campos obligatorios (*).');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const url = editingBannerId ? `/api/banners/${editingBannerId}` : '/api/banners';
      const method = editingBannerId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Password': localStorage.getItem('lotear_admin_password') || ''
        },
        body: JSON.stringify(newBanner)
      });

      if (res.ok) {
        setSuccessMsg(editingBannerId ? '¡Anuncio publicitario modificado con éxito!' : '¡Anuncio publicitario registrado con éxito!');
        onRefresh();
        setNewBanner({
          title: '',
          advertiserName: '',
          imageUrl: '',
          targetUrl: '',
          slot: 'in_feed'
        });
        setEditingBannerId(null);
        setTimeout(() => {
          setShowAddForm(false);
          setSuccessMsg('');
        }, 2000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Ocurrió un error al registrar el anuncio.');
      }
    } catch (err) {
      setErrorMsg('Error de red al registrar el anuncio.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (banner: AdBanner) => {
    setEditingBannerId(banner.id);
    setNewBanner({
      title: banner.title,
      advertiserName: banner.advertiserName,
      imageUrl: banner.imageUrl,
      targetUrl: banner.externalLink || '',
      slot: banner.slot
    });
    setShowAddForm(true);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleDeleteBanner = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el anuncio publicitario "${title}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Password': localStorage.getItem('lotear_admin_password') || ''
        }
      });
      if (res.ok) {
        setSuccessMsg(`Anuncio "${title}" eliminado con éxito.`);
        onRefresh();
        setTimeout(() => setSuccessMsg(''), 2000);
      } else {
        setErrorMsg('No se pudo eliminar el anuncio.');
      }
    } catch (err) {
      setErrorMsg('Error de red al intentar eliminar el anuncio.');
    }
  };

  const getBannerPreset = (index: number) => {
    const presets = [
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    ];
    setNewBanner(prev => ({ ...prev, imageUrl: presets[index] }));
  };

  const totalViews = banners.reduce((sum, b) => sum + b.views, 0);
  const totalClicks = banners.reduce((sum, b) => sum + b.clicks, 0);
  const averageCtr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

  const handleSimulateClick = async (bannerId: string) => {
    try {
      setSimulating(bannerId);
      const res = await fetch(`/api/banners/${bannerId}/click`, { method: 'POST' });
      if (res.ok) {
        // Wait a brief second to show simulated click feedback
        setTimeout(() => {
          onRefresh();
          setSimulating(null);
        }, 300);
      }
    } catch (err) {
      console.error("Error simulating click:", err);
      setSimulating(null);
    }
  };

  const getSlotLabel = (slot: string) => {
    switch (slot) {
      case 'billboard_top': return 'Billboard Principal (Cabecera)';
      case 'sidebar_top': return 'Lateral Superior (Filtros)';
      case 'sidebar_bottom': return 'Lateral Inferior (Filtros)';
      case 'in_feed': return 'In-Feed Patrocinado (Grilla)';
      case 'footer_brand': return 'Banner de Cierre (Pre-Footer)';
      default: return slot;
    }
  };

  const getSlotDimensions = (slot: string) => {
    switch (slot) {
      case 'billboard_top': return '1200 x 250 px';
      case 'sidebar_top': return '300 x 250 px';
      case 'sidebar_bottom': return '300 x 250 px';
      case 'in_feed': return '800 x 450 px';
      case 'footer_brand': return '1200 x 120 px';
      default: return 'Medida variable';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Monetization Summary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Metric 1: Total Views */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Impresiones (Views)</span>
            <h3 className="text-xl md:text-2xl font-mono font-extrabold text-slate-900 mt-1">
              {totalViews.toLocaleString()}
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Vistas totales de banners.</p>
          </div>
          <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Total Clicks */}
        <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Clics en Anuncios</span>
            <h3 className="text-xl md:text-2xl font-mono font-extrabold text-emerald-950 mt-1">
              {totalClicks.toLocaleString()}
            </h3>
            <p className="text-[10px] text-emerald-600 mt-1">Redirecciones a constructoras.</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center">
            <MousePointerClick className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Click-Through Rate */}
        <div className="bg-slate-900 text-white rounded-xl p-4.5 flex items-center justify-between border border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tasa de Clics (CTR)</span>
            <h3 className="text-xl md:text-2xl font-mono font-extrabold text-emerald-400 mt-1">
              {averageCtr.toFixed(2)}%
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Rendimiento publicitario promedio.</p>
          </div>
          <div className="w-10 h-10 bg-slate-850 text-emerald-400 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Header and Toggle Button for Banner Adding */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
        <div>
          <h3 className="font-sans font-bold text-slate-900 text-sm">Alta de Anunciantes / Publicidad</h3>
          <p className="text-[11px] text-slate-500">Agregá banners de constructoras patrocinantes para monetizar el tráfico.</p>
        </div>
        <button
          onClick={() => {
            if (showAddForm) {
              setEditingBannerId(null);
            }
            setShowAddForm(!showAddForm);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
            showAddForm 
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md'
          }`}
        >
          <Plus className={`w-3.5 h-3.5 transition-transform duration-300 ${showAddForm ? 'rotate-45' : ''}`} />
          {showAddForm ? 'Cerrar Formulario' : 'Cargar Banner Publicitario'}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreateBanner} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <h4 className="font-bold text-slate-900 text-xs">
                    {editingBannerId ? `Modificar Banner: ${newBanner.title}` : 'Registrar Nuevo Banner Publicitario'}
                  </h4>
                </div>
                {editingBannerId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBannerId(null);
                      setNewBanner({
                        title: '',
                        advertiserName: '',
                        imageUrl: '',
                        targetUrl: '',
                        slot: 'in_feed'
                      });
                      setShowAddForm(false);
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer bg-red-50 hover:bg-red-100/80 px-2.5 py-1 rounded-lg border border-red-200/50 transition-colors"
                  >
                    Cancelar Edición
                  </button>
                )}
              </div>

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Título del Anuncio *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. ¡Lanzamiento Barrio Cerrado Los Pasos!"
                    value={newBanner.title}
                    onChange={e => setNewBanner({ ...newBanner, title: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Nombre del Anunciante / Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Pilay S.A."
                    value={newBanner.advertiserName}
                    onChange={e => setNewBanner({ ...newBanner, advertiserName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Ubicación / Slot del Banner</label>
                  <select
                    value={newBanner.slot}
                    onChange={e => setNewBanner({ ...newBanner, slot: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 text-slate-850 font-medium text-xs border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="billboard_top">Billboard Principal (Cabecera) - [1200 x 250 px]</option>
                    <option value="sidebar_top">Lateral Superior (Filtros) - [300 x 250 px]</option>
                    <option value="sidebar_bottom">Lateral Inferior (Filtros) - [300 x 250 px]</option>
                    <option value="in_feed">In-Feed Patrocinado (Grilla) - [800 x 450 px]</option>
                    <option value="footer_brand">Banner de Cierre (Pre-Footer) - [1200 x 120 px]</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Enlace de Destino (Link)</label>
                  <input
                    type="url"
                    placeholder="Ej. https://pilay.com.ar"
                    value={newBanner.targetUrl}
                    onChange={e => setNewBanner({ ...newBanner, targetUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">URL de la Imagen del Banner *</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newBanner.imageUrl}
                  onChange={e => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400">O usá un preset publicitario:</span>
                  <div className="flex gap-1.5">
                    {['Edificio', 'Oficina', 'Inmobiliaria'].map((name, idx) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => getBannerPreset(idx)}
                        className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting 
                  ? 'Guardando datos...' 
                  : editingBannerId 
                    ? 'Guardar Cambios del Banner' 
                    : 'Confirmar y Publicar Banner'
                }
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slots performance list */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Monitoreo de Espacios Publicitarios (Sponsor Slots)</h3>
            <p className="text-xs text-slate-500">Métricas y auditoría de los 5 banners integrados en el portal inmobiliario.</p>
          </div>
          <button
            onClick={onRefresh}
            className="p-1.5 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
            title="Refrescar métricas"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {banners.map((banner) => {
            const ctr = banner.views > 0 ? (banner.clicks / banner.views) * 100 : 0;
            return (
              <div key={banner.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-slate-50/40 transition-colors">
                
                {/* Banner Profile */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-20 h-14 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0 relative hidden sm:block">
                    <img
                      src={banner.imageUrl}
                      alt={banner.advertiserName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded font-mono">
                        ID: #{banner.id}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
                        {getSlotLabel(banner.slot)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold bg-slate-100/80 px-2 py-0.5 rounded-lg border border-slate-200/50">
                        Medida: {getSlotDimensions(banner.slot)}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-950 text-sm mt-1.5 leading-tight">{banner.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Cliente/Anunciante: <strong className="text-slate-700">{banner.advertiserName}</strong>
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-6 shrink-0 bg-slate-50/70 border border-slate-100 rounded-xl p-3 px-4.5 justify-between md:justify-start">
                  <div className="text-center font-mono">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Views</span>
                    <span className="text-xs font-extrabold text-slate-800">{banner.views}</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200"></div>
                  <div className="text-center font-mono">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Clicks</span>
                    <span className="text-xs font-extrabold text-slate-800">{banner.clicks}</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200"></div>
                  <div className="text-center font-mono">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">CTR</span>
                    <span className="text-xs font-extrabold text-emerald-600">{ctr.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Actions / Simulators */}
                <div className="shrink-0 flex items-center gap-2.5">
                  <button
                    onClick={() => handleSimulateClick(banner.id)}
                    disabled={simulating === banner.id}
                    className={`text-xs px-3.5 py-2 rounded-xl font-bold border cursor-pointer transition-all flex items-center gap-1.5 ${
                      simulating === banner.id
                        ? 'bg-slate-150 border-slate-200 text-slate-400'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <MousePointerClick className="w-3.5 h-3.5" />
                    {simulating === banner.id ? 'Simulando...' : 'Simular Clic'}
                  </button>
                  <button
                    onClick={() => handleEditClick(banner)}
                    className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-emerald-200"
                    title="Modificar Banner"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(banner.id, banner.title)}
                    className="p-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-red-200"
                    title="Eliminar Banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={banner.externalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer border border-transparent"
                    title="Visitar Sitio"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Advisory message */}
      <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-xl p-4 flex gap-3 text-xs text-emerald-800">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h5 className="font-bold">Monetización y Retorno de Inversión (ROI)</h5>
          <p className="mt-1 leading-relaxed">
            Cada vez que un usuario visualiza o hace clic en el botón de un loteo promocionado, LoteAR registra las impresiones y clics correspondientes. Esto permite generar reportes automáticos mensuales para tus constructoras clientes, respaldando los precios de los banners publicitarios contratados.
          </p>
        </div>
      </div>

    </div>
  );
}
