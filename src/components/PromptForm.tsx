

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Wand2, Settings2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PromptFormProps {
  onGenerate: (prompt: string, settings: any) => void;
  disabled?: boolean;
}

const PromptForm = ({ onGenerate, disabled = false }: PromptFormProps) => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [settings, setSettings] = useState({
    size: "1024x1024",
    quality: "high",
    format: "webp",
    numImages: 3,
    seed: "",
    steps: 4,
    cfgScale: 1,
    model: "runware:100@1"
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || disabled) return;
    
    setIsGenerating(true);
    
    try {
      await onGenerate(prompt, { ...settings, negativePrompt });
    } finally {
      setIsGenerating(false);
    }
  };

  const promptExamples = [
    "A futuristic cityscape at sunset with flying cars",
    "A magical forest with glowing mushrooms and fairy lights",
    "A steampunk robot playing chess in a Victorian library",
    "An underwater palace with coral gardens and tropical fish"
  ];

  return (
    <div className="space-y-6">
      {/* Main Prompt */}
      <div className="space-y-2">
        <Label htmlFor="prompt" className="text-white flex items-center gap-2">
          <Wand2 className="w-4 h-4" />
          Prompt
        </Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="min-h-24 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 resize-none"
          disabled={disabled}
        />
        <div className="flex flex-wrap gap-2">
          {promptExamples.map((example, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setPrompt(example)}
              className="text-xs border-slate-600 text-black hover:bg-slate-700 hover:text-white bg-white"
              disabled={disabled}
            >
              {example.substring(0, 30)}...
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white">Size</Label>
          <Select value={settings.size} onValueChange={(value) => setSettings({...settings, size: value})} disabled={disabled}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="512x512">512×512</SelectItem>
              <SelectItem value="1024x1024">1024×1024</SelectItem>
              <SelectItem value="1024x1792">1024×1792</SelectItem>
              <SelectItem value="1792x1024">1792×1024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Format</Label>
          <Select value={settings.format} onValueChange={(value) => setSettings({...settings, format: value})} disabled={disabled}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Number of Images Setting */}
      <div className="space-y-2">
        <Label className="text-white flex items-center justify-between">
          Number of Images <Badge variant="outline" className="border-slate-500 text-slate-300">{settings.numImages}</Badge>
        </Label>
        <Slider
          value={[settings.numImages]}
          onValueChange={(value) => setSettings({...settings, numImages: value[0]})}
          min={2}
          max={4}
          step={1}
          className="w-full"
          disabled={disabled}
        />
        <p className="text-xs text-slate-400">Generate multiple variations of your prompt</p>
      </div>

      {/* Advanced Settings */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700" disabled={disabled}>
            <Settings2 className="w-4 h-4 mr-2" />
            Advanced Settings
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          <Card className="bg-slate-700/30 border-slate-600">
            <CardContent className="p-4 space-y-4">
              {/* Negative Prompt */}
              <div className="space-y-2">
                <Label className="text-white">Negative Prompt</Label>
                <Textarea
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="What to avoid in the image..."
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  disabled={disabled}
                />
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white flex items-center justify-between">
                    Steps <Badge variant="outline" className="border-slate-500 text-slate-300">{settings.steps}</Badge>
                  </Label>
                  <Slider
                    value={[settings.steps]}
                    onValueChange={(value) => setSettings({...settings, steps: value[0]})}
                    min={1}
                    max={20}
                    step={1}
                    className="w-full"
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white flex items-center justify-between">
                    CFG Scale <Badge variant="outline" className="border-slate-500 text-slate-300">{settings.cfgScale}</Badge>
                  </Label>
                  <Slider
                    value={[settings.cfgScale]}
                    onValueChange={(value) => setSettings({...settings, cfgScale: value[0]})}
                    min={1}
                    max={10}
                    step={0.5}
                    className="w-full"
                    disabled={disabled}
                  />
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-2">
                <Label className="text-white">Seed (Optional)</Label>
                <Input
                  value={settings.seed}
                  onChange={(e) => setSettings({...settings, seed: e.target.value})}
                  placeholder="Random seed for reproducible results"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  disabled={disabled}
                />
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Generate Button */}
      <Button 
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating || disabled}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Generating {settings.numImages} Images...
          </>
        ) : disabled ? (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Set API Key to Generate
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate {settings.numImages} Images
          </>
        )}
      </Button>
    </div>
  );
};

export default PromptForm;

