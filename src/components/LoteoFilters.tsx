/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FilterState, Loteo } from '../types';
import { LOCATIONS, STAGES, SCOPES, DEVELOPERS } from '../data/loteos';
import { Search, MapPin, Layers, DollarSign, Crop, CheckSquare, Square, RefreshCw, Briefcase, Globe } from 'lucide-react';

interface LoteoFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  loteos: Loteo[];
}

export default function LoteoFilters({ filters, onChange, onClear, loteos }: LoteoFiltersProps) {
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, searchQuery: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, location: e.target.value });
  };

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, stage: e.target.value });
  };

  const handleScopeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, scope: e.target.value });
  };

  const handleDeveloperChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, developer: e.target.value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, maxPrice: Number(e.target.value) });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, minSize: Number(e.target.value) });
  };

  const toggleCheckbox = (field: 'hasGas' | 'hasWater' | 'hasSewer' | 'hasInternet') => {
    onChange({ ...filters, [field]: !filters[field] });
  };

  // Helper to count results matching these filters
  const filterCount = loteos.filter(l => {
    const matchQuery = l.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                       l.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                       l.location.toLowerCase().includes(filters.searchQuery.toLowerCase());
    const matchLoc = filters.location === 'all' || l.location === filters.location;
    const matchStage = filters.stage === 'all' || l.stage === filters.stage;
    const matchScope = !filters.scope || filters.scope === 'all' || l.scope === filters.scope;
    const matchDev = !filters.developer || filters.developer === 'all' || l.developer === filters.developer;
    const matchPrice = l.priceUSD <= filters.maxPrice;
    const matchSize = l.sizeMax >= filters.minSize;
    const matchGas = !filters.hasGas || l.services.gas;
    const matchWater = !filters.hasWater || l.services.water;
    const matchSewer = !filters.hasSewer || l.services.sewer;
    const matchInternet = !filters.hasInternet || l.services.internet;

    return matchQuery && matchLoc && matchStage && matchScope && matchDev && matchPrice && matchSize && matchGas && matchWater && matchSewer && matchInternet;
  }).length;


  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-20 z-20">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <h3 className="font-sans font-bold text-slate-900 text-lg flex items-center gap-2">
          Filtrar Lotes
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-mono font-semibold">
            {filterCount} resultados
          </span>
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1 cursor-pointer font-medium"
          id="btn-clear-filters"
        >
          <RefreshCw className="w-3 h-3" />
          Restablecer
        </button>
      </div>

      {/* 1. Search Query */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Búsqueda rápida</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre, zona..."
            value={filters.searchQuery}
            onChange={handleTextChange}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white text-slate-800 text-sm border border-slate-200 focus:border-slate-400 rounded-xl outline-none transition-colors"
            id="filter-search-input"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* 2. Nivel Geográfico Select */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          Cobertura Geográfica
        </label>
        <div className="relative">
          <select
            value={filters.scope || 'all'}
            onChange={handleScopeChange}
            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 font-semibold text-slate-800 text-sm border border-slate-200 focus:border-slate-400 rounded-xl outline-none appearance-none transition-colors cursor-pointer"
            id="filter-scope-select"
          >
            {SCOPES.map(scopeObj => (
              <option key={scopeObj.value} value={scopeObj.value}>
                {scopeObj.label}
              </option>
            ))}
          </select>
          <Globe className="w-4 h-4 text-emerald-600 absolute left-3 top-3.5" />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {/* 3. Developer Select */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Desarrolladora / Constructora</label>
        <div className="relative">
          <select
            value={filters.developer || 'all'}
            onChange={handleDeveloperChange}
            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 text-slate-800 text-sm border border-slate-200 focus:border-slate-400 rounded-xl outline-none appearance-none transition-colors cursor-pointer"
            id="filter-developer-select"
          >
            {DEVELOPERS.map(dev => (
              <option key={dev} value={dev}>
                {dev === 'all' ? 'Todas las constructoras' : dev}
              </option>
            ))}
          </select>
          <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {/* 4. Location Select */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Ciudad / Comuna específica</label>
        <div className="relative">
          <select
            value={filters.location}
            onChange={handleLocationChange}
            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 text-slate-800 text-sm font-medium border border-slate-200 focus:border-slate-400 rounded-xl outline-none appearance-none transition-colors cursor-pointer"
            id="filter-location-select"
          >
            <option value="all">Todas las ciudades / Comunas</option>
            
            <optgroup label="Gran Rosario">
              <option value="Funes">Funes</option>
              <option value="Roldán">Roldán</option>
              <option value="Ibarlucea">Ibarlucea</option>
              <option value="Pueblo Esther">Pueblo Esther</option>
              <option value="Alvear">Alvear</option>
              <option value="General Lagos">General Lagos</option>
            </optgroup>
            
            <optgroup label="Provincia de Santa Fe">
              <option value="Santo Tomé">Santo Tomé</option>
              <option value="Rafaela">Rafaela</option>
            </optgroup>
            
            <optgroup label="Otras Provincias">
              <option value="Bariloche">Bariloche</option>
              <option value="Luján de Cuyo">Luján de Cuyo</option>
              <option value="Tigre">Tigre</option>
            </optgroup>
          </select>
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {/* 5. Stage Select */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Etapa del Proyecto</label>
        <div className="relative">
          <select
            value={filters.stage}
            onChange={handleStageChange}
            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 text-slate-800 text-sm border border-slate-200 focus:border-slate-400 rounded-xl outline-none appearance-none transition-colors cursor-pointer"
            id="filter-stage-select"
          >
            {STAGES.map(stage => (
              <option key={stage} value={stage}>
                {stage === 'all' ? 'Cualquier etapa' : stage}
              </option>
            ))}
          </select>
          <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {/* 6. Price Slider */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Precio máximo</label>
          <span className="text-sm font-bold text-slate-900 font-mono">USD {filters.maxPrice.toLocaleString()}</span>
        </div>
        <div className="relative flex items-center">
          <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2" />
          <input
            type="range"
            min="15000"
            max="120000"
            step="1000"
            value={filters.maxPrice}
            onChange={handlePriceChange}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
            id="filter-price-slider"
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
          <span>USD 15k</span>
          <span>USD 120k</span>
        </div>
      </div>

      {/* 7. Size Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Superficie mínima</label>
          <span className="text-sm font-bold text-slate-900 font-mono">{filters.minSize} m²</span>
        </div>
        <div className="relative flex items-center">
          <Crop className="w-3.5 h-3.5 text-slate-400 absolute left-2" />
          <input
            type="range"
            min="300"
            max="1000"
            step="50"
            value={filters.minSize}
            onChange={handleSizeChange}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
            id="filter-size-slider"
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
          <span>300 m²</span>
          <span>1000 m²</span>
        </div>
      </div>

      {/* 6. Service Checklist */}
      <div className="pt-4 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Servicios Disponibles</label>
        <div className="space-y-2.5">
          <button
            onClick={() => toggleCheckbox('hasGas')}
            className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-slate-900 w-full text-left transition-colors cursor-pointer"
            id="filter-chk-gas"
          >
            {filters.hasGas ? (
              <CheckSquare className="w-4.5 h-4.5 text-emerald-600 fill-emerald-50" />
            ) : (
              <Square className="w-4.5 h-4.5 text-slate-300" />
            )}
            <span>Gas Natural</span>
          </button>

          <button
            onClick={() => toggleCheckbox('hasWater')}
            className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-slate-900 w-full text-left transition-colors cursor-pointer"
            id="filter-chk-water"
          >
            {filters.hasWater ? (
              <CheckSquare className="w-4.5 h-4.5 text-emerald-600 fill-emerald-50" />
            ) : (
              <Square className="w-4.5 h-4.5 text-slate-300" />
            )}
            <span>Agua Corriente</span>
          </button>

          <button
            onClick={() => toggleCheckbox('hasSewer')}
            className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-slate-900 w-full text-left transition-colors cursor-pointer"
            id="filter-chk-sewer"
          >
            {filters.hasSewer ? (
              <CheckSquare className="w-4.5 h-4.5 text-emerald-600 fill-emerald-50" />
            ) : (
              <Square className="w-4.5 h-4.5 text-slate-300" />
            )}
            <span>Cloacas de Red</span>
          </button>

          <button
            onClick={() => toggleCheckbox('hasInternet')}
            className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-slate-900 w-full text-left transition-colors cursor-pointer"
            id="filter-chk-internet"
          >
            {filters.hasInternet ? (
              <CheckSquare className="w-4.5 h-4.5 text-emerald-600 fill-emerald-50" />
            ) : (
              <Square className="w-4.5 h-4.5 text-slate-300" />
            )}
            <span>Fibra Óptica</span>
          </button>
        </div>
      </div>
    </div>
  );
}
