import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Download, Smartphone, Globe, Play } from "lucide-react";
import { Link } from "wouter";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  isFeatured: boolean;
  isBeta: boolean;
  rating: number;
  downloads: string;
  appStoreUrl: string;
  playStoreUrl: string;
  isActive: boolean;
}

// Static professional product images
const productImages: Record<string, string> = {
  "zyrok-social": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  "datamind-analytics": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  "ai-assistant-pro": "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  "smartbot-creator": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
};

const productDetails: Record<string, any> = {
  "zyrok-social": {
    title: "ZyRok Social",
    subtitle: "Next-generation social platform powered by AI",
    overview: "ZyRok Social revolutionizes social networking with intelligent content curation, AI-powered matching, and advanced privacy controls. Connect with like-minded individuals while enjoying a seamless, personalized social experience.",
    features: [
      "AI-powered content recommendations",
      "Smart friend matching algorithms",
      "Advanced privacy and security controls",
      "Real-time translation for global communication",
      "Intelligent spam and harassment detection",
      "Personalized feed optimization"
    ],
    systemRequirements: {
      ios: "iOS 14.0 or later",
      android: "Android 8.0 (API level 26) or higher",
      storage: "100 MB available space",
      internet: "Active internet connection required"
    },
    howToDownload: [
      "Visit the App Store (iOS) or Google Play Store (Android)",
      "Search for 'ZyRok Social' or use the direct links below",
      "Tap 'Install' or 'Get' to download the app",
      "Wait for the download and installation to complete",
      "Open the app and create your account"
    ],
    howToUse: [
      "Create your profile with interests and preferences",
      "Allow the AI to analyze your social patterns",
      "Start connecting with recommended friends",
      "Share content and engage with your network",
      "Customize your feed and notification settings",
      "Explore AI-curated content and communities"
    ],
    pricing: "Free with premium features at $9.99/month",
    rating: 4.8,
    downloads: "2M+"
  },
  "datamind-analytics": {
    title: "DataMind Analytics",
    subtitle: "Advanced business intelligence with AI insights",
    overview: "DataMind Analytics transforms raw business data into actionable insights using cutting-edge AI algorithms. Make data-driven decisions with confidence through intuitive dashboards and predictive analytics.",
    features: [
      "Real-time data visualization",
      "Predictive analytics and forecasting",
      "Custom dashboard creation",
      "Automated report generation",
      "Integration with major data sources",
      "AI-powered anomaly detection"
    ],
    systemRequirements: {
      ios: "iOS 15.0 or later",
      android: "Android 9.0 (API level 28) or higher",
      storage: "150 MB available space",
      internet: "High-speed internet connection recommended"
    },
    howToDownload: [
      "Access the App Store or Google Play Store",
      "Search for 'DataMind Analytics'",
      "Download and install the application",
      "Complete the business verification process",
      "Set up your data connections"
    ],
    howToUse: [
      "Connect your business data sources",
      "Configure your analytics preferences",
      "Create custom dashboards for your KPIs",
      "Set up automated alerts and reports",
      "Analyze AI-generated insights and recommendations",
      "Share reports with your team members"
    ],
    pricing: "Enterprise pricing starting at $299/month",
    rating: 4.6,
    downloads: "500K+"
  },
  "ai-assistant-pro": {
    title: "AI Assistant Pro",
    subtitle: "Your intelligent personal and business assistant",
    overview: "AI Assistant Pro is your comprehensive digital companion that handles scheduling, task management, research, and communication. Powered by advanced AI, it learns your preferences and adapts to your workflow.",
    features: [
      "Natural language processing",
      "Calendar and task management",
      "Email and message composition",
      "Research and information gathering",
      "Meeting transcription and summarization",
      "Multi-language support"
    ],
    systemRequirements: {
      ios: "iOS 14.0 or later",
      android: "Android 8.0 (API level 26) or higher",
      storage: "75 MB available space",
      internet: "Stable internet connection required"
    },
    howToDownload: [
      "Open your device's app store",
      "Search for 'AI Assistant Pro'",
      "Install the application",
      "Grant necessary permissions for optimal functionality",
      "Complete the initial setup and personalization"
    ],
    howToUse: [
      "Train the AI with your preferences and routines",
      "Connect your calendar and communication apps",
      "Start with simple voice or text commands",
      "Review and approve AI-generated content",
      "Customize automation rules and triggers",
      "Expand usage as you become more comfortable"
    ],
    pricing: "Free trial, then $19.99/month",
    rating: 4.7,
    downloads: "1.5M+"
  },
  "smartbot-creator": {
    title: "SmartBot Creator",
    subtitle: "Build intelligent chatbots without coding",
    overview: "SmartBot Creator empowers businesses to create sophisticated AI chatbots without technical expertise. Design, train, and deploy chatbots for customer service, sales, and support with our intuitive visual interface.",
    features: [
      "Drag-and-drop bot builder",
      "Natural language understanding",
      "Multi-channel deployment",
      "Analytics and performance tracking",
      "Integration with popular platforms",
      "Pre-built industry templates"
    ],
    systemRequirements: {
      ios: "iOS 15.0 or later",
      android: "Android 9.0 (API level 28) or higher",
      storage: "120 MB available space",
      internet: "Reliable internet connection required"
    },
    howToDownload: [
      "Navigate to the App Store or Google Play Store",
      "Search for 'SmartBot Creator'",
      "Download and install the app",
      "Create your business account",
      "Choose your subscription plan"
    ],
    howToUse: [
      "Start with a template or create from scratch",
      "Design conversation flows using visual tools",
      "Train your bot with sample conversations",
      "Test thoroughly before deployment",
      "Deploy to your preferred channels",
      "Monitor performance and optimize based on analytics"
    ],
    pricing: "Starter plan at $49/month, Pro at $149/month",
    rating: 4.5,
    downloads: "750K+"
  }
};

export default function ProductDetail() {
  const params = useParams();
  const productSlug = params.slug as string;

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json() as Product[];
    }
  });

  const product = products?.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === productSlug);
  const details = productDetails[productSlug];

  if (!product || !details) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Product Not Found</h1>
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
              <div className="flex items-center space-x-4 mb-4">
                {product.isFeatured && (
                  <Badge className="bg-gradient-to-r from-accent-amber to-accent-emerald text-slate-900 font-bold">
                    FEATURED
                  </Badge>
                )}
                {product.isBeta && (
                  <Badge className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold">
                    BETA
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {details.title}
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                {details.subtitle}
              </p>
              <p className="text-lg text-gray-400 mb-8">
                {details.overview}
              </p>
              
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(details.rating) ? 'text-accent-amber fill-current' : 'text-gray-400'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-white font-semibold">{details.rating}</span>
                </div>
                <div className="text-gray-400">
                  <Download className="w-4 h-4 inline mr-1" />
                  {details.downloads} downloads
                </div>
              </div>

              <div className="flex space-x-4">
                <Button 
                  className="bg-black text-white hover:bg-gray-800"
                  onClick={() => window.open(product.appStoreUrl, '_blank')}
                >
                  <span className="mr-2">🍎</span>
                  App Store
                </Button>
                <Button 
                  className="bg-green-600 text-white hover:bg-green-700"
                  onClick={() => window.open(product.playStoreUrl, '_blank')}
                >
                  <span className="mr-2">📱</span>
                  Play Store
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img
                src={productImages[productSlug]}
                alt={details.title}
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-500/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Key Features</h2>
            <p className="text-xl text-gray-400">What makes {details.title} special</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {details.features.map((feature: string, index: number) => (
              <Card key={index} className="glass-effect border-white/10 bg-transparent">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-300">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Download */}
      <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">How to Download</h2>
            <p className="text-xl text-gray-400">Get started in minutes</p>
          </div>
          <Card className="glass-effect border-white/10 bg-transparent max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-6">
                {details.howToDownload.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-accent-cyan to-accent-emerald rounded-full flex items-center justify-center text-slate-900 font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 text-lg">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">How to Use</h2>
            <p className="text-xl text-gray-400">Master {details.title} with these steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {details.howToUse.map((instruction: string, index: number) => (
              <Card key={index} className="glass-effect border-white/10 bg-transparent">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                      {index + 1}
                    </div>
                  </div>
                  <p className="text-gray-300 text-center">{instruction}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* System Requirements & Pricing */}
      <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="glass-effect border-white/10 bg-transparent">
              <CardHeader>
                <CardTitle className="text-2xl text-white">System Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-accent-cyan font-semibold mb-2">iOS</h4>
                  <p className="text-gray-300">{details.systemRequirements.ios}</p>
                </div>
                <div>
                  <h4 className="text-accent-emerald font-semibold mb-2">Android</h4>
                  <p className="text-gray-300">{details.systemRequirements.android}</p>
                </div>
                <div>
                  <h4 className="text-accent-amber font-semibold mb-2">Storage</h4>
                  <p className="text-gray-300">{details.systemRequirements.storage}</p>
                </div>
                <div>
                  <h4 className="text-secondary-500 font-semibold mb-2">Internet</h4>
                  <p className="text-gray-300">{details.systemRequirements.internet}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10 bg-transparent">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent-cyan mb-4">
                  {details.pricing}
                </div>
                <p className="text-gray-400 mb-6">Flexible pricing options for every need</p>
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
                    onClick={() => window.open(product.appStoreUrl, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Now
                  </Button>
                  <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-slate-900">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Demo
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