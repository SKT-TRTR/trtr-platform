import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { User, Menu, X } from "lucide-react";
import trtrLogo from "@assets/trtr logo4_1750910979150.png";

export default function Navigation() {
  const [location] = useLocation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const { user, isAuthenticated, login, register, logout, isLoginLoading, isRegisterLoading } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authMode === "login") {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register({ 
          username: formData.username, 
          email: formData.email, 
          password: formData.password 
        });
      }
      setIsAuthOpen(false);
      setFormData({ username: "", email: "", password: "" });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const scrollToSection = (sectionId: string) => {
    if (location === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center">
              <img 
                src={trtrLogo} 
                alt="TRTR Logo" 
                className="h-12 w-auto transition-transform duration-300 hover:scale-105 mr-3"
              />
              <span className="font-black text-2xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                TRTR
              </span>
            </Link>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button 
                  onClick={() => scrollToSection("home")}
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection("services")}
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection("products")}
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Products
                </button>
                <button 
                  onClick={() => scrollToSection("testimonials")}
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Testimonials
                </button>
                <button 
                  onClick={() => scrollToSection("contact")}
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Contact
                </button>
                <Link href="/ai-demo">
                  <button className="text-purple-400 hover:text-purple-300 transition-colors duration-300 font-semibold">
                    AI Demo
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="glass-effect">
                      <User className="w-4 h-4 mr-2" />
                      {user?.username}
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="glass-effect"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => { setAuthMode("login"); setIsAuthOpen(true); }}
                    className="glass-effect"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => scrollToSection("home")}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-500/90 hover:to-secondary-500/90 animate-glow"
                  >
                    Get Started
                  </Button>
                </>
              )}
              
              <div className="md:hidden">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-effect border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => scrollToSection("home")}
                className="block px-3 py-2 text-gray-300 hover:text-white w-full text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection("services")}
                className="block px-3 py-2 text-gray-300 hover:text-white w-full text-left"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection("products")}
                className="block px-3 py-2 text-gray-300 hover:text-white w-full text-left"
              >
                Products
              </button>
              <button 
                onClick={() => scrollToSection("testimonials")}
                className="block px-3 py-2 text-gray-300 hover:text-white w-full text-left"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection("contact")}
                className="block px-3 py-2 text-gray-300 hover:text-white w-full text-left"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Dialog */}
      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="glass-effect border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              <img src={trtrLogo} alt="TRTR Logo" className="h-6 w-auto" />
              <span className="font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">TRTR</span> {authMode === "login" ? "Login" : "Account"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === "register" && (
              <div>
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="glass-effect border-white/20 text-white"
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="glass-effect border-white/20 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="glass-effect border-white/20 text-white"
                required
              />
            </div>
            <div className="flex flex-col space-y-3">
              <Button 
                type="submit" 
                disabled={isLoginLoading || isRegisterLoading}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-500/90 hover:to-secondary-500/90"
              >
                {authMode === "login" 
                  ? (isLoginLoading ? "Logging in..." : "Login")
                  : (isRegisterLoading ? "Creating account..." : "Create Account")
                }
              </Button>
              <Button 
                type="button" 
                variant="ghost"
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                className="text-gray-300 hover:text-white"
              >
                {authMode === "login" 
                  ? "Need an account? Sign up" 
                  : "Already have an account? Login"
                }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
