import { users, testimonials, products, services, userPurchases, type User, type InsertUser, type Testimonial, type Product, type Service, type UserPurchase } from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: number, customerId: string, subscriptionId?: string): Promise<User>;
  
  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  getActiveTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: any): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: any): Promise<Testimonial>;
  deleteTestimonial(id: number): Promise<void>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getActiveProducts(): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getBetaProducts(): Promise<Product[]>;
  createProduct(product: any): Promise<Product>;
  updateProduct(id: number, product: any): Promise<Product>;
  
  // Services
  getAllServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;
  createService(service: any): Promise<Service>;
  updateService(id: number, service: any): Promise<Service>;
  
  // User purchases
  getUserPurchases(userId: number): Promise<UserPurchase[]>;
  createUserPurchase(purchase: any): Promise<UserPurchase>;
  updatePurchaseStatus(id: number, status: string): Promise<UserPurchase>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private testimonials: Map<number, Testimonial>;
  private products: Map<number, Product>;
  private services: Map<number, Service>;
  private userPurchases: Map<number, UserPurchase>;
  private currentUserId: number;
  private currentTestimonialId: number;
  private currentProductId: number;
  private currentServiceId: number;
  private currentPurchaseId: number;

  constructor() {
    this.users = new Map();
    this.testimonials = new Map();
    this.products = new Map();
    this.services = new Map();
    this.userPurchases = new Map();
    this.currentUserId = 1;
    this.currentTestimonialId = 1;
    this.currentProductId = 1;
    this.currentServiceId = 1;
    this.currentPurchaseId = 1;
    
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize 30 testimonials
    const testimonialData = [
      { name: "John Anderson", title: "CEO", company: "TechStart Inc.", content: "TRTR's AI solutions transformed our business operations completely. The custom AI agents they developed increased our efficiency by 300%.", rating: 5, profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Sarah Mitchell", title: "Marketing Director", company: "GrowthCorp", content: "The career coaching service helped me transition from a junior role to a senior position in just 6 months. Incredible results!", rating: 5, profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Michael Chen", title: "Founder", company: "InnovateLab", content: "Their brand development service gave our startup the professional identity we needed. We closed our Series A within 3 months.", rating: 5, profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Emma Rodriguez", title: "CTO", company: "DataFlow Solutions", content: "The ZyRok app development exceeded our expectations. The user engagement metrics are through the roof!", rating: 5, profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "David Park", title: "CEO", company: "HealthTech Plus", content: "HealthCare Pro revolutionized how we deliver patient care. The AI diagnostics are incredibly accurate.", rating: 5, profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Lisa Thompson", title: "VP Operations", company: "FinanceFirst", content: "FinanceTracker AI helped our clients save over $2M in the first quarter. Outstanding ROI!", rating: 5, profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Robert Kim", title: "Director", company: "TradePro Analytics", content: "TradeMaster Pro's AI predictions have improved our trading accuracy by 85%. Phenomenal technology!", rating: 5, profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Jennifer Liu", title: "Founder", company: "NextGen Startups", content: "The customer-business connection platform brought us 500% more qualified leads. Incredible results!", rating: 5, profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Alex Johnson", title: "CMO", company: "Digital Dynamics", content: "AI Agents streamlined our entire marketing workflow. We're seeing 200% better conversion rates.", rating: 5, profileImage: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Maria Garcia", title: "Product Manager", company: "InnovateX", content: "The brand development package transformed our market presence completely. Sales increased by 400%.", rating: 5, profileImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Kevin Brown", title: "Tech Lead", company: "CodeCraft", content: "Their AI applications are next-level. The performance and user experience are unmatched.", rating: 5, profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Sophia Davis", title: "CEO", company: "MedTech Solutions", content: "HealthCare Pro's AI diagnostics have improved our accuracy rate to 98%. Revolutionary technology!", rating: 5, profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "James Wilson", title: "Financial Advisor", company: "WealthMax", content: "FinanceTracker AI transformed how we manage client portfolios. ROI increased by 250%.", rating: 5, profileImage: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Rachel Green", title: "Startup Founder", company: "EcoTech", content: "The career coaching program helped me secure $2M in funding. Best investment I've ever made.", rating: 5, profileImage: "https://images.unsplash.com/photo-1494790108755-2616b332db3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Daniel Martinez", title: "CTO", company: "AI Innovations", content: "ZyRok Social's engagement features are incredible. Our user retention rate is now 95%.", rating: 5, profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Amanda Taylor", title: "Business Owner", company: "Taylor Enterprises", content: "The customer connection platform increased our sales by 600%. Absolutely game-changing!", rating: 5, profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Christopher Lee", title: "VP Technology", company: "FutureTech", content: "Their AI agents handle 80% of our customer service. Efficiency through the roof!", rating: 5, profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Nicole Adams", title: "Marketing Chief", company: "BrandBoost", content: "Brand development service elevated our company image completely. Premium clients are flowing in.", rating: 5, profileImage: "https://images.unsplash.com/photo-1502764613149-7f1d229e230f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Ryan Cooper", title: "Day Trader", company: "TradeMax Pro", content: "TradeMaster Pro's AI predictions are scary accurate. My success rate jumped to 88%.", rating: 5, profileImage: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Elena Petrov", title: "Healthcare Director", company: "MedCare Plus", content: "HealthCare Pro reduced our diagnostic time by 70%. Patients are getting better care faster.", rating: 5, profileImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Marcus Johnson", title: "Finance Manager", company: "InvestSmart", content: "FinanceTracker AI's insights helped us optimize our investment strategy. Returns up 180%.", rating: 5, profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Olivia Zhang", title: "Entrepreneur", company: "StartupLaunch", content: "The career coaching and brand development combo launched my business to success. $1M ARR!", rating: 5, profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Thomas Anderson", title: "Tech Director", company: "CodeVantage", content: "ZyRok Social's AI algorithms are revolutionary. User engagement increased by 400%.", rating: 5, profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Isabella Ross", title: "Business Consultant", company: "ConsultPro", content: "Their AI agents transformed my consulting practice. I can serve 5x more clients now.", rating: 5, profileImage: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Andrew Kim", title: "Startup CEO", company: "Innovation Hub", content: "Brand development service positioned us as industry leaders. Secured major partnerships!", rating: 5, profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Victoria Chen", title: "Health Tech CEO", company: "WellnessTech", content: "HealthCare Pro's AI features are groundbreaking. Patient satisfaction scores hit 98%.", rating: 5, profileImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Benjamin Taylor", title: "Investment Analyst", company: "Alpha Capital", content: "TradeMaster Pro's market analysis is phenomenal. Portfolio performance improved by 220%.", rating: 5, profileImage: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Samantha White", title: "Digital Strategist", company: "Growth Partners", content: "The customer connection platform revolutionized our lead generation. Quality leads up 500%.", rating: 5, profileImage: "https://images.unsplash.com/photo-1502764613149-7f1d229e230f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Jacob Miller", title: "Tech Entrepreneur", company: "FutureBuild", content: "Their AI applications suite powered our entire tech stack. Development time reduced by 60%.", rating: 5, profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" },
      { name: "Hannah Davis", title: "Brand Manager", company: "Elite Brands", content: "Brand development service created our award-winning identity. Recognition in Forbes!", rating: 5, profileImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" }
    ];

    testimonialData.forEach((testimonial, index) => {
      const id = this.currentTestimonialId++;
      this.testimonials.set(id, {
        id,
        ...testimonial,
        isActive: true,
        createdAt: new Date()
      });
    });

    // Initialize products
    const productData = [
      {
        name: "ZyRok Social",
        description: "Instagram, TikTok, and YouTube Reels inspired social media platform",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        category: "Social Media",
        isFeatured: true,
        isBeta: false,
        rating: 4.8,
        downloads: "1M+",
        appStoreUrl: "#",
        playStoreUrl: "#"
      },
      {
        name: "HealthCare Pro",
        description: "AI-powered health monitoring and medical consultation platform",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        category: "Healthcare",
        isFeatured: false,
        isBeta: true,
        rating: 4.6,
        downloads: "500K+",
        appStoreUrl: "#",
        playStoreUrl: "#"
      },
      {
        name: "FinanceTracker AI",
        description: "Smart financial goal tracking and expense management with AI insights",
        image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        category: "Finance",
        isFeatured: false,
        isBeta: true,
        rating: 4.7,
        downloads: "750K+",
        appStoreUrl: "#",
        playStoreUrl: "#"
      },
      {
        name: "TradeMaster Pro",
        description: "Advanced stock market analysis and day-trading tools with AI predictions",
        image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        category: "Trading",
        isFeatured: false,
        isBeta: true,
        rating: 4.5,
        downloads: "300K+",
        appStoreUrl: "#",
        playStoreUrl: "#"
      },
      {
        name: "Analytics Pro",
        description: "Business intelligence and analytics platform with AI-driven insights",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        category: "Analytics",
        isFeatured: false,
        isBeta: true,
        rating: 4.4,
        downloads: "200K+",
        appStoreUrl: "#",
        playStoreUrl: "#"
      }
    ];

    productData.forEach((product) => {
      const id = this.currentProductId++;
      this.products.set(id, {
        id,
        ...product,
        isActive: true,
        createdAt: new Date()
      });
    });

    // Initialize services
    const serviceData = [
      {
        name: "AI Applications",
        description: "Custom mobile and web applications powered by advanced AI algorithms for App Store and Google Play deployment.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        features: ["Mobile App Development", "Web Application Suite", "Store Deployment"],
        color: "primary-400"
      },
      {
        name: "Career Coaching",
        description: "Personalized career guidance and consulting services for students and professionals seeking career advancement.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        features: ["1-on-1 Coaching Sessions", "Resume Optimization", "Interview Preparation"],
        color: "accent-cyan"
      },
      {
        name: "AI Agents",
        description: "Intelligent business automation agents designed to streamline operations and drive growth through AI-powered solutions.",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        features: ["Custom AI Agents", "Business Automation", "Growth Analytics"],
        color: "secondary-400"
      },
      {
        name: "Brand Development",
        description: "Comprehensive brand identity creation and development services for companies of all sizes, from startups to enterprises.",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        features: ["Brand Identity Design", "Marketing Strategy", "Digital Presence"],
        color: "accent-amber"
      },
      {
        name: "Customer-Business Connections",
        description: "Revolutionary platform connecting customers directly to businesses through AI-powered matching and service optimization.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        features: ["Smart Matching", "Direct Connections", "Growth Analytics"],
        color: "accent-emerald"
      }
    ];

    serviceData.forEach((service) => {
      const id = this.currentServiceId++;
      this.services.set(id, {
        id,
        ...service,
        isActive: true,
        createdAt: new Date()
      });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      profileImage: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      isAdmin: false,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStripeInfo(userId: number, customerId: string, subscriptionId?: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = {
      ...user,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId || user.stripeSubscriptionId,
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getActiveTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(t => t.isActive);
  }

  async createTestimonial(testimonial: any): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const newTestimonial: Testimonial = {
      ...testimonial,
      id,
      isActive: true,
      createdAt: new Date(),
    };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }

  async updateTestimonial(id: number, testimonial: any): Promise<Testimonial> {
    const existing = this.testimonials.get(id);
    if (!existing) throw new Error("Testimonial not found");
    
    const updated = { ...existing, ...testimonial };
    this.testimonials.set(id, updated);
    return updated;
  }

  async deleteTestimonial(id: number): Promise<void> {
    this.testimonials.delete(id);
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getActiveProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isFeatured && p.isActive);
  }

  async getBetaProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isBeta && p.isActive);
  }

  async createProduct(product: any): Promise<Product> {
    const id = this.currentProductId++;
    const newProduct: Product = {
      ...product,
      id,
      isActive: true,
      createdAt: new Date(),
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: any): Promise<Product> {
    const existing = this.products.get(id);
    if (!existing) throw new Error("Product not found");
    
    const updated = { ...existing, ...product };
    this.products.set(id, updated);
    return updated;
  }

  // Service methods
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getActiveServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(s => s.isActive);
  }

  async createService(service: any): Promise<Service> {
    const id = this.currentServiceId++;
    const newService: Service = {
      ...service,
      id,
      isActive: true,
      createdAt: new Date(),
    };
    this.services.set(id, newService);
    return newService;
  }

  async updateService(id: number, service: any): Promise<Service> {
    const existing = this.services.get(id);
    if (!existing) throw new Error("Service not found");
    
    const updated = { ...existing, ...service };
    this.services.set(id, updated);
    return updated;
  }

  // User purchase methods
  async getUserPurchases(userId: number): Promise<UserPurchase[]> {
    return Array.from(this.userPurchases.values()).filter(p => p.userId === userId);
  }

  async createUserPurchase(purchase: any): Promise<UserPurchase> {
    const id = this.currentPurchaseId++;
    const newPurchase: UserPurchase = {
      ...purchase,
      id,
      createdAt: new Date(),
    };
    this.userPurchases.set(id, newPurchase);
    return newPurchase;
  }

  async updatePurchaseStatus(id: number, status: string): Promise<UserPurchase> {
    const existing = this.userPurchases.get(id);
    if (!existing) throw new Error("Purchase not found");
    
    const updated = { ...existing, status };
    this.userPurchases.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
