/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { LOTEOS_DATA } from "./src/data/loteos";
import { INITIAL_BANNERS } from "./src/data/banners";
import { GoogleGenAI } from "@google/genai";
import { Inquiry, AdBanner, Loteo } from "./src/types";

// In-memory array of inquiries to persist contact requests during the server session.
const inquiries: Inquiry[] = [];

// In-memory array of active loteos with live additions.
let loteosList: Loteo[] = [...LOTEOS_DATA];

// In-memory array of active banners with live views and clicks tracking.
let banners: AdBanner[] = [...INITIAL_BANNERS];

// Lazy-initialization of the Google Gen AI client to prevent crashes if key is not configured yet
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY no está definida. Configurala en la sección Settings > Secrets de AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "loteArAdmin2026";

  // Middleware to verify admin password header
  const verifyAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const pwd = req.headers["x-admin-password"];
    if (!pwd || pwd !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Acceso no autorizado. Contraseña incorrecta." });
    }
    next();
  };

  // API: Verify Admin Password
  app.post("/api/admin/verify", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      return res.json({ success: true });
    }
    return res.status(401).json({ error: "Contraseña incorrecta." });
  });

  // 1. API: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // 2. API: Get Loteos
  app.get("/api/loteos", (req, res) => {
    res.json(loteosList);
  });

  // 2b. API: Add a new loteo manually
  app.post("/api/loteos", verifyAdmin, (req, res) => {
    const { name, location, stage, scope, priceUSD, sizeMin, sizeMax, distanceFromRosario, developer, description, longDescription, imageUrl, services, amenities, images } = req.body;

    if (!name || !location || !priceUSD || !description) {
      return res.status(400).json({ error: "Faltan campos obligatorios para dar de alta el loteo" });
    }

    const id = (loteosList.length + 1).toString();
    const mainImg = imageUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80";
    const defaultImages = [
      mainImg,
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ];

    const newLoteo: Loteo = {
      id,
      name,
      location,
      stage: stage || "Pre-venta",
      scope: scope || "Rosario",
      priceUSD: Number(priceUSD),
      sizeMin: Number(sizeMin) || 300,
      sizeMax: Number(sizeMax) || 600,
      distanceFromRosario: Number(distanceFromRosario) || 15,
      developer: developer || "LoteAR Desarrollos",
      description,
      longDescription: longDescription || description,
      imageUrl: mainImg,
      images: Array.isArray(images) && images.length > 0 ? images : defaultImages,
      coordinates: { lat: -32.9468, lng: -60.6393 },
      services: services || { light: true, gas: false, water: false, sewer: false, internet: false },
      amenities: amenities || []
    };

    loteosList.push(newLoteo);
    res.status(201).json({ success: true, loteo: newLoteo });
  });

  // 2c. API: Update a loteo's details
  app.put("/api/loteos/:id", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const index = loteosList.findIndex(l => l.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Loteo no encontrado" });
    }

    const { name, location, stage, scope, priceUSD, sizeMin, sizeMax, distanceFromRosario, developer, description, longDescription, imageUrl, services, amenities, images } = req.body;

    if (!name || !location || !priceUSD || !description) {
      return res.status(400).json({ error: "Faltan campos obligatorios para actualizar el loteo" });
    }

    const currentLoteo = loteosList[index];
    const updatedLoteo: Loteo = {
      ...currentLoteo,
      name,
      location,
      stage: stage || "Pre-venta",
      scope: scope || "Rosario",
      priceUSD: Number(priceUSD),
      sizeMin: Number(sizeMin) || 300,
      sizeMax: Number(sizeMax) || 600,
      distanceFromRosario: Number(distanceFromRosario) || 15,
      developer: developer || "LoteAR Desarrollos",
      description,
      longDescription: longDescription || description,
      imageUrl: imageUrl || currentLoteo.imageUrl,
      images: Array.isArray(images) && images.length > 0 ? images : (currentLoteo.images ? [imageUrl || currentLoteo.imageUrl, ...currentLoteo.images.slice(1)] : [imageUrl || currentLoteo.imageUrl]),
      services: services || currentLoteo.services,
      amenities: amenities || currentLoteo.amenities
    };

    loteosList[index] = updatedLoteo;
    res.json({ success: true, loteo: updatedLoteo });
  });

  // 2d. API: Delete a loteo
  app.delete("/api/loteos/:id", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const index = loteosList.findIndex(l => l.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Loteo no encontrado" });
    }
    loteosList.splice(index, 1);
    res.json({ success: true });
  });

  // 3. API: Get inquiries (To show submitted inquiries in a client dashboard tab)
  app.get("/api/inquiries", verifyAdmin, (req, res) => {
    res.json(inquiries);
  });

  // 3b. API: Get active ad banners with real-time stats
  app.get("/api/banners", (req, res) => {
    res.json(banners);
  });

  // 3bb. API: Add a new banner manually
  app.post("/api/banners", verifyAdmin, (req, res) => {
    const { title, advertiserName, imageUrl, targetUrl, slot } = req.body;

    if (!title || !advertiserName || !imageUrl || !slot) {
      return res.status(400).json({ error: "Faltan campos obligatorios para dar de alta el banner" });
    }

    const id = (banners.length + 1).toString();
    const newBanner: AdBanner = {
      id,
      title,
      advertiserName,
      imageUrl,
      externalLink: targetUrl || "https://loteas.ar",
      slot,
      subtitle: "Patrocinado por LoteAR",
      ctaText: "Ver Más",
      active: true,
      views: 0,
      clicks: 0
    };

    banners.push(newBanner);
    res.status(201).json({ success: true, banner: newBanner });
  });

  // 3bc2. API: Update a banner's details
  app.put("/api/banners/:id", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const index = banners.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Banner no encontrado" });
    }

    const { title, advertiserName, imageUrl, targetUrl, slot } = req.body;

    if (!title || !advertiserName || !imageUrl || !slot) {
      return res.status(400).json({ error: "Faltan campos obligatorios para actualizar el banner" });
    }

    const currentBanner = banners[index];
    const updatedBanner: AdBanner = {
      ...currentBanner,
      title,
      advertiserName,
      imageUrl,
      externalLink: targetUrl || "https://loteas.ar",
      slot
    };

    banners[index] = updatedBanner;
    res.json({ success: true, banner: updatedBanner });
  });

  // 3bc3. API: Delete a banner
  app.delete("/api/banners/:id", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const index = banners.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Banner no encontrado" });
    }
    banners.splice(index, 1);
    res.json({ success: true });
  });

  // 3c. API: Increment views/impressions for a banner
  app.post("/api/banners/:id/view", (req, res) => {
    const { id } = req.params;
    const banner = banners.find(b => b.id === id);
    if (banner) {
      banner.views += 1;
      return res.json({ success: true, id, views: banner.views });
    }
    res.status(404).json({ error: "Banner no encontrado" });
  });

  // 3d. API: Increment clicks for a banner
  app.post("/api/banners/:id/click", (req, res) => {
    const { id } = req.params;
    const banner = banners.find(b => b.id === id);
    if (banner) {
      banner.clicks += 1;
      return res.json({ success: true, id, clicks: banner.clicks });
    }
    res.status(404).json({ error: "Banner no encontrado" });
  });

  // 4. API: Submit inquiry
  app.post("/api/inquiry", (req, res) => {
    const { loteoId, loteoName, clientName, clientEmail, clientPhone, message } = req.body;

    if (!loteoId || !loteoName || !clientName || !clientEmail) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const newInquiry: Inquiry = {
      id: Math.random().toString(36).substring(2, 9),
      loteoId,
      loteoName,
      clientName,
      clientEmail,
      clientPhone: clientPhone || "No especificado",
      message: message || "Deseo recibir más información sobre este loteo.",
      timestamp: new Date().toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    inquiries.push(newInquiry);
    res.status(201).json({ success: true, inquiry: newInquiry });
  });

  // 5. API: Asesor Inteligente Chat with Gemini Grounding in Loteos dataset
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body; // Array of { role: 'user' | 'model', text: string }

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "El historial de mensajes es requerido." });
      }

      const client = getGeminiClient();

      // We inject the catalog dynamically into the system instruction so the model has exact, real-time facts
      const loteosContext = loteosList.map(l => {
        return `- Loteo: ${l.name}
  Ubicación/Ciudad: ${l.location}
  Precio desde: USD ${l.priceUSD}
  Distancia a Rosario: ${l.distanceFromRosario} km
  Etapa de desarrollo: ${l.stage}
  Tamaños de lote: de ${l.sizeMin}m² a ${l.sizeMax}m²
  Servicios: Luz: ${l.services.light ? "Sí" : "No"}, Gas Natural: ${l.services.gas ? "Sí" : "No"}, Agua Corriente: ${l.services.water ? "Sí" : "No"}, Cloacas: ${l.services.sewer ? "Sí" : "No"}, Fibra Óptica: ${l.services.internet ? "Sí" : "No"}
  Amenities: ${l.amenities.join(", ")}
  Financiación: ${l.financing ? `Anticipo USD ${l.financing.anticipoUSD}, ${l.financing.cuotasCount} cuotas de USD ${l.financing.cuotaUSD}. Detalle: ${l.financing.description}` : "Solo contado"}
  Descripción breve: ${l.description}`;
      }).join("\n\n");

      const systemInstruction = `Sos el Asesor Inteligente de LoteAR (loteas.ar), una plataforma de promoción y asesoramiento sobre loteos y barrios cerrados/abiertos en Rosario y la región metropolitana (Funes, Roldán, Ibarlucea, Pueblo Esther, Alvear, General Lagos, etc.).

Tus objetivos son:
1. Ayudar a los usuarios a encontrar el loteo ideal según su presupuesto, ubicación deseada, etapa de desarrollo o necesidades de servicios (como gas natural, cloacas, agua de red) y amenities.
2. Basar todas tus respuestas de loteos ÚNICAMENTE en este catálogo oficial:
${loteosContext}

3. Responder de forma muy profesional, atenta, empática y clara. Usá un tono amigable, típico de un asesor inmobiliario de la región de Rosario (puedes usar "vos" y "tú" de forma cálida pero respetuosa, sin caer en lenguaje demasiado informal).
4. Cuando recomiendes opciones, destaca sus precios, ubicación, servicios claves y por qué se adaptan a lo que busca el cliente.
5. Invita activamente al usuario a completar el formulario de contacto o consulta ("Enviar Consulta") que se encuentra disponible en cada loteo de la plataforma, o a dejar sus datos para que un agente humano de LoteAR lo contacte de forma directa.
6. Si te preguntan por loteos que NO están en este catálogo, aclará amablemente que actualmente trabajás exclusivamente con los desarrollos certificados de la plataforma LoteAR, pero que podés sugerirle opciones similares en la misma zona que sí tengamos disponibles.`;

      // Format history into Contents for @google/genai SDK
      // The SDK expects contents to have { role: 'user' | 'model', parts: [{ text: '...' }] }
      // In @google/genai, the model role is 'model' (not 'assistant')
      const formattedContents = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Call the API using gemini-3.5-flash as it's a basic to medium text chat task
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Disculpas, no pude procesar la respuesta en este momento.";
      res.json({ text: replyText });
    } catch (error: any) {
      console.error("Error en API de Chat:", error);
      res.status(500).json({ 
        error: "Error al procesar la consulta de Inteligencia Artificial.",
        details: error.message || String(error)
      });
    }
  });

  // Vite middleware setup for Development vs Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[LoteAR FullStack] Servidor escuchando en http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error al arrancar el servidor de LoteAR:", err);
});
