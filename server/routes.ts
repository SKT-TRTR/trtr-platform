import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { generateAIServiceImage, generateHeroAIImage } from "./ai-image-generator";
import { summarizeArticle as geminiSummarize, analyzeSentiment as geminiSentiment, analyzeImage as geminiAnalyzeImage, generateContentWithGemini, generateImage as geminiGenerateImage } from "./gemini-service";
import { summarizeArticle as claudeSummarize, analyzeSentiment as claudeSentiment, analyzeImage as claudeAnalyzeImage, generateContentWithClaude, generateBusinessInsights } from "./anthropic-service";
import { detectSentimentAWS, analyzeImageAWS, detectEntitiesAWS, synthesizeSpeechAWS, translateTextAWS, generateBusinessInsightsAWS } from "./aws-services";
import { insertUserSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import { healthCheck } from "./health";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not provided, payment features will be disabled');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", healthCheck);

  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  const requireAdmin = async (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    req.user = user;
    next();
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
      });

      // Set session
      req.session.userId = user.id;
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          isAdmin: user.isAdmin 
        } 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          isAdmin: user.isAdmin 
        } 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        isAdmin: user.isAdmin 
      } 
    });
  });

  // Content routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getActiveTestimonials();
      res.json(testimonials);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getActiveProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getActiveServices();
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User dashboard routes
  app.get("/api/user/purchases", requireAuth, async (req, res) => {
    try {
      const purchases = await storage.getUserPurchases(req.session.userId);
      res.json(purchases);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllProducts(); // This would be different in real implementation
      const testimonials = await storage.getAllTestimonials();
      const products = await storage.getAllProducts();
      const services = await storage.getAllServices();

      res.json({
        totalUsers: 15420,
        activeSubscriptions: 8750,
        monthlyRevenue: 284000,
        appDownloads: 1200000,
        totalTestimonials: testimonials.length,
        totalProducts: products.length,
        totalServices: services.length
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin content management
  app.post("/api/admin/testimonials", requireAdmin, async (req, res) => {
    try {
      const testimonial = await storage.createTestimonial(req.body);
      res.json(testimonial);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/testimonials/:id", requireAdmin, async (req, res) => {
    try {
      const testimonial = await storage.updateTestimonial(parseInt(req.params.id), req.body);
      res.json(testimonial);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/testimonials/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteTestimonial(parseInt(req.params.id));
      res.json({ message: "Testimonial deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Stripe payment routes
  if (stripe) {
    app.post("/api/create-payment-intent", async (req, res) => {
      try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "usd",
        });
        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        res.status(500).json({ message: "Error creating payment intent: " + error.message });
      }
    });

    app.post('/api/get-or-create-subscription', requireAuth, async (req, res) => {
      try {
        const user = await storage.getUser(req.session.userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if (user.stripeSubscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          res.json({
            subscriptionId: subscription.id,
            clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
          });
          return;
        }
        
        if (!user.email) {
          return res.status(400).json({ message: 'No user email on file' });
        }

        const customer = await stripe.customers.create({
          email: user.email,
          name: user.username,
        });

        await storage.updateUserStripeInfo(user.id, customer.id);

        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{
            // This would need to be configured in Stripe dashboard
            price: process.env.STRIPE_PRICE_ID || 'price_1234567890',
          }],
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        });

        await storage.updateUserStripeInfo(user.id, customer.id, subscription.id);
    
        res.json({
          subscriptionId: subscription.id,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        });
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    });
  } else {
    // Mock payment endpoints when Stripe is not configured
    app.post("/api/create-payment-intent", (req, res) => {
      res.status(503).json({ message: "Payment processing not configured" });
    });

    app.post('/api/get-or-create-subscription', (req, res) => {
      res.status(503).json({ message: "Subscription service not configured" });
    });
  }

  // AI image generation endpoints
  app.post("/api/generate-service-image", async (req, res) => {
    try {
      const { serviceName } = req.body;
      if (!serviceName) {
        return res.status(400).json({ message: "Service name is required" });
      }
      
      const imageUrl = await generateAIServiceImage(serviceName);
      res.json({ imageUrl });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate service image: " + error.message });
    }
  });

  app.post("/api/generate-hero-image", async (req, res) => {
    try {
      const imageUrl = await generateHeroAIImage();
      res.json({ imageUrl });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate hero image: " + error.message });
    }
  });

  // Gemini AI endpoints
  app.post("/api/gemini/summarize", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const summary = await geminiSummarize(text);
      res.json({ summary });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to summarize with Gemini: " + error.message });
    }
  });

  app.post("/api/gemini/sentiment", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const sentiment = await geminiSentiment(text);
      res.json(sentiment);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to analyze sentiment with Gemini: " + error.message });
    }
  });

  app.post("/api/gemini/analyze-image", async (req, res) => {
    try {
      const { base64Image } = req.body;
      if (!base64Image) {
        return res.status(400).json({ message: "Base64 image is required" });
      }
      
      const analysis = await geminiAnalyzeImage(base64Image);
      res.json({ analysis });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to analyze image with Gemini: " + error.message });
    }
  });

  app.post("/api/gemini/generate-content", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      
      const content = await generateContentWithGemini(prompt);
      res.json({ content });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate content with Gemini: " + error.message });
    }
  });

  app.post("/api/gemini/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      
      const imageData = await geminiGenerateImage(prompt);
      res.json({ imageData });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate image with Gemini: " + error.message });
    }
  });

  // AWS AI Service endpoints (Free Tier optimized)
  app.post("/api/aws/sentiment", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const sentiment = await detectSentimentAWS(text);
      res.json(sentiment);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to analyze sentiment: " + error.message });
    }
  });

  app.post("/api/aws/entities", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const entities = await detectEntitiesAWS(text);
      res.json(entities);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to detect entities: " + error.message });
    }
  });

  app.post("/api/aws/image-analysis", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ message: "Image is required" });
      }
      
      const analysis = await analyzeImageAWS(image);
      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to analyze image: " + error.message });
    }
  });

  app.post("/api/aws/translate", async (req, res) => {
    try {
      const { text, targetLanguage } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const translation = await translateTextAWS(text, targetLanguage);
      res.json(translation);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to translate text: " + error.message });
    }
  });

  app.post("/api/aws/speech", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const speech = await synthesizeSpeechAWS(text);
      res.json(speech);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to synthesize speech: " + error.message });
    }
  });

  app.post("/api/aws/business-insights", async (req, res) => {
    try {
      const { businessData } = req.body;
      if (!businessData) {
        return res.status(400).json({ message: "Business data is required" });
      }
      
      const insights = await generateBusinessInsightsAWS(businessData);
      res.json({ insights });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate business insights: " + error.message });
    }
  });

  // Anthropic Claude endpoints
  app.post("/api/claude/summarize", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const summary = await claudeSummarize(text);
      res.json({ summary });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to summarize with Claude: " + error.message });
    }
  });

  app.post("/api/claude/sentiment", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const sentiment = await claudeSentiment(text);
      res.json(sentiment);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to analyze sentiment with Claude: " + error.message });
    }
  });

  app.post("/api/claude/analyze-image", async (req, res) => {
    try {
      const { base64Image } = req.body;
      if (!base64Image) {
        return res.status(400).json({ message: "Base64 image is required" });
      }
      
      const analysis = await claudeAnalyzeImage(base64Image);
      res.json({ analysis });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to analyze image with Claude: " + error.message });
    }
  });

  app.post("/api/claude/generate-content", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      
      const content = await generateContentWithClaude(prompt);
      res.json({ content });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate content with Claude: " + error.message });
    }
  });

  app.post("/api/claude/business-insights", async (req, res) => {
    try {
      const { businessData } = req.body;
      if (!businessData) {
        return res.status(400).json({ message: "Business data is required" });
      }
      
      const insights = await generateBusinessInsights(businessData);
      res.json({ insights });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate business insights: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
