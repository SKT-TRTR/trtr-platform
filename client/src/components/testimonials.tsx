import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  content: string;
  rating: number;
  profileImage: string;
  isActive: boolean;
}

export default function Testimonials() {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["/api/testimonials"],
    queryFn: async () => {
      const response = await fetch("/api/testimonials");
      if (!response.ok) throw new Error("Failed to fetch testimonials");
      return response.json() as Testimonial[];
    }
  });

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 bg-gradient-to-b from-purple-900 to-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-gradient-to-r from-accent-cyan/20 to-secondary-500/20 rounded-lg animate-pulse mb-6"></div>
            <div className="h-6 bg-gray-300/20 rounded-lg animate-pulse max-w-2xl mx-auto"></div>
          </div>
          <div className="relative">
            <div className="flex space-x-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="min-w-[400px] glass-effect rounded-2xl p-8 animate-pulse">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gray-300/20 rounded-full mr-4"></div>
                    <div>
                      <div className="h-4 bg-gray-300/20 rounded mb-2 w-32"></div>
                      <div className="h-3 bg-gray-300/20 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-16 bg-gray-300/20 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Create doubled array for seamless infinite scroll
  const doubledTestimonials = testimonials ? [...testimonials, ...testimonials] : [];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-purple-900 to-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-2xl">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real testimonials from satisfied customers who have transformed their businesses with our AI solutions
          </p>
        </div>
        
        <div className="relative">
          <div className="testimonial-container">
            {doubledTestimonials.map((testimonial, index) => (
              <Card key={`${testimonial.id}-${index}`} className="testimonial-card glass-laser-cell border-white/10">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <img 
                      src={testimonial.profileImage} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4 bg-gray-600" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1494790108755-2616b332db3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150";
                      }}
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-accent-cyan text-sm">{testimonial.title}, {testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-accent-amber fill-current" />
                    ))}
                  </div>
                  <p className="testimonial-text text-gray-300">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
