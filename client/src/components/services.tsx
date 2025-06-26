import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
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
  "AI Applications": "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
  "Career Coaching": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
  "AI Agents": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
  "Brand Development": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
  "Customer-Business Connections": "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
};

export default function Services() {

  const { data: services, isLoading } = useQuery({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json() as Service[];
    }
  });



  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-lg animate-pulse mb-6"></div>
            <div className="h-6 bg-gray-300/20 rounded-lg animate-pulse max-w-2xl mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass-effect rounded-2xl p-8 animate-pulse">
                <div className="h-48 bg-gray-300/20 rounded-xl mb-6"></div>
                <div className="h-6 bg-gray-300/20 rounded mb-4"></div>
                <div className="h-16 bg-gray-300/20 rounded mb-6"></div>
                <div className="space-y-2 mb-6">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-300/20 rounded"></div>
                  ))}
                </div>
                <div className="h-12 bg-gray-300/20 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const getButtonStyle = (color: string) => {
    switch (color) {
      case "primary-400":
        return "bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-500/90 hover:to-secondary-500/90";
      case "accent-cyan":
        return "bg-gradient-to-r from-accent-cyan to-primary-500 hover:opacity-90";
      case "secondary-400":
        return "bg-gradient-to-r from-secondary-500 to-primary-500 hover:from-secondary-500/90 hover:to-primary-500/90";
      case "accent-amber":
        return "bg-gradient-to-r from-accent-amber to-accent-emerald hover:opacity-90 text-slate-900";
      case "accent-emerald":
        return "bg-gradient-to-r from-accent-emerald to-primary-500 hover:from-accent-emerald/90 hover:to-primary-500/90";
      default:
        return "bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-500/90 hover:to-secondary-500/90";
    }
  };

  const getServiceImage = (serviceName: string) => {
    const imageMap: Record<string, string> = {
      'AI Applications': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      'Career Coaching': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      'AI Agents': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      'Brand Development': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      'Customer-Business Connections': 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400'
    };
    return imageMap[serviceName] || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
  };

  const getTextColor = (color: string) => {
    switch (color) {
      case "primary-400":
        return "text-primary-500";
      case "accent-cyan":
        return "text-accent-cyan";
      case "secondary-400":
        return "text-secondary-500";
      case "accent-amber":
        return "text-accent-amber";
      case "accent-emerald":
        return "text-accent-emerald";
      default:
        return "text-primary-500";
    }
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="header-sync mb-6">
            Services
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-semibold">
            Comprehensive AI-powered solutions designed to accelerate your business transformation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.slice(0, 4).map((service) => (
            <Card key={service.id} className="service-card glass-laser-cell border-white/10">
              <CardHeader className="p-0">
                <div className="mb-6 relative h-48 rounded-t-xl overflow-hidden">
                  <img 
                    src={getServiceImage(service.name)} 
                    alt={service.name}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="px-8">
                  <CardTitle className={`text-2xl font-bold mb-4 ${getTextColor(service.color)}`}>
                    {service.name}
                  </CardTitle>
                  <CardDescription className="text-gray-300 mb-6">
                    {service.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <ul className="space-y-2 mb-6">
                  {service.features?.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-400">
                      <Check className="w-4 h-4 text-accent-emerald mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={`/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Button className={`w-full ${getButtonStyle(service.color)}`}>
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
          
          {/* Customer-Business Connections - Special Layout */}
          {services && services.length > 4 && (
            <Card className="service-card glass-effect border-white/10 bg-transparent md:col-span-2 lg:col-span-2">
              <CardHeader className="p-0">
                <div className="mb-6 flex justify-center">
                  <img 
                    src={services[4].image} 
                    alt={services[4].name}
                    className="w-full max-w-md h-48 object-cover rounded-t-xl" 
                  />
                </div>
                <div className="px-8">
                  <CardTitle className="text-2xl font-bold mb-4 text-accent-emerald text-center">
                    {services[4].name}
                  </CardTitle>
                  <CardDescription className="text-gray-300 mb-6 text-center max-w-2xl mx-auto">
                    {services[4].description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {services[4].features?.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl text-accent-emerald mb-2">
                        {index === 0 && "👥"}
                        {index === 1 && "🤝"}
                        {index === 2 && "📈"}
                      </div>
                      <p className="text-sm text-gray-400">{feature}</p>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <Button className="bg-gradient-to-r from-accent-emerald to-primary-500 hover:from-accent-emerald/90 hover:to-primary-500/90 px-8">
                    Join Platform
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
