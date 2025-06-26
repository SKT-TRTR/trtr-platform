import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import Services from "@/components/services";
import Products from "@/components/products";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Rocket, Phone } from "lucide-react";

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Services />
      <Products />
      <Testimonials />
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-2xl">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied clients who have revolutionized their operations with our AI-powered solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              onClick={() => scrollToSection("services")}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-500/90 hover:to-secondary-500/90 animate-glow text-lg px-8 py-4"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Get Started Today
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              onClick={() => scrollToSection("contact")}
              className="glass-effect hover:bg-white/10 text-lg px-8 py-4"
            >
              <Phone className="w-5 h-5 mr-2" />
              Talk to Sales
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
