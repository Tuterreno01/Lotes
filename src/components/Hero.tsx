/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Search, Compass, Calculator, Sparkles } from 'lucide-react';

interface HeroProps {
  onSearchClick: () => void;
  totalLoteos: number;
}

export default function Hero({ onSearchClick, totalLoteos }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 py-16 md:py-24 border-b border-slate-200">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-50 rounded-full filter blur-3xl opacity-70 -translate-y-12"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-50 rounded-full filter blur-3xl opacity-60 translate-y-12"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Logo / Tagline */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold tracking-wide uppercase border border-emerald-100 mb-6"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
            <span>Encontrá tu lugar en Rosario y la región</span>
          </motion.div>

          {/* Main Typography Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-sans font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            Tu terreno ideal en <span className="text-emerald-600">LoteAR</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-slate-600 leading-relaxed font-sans"
          >
            La primera plataforma inteligente dedicada exclusivamente a promover y comparar loteos y barrios cerrados en Rosario, Funes, Roldán, Ibarlucea y todo el corredor metropolitano.
          </motion.p>

          {/* Hero Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onSearchClick}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-emerald-200 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              id="hero-btn-search"
            >
              <Search className="w-5 h-5 text-white" />
              Explorar Catálogo de Lotes
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
