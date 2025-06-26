import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  DollarSign, 
  Download, 
  Star,
  Edit,
  Trash2,
  Plus,
  Shield,
  Lock,
  Globe,
  BarChart3,
  MessageSquare,
  Smartphone
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  appDownloads: number;
  totalTestimonials: number;
  totalProducts: number;
  totalServices: number;
}

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

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    title: "",
    company: "",
    content: "",
    rating: 5,
    profileImage: ""
  });

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/stats", {
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json() as AdminStats;
    }
  });

  // Fetch testimonials
  const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: ["/api/testimonials"],
    queryFn: async () => {
      const response = await fetch("/api/testimonials");
      if (!response.ok) throw new Error("Failed to fetch testimonials");
      return response.json() as Testimonial[];
    }
  });

  // Create testimonial mutation
  const createTestimonialMutation = useMutation({
    mutationFn: (testimonial: any) => apiRequest("POST", "/api/admin/testimonials", testimonial),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setIsTestimonialDialogOpen(false);
      setTestimonialForm({
        name: "",
        title: "",
        company: "",
        content: "",
        rating: 5,
        profileImage: ""
      });
      toast({
        title: "Success",
        description: "Testimonial created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create testimonial",
        variant: "destructive",
      });
    }
  });

  // Update testimonial mutation
  const updateTestimonialMutation = useMutation({
    mutationFn: ({ id, ...testimonial }: any) => 
      apiRequest("PUT", `/api/admin/testimonials/${id}`, testimonial),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setIsTestimonialDialogOpen(false);
      setEditingTestimonial(null);
      setTestimonialForm({
        name: "",
        title: "",
        company: "",
        content: "",
        rating: 5,
        profileImage: ""
      });
      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update testimonial",
        variant: "destructive",
      });
    }
  });

  // Delete testimonial mutation
  const deleteTestimonialMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/testimonials/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  });

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTestimonial) {
      updateTestimonialMutation.mutate({ id: editingTestimonial.id, ...testimonialForm });
    } else {
      createTestimonialMutation.mutate(testimonialForm);
    }
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      name: testimonial.name,
      title: testimonial.title,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
      profileImage: testimonial.profileImage
    });
    setIsTestimonialDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Control Panel</h1>
          <p className="text-gray-400">Manage your TRTR platform and monitor performance</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="glass-effect border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary-500">
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-primary-500">
              Content
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary-500">
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-effect border-white/20 bg-transparent">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-accent-emerald mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-accent-emerald">
                    {statsLoading ? "..." : formatNumber(stats?.totalUsers || 0)}
                  </h3>
                  <p className="text-sm text-gray-400">Total Users</p>
                </CardContent>
              </Card>

              <Card className="glass-effect border-white/20 bg-transparent">
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-accent-cyan mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-accent-cyan">
                    {statsLoading ? "..." : formatNumber(stats?.activeSubscriptions || 0)}
                  </h3>
                  <p className="text-sm text-gray-400">Active Subscriptions</p>
                </CardContent>
              </Card>

              <Card className="glass-effect border-white/20 bg-transparent">
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-8 h-8 text-accent-amber mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-accent-amber">
                    {statsLoading ? "..." : formatCurrency(stats?.monthlyRevenue || 0)}
                  </h3>
                  <p className="text-sm text-gray-400">Monthly Revenue</p>
                </CardContent>
              </Card>

              <Card className="glass-effect border-white/20 bg-transparent">
                <CardContent className="p-6 text-center">
                  <Download className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-secondary-500">
                    {statsLoading ? "..." : formatNumber(stats?.appDownloads || 0)}
                  </h3>
                  <p className="text-sm text-gray-400">App Downloads</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="glass-effect border-white/20 bg-transparent">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Platform Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Services</span>
                    <Badge variant="outline" className="text-primary-500 border-primary-500">
                      {stats?.totalServices || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Products</span>
                    <Badge variant="outline" className="text-accent-cyan border-accent-cyan">
                      {stats?.totalProducts || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Testimonials</span>
                    <Badge variant="outline" className="text-accent-emerald border-accent-emerald">
                      {stats?.totalTestimonials || 0}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-white/20 bg-transparent">
                <CardHeader>
                  <CardTitle className="text-white">System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Server Status</span>
                    <Badge className="bg-accent-emerald text-white">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Database</span>
                    <Badge className="bg-accent-emerald text-white">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Payment Gateway</span>
                    <Badge className="bg-accent-emerald text-white">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-8">
            {/* Content Management */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="glass-effect border-white/20 bg-transparent hover:bg-white/5 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Edit className="w-8 h-8 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Edit Services</h3>
                  <p className="text-sm text-gray-400">Manage service offerings</p>
                </CardContent>
              </Card>

              <Card className="glass-effect border-white/20 bg-transparent hover:bg-white/5 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Smartphone className="w-8 h-8 text-accent-cyan mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Manage Products</h3>
                  <p className="text-sm text-gray-400">Update product catalog</p>
                </CardContent>
              </Card>

              <Card className="glass-effect border-white/20 bg-transparent hover:bg-white/5 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="w-8 h-8 text-accent-emerald mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Update Testimonials</h3>
                  <p className="text-sm text-gray-400">Manage customer reviews</p>
                </CardContent>
              </Card>
            </div>

            {/* Testimonials Management */}
            <Card className="glass-effect border-white/20 bg-transparent">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Testimonials Management
                  </CardTitle>
                  <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-500/90 hover:to-secondary-500/90"
                        onClick={() => {
                          setEditingTestimonial(null);
                          setTestimonialForm({
                            name: "",
                            title: "",
                            company: "",
                            content: "",
                            rating: 5,
                            profileImage: ""
                          });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Testimonial
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-effect border-white/20 max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name" className="text-gray-300">Name</Label>
                            <Input
                              id="name"
                              value={testimonialForm.name}
                              onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
                              className="glass-effect border-white/20 text-white"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="title" className="text-gray-300">Title</Label>
                            <Input
                              id="title"
                              value={testimonialForm.title}
                              onChange={(e) => setTestimonialForm(prev => ({ ...prev, title: e.target.value }))}
                              className="glass-effect border-white/20 text-white"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="company" className="text-gray-300">Company</Label>
                          <Input
                            id="company"
                            value={testimonialForm.company}
                            onChange={(e) => setTestimonialForm(prev => ({ ...prev, company: e.target.value }))}
                            className="glass-effect border-white/20 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="content" className="text-gray-300">Content</Label>
                          <Textarea
                            id="content"
                            value={testimonialForm.content}
                            onChange={(e) => setTestimonialForm(prev => ({ ...prev, content: e.target.value }))}
                            className="glass-effect border-white/20 text-white"
                            rows={4}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="rating" className="text-gray-300">Rating</Label>
                            <Input
                              id="rating"
                              type="number"
                              min="1"
                              max="5"
                              value={testimonialForm.rating}
                              onChange={(e) => setTestimonialForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                              className="glass-effect border-white/20 text-white"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="profileImage" className="text-gray-300">Profile Image URL</Label>
                            <Input
                              id="profileImage"
                              value={testimonialForm.profileImage}
                              onChange={(e) => setTestimonialForm(prev => ({ ...prev, profileImage: e.target.value }))}
                              className="glass-effect border-white/20 text-white"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            type="submit"
                            disabled={createTestimonialMutation.isPending || updateTestimonialMutation.isPending}
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-500/90 hover:to-secondary-500/90"
                          >
                            {editingTestimonial ? "Update" : "Create"} Testimonial
                          </Button>
                          <Button 
                            type="button" 
                            variant="ghost"
                            onClick={() => setIsTestimonialDialogOpen(false)}
                            className="text-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {testimonialsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="glass-effect rounded-lg p-4 animate-pulse">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-300/20 rounded-full"></div>
                            <div>
                              <div className="h-4 bg-gray-300/20 rounded mb-2 w-32"></div>
                              <div className="h-3 bg-gray-300/20 rounded w-24"></div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <div className="w-8 h-8 bg-gray-300/20 rounded"></div>
                            <div className="w-8 h-8 bg-gray-300/20 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {testimonials?.map((testimonial) => (
                      <div key={testimonial.id} className="glass-effect rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={testimonial.profileImage} 
                              alt={testimonial.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="font-medium text-white">{testimonial.name}</h4>
                              <p className="text-sm text-gray-400">{testimonial.title}, {testimonial.company}</p>
                              <div className="flex items-center mt-1">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 text-accent-amber fill-current" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleEditTestimonial(testimonial)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => deleteTestimonialMutation.mutate(testimonial.id)}
                              disabled={deleteTestimonialMutation.isPending}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mt-3 italic">"{testimonial.content}"</p>
                      </div>
                    )) || (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">No testimonials yet</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-8">
            {/* Security Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="glass-effect border-white/20 bg-transparent">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Two-Factor Authentication</span>
                    <div className="flex items-center">
                      <Badge className="bg-accent-emerald text-white mr-2">Enabled</Badge>
                      <Shield className="w-4 h-4 text-accent-emerald" />
                    </div>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">SSL Certificate</span>
                    <div className="flex items-center">
                      <Badge className="bg-accent-emerald text-white mr-2">Active</Badge>
                      <Lock className="w-4 h-4 text-accent-emerald" />
                    </div>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">AWS Integration</span>
                    <div className="flex items-center">
                      <Badge className="bg-accent-emerald text-white mr-2">Connected</Badge>
                      <Globe className="w-4 h-4 text-accent-emerald" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-white/20 bg-transparent">
                <CardHeader>
                  <CardTitle className="text-white">Security Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10">
                    <Shield className="w-4 h-4 mr-2" />
                    Update Security Settings
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10">
                    <Lock className="w-4 h-4 mr-2" />
                    Manage API Keys
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10">
                    <Users className="w-4 h-4 mr-2" />
                    User Access Control
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
