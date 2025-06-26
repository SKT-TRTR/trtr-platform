import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Download, Globe, Smartphone, Zap } from "lucide-react";
import { Link } from "wouter";

interface Service {
  id: number;
  name: string;
  description: string;
  image: string;
  features: string[];
  color: string;
  isActive: boolean;
}

// Static professional service images
const serviceImages: Record<string, string> = {
  "ai-applications": "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  "career-coaching": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  "ai-agents": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  "brand-development": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  "customer-business-connections": "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
};

const serviceDetails: Record<string, any> = {
  "ai-applications": {
    title: "AI Applications",
    subtitle: "Revolutionary AI-powered applications for business transformation",
    overview: "Our AI Applications service delivers cutting-edge artificial intelligence solutions that transform how businesses operate. From custom AI models to intelligent automation systems, we create applications that learn, adapt, and evolve with your business needs.",
    keyBenefits: [
      "Increase operational efficiency by up to 300%",
      "Reduce manual processing time by 85%",
      "Improve decision-making accuracy with data-driven insights",
      "Scale your operations without proportional cost increases"
    ],
    howItWorks: [
      "Initial consultation to understand your business needs",
      "Custom AI model development and training",
      "Integration with your existing systems",
      "Ongoing optimization and support"
    ],
    usageGuide: [
      "Access our web-based AI dashboard",
      "Upload your data for AI processing",
      "Configure AI parameters for your specific use case",
      "Monitor results and performance metrics",
      "Scale usage based on your business growth"
    ],
    pricing: "Starting at $5,000/month",
    downloadInfo: "Available as web application and API integration"
  },
  "career-coaching": {
    title: "Career Coaching",
    subtitle: "AI-powered personalized career advancement program",
    overview: "Our Career Coaching service combines human expertise with AI insights to accelerate your professional growth. Whether you're looking to advance in your current role, switch careers, or build leadership skills, our program provides personalized guidance and actionable strategies.",
    keyBenefits: [
      "Average 40% salary increase within 12 months",
      "85% success rate in career transitions",
      "Personalized learning paths based on industry trends",
      "1-on-1 coaching sessions with industry experts"
    ],
    howItWorks: [
      "Complete comprehensive career assessment",
      "Receive personalized development plan",
      "Weekly coaching sessions with expert mentors",
      "Access to exclusive industry networking events"
    ],
    usageGuide: [
      "Sign up for your career assessment",
      "Schedule your first coaching session",
      "Follow your personalized development plan",
      "Track progress through our mobile app",
      "Apply learnings in real-world scenarios"
    ],
    pricing: "Starting at $299/month",
    downloadInfo: "Mobile app available on iOS and Android"
  },
  "ai-agents": {
    title: "AI Agents",
    subtitle: "Intelligent automation agents for seamless business processes",
    overview: "Our AI Agents service provides intelligent virtual assistants that handle complex business tasks autonomously. These agents learn from your workflows and continuously improve their performance, handling everything from customer service to data analysis.",
    keyBenefits: [
      "Handle 80% of routine tasks automatically",
      "24/7 availability with instant response times",
      "Reduce operational costs by up to 60%",
      "Seamless integration with existing tools"
    ],
    howItWorks: [
      "Define your business processes and requirements",
      "Train AI agents on your specific workflows",
      "Deploy agents across your business operations",
      "Monitor performance and optimize continuously"
    ],
    usageGuide: [
      "Access the AI Agent control panel",
      "Configure agents for specific tasks",
      "Set up integrations with your tools",
      "Monitor agent performance and metrics",
      "Expand agent capabilities as needed"
    ],
    pricing: "Starting at $1,500/month per agent",
    downloadInfo: "Cloud-based service with API access"
  },
  "brand-development": {
    title: "Brand Development",
    subtitle: "Comprehensive brand strategy and visual identity creation",
    overview: "Our Brand Development service creates powerful, memorable brands that resonate with your target audience. We combine strategic thinking with creative execution to build brands that drive business growth and customer loyalty.",
    keyBenefits: [
      "Increase brand recognition by up to 400%",
      "Improve customer loyalty and retention",
      "Create consistent brand experience across all touchpoints",
      "Position your brand as an industry leader"
    ],
    howItWorks: [
      "Brand strategy and positioning workshop",
      "Visual identity design and development",
      "Brand guidelines and asset creation",
      "Launch strategy and implementation support"
    ],
    usageGuide: [
      "Complete brand assessment questionnaire",
      "Participate in strategy workshops",
      "Review and approve design concepts",
      "Receive comprehensive brand package",
      "Implement across all business touchpoints"
    ],
    pricing: "Starting at $10,000 for complete package",
    downloadInfo: "Digital brand package with all assets and guidelines"
  },
  "customer-business-connections": {
    title: "Customer-Business Connections",
    subtitle: "AI-powered platform for meaningful business relationships",
    overview: "Our Customer-Business Connections service creates intelligent matchmaking between businesses and their ideal customers. Using advanced AI algorithms, we help businesses find, connect with, and retain their most valuable customers.",
    keyBenefits: [
      "Increase qualified leads by up to 500%",
      "Improve customer acquisition cost efficiency",
      "Higher conversion rates through better targeting",
      "Build long-term customer relationships"
    ],
    howItWorks: [
      "Define your ideal customer profile",
      "AI analyzes and identifies potential matches",
      "Automated outreach and relationship building",
      "Continuous optimization based on results"
    ],
    usageGuide: [
      "Set up your business profile and goals",
      "Configure target customer parameters",
      "Review AI-generated customer matches",
      "Engage with potential customers through the platform",
      "Track relationship progress and ROI"
    ],
    pricing: "Starting at $2,000/month",
    downloadInfo: "Web platform with mobile companion app"
  }
};

export default function ServiceDetail() {
  const params = useParams();
  const serviceSlug = params.slug as string;

  const { data: services } = useQuery({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json() as Service[];
    }
  });

  const service = services?.find(s => s.name.toLowerCase().replace(/\s+/g, '-') === serviceSlug);
  const details = serviceDetails[serviceSlug];

  if (!service || !details) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Service Not Found</h1>
          <Link href="/">
            <Button className="bg-gradient-to-r from-primary-500 to-secondary-500">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="text-white hover:text-accent-cyan mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white mb-4">
                {details.title}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {details.subtitle}
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                {details.overview}
              </p>
              <div className="flex space-x-4">
                <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600">
                  <Zap className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                  <Download className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={serviceImages[serviceSlug]}
                alt={details.title}
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-500/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Key Benefits</h2>
            <p className="text-xl text-gray-400">Why choose our {details.title} service</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {details.keyBenefits.map((benefit: string, index: number) => (
              <Card key={index} className="glass-effect border-white/10 bg-transparent">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Check className="w-6 h-6 text-accent-emerald flex-shrink-0 mt-1" />
                    <p className="text-gray-300">{benefit}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-gray-400">Simple steps to get started</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {details.howItWorks.map((step: string, index: number) => (
              <Card key={index} className="glass-effect border-white/10 bg-transparent text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {index + 1}
                  </div>
                  <p className="text-gray-300">{step}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Usage Guide */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Usage Guide</h2>
            <p className="text-xl text-gray-400">Step-by-step instructions</p>
          </div>
          <Card className="glass-effect border-white/10 bg-transparent max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                {details.usageGuide.map((instruction: string, index: number) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-accent-cyan to-accent-emerald rounded-full flex items-center justify-center text-slate-900 font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 text-lg">{instruction}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing & Download */}
      <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="glass-effect border-white/10 bg-transparent">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-accent-cyan mb-4">
                  {details.pricing}
                </div>
                <p className="text-gray-400 mb-6">Get started with our flexible pricing options</p>
                <Button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10 bg-transparent">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Download & Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-6">{details.downloadInfo}</p>
                <div className="space-y-4">
                  <Button className="w-full bg-black text-white hover:bg-gray-800">
                    <Globe className="w-4 h-4 mr-2" />
                    Web Platform
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Mobile App
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}