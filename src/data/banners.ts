/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdBanner } from '../types';

export const INITIAL_BANNERS: AdBanner[] = [
  {
    id: 'ad-1',
    slot: 'billboard_top',
    advertiserName: 'Rosental & Fundar',
    title: 'Lanzamiento Exclusivo: Vida Lagoon - Etapa Playa Blanca',
    subtitle: 'Asegurá tu lote con la laguna artificial Crystal Lagoons más grande de Santa Fe. Entrega del 40% y saldo en 48 cuotas ajustables por CAC.',
    ctaText: 'Ver Unidad de Pozo',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    externalLink: 'https://fundar.com.ar/vida-lagoon',
    badgeText: 'Sponsor Premium',
    views: 1450,
    clicks: 182,
    active: true
  },
  {
    id: 'ad-2',
    slot: 'sidebar_top',
    advertiserName: 'Pilay Desarrollos',
    title: 'Lotes con Posesión en Santo Tomé',
    subtitle: 'Pilay te ofrece terrenos premium listos para construir. Financiación flexible de hasta 60 meses.',
    ctaText: 'Solicitar Carpeta Técnica',
    imageUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80',
    externalLink: 'https://pilay.com.ar/loteos-santa-fe',
    badgeText: 'Destacado',
    views: 920,
    clicks: 54,
    active: true
  },
  {
    id: 'ad-3',
    slot: 'sidebar_bottom',
    advertiserName: 'Tierra de Sueños S.A.',
    title: '¡Últimos Lotes Disponibles en Tierra de Sueños 3!',
    subtitle: 'Posesión inmediata y mega club house funcionando con parque acuático y laguna recreativa de 6 hectáreas.',
    ctaText: 'Hacer Oferta Contado',
    imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80',
    externalLink: 'https://tierradesuenos.com.ar',
    badgeText: 'Oportunidad Inmediata',
    views: 810,
    clicks: 72,
    active: true
  },
  {
    id: 'ad-4',
    slot: 'in_feed',
    advertiserName: 'Pecam Desarrollos',
    title: 'Los Fresnos Residencial - Rafaela',
    subtitle: 'Un concepto residencial rodeado de verde con toda la infraestructura de cloacas, gas y asfalto cordón cuneta. ¡Comprá 100% financiado en pesos!',
    ctaText: 'Ver Plan de Cuotas Pesos',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    externalLink: 'https://pecam.com.ar',
    badgeText: '100% Pesificado',
    views: 650,
    clicks: 43,
    active: true
  },
  {
    id: 'ad-5',
    slot: 'footer_brand',
    advertiserName: 'G7 Desarrollos',
    title: 'Ibarlucea Chico: Construí a Minutos de Circunvalación',
    subtitle: 'Barrio abierto planificado de bajo costo. Anticipos hiper accesibles desde USD 8.000. Excelente revalorización de tierra.',
    ctaText: 'Ver Disponibilidad en Plano',
    imageUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80',
    externalLink: 'https://g7desarrollos.com',
    badgeText: 'Inversión Inteligente',
    views: 1100,
    clicks: 98,
    active: true
  }
];
