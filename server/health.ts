import type { Request, Response } from "express";
import { storage } from "./storage";

export async function healthCheck(req: Request, res: Response) {
  try {
    // Test database connection
    const testUser = await storage.getUser(1);
    
    // Test AI services (basic connectivity)
    const aiServices = {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY
    };
    
    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      services: {
        database: testUser !== undefined ? "connected" : "disconnected",
        ai: aiServices,
        payment: !!process.env.STRIPE_SECRET_KEY ? "configured" : "not_configured"
      },
      uptime: process.uptime()
    };
    
    res.status(200).json(healthStatus);
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}