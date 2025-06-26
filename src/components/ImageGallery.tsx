
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Search, Calendar, Settings, Expand, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Image {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
  settings: any;
}

interface ImageGalleryProps {
  images: Image[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const filteredImages = images.filter(image =>
    image.prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = async (image: Image) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${image.id}.${image.settings.format || 'webp'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image");
    }
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied to clipboard!");
  };

  const handleDelete = (imageId: string) => {
    // Simulate delete
    toast.success("Image deleted successfully!");
  };

  if (images.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-12 text-center">
          <div className="text-slate-400 mb-4">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Images Generated Yet</h3>
            <p>Start generating images to see them appear in your gallery.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Image Gallery
              </CardTitle>
              <p className="text-slate-400 text-sm mt-1">
                {images.length} {images.length === 1 ? 'image' : 'images'} generated
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <Card key={image.id} className="bg-slate-800/50 border-slate-700 overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
            <div className="relative aspect-square">
              <img
                src={image.url}
                alt={image.prompt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                        <Expand className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-slate-900 border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Image Details</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <img
                            src={image.url}
                            alt={image.prompt}
                            className="w-full rounded-lg border border-slate-600"
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-white font-semibold mb-2">Prompt</h3>
                            <p className="text-slate-300 text-sm bg-slate-800/50 p-3 rounded-lg border border-slate-600">
                              {image.prompt}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-white font-semibold mb-2">Settings</h3>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                                {image.settings.size}
                              </Badge>
                              <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                                {image.settings.quality}
                              </Badge>
                              <Badge variant="outline" className="border-green-500/30 text-green-300">
                                {image.settings.format}
                              </Badge>
                              <Badge variant="outline" className="border-yellow-500/30 text-yellow-300">
                                {image.settings.model}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-white font-semibold mb-2">Generated</h3>
                            <p className="text-slate-300 text-sm">
                              {image.timestamp.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleDownload(image)}
                              size="sm"
                              className="bg-purple-500 hover:bg-purple-600 text-black"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button
                              onClick={() => handleCopyPrompt(image.prompt)}
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Prompt
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    onClick={() => handleDownload(image)}
                    size="sm"
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                {image.prompt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                    {image.settings.size}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleCopyPrompt(image.prompt)}
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-white hover:bg-slate-700 p-1"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(image.id)}
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-red-400 hover:bg-slate-700 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredImages.length === 0 && searchTerm && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <Search className="w-8 h-8 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-white mb-2">No images found</h3>
            <p className="text-slate-400">Try adjusting your search terms.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageGallery;
