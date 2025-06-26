import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Image, Code, Settings, Sparkles, Eye, Download } from "lucide-react";
import { toast } from "sonner";
import PromptForm from "@/components/PromptForm";
import ImageGallery from "@/components/ImageGallery";
import ApiKeyManager from "@/components/ApiKeyManager";
import RequestViewer from "@/components/RequestViewer";
import ApiKeyInput from "@/components/ApiKeyInput";
import { ImageGenerationService } from "@/services/imageGeneration";

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
  const [apiKey, setApiKey] = useState<string>("");
  const [imageService, setImageService] = useState<ImageGenerationService | null>(null);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('runware_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setImageService(new ImageGenerationService(savedApiKey));
    }
  }, []);

  const handleApiKeySet = (newApiKey: string) => {
    setApiKey(newApiKey);
    const service = new ImageGenerationService(newApiKey);
    setImageService(service);
    toast.success("API key set successfully!");
  };

  const handleImageGeneration = async (prompt: string, settings: any) => {
    if (!imageService) {
      toast.error("Please set your API key first");
      return;
    }

    try {
      const mockRequest = {
        method: "POST",
        url: "wss://ws-api.runware.ai/v1",
        headers: {
          "Authorization": "Bearer " + apiKey.substring(0, 10) + "...",
          "Content-Type": "application/json"
        },
        body: {
          taskType: "imageInference",
          positivePrompt: prompt,
          negativePrompt: settings.negativePrompt || "",
          model: settings.model || "runware:100@1",
          width: parseInt(settings.size?.split('x')[0] || "1024"),
          height: parseInt(settings.size?.split('x')[1] || "1024"),
          outputFormat: settings.format?.toUpperCase() || "WEBP",
          steps: settings.steps || 4,
          CFGScale: settings.cfgScale || 1,
          ...settings
        }
      };

      setCurrentRequest(mockRequest);
      toast.info("Generating image...");

      const result = await imageService.generateImage({
        prompt,
        negativePrompt: settings.negativePrompt,
        size: settings.size,
        quality: settings.quality,
        format: settings.format,
        numImages: settings.numImages,
        seed: settings.seed,
        steps: settings.steps,
        cfgScale: settings.cfgScale,
        model: settings.model
      });

      const mockResponse = {
        taskType: "imageInference",
        taskUUID: crypto.randomUUID(),
        imageUUID: result.imageUUID,
        imageURL: result.imageURL,
        NSFWContent: result.NSFWContent,
        cost: result.cost,
        seed: result.seed,
        positivePrompt: prompt
      };

      setCurrentResponse(mockResponse);

      // Add to gallery
      const newImage = {
        id: result.imageUUID,
        url: result.imageURL,
        prompt,
        timestamp: new Date(),
        settings
      };
      setGeneratedImages(prev => [newImage, ...prev]);
      
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Image generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
    }
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

        {/* API Key Input */}
        {!apiKey && (
          <div className="mb-8">
            <ApiKeyInput onApiKeySet={handleApiKeySet} />
          </div>
        )}

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
                  <PromptForm onGenerate={handleImageGeneration} disabled={!apiKey} />
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
                          {generatedImages[0].settings.format || "webp"}
                        </Badge>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = generatedImages[0].url;
                          link.download = `generated-image-${generatedImages[0].id}.webp`;
                          link.click();
                        }}
                      >
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
            <div className="space-y-6">
              <ApiKeyInput onApiKeySet={handleApiKeySet} currentApiKey={apiKey} />
              <ApiKeyManager />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
