/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Inquiry } from '../types';
import { Mail, Phone, Calendar, User, Eye, Compass, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminInquiriesProps {
  inquiries: Inquiry[];
  onRefresh: () => void;
}

export default function AdminInquiries({ inquiries, onRefresh }: AdminInquiriesProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
        <div>
          <h2 className="text-xl font-sans font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Panel de Consultas Recibidas (Leads)
            <span className="text-xs bg-slate-150 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
              {inquiries.length} recibidas
            </span>
          </h2>
          <p className="text-xs text-slate-500">Comprobá en tiempo real las consultas enviadas por los interesados.</p>
        </div>
        <button
          onClick={onRefresh}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer self-start"
          id="admin-btn-refresh"
        >
          Actualizar Lista
        </button>
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl max-w-xl mx-auto">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Compass className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">No hay consultas registradas aún</h4>
          <p className="text-xs text-slate-500 mt-2.5 max-w-xs mx-auto leading-relaxed">
            Hacé clic en <strong>Consultar</strong> dentro de cualquier loteo, completá el formulario de contacto y verás cómo ingresa el prospecto en este panel de inmediato.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inquiries.map((inquiry) => (
            <motion.div
              key={inquiry.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 bg-slate-50/50 transition-colors flex flex-col justify-between"
              id={`inquiry-lead-${inquiry.id}`}
            >
              <div>
                {/* Header info */}
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
                    {inquiry.loteoName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {inquiry.timestamp}
                  </span>
                </div>

                {/* Client info */}
                <div className="space-y-1.5 text-xs text-slate-700 mb-3.5">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {inquiry.clientName}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {inquiry.clientEmail}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {inquiry.clientPhone}
                  </p>
                </div>

                {/* Message */}
                <div className="p-3 bg-white border border-slate-200/60 rounded-lg text-xs text-slate-600 italic leading-relaxed">
                  "{inquiry.message}"
                </div>
              </div>

              {/* Action Simulation / Status */}
              <div className="mt-4 pt-3 border-t border-slate-100/80 flex justify-between items-center text-[10px]">
                <span className="text-slate-400 font-semibold font-mono">ID: #{inquiry.id}</span>
                <span className="text-emerald-600 bg-emerald-500/15 border border-emerald-500/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Pendiente de contacto
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
