/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Loteo } from '../types';

const RAW_LOTEOS_DATA: Loteo[] = [
  {
    id: '1',
    name: 'Vida Lagoon',
    location: 'Funes',
    distanceFromRosario: 15,
    priceUSD: 48000,
    financing: {
      anticipoUSD: 18000,
      cuotasCount: 48,
      cuotaUSD: 650,
      description: 'Entrega del 40% y saldo en hasta 48 cuotas mensuales ajustables por el índice de la Cámara Argentina de la Construcción (CAC).'
    },
    sizeMin: 600,
    sizeMax: 1100,
    services: {
      light: true,
      gas: true,
      water: true,
      sewer: true,
      internet: true,
    },
    amenities: ['Laguna artificial Crystal Lagoons de 2.3 hectáreas', 'Playa de arena blanca', 'Club House de 1.500 m²', '6 Canchas de tenis rápido y fútbol', 'Gimnasio de última generación', 'Seguridad perimetral triple y sensores térmicos'],
    stage: 'Pre-venta',
    description: 'El barrio cerrado más revolucionario del Gran Rosario, con una playa de arena propia de nivel internacional.',
    longDescription: 'Vida Lagoon es el primer desarrollo con tecnología Crystal Lagoons de la región, combinando una laguna de agua cristalina y arenas blancas de calidad caribeña con un entorno urbano de alta categoría. Emplazado sobre el corredor vial más estratégico de Funes, cuenta con una infraestructura de servicios 100% subterránea y conectividad vial inmediata al centro de Rosario.',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: -32.9154,
      lng: -60.8123,
    },
    developer: 'Rosental & Fundar',
    scope: 'Rosario'
  },
  {
    id: '2',
    name: 'Punta Chacra Solares',
    location: 'Roldán',
    distanceFromRosario: 22,
    priceUSD: 24000,
    financing: {
      anticipoUSD: 9000,
      cuotasCount: 36,
      cuotaUSD: 420,
      description: 'Anticipo mínimo y cuotas fijas en dólares, o cuotas pesificadas ajustadas por el índice de la construcción local (CAC).'
    },
    sizeMin: 500,
    sizeMax: 950,
    services: {
      light: true,
      gas: true,
      water: true,
      sewer: false,
      internet: true,
    },
    amenities: ['Parque central de 4 hectáreas', 'Club House con asadores', 'Canchas de pádel', 'Playón multideportivo', 'Piscina de uso común'],
    stage: 'Posesión Inmediata',
    description: 'Barrio abierto residencial consolidado, excelente forestación y conectividad inmediata por Autopista Rosario-Córdoba.',
    longDescription: 'Punta Chacra se destaca por ser un barrio de espíritu familiar consolidado, libre de expensas costosas y con servicios ya listos para edificar. Ideal para vivienda permanente o de fin de semana, con un entorno verde parquizado inigualable y acceso ágil por autopista o por la Ruta Nacional 9.',
    imageUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: -32.9015,
      lng: -60.8974,
    },
    developer: 'Grupo Punta Chacra',
    scope: 'Rosario'
  },
  {
    id: '3',
    name: 'Ibarlucea Chico',
    location: 'Ibarlucea',
    distanceFromRosario: 12,
    priceUSD: 19500,
    financing: {
      anticipoUSD: 7500,
      cuotasCount: 60,
      cuotaUSD: 220,
      description: 'Plan Joven: Financiación de hasta 5 años (60 cuotas) con mínimos requisitos y ajuste CAC.'
    },
    sizeMin: 360,
    sizeMax: 600,
    services: {
      light: true,
      gas: false,
      water: true,
      sewer: false,
      internet: true,
    },
    amenities: ['Luz LED en vía pública', 'Plaza integradora infantil', 'Estaciones saludables de gimnasia', 'Ciclovía interna', 'Cámaras de seguridad comunitarias'],
    stage: 'En Pozo',
    description: 'Barrio abierto planificado de bajo costo, a minutos del ingreso norte de Rosario por avenida Alberdi.',
    longDescription: 'Ibarlucea Chico ofrece una excelente oportunidad para familias jóvenes que quieren comprar su primer terreno. El desarrollo prioriza calles pavimentadas con asfalto, cordón cuneta, iluminación pública LED y una hermosa parquización urbana para maximizar la calidad de vida a un valor de pozo imbatible.',
    imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: -32.8542,
      lng: -60.7511,
    },
    developer: 'G7 Desarrollos',
    scope: 'Rosario'
  },
  {
    id: '4',
    name: 'Don Mateo Residencial',
    location: 'Funes',
    distanceFromRosario: 14,
    priceUSD: 39000,
    financing: {
      anticipoUSD: 15000,
      cuotasCount: 24,
      cuotaUSD: 1000,
      description: 'Financiación corta de hasta 24 cuotas fijas en dólares estadounidenses (sin interés).'
    },
    sizeMin: 500,
    sizeMax: 800,
    services: {
      light: true,
      gas: true,
      water: true,
      sewer: true,
      internet: true,
    },
    amenities: ['Red de servicios subterránea', 'Boulevard central forestado', 'Colegios y áreas comerciales adyacentes', 'Alumbrado LED', 'Accesibilidad pavimentada total'],
    stage: 'Posesión Inmediata',
    description: 'Lotes de categoría en zona residencial consolidada de Funes, linderos al prestigioso colegio Cantegril.',
    longDescription: 'Don Mateo es sinónimo de distinción urbana. Se sitúa en la mejor zona de Funes, con todos los servicios habilitados (agua corriente, cloacas, gas y pavimentación definitiva). Su cercanía con centros educativos y zonas comerciales lo vuelve la opción premium elegida para residencia familiar estable.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: -32.9231,
      lng: -60.8015,
    },
    developer: 'Rosental Inversiones',
    scope: 'Rosario'
  },
  {
    id: '5',
    name: 'Pueblo Alvear Lotes',
    location: 'Alvear',
    distanceFromRosario: 18,
    priceUSD: 17000,
    financing: {
      anticipoUSD: 6000,
      cuotasCount: 48,
      cuotaUSD: 250,
      description: 'Entrega mínima y financiación directa del desarrollador en pesos indexados o dólares fijos.'
    },
    sizeMin: 300,
    sizeMax: 500,
    services: {
      light: true,
      gas: false,
      water: true,
      sewer: false,
      internet: false,
    },
    amenities: ['Parque recreativo familiar', 'Arbolado de especies nativas', 'Alumbrado público led', 'Estacionamientos para visitas'],
    stage: 'Pre-venta',
    description: 'En el corazón del pujante cordón sur, ideal para inversión con alta revalorización a corto plazo.',
    longDescription: 'Pueblo Alvear es una propuesta de urbanización abierta orientada al sector medio y joven que busca un equilibrio entre accesibilidad económica, tranquilidad de pueblo y cercanía laboral a la zona industrial del Gran Rosario.',
    imageUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: -33.0531,
      lng: -60.6322,
    },
    developer: 'Alvear Desarrollos',
    scope: 'Rosario'
  },
  {
    id: '6',
    name: 'La Estancia',
    location: 'Pueblo Esther',
    distanceFromRosario: 20,
    priceUSD: 31000,
    financing: {
      anticipoUSD: 12400,
      cuotasCount: 36,
      cuotaUSD: 520,
      description: 'Financiación en pesos ajustada por índice de la Cámara de la Construcción o cuotas fijas en dólares.'
    },
    sizeMin: 450,
    sizeMax: 850,
    services: {
      light: true,
      gas: true,
      water: true,
      sewer: true,
      internet: true,
    },
    amenities: ['Bajada náutica al río Paraná', 'Club House histórico de estilo colonial', 'Piscina semiolímpica', 'Canchas de fútbol de césped natural', 'Vigilancia permanente y garitas de control'],
    stage: 'Posesión Inmediata',
    description: 'Barrio privado náutico y de campo con bajada directa al Río Paraná y club house histórico.',
    longDescription: 'La Estancia combina el aire puro del campo santafesino con la pasión por el río. Cuenta con un sector náutico exclusivo, guardería de lanchas, y un imponente casco histórico reconvertido en Club House para el disfrute de los propietarios en una atmósfera de absoluto relax.',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: -33.0782,
      lng: -60.5815,
    },
    developer: 'Esther Group',
    scope: 'Rosario'
  },
  {
    id: '7',
    name: 'Tierra de Sueños 3',
    location: 'Roldán',
    distanceFromRosario: 25,
    priceUSD: 21500,
    financing: {
      anticipoUSD: 8500,
      cuotasCount: 48,
      cuotaUSD: 290,
      description: 'Financiación flexible con un 40% de adelanto y saldo en pesos actualizados por índice CAC.'
    },
    sizeMin: 360,
    sizeMax: 900,
    services: {
      light: true,
      gas: true,
      water: true,
      sewer: false,
      internet: true,
    },
    amenities: ['Parque recreativo acuático de 2 hectáreas', 'Gimnasio techado', 'Laguna artificial de 6 hectáreas con playa', 'Sector comercial con supermercado', 'Colegio primario bilingüe dentro del barrio'],
    stage: 'Posesión Inmediata',
    description: 'El barrio abierto más grande y consolidado del corredor oeste de la provincia de Santa Fe.',
    longDescription: 'Tierra de Sueños 3 es un hito de las urbanizaciones abiertas del país. Con miles de viviendas ya consolidadas, ofrece servicios integrales que van desde una laguna recreativa gigante, piscinas con toboganes acuáticos de escala regional, hasta locales comerciales, seguridad privada adicional y escuelas de primer nivel dentro del predio.',
    imageUrl: 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: -32.9067,
      lng: -60.9125,
    },
    developer: 'Tierra de Sueños S.A.',
    scope: 'Rosario'
  },
  {
    id: '8',
    name: 'San Sebastián Solares',
    location: 'Roldán',
    distanceFromRosario: 24,
    priceUSD: 42000,
    financing: {
      anticipoUSD: 16800,
      cuotasCount: 36,
      cuotaUSD: 700,
      description: 'Saldos pesificados con amortización trimestral bajo índice CAC o amortización mensual.'
    },
    sizeMin: 800,
    sizeMax: 1500,
    services: {
      light: true,
      gas: true,
      water: true,
      sewer: true,
      internet: true,
    },
    amenities: ['Cancha de golf homologada de 9 hoyos', 'Club House de campo', '10 canchas de tenis iluminadas', 'Hípico integrado y senderos de cabalgata', 'Cámaras de monitoreo HD térmicas'],
    stage: 'Posesión Inmediata',
    description: 'Barrio privado de campo premium con hípico, tenis y un imponente campo de golf de nivel profesional.',
    longDescription: 'San Sebastián es el refugio perfecto para los amantes del deporte y la naturaleza. Ofrece terrenos de generosa superficie rodeados de arboledas añejas y lagunas artificiales paisajísticas, con un altísimo nivel de infraestructura urbana subterránea y un control de accesos automatizado de última tecnología.',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: -32.8988,
      lng: -60.9322,
    },
    developer: 'Rosental Inversiones',
    scope: 'Rosario'
  },
  {
    id: '9',
    name: 'Praderas de General Lagos',
    location: 'General Lagos',
    distanceFromRosario: 26,
    priceUSD: 18000,
    financing: {
      anticipoUSD: 7000,
      cuotasCount: 48,
      cuotaUSD: 235,
      description: 'Anticipo pesificado y cuotas mensuales indexadas al costo de vida de la construcción.'
    },
    sizeMin: 300,
    sizeMax: 500,
    services: {
      light: true,
      gas: false,
      water: true,
      sewer: false,
      internet: true,
    },
    amenities: ['Parque lineal con bicisendas', 'Estaciones recreativas de calistenia', 'Paseo comercial gastronómico', 'Red de agua potable certificada'],
    stage: 'Pre-venta',
    description: 'Barrio abierto residencial de diseño sustentable, ubicado en una zona de alta tranquilidad y seguridad rural.',
    longDescription: 'Praderas de General Lagos ofrece un estilo de vida de conexión con el verde pero sumando infraestructura urbana de primer nivel. Conectado de forma impecable por autopista a Rosario en menos de 20 minutos, es la gema oculta del crecimiento inmobiliario del sur santafesino.',
    imageUrl: 'https://images.unsplash.com/photo-1444653300606-1d4df7743d12?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: -33.1012,
      lng: -60.5489,
    },
    developer: 'Lagos Desarrollos',
    scope: 'Rosario'
  },
  // PROVINCIA DE SANTA FE (Rest of Santa Fe province)
  {
    id: '10',
    name: 'Santo Tomé River Residencias',
    location: 'Santo Tomé',
    distanceFromRosario: 155,
    priceUSD: 29000,
    financing: {
      anticipoUSD: 11000,
      cuotasCount: 60,
      cuotaUSD: 300,
      description: 'Plan Casa & Lote de Pilay: Pagá tu lote en hasta 5 años totalmente pesificados ajustables por CAC.'
    },
    sizeMin: 400,
    sizeMax: 800,
    services: {
      light: true,
      gas: true,
      water: true,
      sewer: true,
      internet: true,
    },
    amenities: ['Costanera recreativa privada', 'Club House náutico', 'Seguridad virtual inteligente', 'Playón polideportivo de hormigón'],
    stage: 'Pre-venta',
    description: 'Desarrollo residencial premium en las cercanías del río Salado, con la firma de calidad Pilay.',
    longDescription: 'Santo Tomé River Residencias es el desembarco de los loteos integrales de Pilay en el área metropolitana de Santa Fe capital. Combina servicios sanitarios completos, asfalto definitivo en todas las arterias y un entorno pacífico pegado a las márgenes del río con acceso rapidísimo al puente de Santa Fe.',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: -31.6627,
      lng: -60.7573,
    },
    developer: 'Pilay S.A.',
    scope: 'Provincia'
  },
  {
    id: '11',
    name: 'Los Fresnos Residencial',
    location: 'Rafaela',
    distanceFromRosario: 220,
    priceUSD: 26500,
    financing: {
      anticipoUSD: 10000,
      cuotasCount: 48,
      cuotaUSD: 350,
      description: 'Financiación corporativa directa de Pecam. Cuotas pesificadas con ajuste CAC trimestral.'
    },
    sizeMin: 450,
    sizeMax: 700,
    services: {
      light: true,
      gas: true,
      water: true,
      sewer: true,
      internet: true,
    },
    amenities: ['Parque urbano lineal de 3 hectáreas', 'Centro de salud primario comunitario', 'Canchas de fútbol y vóley', 'Estación de carga para vehículos eléctricos'],
    stage: 'En Pozo',
    description: 'Masterplan residencial en la pujante ciudad de Rafaela, con infraestructura de servicios de clase mundial.',
    longDescription: 'Los Fresnos en Rafaela representa el nuevo estándar de vida de la perla del oeste santafesino. Llevado a cabo por Pecam Desarrollos, se destaca por su estricto planeamiento hidráulico, asfalto cordón cuneta en toda la extensión, red interna de gas natural y cloacas ya conectadas a colectores maestros municipales.',
    imageUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: -31.2503,
      lng: -61.4867,
    },
    developer: 'Pecam Desarrollos',
    scope: 'Provincia'
  },
  // NACIONAL (Rest of Argentina)
  {
    id: '12',
    name: 'Solares del Lago',
    location: 'Bariloche',
    distanceFromRosario: 1600,
    priceUSD: 59000,
    financing: {
      anticipoUSD: 25000,
      cuotasCount: 36,
      cuotaUSD: 950,
      description: 'Entrega en dólares y saldo en cuotas fijas en moneda dura. Descuentos por pago de contado del 10%.'
    },
    sizeMin: 800,
    sizeMax: 2000,
    services: {
      light: true,
      gas: true,
      water: true,
      sewer: false,
      internet: true,
    },
    amenities: ['Acceso directo a playa del Lago Nahuel Huapi', 'Bosque nativo intangible protegido', 'Club de montaña con hogar a leña', 'Estación de kayak y stand-up paddle', 'Seguridad perimetral satelital'],
    stage: 'Pre-venta',
    description: 'Terrenos de montaña con exclusivas vistas al lago y bosque autóctono protegido de coihues y cipreses.',
    longDescription: 'Solares del Lago es una propuesta de ensueño en San Carlos de Bariloche. Cuenta con parcelas exclusivas rodeadas de bosques milenarios y pendientes suaves que ofrecen una vista panorámica del Lago Nahuel Huapi. Infraestructura subterránea de agua de vertiente y tendido eléctrico soterrado para cuidar el paisaje natural de la Patagonia.',
    imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: -41.1335,
      lng: -71.3103,
    },
    developer: 'Patagonia Lands S.A.',
    scope: 'Nacional'
  },
  {
    id: '13',
    name: 'Valle del Sol',
    location: 'Luján de Cuyo',
    distanceFromRosario: 900,
    priceUSD: 34000,
    financing: {
      anticipoUSD: 14000,
      cuotasCount: 48,
      cuotaUSD: 420,
      description: 'Financiación adaptada al ciclo vitivinícola con cuotas fijas semestrales o cuotas mensuales en dólares.'
    },
    sizeMin: 600,
    sizeMax: 1200,
    services: {
      light: true,
      gas: false,
      water: true,
      sewer: false,
      internet: true,
    },
    amenities: ['Viñedos internos de Malbec', 'Cava de vinos subterránea comunitaria con sommelier', 'Mirador de la Cordillera de los Andes', 'Quincho asador equipado para catas', 'Seguridad privada física las 24 hs'],
    stage: 'Posesión Inmediata',
    description: 'Viví entre viñedos propios al pie de la imponente Cordillera de los Andes en Mendoza.',
    longDescription: 'Valle del Sol es un concepto inmobiliario innovador en Luján de Cuyo, Mendoza. Los propietarios disfrutan de parcelas residenciales inmersas en viñedos productivos activos, pudiendo elaborar su propio vino reserva cada año. Todo esto custodiado por la majestuosa vista de la cordillera del Plata y el aire puro de la montaña mendocina.',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: -33.0333,
      lng: -68.8667,
    },
    developer: 'Andes Builders',
    scope: 'Nacional'
  },
  {
    id: '14',
    name: 'Nordelta Golf Club Lotes',
    location: 'Tigre',
    distanceFromRosario: 280,
    priceUSD: 89000,
    financing: {
      anticipoUSD: 40000,
      cuotasCount: 36,
      cuotaUSD: 1360,
      description: 'Entrega inicial y cuotas fijas en dólares o indexadas por índice de la Cámara de la Construcción.'
    },
    sizeMin: 900,
    sizeMax: 1600,
    services: {
      light: true,
      gas: true,
      water: true,
      sewer: true,
      internet: true,
    },
    amenities: ['Cancha de golf diseñada por Jack Nicklaus de 18 hoyos', 'Gran lago navegable de 180 hectáreas', 'Club house náutico con restaurante', 'Acceso a canchas de tenis de polvo de ladrillo', 'Monitoreo perimetral inteligente con lanchas tácticas'],
    stage: 'Posesión Inmediata',
    description: 'El barrio cerrado más emblemático y de mayor categoría en la zona norte de Buenos Aires.',
    longDescription: 'Terrenos residenciales con salida directa al campo de golf profesional y con acceso opcional al gran espejo de agua navegable de Nordelta. Un ecosistema urbano autónomo que cuenta con sanatorios, centros comerciales, colegios bilingües de élite y seguridad total integrada para la tranquilidad absoluta de la familia.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    coordinates: {
      lat: -34.4167,
      lng: -58.6333,
    },
    developer: 'Consultatio S.A.',
    scope: 'Nacional'
  }
];

// Múltiples imágenes reales de alta resolución para la galería de fotos interactiva
const SAMPLE_GALLERIES: { [key: string]: string[] } = {
  '1': [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
  ],
  '2': [
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
  ],
  '3': [
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1444653300606-1d4df7743d12?auto=format&fit=crop&w=1200&q=80'
  ],
  '4': [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'
  ],
  '5': [
    'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
  ],
  '6': [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
  ],
  '7': [
    'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
  ],
  '8': [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
  ],
  '9': [
    'https://images.unsplash.com/photo-1444653300606-1d4df7743d12?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80'
  ]
};

export const LOTEOS_DATA: Loteo[] = RAW_LOTEOS_DATA.map(l => ({
  ...l,
  images: SAMPLE_GALLERIES[l.id] || [
    l.imageUrl,
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80'
  ]
}));

export const LOCATIONS = [
  'all',
  'Funes',
  'Roldán',
  'Ibarlucea',
  'Pueblo Esther',
  'Alvear',
  'General Lagos',
  'Santo Tomé',
  'Rafaela',
  'Bariloche',
  'Luján de Cuyo',
  'Tigre'
];

export const SCOPES = [
  { value: 'all', label: 'Todos los Niveles' },
  { value: 'Rosario', label: 'Rosario y Gran Rosario' },
  { value: 'Provincia', label: 'Provincia de Santa Fe' },
  { value: 'Nacional', label: 'Nivel Nacional (Todo el País)' }
];

export const DEVELOPERS = [
  'all',
  'Rosental & Fundar',
  'Rosental Inversiones',
  'Grupo Punta Chacra',
  'G7 Desarrollos',
  'Alvear Desarrollos',
  'Esther Group',
  'Tierra de Sueños S.A.',
  'Lagos Desarrollos',
  'Pilay S.A.',
  'Pecam Desarrollos',
  'Patagonia Lands S.A.',
  'Andes Builders',
  'Consultatio S.A.'
];

export const STAGES = ['all', 'En Pozo', 'Pre-venta', 'Posesión Inmediata'];

