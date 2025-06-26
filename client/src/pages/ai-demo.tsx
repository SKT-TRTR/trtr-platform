import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Sparkles, Image, BarChart3, FileText, Zap, Cpu, Bot, Lightbulb } from "lucide-react";
import heroImage from "@assets/image_1750909878337.png";

interface AIResponse {
  content?: string;
  summary?: string;
  analysis?: string;
  insights?: string;
  imageData?: string;
  sentiment?: string;
  confidence?: number;
  rating?: number;
}

export default function AIDemo() {
  const [inputText, setInputText] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [businessData, setBusinessData] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [responses, setResponses] = useState<Record<string, AIResponse>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleAIRequest = async (endpoint: string, payload: any, responseKey: string) => {
    setLoading(prev => ({ ...prev, [responseKey]: true }));
    try {
      const response = await fetch(endpoint, {
        method: "POST", 
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setResponses(prev => ({ ...prev, [responseKey]: data }));
    } catch (error) {
      console.error(`Error with ${endpoint}:`, error);
      setResponses(prev => ({ ...prev, [responseKey]: { content: `Error: ${error}` } }));
    } finally {
      setLoading(prev => ({ ...prev, [responseKey]: false }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setBase64Image(base64.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
        backgroundSize: '20px 20px'
      }}></div>
      
      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-8 flex justify-center">
              <div className="relative group">
                <img 
                  src={heroImage} 
                  alt="AI-powered futuristic interface" 
                  className="w-96 h-48 object-cover rounded-2xl shadow-2xl border border-purple-500/20 transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20">
                    <p className="text-white text-sm font-medium">AI-Powered Business Solutions</p>
                  </div>
                </div>
                {/* Floating Icons */}
                <div className="absolute -top-4 -right-4 bg-purple-600 rounded-full p-3 animate-bounce">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-600 rounded-full p-3 animate-pulse">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-6 relative">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                AI Capabilities Demo
              </span>
              <Sparkles className="inline-block w-12 h-12 text-purple-400 ml-4 animate-pulse" />
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Experience the power of <span className="text-purple-400 font-semibold">OpenAI</span>, 
              <span className="text-blue-400 font-semibold"> Google Gemini</span>, and 
              <span className="text-orange-400 font-semibold"> Anthropic Claude</span> in one unified platform
            </p>
            
            {/* AI Status Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-green-500/20 border border-green-500/30 rounded-full px-6 py-3 flex items-center gap-3 backdrop-blur-sm">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <Bot className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">OpenAI Active</span>
              </div>
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-full px-6 py-3 flex items-center gap-3 backdrop-blur-sm">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <Lightbulb className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Gemini Active</span>
              </div>
              <div className="bg-orange-500/20 border border-orange-500/30 rounded-full px-6 py-3 flex items-center gap-3 backdrop-blur-sm">
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                <Brain className="w-5 h-5 text-orange-400" />
                <span className="text-orange-400 font-medium">Claude Ready</span>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 backdrop-blur-sm">
                <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-sm">Text Analysis</h3>
                <p className="text-gray-400 text-xs">Summarize & analyze</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
                <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-sm">Content Generation</h3>
                <p className="text-gray-400 text-xs">Create with AI</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 backdrop-blur-sm">
                <Image className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-sm">Image AI</h3>
                <p className="text-gray-400 text-xs">Analyze & generate</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 backdrop-blur-sm">
                <BarChart3 className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-sm">Business Insights</h3>
                <p className="text-gray-400 text-xs">Strategic analysis</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="text-analysis" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
              <TabsTrigger value="text-analysis" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <FileText className="w-4 h-4 mr-2" />
                Text Analysis
              </TabsTrigger>
              <TabsTrigger value="content-generation" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Sparkles className="w-4 h-4 mr-2" />
                Content Generation
              </TabsTrigger>
              <TabsTrigger value="image-ai" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Image className="w-4 h-4 mr-2" />
                Image AI
              </TabsTrigger>
              <TabsTrigger value="business-insights" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                Business Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text-analysis" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Text Analysis & Summarization
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Analyze sentiment and create summaries using multiple AI models
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter text to analyze..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white min-h-[120px]"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => handleAIRequest("/api/gemini/summarize", { text: inputText }, "gemini-summary")}
                      disabled={!inputText || loading["gemini-summary"]}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {loading["gemini-summary"] ? "Processing..." : "Gemini Summary"}
                    </Button>
                    <Button
                      onClick={() => handleAIRequest("/api/claude/summarize", { text: inputText }, "claude-summary")}
                      disabled={!inputText || loading["claude-summary"]}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {loading["claude-summary"] ? "Processing..." : "Claude Summary"}
                    </Button>
                    <Button
                      onClick={() => handleAIRequest("/api/gemini/sentiment", { text: inputText }, "gemini-sentiment")}
                      disabled={!inputText || loading["gemini-sentiment"]}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      {loading["gemini-sentiment"] ? "Processing..." : "Gemini Sentiment"}
                    </Button>
                    <Button
                      onClick={() => handleAIRequest("/api/claude/sentiment", { text: inputText }, "claude-sentiment")}
                      disabled={!inputText || loading["claude-sentiment"]}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      {loading["claude-sentiment"] ? "Processing..." : "Claude Sentiment"}
                    </Button>
                  </div>

                  {/* Results Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {Object.entries(responses).map(([key, response]) => (
                      <Card key={key} className="bg-slate-700/50 border-slate-600/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {key.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-white text-sm">
                            {response.summary && <p>{response.summary}</p>}
                            {response.content && <p>{response.content}</p>}
                            {response.analysis && <p>{response.analysis}</p>}
                            {response.insights && <p>{response.insights}</p>}
                            {response.sentiment && (
                              <div>
                                <p><strong>Sentiment:</strong> {response.sentiment}</p>
                                {response.confidence && <p><strong>Confidence:</strong> {Math.round(response.confidence * 100)}%</p>}
                                {response.rating && <p><strong>Rating:</strong> {response.rating}/5 stars</p>}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content-generation" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Content Generation
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Generate creative content with AI models
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter your content prompt..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white min-h-[120px]"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => handleAIRequest("/api/gemini/generate-content", { prompt: inputText }, "gemini-content")}
                      disabled={!inputText || loading["gemini-content"]}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {loading["gemini-content"] ? "Generating..." : "Generate with Gemini"}
                    </Button>
                    <Button
                      onClick={() => handleAIRequest("/api/claude/generate-content", { prompt: inputText }, "claude-content")}
                      disabled={!inputText || loading["claude-content"]}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {loading["claude-content"] ? "Generating..." : "Generate with Claude"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="image-ai" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Image className="w-5 h-5" />
                      Image Analysis
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Upload an image for AI analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="bg-slate-700/50 border-slate-600/50 text-white"
                    />
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        onClick={() => handleAIRequest("/api/gemini/analyze-image", { base64Image }, "gemini-image")}
                        disabled={!base64Image || loading["gemini-image"]}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {loading["gemini-image"] ? "Analyzing..." : "Analyze with Gemini"}
                      </Button>
                      <Button
                        onClick={() => handleAIRequest("/api/claude/analyze-image", { base64Image }, "claude-image")}
                        disabled={!base64Image || loading["claude-image"]}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {loading["claude-image"] ? "Analyzing..." : "Analyze with Claude"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Image Generation
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Generate images with Gemini AI
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Describe the image you want to generate..."
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      className="bg-slate-700/50 border-slate-600/50 text-white min-h-[100px]"
                    />
                    <Button
                      onClick={() => handleAIRequest("/api/gemini/generate-image", { prompt: imagePrompt }, "gemini-generated-image")}
                      disabled={!imagePrompt || loading["gemini-generated-image"]}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {loading["gemini-generated-image"] ? "Generating..." : "Generate Image"}
                    </Button>
                    {responses["gemini-generated-image"]?.imageData && (
                      <div className="mt-4">
                        <img 
                          src={responses["gemini-generated-image"].imageData} 
                          alt="Generated by Gemini" 
                          className="w-full rounded-lg border border-slate-600"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="business-insights" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Business Intelligence
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Get strategic business insights from your data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter your business data, metrics, or situation for analysis..."
                    value={businessData}
                    onChange={(e) => setBusinessData(e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white min-h-[150px]"
                  />
                  <Button
                    onClick={() => handleAIRequest("/api/claude/business-insights", { businessData }, "business-insights")}
                    disabled={!businessData || loading["business-insights"]}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {loading["business-insights"] ? "Analyzing..." : "Generate Business Insights"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}