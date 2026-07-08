/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Loteo } from '../types';
import { Plus, Trash2, Home, Landmark, Crop, MapPin, Eye, CheckCircle2, AlertCircle, Sparkles, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLoteosProps {
  loteos: Loteo[];
  onRefresh: () => void;
}

export default function AdminLoteos({ loteos, onRefresh }: AdminLoteosProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLoteoId, setEditingLoteoId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    location: 'Funes',
    stage: 'Pre-venta',
    scope: 'Rosario',
    priceUSD: 25000,
    sizeMin: 300,
    sizeMax: 600,
    distanceFromRosario: 15,
    developer: '',
    description: '',
    longDescription: '',
    imageUrl: '',
    imagesRaw: '',
    amenitiesRaw: 'Seguridad 24hs, Tendido de servicios subterráneos, S.U.M., Canchas de Tenis',
    light: true,
    gas: false,
    water: false,
    sewer: false,
    internet: false,
  });

  const handleServiceChange = (service: 'light' | 'gas' | 'water' | 'sewer' | 'internet') => {
    setFormData(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.priceUSD || !formData.description) {
      setErrorMsg('Por favor completá los campos obligatorios (*).');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Process amenities array
    const amenities = formData.amenitiesRaw
      ? formData.amenitiesRaw.split(',').map(item => item.trim()).filter(Boolean)
      : [];

    // Process images array
    const images = formData.imagesRaw
      ? formData.imagesRaw.split(',').map(item => item.trim()).filter(Boolean)
      : [];

    const payload = {
      name: formData.name,
      location: formData.location,
      stage: formData.stage,
      scope: formData.scope,
      priceUSD: Number(formData.priceUSD),
      sizeMin: Number(formData.sizeMin),
      sizeMax: Number(formData.sizeMax),
      distanceFromRosario: Number(formData.distanceFromRosario),
      developer: formData.developer || 'LoteAR Desarrollos',
      description: formData.description,
      longDescription: formData.longDescription || formData.description,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      images: images.length > 0 ? images : [formData.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'],
      services: {
        light: formData.light,
        gas: formData.gas,
        water: formData.water,
        sewer: formData.sewer,
        internet: formData.internet,
      },
      amenities,
    };

    try {
      const url = editingLoteoId ? `/api/loteos/${editingLoteoId}` : '/api/loteos';
      const method = editingLoteoId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Password': localStorage.getItem('lotear_admin_password') || ''
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMsg(editingLoteoId ? `¡Loteo "${formData.name}" modificado con éxito!` : `¡Loteo "${formData.name}" registrado con éxito!`);
        onRefresh();
        // Reset form except defaults
        setFormData({
          name: '',
          location: 'Funes',
          stage: 'Pre-venta',
          scope: 'Rosario',
          priceUSD: 25000,
          sizeMin: 300,
          sizeMax: 600,
          distanceFromRosario: 15,
          developer: '',
          description: '',
          longDescription: '',
          imageUrl: '',
          imagesRaw: '',
          amenitiesRaw: 'Seguridad 24hs, S.U.M., Parquización, Calles Asfaltadas',
          light: true,
          gas: false,
          water: false,
          sewer: false,
          internet: false,
        });
        setEditingLoteoId(null);
        setTimeout(() => {
          setShowAddForm(false);
          setSuccessMsg('');
        }, 2000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Ocurrió un error al procesar el loteo.');
      }
    } catch (err) {
      setErrorMsg('Error de red al conectar con el servidor.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (loteo: Loteo) => {
    setEditingLoteoId(loteo.id);
    setFormData({
      name: loteo.name,
      location: loteo.location,
      stage: loteo.stage,
      scope: loteo.scope || 'Rosario',
      priceUSD: loteo.priceUSD,
      sizeMin: loteo.sizeMin,
      sizeMax: loteo.sizeMax,
      distanceFromRosario: loteo.distanceFromRosario,
      developer: loteo.developer,
      description: loteo.description,
      longDescription: loteo.longDescription || loteo.description,
      imageUrl: loteo.imageUrl,
      imagesRaw: loteo.images ? loteo.images.join(', ') : loteo.imageUrl,
      amenitiesRaw: loteo.amenities.join(', '),
      light: loteo.services.light,
      gas: loteo.services.gas,
      water: loteo.services.water,
      sewer: loteo.services.sewer,
      internet: loteo.services.internet,
    });
    setShowAddForm(true);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleDeleteLoteo = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el loteo "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/loteos/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Password': localStorage.getItem('lotear_admin_password') || ''
        }
      });
      if (res.ok) {
        setSuccessMsg(`Loteo "${name}" eliminado correctamente.`);
        onRefresh();
        setTimeout(() => setSuccessMsg(''), 2000);
      } else {
        setErrorMsg('No se pudo eliminar el loteo.');
      }
    } catch (err) {
      setErrorMsg('Error de red al eliminar el loteo.');
    }
  };

  const getUnsplashPreset = (index: number) => {
    const presets = [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80',
    ];
    setFormData(prev => ({ ...prev, imageUrl: presets[index] }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Toggle Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
        <div>
          <h3 className="font-sans font-bold text-slate-900 text-lg">Administración de Loteos</h3>
          <p className="text-xs text-slate-500">Agregá nuevos emprendimientos urbanísticos y modificá el catálogo del portal en tiempo real.</p>
        </div>
        <button
          onClick={() => {
            if (showAddForm) {
              setEditingLoteoId(null);
            }
            setShowAddForm(!showAddForm);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
            showAddForm 
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md'
          }`}
        >
          <Plus className={`w-4 h-4 transition-transform duration-300 ${showAddForm ? 'rotate-45' : ''}`} />
          {showAddForm ? 'Cerrar Formulario' : 'Cargar Nuevo Loteo'}
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
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                  <h4 className="font-bold text-slate-900 text-sm">
                    {editingLoteoId ? `Modificar Loteo: ${formData.name}` : 'Formulario de Alta de Loteo'}
                  </h4>
                </div>
                {editingLoteoId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLoteoId(null);
                      setFormData({
                        name: '',
                        location: 'Funes',
                        stage: 'Pre-venta',
                        scope: 'Rosario',
                        priceUSD: 25000,
                        sizeMin: 300,
                        sizeMax: 600,
                        distanceFromRosario: 15,
                        developer: '',
                        description: '',
                        longDescription: '',
                        imageUrl: '',
                        amenitiesRaw: 'Seguridad 24hs, S.U.M., Parquización, Calles Asfaltadas',
                        light: true,
                        gas: false,
                        water: false,
                        sewer: false,
                        internet: false,
                      });
                      setShowAddForm(false);
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer bg-red-50 hover:bg-red-100/80 px-2.5 py-1 rounded-lg border border-red-200/50 transition-colors"
                  >
                    Cancelar Edición
                  </button>
                )}
              </div>

              {/* Success / Error Banners */}
              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Main Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Nombre del Loteo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Vida San Sebastián"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Localidad / Comuna *</label>
                  <select
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="Funes">Funes</option>
                    <option value="Roldán">Roldán</option>
                    <option value="Ibarlucea">Ibarlucea</option>
                    <option value="Pueblo Esther">Pueblo Esther</option>
                    <option value="Alvear">Alvear</option>
                    <option value="General Lagos">General Lagos</option>
                    <option value="Santo Tomé">Santo Tomé</option>
                    <option value="Rafaela">Rafaela</option>
                    <option value="Bariloche">Bariloche</option>
                    <option value="Luján de Cuyo">Luján de Cuyo</option>
                    <option value="Tigre">Tigre</option>
                  </select>
                </div>

                {/* Developer */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Desarrolladora / Constructora</label>
                  <input
                    type="text"
                    placeholder="Ej. Rosental Inversiones"
                    value={formData.developer}
                    onChange={e => setFormData({ ...formData, developer: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>

                {/* Price USD */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Precio Desde (USD) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="Ej. 32000"
                    value={formData.priceUSD}
                    onChange={e => setFormData({ ...formData, priceUSD: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs font-mono border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>

                {/* Size Min */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Superficie Mínima (m²)</label>
                  <input
                    type="number"
                    min="100"
                    placeholder="Ej. 300"
                    value={formData.sizeMin}
                    onChange={e => setFormData({ ...formData, sizeMin: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs font-mono border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>

                {/* Size Max */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Superficie Máxima (m²)</label>
                  <input
                    type="number"
                    min="100"
                    placeholder="Ej. 800"
                    value={formData.sizeMax}
                    onChange={e => setFormData({ ...formData, sizeMax: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs font-mono border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>

                {/* Distance From Rosario */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Distancia a Rosario (km)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ej. 18"
                    value={formData.distanceFromRosario}
                    onChange={e => setFormData({ ...formData, distanceFromRosario: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs font-mono border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>

                {/* Stage */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Etapa de Desarrollo</label>
                  <select
                    value={formData.stage}
                    onChange={e => setFormData({ ...formData, stage: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="En Pozo">En Pozo</option>
                    <option value="Pre-venta">Pre-venta</option>
                    <option value="Posesión Inmediata">Posesión Inmediata</option>
                  </select>
                </div>

                {/* Scope */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Alcance Geográfico</label>
                  <select
                    value={formData.scope}
                    onChange={e => setFormData({ ...formData, scope: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="Rosario">Rosario & Gran Rosario</option>
                    <option value="Provincia">Provincia de Santa Fe</option>
                    <option value="Nacional">Nivel Nacional (Otras Provincias)</option>
                  </select>
                </div>

              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Descripción Breve *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Exclusivo barrio cerrado en Funes con lago artificial y servicios premium."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Amenities (Separados por coma)</label>
                  <input
                    type="text"
                    placeholder="Ej. Seguridad 24hs, S.U.M., Piscina, Canchas de Paddle, Fibra óptica"
                    value={formData.amenitiesRaw}
                    onChange={e => setFormData({ ...formData, amenitiesRaw: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Descripción Detallada (Larga)</label>
                <textarea
                  rows={3}
                  placeholder="Detallá los accesos, facilidades, arbolado público, plazos de entrega, forestación..."
                  value={formData.longDescription}
                  onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
                  className="w-full p-3 bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              {/* Image Input & Presets */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">URL de la Imagen Principal</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1 p-2.5 bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400">O usá un preset de alta calidad:</span>
                  <div className="flex gap-1.5">
                    {['Bosque', 'Familiar', 'Lago', 'Premium'].map((name, idx) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => getUnsplashPreset(idx)}
                        className="px-2.5 py-1 text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Images Input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Galería de Fotos Adicionales (URLs separadas por coma para el carrusel del detalle)</label>
                <textarea
                  rows={2}
                  placeholder="Ej: https://images.unsplash.com/foto1..., https://images.unsplash.com/foto2..."
                  value={formData.imagesRaw}
                  onChange={e => setFormData({ ...formData, imagesRaw: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all resize-none"
                ></textarea>
                <p className="text-[10px] text-slate-400 font-semibold">Cargá varias imágenes separadas por coma para habilitar el carrusel interactivo en el detalle del lote.</p>
              </div>

              {/* Services Checklist */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">Servicios de Infraestructura Disponibles</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                  {[
                    { key: 'light', label: 'Luz Eléctrica' },
                    { key: 'gas', label: 'Gas Natural' },
                    { key: 'water', label: 'Agua Corriente' },
                    { key: 'sewer', label: 'Cloacas' },
                    { key: 'internet', label: 'Fibra Óptica' },
                  ].map((srv) => (
                    <label key={srv.key} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!(formData as any)[srv.key]}
                        onChange={() => handleServiceChange(srv.key as any)}
                        className="w-4 h-4 rounded-md text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span>{srv.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting 
                  ? 'Guardando datos...' 
                  : editingLoteoId 
                    ? 'Guardar Cambios del Loteo' 
                    : 'Confirmar Registro y Publicar Loteo'
                }
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing Loteos Registry Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h4 className="font-bold text-slate-900 text-xs">Registro de Emprendimientos Certificados ({loteos.length})</h4>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-md font-bold">Catálogo Sincronizado</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-slate-800">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                <th className="p-4">Imagen & Loteo</th>
                <th className="p-4">Localidad</th>
                <th className="p-4">Etapa</th>
                <th className="p-4">Superficie</th>
                <th className="p-4 text-emerald-800">Monto Total</th>
                <th className="p-4">Servicios</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loteos.map((loteo) => (
                <tr key={loteo.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={loteo.imageUrl}
                      alt={loteo.name}
                      className="w-12 h-9 bg-slate-100 object-cover rounded-lg border border-slate-200 hover:scale-105 transition-transform"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">{loteo.name}</span>
                      <span className="text-[10px] text-slate-400">Desarrolladora: {loteo.developer}</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{loteo.location}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50 rounded-lg">
                      {loteo.stage}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-medium">{loteo.sizeMin} a {loteo.sizeMax} m²</td>
                  <td className="p-4 font-mono font-extrabold text-emerald-700">USD {loteo.priceUSD.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex gap-1 text-[10px]">
                      {loteo.services.light && <span className="bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded font-semibold border border-emerald-100">Luz</span>}
                      {loteo.services.gas && <span className="bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded font-semibold border border-emerald-100">Gas</span>}
                      {loteo.services.water && <span className="bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded font-semibold border border-emerald-100">Agua</span>}
                      {loteo.services.internet && <span className="bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded font-semibold border border-emerald-100">Fibra</span>}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEditClick(loteo)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Modificar Loteo"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLoteo(loteo.id, loteo.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar Loteo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
