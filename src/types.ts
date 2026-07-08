/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LoteoFinancing {
  anticipoUSD: number;
  cuotasCount: number;
  cuotaUSD: number;
  description: string;
}

export interface LoteoServices {
  light: boolean;     // Electricidad
  gas: boolean;       // Gas natural
  water: boolean;     // Agua corriente
  sewer: boolean;     // Cloacas
  internet: boolean;  // Internet por fibra óptica
}

export interface Loteo {
  id: string;
  name: string;
  location: string; // "Funes", "Roldán", "Ibarlucea", "Pueblo Esther", "Alvear", "General Lagos", etc.
  distanceFromRosario: number; // en km
  priceUSD: number; // Precio desde (en USD)
  financing?: LoteoFinancing;
  sizeMin: number; // m² mínimo
  sizeMax: number; // m² máximo
  services: LoteoServices;
  amenities: string[];
  stage: 'En Pozo' | 'Pre-venta' | 'Posesión Inmediata';
  description: string;
  longDescription: string;
  imageUrl: string;
  images?: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  developer: string; // Constructora / Desarrolladora (e.g. "Fundar", "Rosental", "Pecam", "Tierra de Sueños S.A.")
  scope: 'Rosario' | 'Provincia' | 'Nacional'; // Rosario y Gran Rosario, Provincia de Santa Fe, o Nacional
}

export interface AdBanner {
  id: string;
  slot: 'billboard_top' | 'sidebar_top' | 'sidebar_bottom' | 'in_feed' | 'footer_brand';
  advertiserName: string;
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
  externalLink: string;
  badgeText?: string;
  views: number;
  clicks: number;
  active: boolean;
}

export interface FilterState {
  searchQuery: string;
  location: string; // 'all' or specific city
  stage: string; // 'all' or specific stage
  scope: string; // 'all' | 'Rosario' | 'Provincia' | 'Nacional'
  developer: string; // 'all' or specific constructor
  maxPrice: number; // up to 150000
  minSize: number; // min m2
  hasGas: boolean;
  hasWater: boolean;
  hasSewer: boolean;
  hasInternet: boolean;
}

export interface Inquiry {
  id?: string;
  loteoId: string;
  loteoName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  message: string;
  timestamp: string;
  attachment?: {
    name: string;
    size: number;
    type: string;
    dataUrl?: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
