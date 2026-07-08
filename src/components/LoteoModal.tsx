/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Loteo, Inquiry } from '../types';
import { X, MapPin, CheckCircle2, ChevronLeft, ChevronRight, Send, Flame, Lightbulb, Droplet, Wifi, Landmark, Shield, Calendar, DollarSign, Crop, Phone, Mail, User, Briefcase, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoteoModalProps {
  loteo: Loteo | null;
  onClose: () => void;
  onSubmitInquiry: (inquiryData: Omit<Inquiry, 'id' | 'timestamp'>) => Promise<boolean>;
}

export default function LoteoModal({ loteo, onClose, onSubmitInquiry }: LoteoModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset active image index when loading a different loteo
  React.useEffect(() => {
    setActiveImageIndex(0);
  }, [loteo?.id]);

  if (!loteo) return null;

  const loteoImages = loteo.images && loteo.images.length > 0 ? loteo.images : [loteo.imageUrl];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev === 0 ? loteoImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev === loteoImages.length - 1 ? 0 : prev + 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Por favor ingresá tu nombre y correo electrónico.");
      return;
    }

    setSubmitting(true);
    const success = await onSubmitInquiry({
      loteoId: loteo.id,
      loteoName: loteo.name,
      clientName: formData.name,
      clientEmail: formData.email,
      clientPhone: formData.phone,
      message: formData.message || `Hola, me interesa recibir más información sobre el loteo ${loteo.name} en ${loteo.location}.`
    });

    setSubmitting(false);
    if (success) {
      setSubmittedSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => {
        setSubmittedSuccess(false);
      }, 5000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-center items-start p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden relative border border-slate-200 my-8"
        >
          {/* Close button with high visibility */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-950 text-emerald-400 p-3 rounded-full shadow-lg border-2 border-emerald-500/80 transition-all z-50 cursor-pointer hover:scale-110 flex items-center justify-center hover:bg-emerald-600 hover:text-white"
            id="modal-close-btn"
            title="Cerrar y seguir buscando"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Image Slider */}
          <div className="relative h-64 md:h-85 bg-slate-900 overflow-hidden group">
            <img
              src={loteoImages[activeImageIndex]}
              alt={`${loteo.name} - Imagen ${activeImageIndex + 1}`}
              className="w-full h-full object-cover select-none transition-all duration-300"
            />
            
            {/* Navigation arrows */}
            {loteoImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-xs transition-all z-20 cursor-pointer hover:scale-110 active:scale-95 flex items-center justify-center border border-white/10"
                  title="Imagen Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-xs transition-all z-20 cursor-pointer hover:scale-110 active:scale-95 flex items-center justify-center border border-white/10"
                  title="Siguiente Imagen"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-6 md:p-8">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-sm">
                  {loteo.stage}
                </span>
                <span className="px-3 py-1 bg-slate-800/80 backdrop-blur-xs text-slate-200 text-xs font-medium rounded-lg">
                  {loteo.location}
                </span>
                {loteoImages.length > 1 && (
                  <span className="px-2.5 py-1 bg-slate-900/60 backdrop-blur-xs text-slate-300 text-xs font-semibold font-mono rounded-lg border border-white/10">
                    {activeImageIndex + 1} / {loteoImages.length}
                  </span>
                )}
              </div>
              <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-white tracking-tight">
                {loteo.name}
              </h2>
              <p className="text-slate-200 text-sm md:text-base mt-2 max-w-xl flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                A sólo {loteo.distanceFromRosario} km de Rosario — Localidad de {loteo.location}, Santa Fe.
              </p>
            </div>

            {/* Photo Indicator Dots */}
            {loteoImages.length > 1 && (
              <div className="absolute bottom-4 right-6 md:right-8 z-20 flex gap-1.5 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-xs">
                {loteoImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'bg-emerald-500 w-4' : 'bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Modal Grid body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8">
            
            {/* Left Content (8 columns) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Core Features Specs Card */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200/60 rounded-xl text-center">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Superficie</span>
                  <span className="text-sm font-extrabold text-slate-800 font-mono">{loteo.sizeMin} a {loteo.sizeMax} m²</span>
                </div>
                <div className="border-l border-slate-200">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precio Total Desde</span>
                  <span className="text-sm font-extrabold text-emerald-700 font-mono">USD {loteo.priceUSD.toLocaleString()}</span>
                </div>
              </div>

              {/* Developer / Builder Block */}
              <div className="flex items-center gap-3.5 p-4 bg-emerald-50/30 border border-emerald-100/60 rounded-xl">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Desarrolladora / Constructora</span>
                  <span className="text-sm font-extrabold text-slate-900 truncate block">{loteo.developer}</span>
                </div>
                <div className="flex items-center gap-1 bg-emerald-100/60 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200/40">
                  <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Certificada LoteAR</span>
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Sobre el desarrollo</h4>
                <p className="text-slate-700 text-sm leading-relaxed font-sans whitespace-pre-line">
                  {loteo.longDescription}
                </p>
              </div>

              {/* Infrastructure Services */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Infraestructura y Servicios</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${loteo.services.light ? 'bg-emerald-50/50 border-emerald-100 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <Lightbulb className={`w-5 h-5 ${loteo.services.light ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <div>
                      <span className="block text-xs font-bold">Electricidad</span>
                      <span className="text-[10px] text-slate-500">{loteo.services.light ? 'Tendido Subterráneo/Aéreo' : 'No disponible'}</span>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${loteo.services.gas ? 'bg-emerald-50/50 border-emerald-100 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <Flame className={`w-5 h-5 ${loteo.services.gas ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <div>
                      <span className="block text-xs font-bold">Gas Natural</span>
                      <span className="text-[10px] text-slate-500">{loteo.services.gas ? 'Red Conectada' : 'No disponible'}</span>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${loteo.services.water ? 'bg-emerald-50/50 border-emerald-100 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <Droplet className={`w-5 h-5 ${loteo.services.water ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <div>
                      <span className="block text-xs font-bold">Agua Corriente</span>
                      <span className="text-[10px] text-slate-500">{loteo.services.water ? 'Ómosis Inversa / Red' : 'No disponible'}</span>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${loteo.services.internet ? 'bg-emerald-50/50 border-emerald-100 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <Wifi className={`w-5 h-5 ${loteo.services.internet ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <div>
                      <span className="block text-xs font-bold">Fibra Óptica</span>
                      <span className="text-[10px] text-slate-500">{loteo.services.internet ? 'Internet Banda Ancha' : 'No disponible'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities List */}
              {loteo.amenities && loteo.amenities.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Amenities y Áreas Comunes</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
                    {loteo.amenities.map((am, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{am}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            {/* Right Inquiry Form Card (5 columns) */}
            <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 md:p-6 self-start space-y-4">
              <div className="text-center pb-3 border-b border-slate-200/50">
                <h3 className="font-sans font-bold text-slate-900 text-lg">Solicitar Información</h3>
                <p className="text-xs text-slate-500 mt-1">Un consultor especializado te responderá en minutos con planos oficiales de manzana.</p>
              </div>

              {submittedSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center text-emerald-850"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h4 className="font-bold text-base">¡Consulta Recibida!</h4>
                  <p className="text-xs text-emerald-700 mt-2 leading-relaxed">
                    Hemos registrado tu contacto correctamente para el loteo <strong>{loteo.name}</strong>. Un especialista se comunicará vía WhatsApp o mail para enviarte planos de disponibilidad y promociones exclusivas.
                  </p>
                  <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
                    Un asesor especializado te responderá a la brevedad con los planos oficiales de disponibilidad.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Nombre Completo</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Ej. Dante Massi"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-white text-slate-800 text-sm border border-slate-200 rounded-xl outline-none focus:border-slate-400 transition-all"
                        id="inquiry-input-name"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Correo Electrónico</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="Ej. dante@gmail.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-white text-slate-800 text-sm border border-slate-200 rounded-xl outline-none focus:border-slate-400 transition-all"
                        id="inquiry-input-email"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Teléfono / WhatsApp</label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="Ej. 341 5556789"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-white text-slate-800 text-sm border border-slate-200 rounded-xl outline-none focus:border-slate-400 transition-all"
                        id="inquiry-input-phone"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Mensaje o Consulta</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder={`Hola, deseo recibir planos oficiales, factibilidad de gas natural, financiación y lista de precios actualizada del loteo ${loteo.name}.`}
                      className="w-full p-3 bg-white text-slate-800 text-sm border border-slate-200 rounded-xl outline-none focus:border-slate-400 transition-all resize-none"
                      id="inquiry-input-msg"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    id="inquiry-submit-btn"
                  >
                    {submitting ? (
                      <span>Enviando...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Enviar Consulta Directa</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 justify-center text-[10px] text-slate-400 mt-2">
                    <Shield className="w-3.5 h-3.5 text-slate-300" />
                    <span>Tus datos están protegidos por LoteAR</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
