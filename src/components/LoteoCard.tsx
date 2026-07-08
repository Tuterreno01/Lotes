/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loteo } from '../types';
import { MapPin, Crop, Lightbulb, Flame, Droplet, Wifi, Landmark, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LoteoCardProps {
  key?: string;
  loteo: Loteo;
  onSelect: (loteo: Loteo) => void;
  onInquire: (loteo: Loteo) => void;
}

export default function LoteoCard({ loteo, onSelect, onInquire }: LoteoCardProps) {
  // Determine badge styles for the development stage
  const getStageBadgeClass = (stage: Loteo['stage']) => {
    switch (stage) {
      case 'En Pozo':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Pre-venta':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Posesión Inmediata':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    onSelect(loteo);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className="bg-white border border-slate-200 hover:border-emerald-300/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full cursor-pointer group"
      id={`loteo-card-${loteo.id}`}
    >
      {/* Property Image & Badge */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100 group">
        <img
          src={loteo.imageUrl}
          alt={loteo.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-1 text-xs font-semibold border rounded-lg shadow-sm ${getStageBadgeClass(loteo.stage)}`}>
            {loteo.stage}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium font-mono px-2 py-1 rounded-md">
          {loteo.distanceFromRosario} km de Rosario
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title & Location */}
        <div className="mb-2.5">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mb-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{loteo.location}, Santa Fe</span>
          </div>
          <h3 className="text-xl font-sans font-bold text-slate-900 tracking-tight hover:text-emerald-700 transition-colors">
            {loteo.name}
          </h3>
        </div>

        {/* Short Description */}
        <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {loteo.description}
        </p>

        {/* Highlights/Stats */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 mb-4 bg-slate-50/50 rounded-xl px-3 text-slate-700">
          <div className="flex items-center gap-2">
            <Crop className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="text-xs">
              <span className="block text-slate-400 font-medium text-[9px] uppercase tracking-wider">Superficie</span>
              <span className="font-mono font-bold text-slate-800">{loteo.sizeMin}-{loteo.sizeMax} m²</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="text-xs">
              <span className="block text-slate-400 font-medium text-[9px] uppercase tracking-wider">Distancia</span>
              <span className="font-sans font-bold text-slate-800">{loteo.distanceFromRosario} km de Ros.</span>
            </div>
          </div>
        </div>

        {/* Services Status bar */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Servicios:</span>
          <div className="flex gap-2.5">
            <span title="Luz eléctrica" className={`p-1 rounded-md border ${loteo.services.light ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
              <Lightbulb className="w-3.5 h-3.5" />
            </span>
            <span title="Gas natural" className={`p-1 rounded-md border ${loteo.services.gas ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
              <Flame className="w-3.5 h-3.5" />
            </span>
            <span title="Agua corriente" className={`p-1 rounded-md border ${loteo.services.water ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
              <Droplet className="w-3.5 h-3.5" />
            </span>
            <span title="Fibra óptica" className={`p-1 rounded-md border ${loteo.services.internet ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
              <Wifi className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Pricing & Footer Button Actions */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Desde</span>
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              USD {loteo.priceUSD.toLocaleString()}
            </span>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => onSelect(loteo)}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1"
              id={`loteo-btn-ver-${loteo.id}`}
            >
              Ficha
            </button>
            <button
              onClick={() => onInquire(loteo)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              id={`loteo-btn-consultar-${loteo.id}`}
            >
              Consultar
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
