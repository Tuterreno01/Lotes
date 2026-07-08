/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, Mail, Phone, MapPin, Layers, Send, CheckCircle2, 
  ArrowRight, ShieldCheck, HelpCircle, FileText, Globe2, AlertCircle,
  UploadCloud, X, Paperclip
} from 'lucide-react';
import { Inquiry } from '../types';

interface DeveloperContactProps {
  onSubmitInquiry: (inquiryData: Omit<Inquiry, 'id' | 'timestamp'>) => Promise<boolean>;
}

export default function DeveloperContact({ onSubmitInquiry }: DeveloperContactProps) {
  const [formData, setFormData] = useState({
    developerName: '',
    email: '',
    phone: '',
    loteoName: '',
    location: '',
    totalLots: '',
    services: {
      light: false,
      gas: false,
      water: false,
      sewer: false,
      internet: false
    },
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: number; type: string; dataUrl?: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const processFile = (file: File) => {
    if (!file) return;
    
    // Check size limit (12MB)
    const maxSize = 12 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMsg('El archivo es demasiado grande. El límite para adjuntar es de 12MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setAttachedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: e.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
  };

  const handleCheckboxChange = (serviceKey: keyof typeof formData.services) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceKey]: !prev.services[serviceKey]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.developerName || !formData.email || !formData.loteoName || !formData.location) {
      setErrorMsg('Por favor completá los campos requeridos (*).');
      return;
    }

    setSubmitting(true);

    // Build list of checked services for message format
    const selectedServicesList = Object.entries(formData.services)
      .filter(([_, checked]) => checked)
      .map(([name]) => {
        const translate: Record<string, string> = {
          light: 'Electricidad',
          gas: 'Gas Natural',
          water: 'Agua Corriente',
          sewer: 'Cloacas',
          internet: 'Internet Fibra'
        };
        return translate[name] || name;
      });

    const formattedMessage = `
[Propuesta de Publicación de Loteo]
- Desarrollador / Empresa: ${formData.developerName}
- Teléfono: ${formData.phone || 'No especificado'}
- Nombre del Desarrollo: ${formData.loteoName}
- Localidad/Ubicación: ${formData.location}
- Cantidad de Lotes: ${formData.totalLots || 'No especificada'}
- Servicios Disponibles: ${selectedServicesList.length > 0 ? selectedServicesList.join(', ') : 'Ninguno seleccionado'}
${attachedFile ? `- Archivo Adjunto: ${attachedFile.name} (${(attachedFile.size / (1024 * 1024)).toFixed(2)} MB)` : ''}

Comentarios del Desarrollador:
${formData.message || 'Sin comentarios adicionales.'}
    `.trim();

    try {
      const success = await onSubmitInquiry({
        loteoId: 'PROPOSAL',
        loteoName: `Propuesta: ${formData.loteoName}`,
        clientName: formData.developerName,
        clientEmail: formData.email,
        clientPhone: formData.phone || 'No especificado',
        message: formattedMessage,
        attachment: attachedFile ? {
          name: attachedFile.name,
          size: attachedFile.size,
          type: attachedFile.type,
          dataUrl: attachedFile.dataUrl
        } : undefined
      });

      if (success) {
        setSubmitted(true);
        // Clear form
        setFormData({
          developerName: '',
          email: '',
          phone: '',
          loteoName: '',
          location: '',
          totalLots: '',
          services: { light: false, gas: false, water: false, sewer: false, internet: false },
          message: ''
        });
        setAttachedFile(null);
      } else {
        setErrorMsg('Ocurrió un error al procesar tu solicitud. Por favor reintentá.');
      }
    } catch (err) {
      setErrorMsg('Error de conexión. Intente nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // Prefilled mailto link to facilitate sending masterplans/attachments directly to tupropioterreno1@gmail.com
  const mailtoUrl = `mailto:tupropioterreno1@gmail.com?subject=Propuesta de Publicacion Loteo - LoteAR&body=Hola equipo de LoteAR,%0D%0DAdjunto planos, renders y listas de precios de nuestro desarrollo para evaluar su incorporacion en la plataforma.%0D%0DAtentamente,%0D%0D`;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Info Column (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-emerald-950 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-48 h-48 bg-emerald-800 rounded-full blur-3xl opacity-30"></div>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-800 text-emerald-300 uppercase tracking-wide border border-emerald-700/50 mb-6">
              <Building2 className="w-3.5 h-3.5 animate-pulse" /> Desarrolladores
            </span>

            <h3 className="text-2xl font-sans font-extrabold tracking-tight mb-4 leading-tight">
              Sumá tu desarrollo a LoteAR
            </h3>
            
            <p className="text-xs text-emerald-200/90 leading-relaxed mb-6">
              Llegá a miles de inversores y familias buscando activamente terrenos listos para construir. Brindamos soporte con asesoría IA, estadísticas en tiempo real y campañas dedicadas de publicidad.
            </p>

            <div className="space-y-4 pt-4 border-t border-emerald-800">
              <div className="flex gap-3 items-start text-xs text-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="block text-white">Publicación Express</strong>
                  <span>Revisamos tu propuesta técnica y plano de mensura en menos de 24 hs hábiles.</span>
                </div>
              </div>
              
              <div className="flex gap-3 items-start text-xs text-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="block text-white">Canal Unificado Directo</strong>
                  <span>Todas las consultas y solicitudes de tus clientes potenciales se derivan automáticamente a administración.</span>
                </div>
              </div>

              <div className="flex gap-3 items-start text-xs text-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="block text-white">Soporte Multimedial</strong>
                  <span>Cargamos tus carpetas comerciales completas, renders en alta resolución y planillas de financiación.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column (7 columns) */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans font-extrabold text-slate-900 text-2xl tracking-tight">¡Propuesta Registrada!</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                    Muchas gracias. Hemos registrado correctamente tu propuesta comercial. Toda la información ha sido recopilada de manera segura para ser revisada por nuestro equipo de administración.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Pronto nos pondremos en contacto vía mail o WhatsApp con la cotización de publicación y detalles técnicos del alta.
                </div>

                <div className="flex justify-center pt-2 max-w-xs mx-auto">
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="w-full px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    Cargar otra propuesta
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-lg font-sans font-bold text-slate-900 mb-1">Formulario de Solicitud de Publicación</h3>
                  <p className="text-xs text-slate-400">Completá los detalles técnicos del loteo para habilitar su carga rápida.</p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nombre de Desarrollador / Empresa *</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Pecam S.A."
                        value={formData.developerName}
                        onChange={e => setFormData({...formData, developerName: e.target.value})}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
                      />
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nombre del Loteo *</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Lares de Ibarlucea"
                        value={formData.loteoName}
                        onChange={e => setFormData({...formData, loteoName: e.target.value})}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
                      />
                      <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email de Contacto Comercial *</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        required
                        placeholder="Ej. ventas@desarrollos.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Teléfono / WhatsApp de Contacto</label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        placeholder="Ej. 341 15556789"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ubicación / Localidad *</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Roldán, Santa Fe"
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
                      />
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cantidad de Lotes aproximada</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        placeholder="Ej. 120"
                        value={formData.totalLots}
                        onChange={e => setFormData({...formData, totalLots: e.target.value})}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
                      />
                      <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>

                {/* Services Checklist */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Servicios Públicos de la Zona</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-200/50">
                    {Object.keys(formData.services).map((serviceKey) => {
                      const key = serviceKey as keyof typeof formData.services;
                      const labelMap: Record<string, string> = {
                        light: 'Luz',
                        gas: 'Gas Natural',
                        water: 'Agua C.',
                        sewer: 'Cloacas',
                        internet: 'Fibra'
                      };
                      return (
                        <label 
                          key={serviceKey} 
                          className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none"
                        >
                          <input 
                            type="checkbox"
                            checked={formData.services[key]}
                            onChange={() => handleCheckboxChange(key)}
                            className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                          />
                          <span>{labelMap[serviceKey] || serviceKey}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Message field */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Detalles del Proyecto y Financiación</label>
                  <textarea 
                    rows={4}
                    placeholder="Contanos brevemente las medidas de los terrenos, si ofrecen planes de financiación CAC, porcentaje de anticipo, o plazos estimados de entrega de posesión..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-850 resize-none"
                  ></textarea>
                </div>

                {/* File Attachment field */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Adjuntar Máster Plan, Lista de Precios o Presentación (Opcional)
                  </label>
                  
                  {attachedFile ? (
                    <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center shrink-0">
                          <Paperclip className="w-5 h-5" />
                        </div>
                        <div className="text-left overflow-hidden">
                          <p className="text-xs font-bold text-emerald-950 truncate max-w-[200px] sm:max-w-md">{attachedFile.name}</p>
                          <p className="text-[10px] text-emerald-700 font-mono">
                            {(attachedFile.size / 1024).toFixed(0)} KB • {attachedFile.type.split('/')[1]?.toUpperCase() || 'Archivo'}
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        type="button"
                        onClick={removeFile}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        title="Quitar archivo"
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
                        dragActive 
                          ? 'border-emerald-500 bg-emerald-50/50' 
                          : 'border-slate-200 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <input 
                        type="file" 
                        id="file-upload-input"
                        className="hidden" 
                        onChange={handleFileChange}
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                      />
                      <label htmlFor="file-upload-input" className="cursor-pointer space-y-2 block">
                        <UploadCloud className={`w-8 h-8 mx-auto transition-all ${dragActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-slate-700">
                            Arrastrá tus archivos acá o <span className="text-emerald-600 underline">buscalos en tu equipo</span>
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Soporta PDF, Planos (PNG, JPG), Carpetas de precios (Excel, Word) de hasta 12MB
                          </p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-2xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Registrando propuesta...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Registrar Propuesta en LoteAR
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-400 text-center leading-normal">
                  Al enviar, la propuesta quedará registrada de forma segura en el Panel de Administración de LoteAR para su evaluación técnica y aprobación inmediata.
                </p>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
