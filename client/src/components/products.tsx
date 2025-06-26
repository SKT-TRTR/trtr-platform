import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Download } from "lucide-react";
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

export default function Products() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return await response.json() as Product[];
    }
  });

  if (isLoading) {
    return (
      <section id="products" className="py-20 bg-gradient-to-b from-slate-800 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-gradient-to-r from-secondary-500/20 to-accent-cyan/20 rounded-lg animate-pulse mb-6"></div>
            <div className="h-6 bg-gray-300/20 rounded-lg animate-pulse max-w-2xl mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass-effect rounded-2xl p-6 animate-pulse">
                <div className="h-32 bg-gray-300/20 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-300/20 rounded mb-2"></div>
                <div className="h-12 bg-gray-300/20 rounded mb-4"></div>
                <div className="flex space-x-2 mb-4">
                  <div className="flex-1 h-8 bg-gray-300/20 rounded-lg"></div>
                  <div className="flex-1 h-8 bg-gray-300/20 rounded-lg"></div>
                </div>
                <div className="h-4 bg-gray-300/20 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-slate-800 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="header-sync mb-6">
            Products
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-semibold">
            Download our cutting-edge applications directly from App Store and Google Play Store
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products?.map((product) => (
            <Card key={product.id} className="product-card glass-laser-cell border-white/10 relative">
              {(product.isFeatured || product.isBeta) && (
                <div className="absolute top-2 right-2 z-20">
                  {product.isFeatured ? (
                    <Badge className="bg-gradient-to-r from-accent-amber to-accent-emerald text-slate-900 font-bold px-3 py-1 text-xs">
                      FEATURED
                    </Badge>
                  ) : (
                    <Badge className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold px-3 py-1 text-xs">
                      BETA
                    </Badge>
                  )}
                </div>
              )}
              
              <CardHeader className="p-0">
                <div className="mb-4 h-32 rounded-t-xl overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="px-6">
                  <CardTitle className="text-xl font-bold mb-2 text-white">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-sm mb-4">
                    {product.description}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="px-6 pb-6">
                <div className="flex space-x-2 mb-4">
                  <Link href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`} className="flex-1">
                    <Button size="sm" className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white text-xs">
                      View Details
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-black text-white hover:bg-gray-800 text-xs"
                    onClick={() => window.open(product.appStoreUrl, '_blank')}
                  >
                    Download
                  </Button>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-accent-amber mr-1 fill-current" />
                    {product.rating}
                  </div>
                  <div className="flex items-center">
                    <Download className="w-3 h-3 mr-1" />
                    {product.downloads} downloads
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
