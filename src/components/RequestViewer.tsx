
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, Book, Globe, Zap } from "lucide-react";
import { toast } from "sonner";

interface RequestViewerProps {
  request: any;
  response: any;
  showDocumentation?: boolean;
}

const RequestViewer = ({ request, response, showDocumentation = false }: RequestViewerProps) => {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const apiDocumentation = `
# Artify API Documentation

## Base URL
https://api.artify.dev/v1

## Authentication
All requests require an API key in the Authorization header:
\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Generate Images
**POST** \`/images/generate\`

Generate images from text prompts using AI models.

### Request Body
\`\`\`json
{
  "prompt": "A futuristic city at sunset with flying cars",
  "negative_prompt": "cartoon, blurry, low-resolution",
  "num_images": 1,
  "size": "1024x1024",
  "quality": "high",
  "format": "png",
  "seed": 12345,
  "model": "stable-diffusion-xl"
}
\`\`\`

### Parameters
- **prompt** (required): Text description of the desired image
- **negative_prompt** (optional): Elements to exclude from the image
- **num_images** (optional): Number of images to generate (1-4, default: 1)
- **size** (optional): Image dimensions (512x512, 1024x1024, etc.)
- **quality** (optional): Image quality (standard, high, ultra)
- **format** (optional): Output format (png, jpeg, webp)
- **seed** (optional): Random seed for reproducible results
- **model** (optional): AI model to use

### Response
\`\`\`json
{
  "generation_id": "gen_abcdef12345",
  "status": "completed",
  "images": [
    {
      "image_id": "img_xyz789",
      "url": "https://api.artify.dev/images/img_xyz789.png",
      "status": "completed",
      "revised_prompt": "Enhanced version of the original prompt"
    }
  ]
}
\`\`\`

## Rate Limits
- **Free tier**: 10 requests per minute
- **Pro tier**: 100 requests per minute
- **Enterprise**: Custom limits

## Error Codes
- **400**: Bad Request - Invalid parameters
- **401**: Unauthorized - Invalid API key
- **403**: Forbidden - Insufficient permissions
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error - Server error

## SDKs
Official SDKs available for:
- Python
- JavaScript/Node.js
- PHP
- Ruby
- Go
  `;

  if (showDocumentation) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Book className="w-5 h-5 text-blue-400" />
              API Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="sdks">SDKs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                  <pre className="text-slate-300 text-sm overflow-x-auto whitespace-pre-wrap">
                    {apiDocumentation}
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="examples" className="mt-4">
                <div className="space-y-4">
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">cURL Example</h3>
                      <Button
                        onClick={() => handleCopy(`curl -X POST https://api.artify.dev/v1/images/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "A futuristic city at sunset",
    "size": "1024x1024",
    "quality": "high"
  }'`)}
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <pre className="text-slate-300 text-sm overflow-x-auto">
{`curl -X POST https://api.artify.dev/v1/images/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "A futuristic city at sunset",
    "size": "1024x1024",
    "quality": "high"
  }'`}
                    </pre>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">Python Example</h3>
                      <Button
                        onClick={() => handleCopy(`import requests

response = requests.post(
    "https://api.artify.dev/v1/images/generate",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    json={
        "prompt": "A futuristic city at sunset",
        "size": "1024x1024",
        "quality": "high"
    }
)

data = response.json()
print(data)`)}
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <pre className="text-slate-300 text-sm overflow-x-auto">
{`import requests

response = requests.post(
    "https://api.artify.dev/v1/images/generate",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    json={
        "prompt": "A futuristic city at sunset",
        "size": "1024x1024",
        "quality": "high"
    }
)

data = response.json()
print(data)`}
                    </pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="sdks" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-slate-700/30 border-slate-600">
                    <CardContent className="p-4">
                      <h3 className="text-white font-semibold mb-2">Python SDK</h3>
                      <p className="text-slate-300 text-sm mb-3">Official Python library for Artify API</p>
                      <code className="bg-slate-800/50 text-purple-300 text-sm p-2 rounded block">
                        pip install artify-python
                      </code>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-700/30 border-slate-600">
                    <CardContent className="p-4">
                      <h3 className="text-white font-semibold mb-2">JavaScript SDK</h3>
                      <p className="text-slate-300 text-sm mb-3">Official Node.js library for Artify API</p>
                      <code className="bg-slate-800/50 text-purple-300 text-sm p-2 rounded block">
                        npm install artify-js
                      </code>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!request && !response) {
    return (
      <Card className="bg-slate-700/30 border-slate-600">
        <CardContent className="p-8 text-center">
          <Code className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold text-white mb-2">No Request Data</h3>
          <p className="text-slate-400">Generate an image to see the API request and response here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {request && (
        <Card className="bg-slate-700/30 border-slate-600">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" />
                Request
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-green-500/30 text-green-300">
                  {request.method}
                </Badge>
                <Button
                  onClick={() => handleCopy(formatJson(request.body))}
                  size="sm"
                  variant="ghost"
                  className="text-slate-400 hover:text-white hover:bg-slate-600 p-1"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <Badge variant="outline" className="border-blue-500/30 text-blue-300 mb-2">
                  {request.method} {request.url}
                </Badge>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-600">
                <pre className="text-slate-300 text-xs overflow-x-auto">
                  {formatJson(request.body)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card className="bg-slate-700/30 border-slate-600">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                Response
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-green-500/30 text-green-300">
                  200 OK
                </Badge>
                <Button
                  onClick={() => handleCopy(formatJson(response))}
                  size="sm"
                  variant="ghost"
                  className="text-slate-400 hover:text-white hover:bg-slate-600 p-1"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-600">
              <pre className="text-slate-300 text-xs overflow-x-auto">
                {formatJson(response)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RequestViewer;
