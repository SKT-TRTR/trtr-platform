import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Rocket, Brain, Zap, Sparkles, Bot, Cpu, Globe, ArrowRight, Star, Monitor, Code, Database, Shield } from "lucide-react";
import heroImage from "@assets/image_1750909878337.png";
import trtrLogo from "@assets/trtr logo4_1750910979150.png";

export default function Hero() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950">
        {/* Modern Geometric Background */}
        <div className="absolute inset-0">
          {/* Hexagon Pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}></div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-20 left-20 w-4 h-4 bg-cyan-400 rotate-45 animate-pulse opacity-60"></div>
          <div className="absolute top-40 right-32 w-6 h-6 border-2 border-purple-400 rotate-12 animate-spin-slow opacity-40"></div>
          <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-50"></div>
          
          {/* Vertical Lines */}
          <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>
          <div className="absolute right-1/3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left Content - Modern Layout */}
            <div className="space-y-12">
              {/* Status Indicator */}
              <div className="inline-flex items-center gap-3 bg-slate-800/50 border border-slate-700/50 rounded-full px-6 py-3 backdrop-blur-sm">
                <div className="relative">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
                <span className="text-emerald-400 font-medium text-sm">AI Systems Online</span>
                <div className="w-px h-4 bg-slate-600"></div>
                <span className="text-slate-400 text-sm">15 Capabilities Active</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-6xl md:text-8xl font-black leading-[0.9]">
                  <span className="block text-white">NEXT-GEN</span>
                  <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    AI SOLUTIONS
                  </span>
                </h1>
                
                <div className="max-w-lg">
                  <p className="text-xl text-slate-300 leading-relaxed font-light">
                    Revolutionize your business with enterprise-grade AI. From intelligent automation 
                    to predictive analytics—experience the future today.
                  </p>
                </div>
              </div>

              {/* Tech Stack Grid */}
              <div className="grid grid-cols-4 gap-3">
                <div className="group relative bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 hover:border-purple-500/30 transition-all duration-300">
                  <Bot className="w-6 h-6 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-xs text-slate-400 font-medium">OpenAI</div>
                  <div className="text-xs text-slate-500">GPT-4</div>
                </div>
                <div className="group relative bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 hover:border-cyan-500/30 transition-all duration-300">
                  <Sparkles className="w-6 h-6 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-xs text-slate-400 font-medium">Gemini</div>
                  <div className="text-xs text-slate-500">Google</div>
                </div>
                <div className="group relative bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 hover:border-orange-500/30 transition-all duration-300">
                  <Brain className="w-6 h-6 text-orange-400 mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-xs text-slate-400 font-medium">Claude</div>
                  <div className="text-xs text-slate-500">Anthropic</div>
                </div>
                <div className="group relative bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 hover:border-emerald-500/30 transition-all duration-300">
                  <Database className="w-6 h-6 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-xs text-slate-400 font-medium">Unified</div>
                  <div className="text-xs text-slate-500">Platform</div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => scrollToSection("services")}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white text-lg px-10 py-6 rounded-xl font-semibold shadow-xl shadow-purple-500/25 border-0 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <Rocket className="w-6 h-6 mr-3" />
                  Get Started
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.href = '/ai-demo'}
                  className="border-2 border-slate-600 hover:border-purple-500 bg-transparent hover:bg-purple-500/10 text-white text-lg px-10 py-6 rounded-xl font-semibold group"
                >
                  <Monitor className="w-6 h-6 mr-3 group-hover:text-purple-400 transition-colors" />
                  Live Demo
                </Button>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-8 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">1K+</div>
                  <div className="text-sm text-slate-500">Businesses</div>
                </div>
                <div className="w-px h-12 bg-slate-700"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-slate-500">Uptime</div>
                </div>
                <div className="w-px h-12 bg-slate-700"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">15</div>
                  <div className="text-sm text-slate-500">AI Models</div>
                </div>
              </div>
            </div>
            
            {/* Right Visual - Modern Interface */}
            <div className="relative">
              {/* Main Container */}
              <div className="relative bg-slate-900/50 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">AI_TERMINAL_V2.1</div>
                </div>

                {/* AI Interface */}
                <div className="space-y-6">
                  {/* Status Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-slate-400 font-mono">ONLINE</span>
                      </div>
                      <div className="text-sm text-white font-semibold">AI Processing</div>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-3 h-3 text-cyan-400" />
                        <span className="text-xs text-slate-400 font-mono">SECURE</span>
                      </div>
                      <div className="text-sm text-white font-semibold">Enterprise Ready</div>
                    </div>
                  </div>

                  {/* Main Image */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-700/30">
                    <img 
                      src={heroImage} 
                      alt="AI Interface Dashboard" 
                      className="w-full h-48 object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700/30">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-purple-400" />
                          <span className="text-white text-sm font-medium">Real-time Analysis</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Neural Processing</span>
                      <span className="text-slate-300">94%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-cyan-400 to-purple-400 h-1.5 rounded-full w-[94%] animate-pulse"></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Data Optimization</span>
                      <span className="text-slate-300">87%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-1.5 rounded-full w-[87%] animate-pulse" style={{animationDelay: "0.5s"}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl p-4 shadow-2xl">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 shadow-2xl">
                <Zap className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
        <DialogContent className="glass-effect border-white/20 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl flex items-center gap-3">
              <img src={trtrLogo} alt="TRTR Logo" className="h-8 w-auto" />
              <span className="font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">TRTR</span> AI Solutions Demo
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 text-white/60 mx-auto mb-4" />
              <p className="text-white/80 text-lg">Demo video coming soon</p>
              <p className="text-white/60">Experience the future of AI-powered business solutions</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
