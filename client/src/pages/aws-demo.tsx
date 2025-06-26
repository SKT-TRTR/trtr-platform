import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Loader2, Brain, Image, MessageSquare, Globe, Volume2, TrendingUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AWSResponse {
  sentiment?: string;
  confidence?: any;
  entities?: any[];
  labels?: any[];
  translatedText?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  audioStream?: any;
  insights?: string;
  service?: string;
}

export default function AWSDemo() {
  const [inputText, setInputText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [responses, setResponses] = useState<Record<string, AWSResponse>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleAWSService = async (service: string, data: any) => {
    setLoading(prev => ({ ...prev, [service]: true }));
    
    try {
      const response = await apiRequest(`/api/aws/${service}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      
      setResponses(prev => ({ ...prev, [service]: response }));
      
      toast({
        title: "AWS Service Success",
        description: `${service} analysis completed successfully`,
      });
    } catch (error) {
      toast({
        title: "AWS Service Error",
        description: error instanceof Error ? error.message : "Service unavailable",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, [service]: false }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const analyzeImage = async () => {
    if (!imageFile) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result?.toString().split(',')[1];
      if (base64) {
        handleAWSService('image-analysis', { image: base64 });
      }
    };
    reader.readAsDataURL(imageFile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AWS AI Services Demo
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience AWS Free Tier AI capabilities including sentiment analysis, image recognition, 
              translation, and business intelligence
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Free Tier Optimized
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                Cost Effective
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                Production Ready
              </Badge>
            </div>
          </div>

          {/* Input Section */}
          <Card className="glass-effect border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Input Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter text for sentiment analysis, entity detection, translation, or business insights..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="glass-input text-white min-h-[100px]"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">
                    Upload Image for Analysis
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="glass-input text-white"
                  />
                </div>
                
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">
                    Target Language for Translation
                  </label>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-full glass-input text-white bg-black/20"
                  >
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AWS Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Sentiment Analysis */}
            <Card className="glass-effect border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                  Sentiment Analysis
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  Amazon Comprehend - 50,000 units/month free
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleAWSService('sentiment', { text: inputText })}
                  disabled={!inputText || loading.sentiment}
                  className="w-full bg-green-500 hover:bg-green-600 mb-4"
                >
                  {loading.sentiment ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze Sentiment"}
                </Button>
                
                {responses.sentiment && (
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-300">
                      <span className="font-semibold">Sentiment:</span> 
                      <span className="ml-2 text-white">{responses.sentiment.sentiment}</span>
                    </div>
                    <div className="text-gray-300">
                      <span className="font-semibold">Confidence:</span>
                      <span className="ml-2 text-white">
                        {Math.max(...Object.values(responses.sentiment.confidence || {})).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Entity Detection */}
            <Card className="glass-effect border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  Entity Detection
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  Amazon Comprehend - Extract key entities
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleAWSService('entities', { text: inputText })}
                  disabled={!inputText || loading.entities}
                  className="w-full bg-blue-500 hover:bg-blue-600 mb-4"
                >
                  {loading.entities ? <Loader2 className="w-4 h-4 animate-spin" /> : "Detect Entities"}
                </Button>
                
                {responses.entities && (
                  <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
                    {responses.entities.entities?.slice(0, 3).map((entity: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-white">{entity.Text}</span>
                        <Badge className="text-xs">{entity.Type}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image Analysis */}
            <Card className="glass-effect border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Image className="w-5 h-5 text-purple-400" />
                  Image Analysis
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  Amazon Rekognition - 5,000 images/month free
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={analyzeImage}
                  disabled={!imageFile || loading['image-analysis']}
                  className="w-full bg-purple-500 hover:bg-purple-600 mb-4"
                >
                  {loading['image-analysis'] ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze Image"}
                </Button>
                
                {responses['image-analysis'] && (
                  <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
                    {responses['image-analysis'].labels?.slice(0, 3).map((label: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-white">{label.Name}</span>
                        <span className="text-gray-400">{label.Confidence.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Translation */}
            <Card className="glass-effect border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-orange-400" />
                  Translation
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  Amazon Translate - 2M characters/month free
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleAWSService('translate', { text: inputText, targetLanguage })}
                  disabled={!inputText || loading.translate}
                  className="w-full bg-orange-500 hover:bg-orange-600 mb-4"
                >
                  {loading.translate ? <Loader2 className="w-4 h-4 animate-spin" /> : "Translate Text"}
                </Button>
                
                {responses.translate && (
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-300">
                      <span className="font-semibold">Translated:</span>
                    </div>
                    <div className="text-white p-2 bg-black/20 rounded">
                      {responses.translate.translatedText}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Text-to-Speech */}
            <Card className="glass-effect border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-pink-400" />
                  Text-to-Speech
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  Amazon Polly - 5M characters/month free
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleAWSService('speech', { text: inputText })}
                  disabled={!inputText || loading.speech}
                  className="w-full bg-pink-500 hover:bg-pink-600 mb-4"
                >
                  {loading.speech ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Speech"}
                </Button>
                
                {responses.speech && (
                  <div className="text-center">
                    <div className="text-green-400 text-sm">
                      Audio generated successfully
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Insights */}
            <Card className="glass-effect border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Business Insights
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  Multi-service AI analysis for business data
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleAWSService('business-insights', { businessData: inputText })}
                  disabled={!inputText || loading['business-insights']}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 mb-4"
                >
                  {loading['business-insights'] ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Insights"}
                </Button>
                
                {responses['business-insights'] && (
                  <div className="text-sm">
                    <div className="text-white p-2 bg-black/20 rounded max-h-32 overflow-y-auto">
                      <pre className="text-xs whitespace-pre-wrap">
                        {responses['business-insights'].insights}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Free Tier Information */}
          <Card className="glass-effect border-white/20 mt-8">
            <CardHeader>
              <CardTitle className="text-white">AWS Free Tier Usage Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="text-gray-300">
                  <div className="font-semibold text-green-400">Amazon Comprehend</div>
                  <div>50,000 units/month</div>
                  <div>Sentiment & Entity Detection</div>
                </div>
                <div className="text-gray-300">
                  <div className="font-semibold text-purple-400">Amazon Rekognition</div>
                  <div>5,000 images/month</div>
                  <div>Image Analysis & Face Detection</div>
                </div>
                <div className="text-gray-300">
                  <div className="font-semibold text-orange-400">Amazon Translate</div>
                  <div>2 million characters/month</div>
                  <div>Real-time Translation</div>
                </div>
                <div className="text-gray-300">
                  <div className="font-semibold text-pink-400">Amazon Polly</div>
                  <div>5 million characters/month</div>
                  <div>Text-to-Speech Synthesis</div>
                </div>
                <div className="text-gray-300">
                  <div className="font-semibold text-blue-400">AWS Lambda</div>
                  <div>1 million requests/month</div>
                  <div>Serverless AI Processing</div>
                </div>
                <div className="text-gray-300">
                  <div className="font-semibold text-emerald-400">Combined Services</div>
                  <div>Multi-AI Analysis</div>
                  <div>Business Intelligence</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}