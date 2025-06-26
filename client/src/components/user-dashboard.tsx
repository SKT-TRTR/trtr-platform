import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  User, 
  Crown, 
  Calendar, 
  CreditCard, 
  Download, 
  Star,
  Settings,
  Bell,
  Shield,
  Smartphone
} from "lucide-react";

interface UserPurchase {
  id: number;
  productId: number;
  purchaseType: string;
  status: string;
  expiryDate: string | null;
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  isFeatured: boolean;
  isBeta: boolean;
}

export default function UserDashboard() {
  const { user } = useAuth();

  const { data: purchases, isLoading: purchasesLoading } = useQuery({
    queryKey: ["/api/user/purchases"],
    queryFn: async () => {
      const response = await fetch("/api/user/purchases", {
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to fetch purchases");
      return response.json() as UserPurchase[];
    }
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json() as Product[];
    }
  });

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isPremiumUser = purchases?.some(p => p.status === 'active' && p.purchaseType === 'subscription');
  const activePurchases = purchases?.filter(p => p.status === 'active') || [];
  const purchasedProductIds = activePurchases.map(p => p.productId);
  const purchasedProducts = products?.filter(p => purchasedProductIds.includes(p.id)) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Manage your TRTR account and access your products</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Section */}
            <Card className="glass-effect border-white/20 bg-transparent">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary-500 text-white text-lg">
                      {getUserInitials(user?.username || "User")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{user?.username}</h3>
                    <p className="text-gray-400">{user?.email}</p>
                    <div className="flex items-center mt-2">
                      {isPremiumUser ? (
                        <Badge className="bg-gradient-to-r from-accent-amber to-accent-emerald text-slate-900">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium Member
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-400 border-gray-400">
                          Free Member
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* My Products */}
            <Card className="glass-effect border-white/20 bg-transparent">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    My Products
                  </span>
                  <Badge variant="outline" className="text-primary-500 border-primary-500">
                    {purchasedProducts.length} Active
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Access and manage your purchased applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {purchasesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="glass-effect rounded-lg p-4 animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-300/20 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300/20 rounded mb-2"></div>
                            <div className="h-3 bg-gray-300/20 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : purchasedProducts.length > 0 ? (
                  <div className="space-y-4">
                    {purchasedProducts.map((product) => (
                      <div key={product.id} className="glass-effect rounded-lg p-4 hover:bg-white/5 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-medium text-white flex items-center">
                                {product.name}
                                {product.isFeatured && (
                                  <Crown className="w-4 h-4 ml-2 text-accent-amber" />
                                )}
                                {product.isBeta && (
                                  <Badge className="ml-2 bg-primary-500 text-white text-xs">BETA</Badge>
                                )}
                              </h4>
                              <p className="text-sm text-gray-400">{product.description}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="border-white/20 text-gray-300">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No products purchased yet</p>
                    <Link href="/products">
                      <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-500/90 hover:to-secondary-500/90">
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Status */}
            <Card className="glass-effect border-white/20 bg-transparent">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-accent-amber" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isPremiumUser ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-300">Plan</span>
                      <Badge className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                        Premium
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-300">Status</span>
                      <span className="text-accent-emerald font-medium">Active</span>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-gray-300">Next billing</span>
                      <span className="text-white">
                        {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <Separator className="my-4 bg-white/10" />
                    <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-400 mb-4">
                      Upgrade to Premium for access to all features and exclusive content.
                    </p>
                    <Link href="/subscribe">
                      <Button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-500/90 hover:to-secondary-500/90">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Premium
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-effect border-white/20 bg-transparent">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-white/10">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-white/10">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing History
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-white/10">
                  <Shield className="w-4 h-4 mr-2" />
                  Security Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-white/10">
                  <Star className="w-4 h-4 mr-2" />
                  Leave Review
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="glass-effect border-white/20 bg-transparent">
              <CardHeader>
                <CardTitle className="text-white">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Our support team is here to help you get the most out of TRTR.
                </p>
                <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
