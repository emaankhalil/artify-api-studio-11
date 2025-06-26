
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Image, Code, Settings, Sparkles, Eye, Download } from "lucide-react";
import PromptForm from "@/components/PromptForm";
import ImageGallery from "@/components/ImageGallery";
import ApiKeyManager from "@/components/ApiKeyManager";
import RequestViewer from "@/components/RequestViewer";

const Index = () => {
  const [activeTab, setActiveTab] = useState("generate");
  const [generatedImages, setGeneratedImages] = useState<Array<{
    id: string;
    url: string;
    prompt: string;
    timestamp: Date;
    settings: any;
  }>>([]);
  const [currentRequest, setCurrentRequest] = useState<any>(null);
  const [currentResponse, setCurrentResponse] = useState<any>(null);

  const handleImageGeneration = (prompt: string, settings: any) => {
    // Simulate API call
    const mockRequest = {
      method: "POST",
      url: "/v1/images/generate",
      headers: {
        "Authorization": "Bearer sk-...",
        "Content-Type": "application/json"
      },
      body: {
        prompt,
        ...settings
      }
    };

    const mockResponse = {
      generation_id: `gen_${Date.now()}`,
      status: "completed",
      images: [{
        image_id: `img_${Date.now()}`,
        url: "https://picsum.photos/1024/1024?random=" + Date.now(),
        status: "completed",
        revised_prompt: prompt
      }]
    };

    setCurrentRequest(mockRequest);
    setCurrentResponse(mockResponse);

    // Add to gallery
    const newImage = {
      id: mockResponse.images[0].image_id,
      url: mockResponse.images[0].url,
      prompt,
      timestamp: new Date(),
      settings
    };
    setGeneratedImages(prev => [newImage, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Artify API Studio
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Professional AI image generation API testing platform. Create, test, and integrate with powerful AI models.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Zap className="w-4 h-4 mr-1" />
              Real-time Generation
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Code className="w-4 h-4 mr-1" />
              Developer-First
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              <Image className="w-4 h-4 mr-1" />
              High Quality
            </Badge>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="generate" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Eye className="w-4 h-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Code className="w-4 h-4 mr-2" />
              API
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Image Generation
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Create stunning images from text prompts using advanced AI models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PromptForm onGenerate={handleImageGeneration} />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-400" />
                    Request & Response
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    View the API request and response in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RequestViewer request={currentRequest} response={currentResponse} />
                </CardContent>
              </Card>
            </div>

            {/* Latest Generated Image */}
            {generatedImages.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Image className="w-5 h-5 text-green-400" />
                    Latest Generation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={generatedImages[0].url} 
                        alt={generatedImages[0].prompt}
                        className="w-full md:w-64 h-64 object-cover rounded-lg border border-slate-600"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Generated Image</h3>
                        <p className="text-slate-300 text-sm">{generatedImages[0].prompt}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                          {generatedImages[0].settings.size || "1024x1024"}
                        </Badge>
                        <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                          {generatedImages[0].settings.quality || "high"}
                        </Badge>
                        <Badge variant="outline" className="border-green-500/30 text-green-300">
                          {generatedImages[0].settings.format || "png"}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="gallery">
            <ImageGallery images={generatedImages} />
          </TabsContent>

          <TabsContent value="api">
            <RequestViewer request={currentRequest} response={currentResponse} showDocumentation={true} />
          </TabsContent>

          <TabsContent value="settings">
            <ApiKeyManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
