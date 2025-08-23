import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { generateGoodMorningMessage } from "./services/openai";
import { generateGoodMorningMessageWithPuter } from "./services/puter-ai";
import { messageGenerationSchema, insertSavedNumberSchema } from "@shared/schema";
import { z } from "zod";
import MemoryStore from "memorystore";

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: false, // set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Generate AI message
  app.post("/api/generate-message", async (req, res) => {
    try {
      const validatedData = messageGenerationSchema.parse(req.body);
      
      // Try OpenAI first if API key is available
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
        try {
          const message = await generateGoodMorningMessage({
            category: validatedData.category,
            includeEmojis: validatedData.includeEmojis,
            includeWeather: validatedData.includeWeather,
            messageLength: validatedData.messageLength,
          });

          return res.json({ 
            message, 
            category: validatedData.category,
            provider: 'openai'
          });
        } catch (openaiError: any) {
          // If OpenAI fails (quota/rate limit), fall back to Puter.js
          console.log("OpenAI failed, falling back to Puter.js:", openaiError.message);
        }
      }
      
      // Use Puter.js as fallback or primary
      const puterPrompt = await generateGoodMorningMessageWithPuter({
        category: validatedData.category,
        includeEmojis: validatedData.includeEmojis,
        includeWeather: validatedData.includeWeather,
        messageLength: validatedData.messageLength,
      });

      res.json({ 
        puterPrompt: JSON.parse(puterPrompt),
        category: validatedData.category,
        provider: 'puter'
      });
    } catch (error) {
      console.error("Message generation error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate message" 
      });
    }
  });

  // Get saved numbers
  app.get("/api/saved-numbers", async (req, res) => {
    try {
      const sessionId = req.session.id;
      const savedNumbers = await storage.getSavedNumbers(sessionId);
      res.json(savedNumbers);
    } catch (error) {
      console.error("Get saved numbers error:", error);
      res.status(500).json({ message: "Failed to retrieve saved numbers" });
    }
  });

  // Save phone number
  app.post("/api/save-number", async (req, res) => {
    try {
      const sessionId = req.session.id;
      const validatedData = insertSavedNumberSchema.parse({
        ...req.body,
        sessionId
      });

      const savedNumber = await storage.savePlaneNumber(validatedData);
      res.json(savedNumber);
    } catch (error) {
      console.error("Save number error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: "Failed to save phone number" 
      });
    }
  });

  // Delete saved number
  app.delete("/api/saved-numbers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const sessionId = req.session.id;
      
      const deleted = await storage.deleteSavedNumber(id, sessionId);
      
      if (deleted) {
        res.json({ message: "Number deleted successfully" });
      } else {
        res.status(404).json({ message: "Number not found" });
      }
    } catch (error) {
      console.error("Delete number error:", error);
      res.status(500).json({ message: "Failed to delete number" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
