/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Calculator, HelpCircle, AlertCircle, ArrowUpRight, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

export default function CacSimulator() {
  const [montoTotal, setMontoTotal] = useState<number>(30000);
  const [anticipo, setAnticipo] = useState<number>(12000);
  const [plazoCuotas, setPlazoCuotas] = useState<number>(36);
  const [cacProyectado, setCacProyectado] = useState<number>(3.5); // % mensual proyectado

  const saldoAFinanciar = montoTotal - anticipo > 0 ? montoTotal - anticipo : 0;
  const cuotaBaseUSD = saldoAFinanciar / plazoCuotas;

  // Generate projections for the first 12 installments showing how they step up with the compound CAC index
  const getProyeccionCuotas = () => {
    let cuotas = [];
    let valorAcumulado = cuotaBaseUSD;
    for (let i = 1; i <= Math.min(plazoCuotas, 12); i++) {
      valorAcumulado = valorAcumulado * (1 + (cacProyectado / 100));
      cuotas.push({
        numero: i,
        valorUSD: valorAcumulado,
        incremento: valorAcumulado - cuotaBaseUSD
      });
    }
    return cuotas;
  };

  const proyeccion = getProyeccionCuotas();
  const cuotaEstimadaFin = cuotaBaseUSD * Math.pow(1 + (cacProyectado / 100), plazoCuotas);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-sans font-extrabold text-slate-900 tracking-tight">Simulador de Cuotas + Índice CAC</h2>
          <p className="text-xs text-slate-500">Calculá la proyección de tus cuotas ajustadas por el Costo de la Construcción.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Monto Total del Terreno (USD)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm font-semibold">USD</span>
              <input
                type="number"
                min="10000"
                max="200000"
                step="1000"
                value={montoTotal}
                onChange={e => setMontoTotal(Number(e.target.value))}
                className="w-full pl-14 pr-3 py-2 bg-slate-50 text-slate-800 text-sm font-mono font-bold border border-slate-200 focus:border-slate-400 rounded-xl outline-none transition-all"
                id="sim-input-total"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>Mín: USD 10k</span>
              <span>Máx: USD 200k</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Anticipo en Dólares (USD)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm font-semibold">USD</span>
              <input
                type="number"
                min="0"
                max={montoTotal}
                step="500"
                value={anticipo}
                onChange={e => setAnticipo(Number(e.target.value))}
                className="w-full pl-14 pr-3 py-2 bg-slate-50 text-slate-800 text-sm font-mono font-bold border border-slate-200 focus:border-slate-400 rounded-xl outline-none transition-all"
                id="sim-input-anticipo"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Equivale al {montoTotal > 0 ? Math.round((anticipo / montoTotal) * 100) : 0}% del valor total del lote.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Plazo (Meses)</label>
              <select
                value={plazoCuotas}
                onChange={e => setPlazoCuotas(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 text-slate-800 text-sm border border-slate-200 focus:border-slate-400 rounded-xl outline-none appearance-none cursor-pointer transition-all"
                id="sim-select-plazo"
              >
                <option value={12}>12 Cuotas</option>
                <option value={24}>24 Cuotas</option>
                <option value={36}>36 Cuotas</option>
                <option value={48}>48 Cuotas</option>
                <option value={60}>60 Cuotas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">CAC Proyectado</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="15"
                  value={cacProyectado}
                  onChange={e => setCacProyectado(Number(e.target.value))}
                  className="w-full pr-8 pl-3 py-2 bg-slate-50 text-slate-800 text-sm font-mono border border-slate-200 focus:border-slate-400 rounded-xl outline-none transition-all"
                  id="sim-input-cac"
                />
                <span className="absolute right-3.5 top-2.5 text-slate-400 font-bold text-xs">% mes</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800 leading-relaxed">
              <strong>Nota sobre el índice CAC:</strong> Es publicado mensualmente por la Cámara Argentina de la Construcción y mide la variación del costo de materiales y mano de obra. Las cuotas usualmente se pesifican al tipo de cambio oficial del día de firma y luego se indexan por CAC.
            </p>
          </div>
        </div>

        {/* Right Side: Projections and Graphs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Monto a Financiar</span>
              <span className="text-xl font-extrabold text-slate-900 font-mono">USD {saldoAFinanciar.toLocaleString()}</span>
              <span className="block text-[10px] text-slate-500 mt-1">Saldo luego del anticipo</span>
            </div>

            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
              <span className="block text-[10px] text-emerald-800 font-bold uppercase tracking-wider mb-1">Cuota Base Sin Ajuste</span>
              <span className="text-xl font-extrabold text-emerald-950 font-mono">USD {Math.round(cuotaBaseUSD).toLocaleString()}</span>
              <span className="block text-[10px] text-emerald-700 mt-1">Valor inicial de la cuota</span>
            </div>
          </div>

          {/* Forecasted Progression */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Progresión Proyectada de Cuotas (Primeros 12 meses)</h3>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">Proyección {cacProyectado}%/mes</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {proyeccion.map((cuota) => (
                <div key={cuota.numero} className="flex justify-between items-center px-4 py-2.5 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-[10px] font-mono font-bold">
                      {cuota.numero}
                    </span>
                    <span className="text-slate-600">Cuota {cuota.numero}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-800">USD {Math.round(cuota.valorUSD).toLocaleString()}</span>
                    <span className="block text-[10px] text-emerald-600 font-semibold font-mono">+{Math.round((cuota.valorUSD - cuotaBaseUSD) / cuotaBaseUSD * 100)}% acumulado</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Max installments alert */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Cuota estimada al finalizar el plazo ({plazoCuotas} meses):</span>
              <span className="text-sm text-slate-400 block italic">Suponiendo inflación estable de {cacProyectado}% mensual.</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-slate-900 font-mono">USD {Math.round(cuotaEstimadaFin).toLocaleString()}</span>
              <span className="block text-[10px] text-red-500 font-bold flex items-center justify-end gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                +{Math.round((cuotaEstimadaFin - cuotaBaseUSD) / cuotaBaseUSD * 100)}% de aumento total
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
