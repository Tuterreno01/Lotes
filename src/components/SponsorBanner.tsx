/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AdBanner } from '../types';
import { ExternalLink, Eye, ArrowRight, Award, Megaphone } from 'lucide-react';
import { motion } from 'motion/react';

interface SponsorBannerProps {
  slot: 'billboard_top' | 'sidebar_top' | 'sidebar_bottom' | 'in_feed' | 'footer_brand';
  onBannerStatsUpdate?: () => void;
  banners?: AdBanner[];
}

export default function SponsorBanner({ slot, onBannerStatsUpdate, banners }: SponsorBannerProps) {
  const [banner, setBanner] = useState<AdBanner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasViewed, setHasViewed] = useState<boolean>(false);

  useEffect(() => {
    fetchBanner();
  }, [slot, banners]);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      let data: AdBanner[] = [];
      if (banners && banners.length > 0) {
        data = banners;
      } else {
        const res = await fetch('/api/banners');
        if (res.ok) {
          data = await res.json();
        }
      }

      const activeInSlot = data.find(b => b.slot === slot && b.active);
      if (activeInSlot) {
        setBanner(activeInSlot);
        // Increment views on server
        if (!hasViewed) {
          fetch(`/api/banners/${activeInSlot.id}/view`, { method: 'POST' })
            .then(() => {
              setHasViewed(true);
              if (onBannerStatsUpdate) onBannerStatsUpdate();
            })
            .catch(err => console.error("Error logging banner view:", err));
        }
      } else {
        setBanner(null);
      }
    } catch (err) {
      console.error("Error loading banner for slot:", slot, err);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerClick = async () => {
    if (!banner) return;
    try {
      await fetch(`/api/banners/${banner.id}/click`, { method: 'POST' });
      if (onBannerStatsUpdate) onBannerStatsUpdate();
    } catch (err) {
      console.error("Error logging banner click:", err);
    }
    window.open(banner.externalLink, '_blank', 'noopener,noreferrer');
  };

  if (loading || !banner) return null;

  // Discrete advertising label
  const adLabel = (
    <span className="absolute bottom-2 right-2 text-[8px] font-bold text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md uppercase tracking-widest select-none pointer-events-none z-10 border border-white/10">
      Anuncio
    </span>
  );

  // Render different layouts depending on the slot, now purely focusing on the banner image
  switch (slot) {
    case 'billboard_top':
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.005, y: -1 }}
          className="w-full aspect-[4/1] md:aspect-[1200/250] rounded-2xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-all duration-300 mb-8 bg-slate-100 relative group"
          id={`ad-slot-${slot}`}
          onClick={handleBannerClick}
        >
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />
          {adLabel}
        </motion.div>
      );

    case 'sidebar_top':
    case 'sidebar_bottom':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.01, y: -2 }}
          className="w-full aspect-[300/250] rounded-2xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-all duration-300 mb-5 bg-slate-100 relative group"
          id={`ad-slot-${slot}`}
          onClick={handleBannerClick}
        >
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />
          {adLabel}
        </motion.div>
      );

    case 'in_feed':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.008, y: -2 }}
          className="w-full aspect-[16/9] md:aspect-[800/450] md:col-span-2 rounded-2xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-all duration-300 mb-6 bg-slate-100 relative group"
          id={`ad-slot-${slot}`}
          onClick={handleBannerClick}
        >
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />
          {adLabel}
        </motion.div>
      );

    case 'footer_brand':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.005, y: -1 }}
          className="w-full aspect-[5/1] md:aspect-[1200/120] rounded-2xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-all duration-300 bg-slate-100 relative group"
          id={`ad-slot-${slot}`}
          onClick={handleBannerClick}
        >
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />
          {adLabel}
        </motion.div>
      );

    default:
      return null;
  }
}
