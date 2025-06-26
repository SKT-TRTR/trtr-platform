import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Check, Crown, Zap } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/dashboard",
      },
    });

    if (error) {
      toast({
        title: "Subscription Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to TRTR Premium!",
        description: "You are now subscribed to our premium plan.",
      });
    }

    setIsProcessing(false);
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-center flex items-center justify-center">
          <Crown className="w-6 h-6 mr-2 text-accent-amber" />
          Subscribe to Premium
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement />
          <Button 
            type="submit" 
            disabled={!stripe || isProcessing}
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-500/90 hover:to-secondary-500/90 animate-glow"
          >
            {isProcessing ? "Processing..." : "Subscribe Now - $29/month"}
          </Button>
          <p className="text-xs text-gray-400 text-center">
            Secure payments powered by Stripe Atlas. Cancel anytime.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      return;
    }

    // Create subscription as soon as the page loads
    apiRequest("POST", "/api/get-or-create-subscription")
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to initialize subscription. Please try again.",
          variant: "destructive",
        });
      });
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen pt-16">
      <Navigation />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Choose Your Plan
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Unlock the full potential of AI-powered business solutions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Free Plan */}
            <Card className="glass-effect border-white/20 bg-transparent">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white mb-2">Free Plan</CardTitle>
                <div className="text-3xl font-bold text-gray-400 mb-4">
                  $0<span className="text-lg">/month</span>
                </div>
                <Badge variant="outline" className="text-gray-400 border-gray-400">
                  Basic Access
                </Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-accent-emerald mr-3" />
                    Access to ZyRok Social
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-accent-emerald mr-3" />
                    Basic AI tools
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-accent-emerald mr-3" />
                    Community support
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="w-5 h-5 mr-3">×</span>
                    Premium AI features
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="w-5 h-5 mr-3">×</span>
                    Priority support
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-400 text-gray-400 hover:bg-gray-400/10"
                  disabled
                >
                  Current Plan
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="glass-effect border-primary-500/50 bg-gradient-to-b from-primary-500/10 to-secondary-500/10 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-accent-amber to-accent-emerald text-slate-900 font-bold">
                  RECOMMENDED
                </Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white mb-2 flex items-center justify-center">
                  <Crown className="w-6 h-6 mr-2 text-accent-amber" />
                  Premium Plan
                </CardTitle>
                <div className="text-4xl font-bold text-white mb-4">
                  $29<span className="text-lg">/month</span>
                </div>
                <Badge className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                  Full Access
                </Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-white">
                    <Check className="w-5 h-5 text-accent-emerald mr-3" />
                    All Free Plan features
                  </li>
                  <li className="flex items-center text-white">
                    <Check className="w-5 h-5 text-accent-emerald mr-3" />
                    Access to all Beta products
                  </li>
                  <li className="flex items-center text-white">
                    <Check className="w-5 h-5 text-accent-emerald mr-3" />
                    Advanced AI agents
                  </li>
                  <li className="flex items-center text-white">
                    <Check className="w-5 h-5 text-accent-emerald mr-3" />
                    Priority customer support
                  </li>
                  <li className="flex items-center text-white">
                    <Check className="w-5 h-5 text-accent-emerald mr-3" />
                    Career coaching sessions
                  </li>
                  <li className="flex items-center text-white">
                    <Zap className="w-5 h-5 text-accent-amber mr-3" />
                    Exclusive early access
                  </li>
                </ul>
                {!clientSecret ? (
                  <div className="w-full h-12 bg-primary-500/20 rounded-lg animate-pulse"></div>
                ) : (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <SubscribeForm />
                  </Elements>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-gray-400">
            <p className="mb-4">
              <strong className="text-white">30-day money-back guarantee.</strong> Cancel anytime.
            </p>
            <p className="text-sm">
              Questions? Contact our sales team at{" "}
              <a href="mailto:sales@trtr-inc.com" className="text-primary-500 hover:text-primary-400">
                sales@trtr-inc.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
