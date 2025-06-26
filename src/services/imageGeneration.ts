
import { toast } from "sonner";

export interface GenerateImageParams {
  prompt: string;
  negativePrompt?: string;
  size?: string;
  quality?: string;
  format?: string;
  numImages?: number;
  seed?: string;
  steps?: number;
  cfgScale?: number;
  model?: string;
}

export interface GeneratedImage {
  imageURL: string;
  imageUUID: string;
  prompt: string;
  seed: number;
  NSFWContent: boolean;
  cost: number;
}

export class ImageGenerationService {
  private apiKey: string | null = null;
  private ws: WebSocket | null = null;
  private messageCallbacks: Map<string, (data: any) => void> = new Map();
  private isAuthenticated: boolean = false;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || localStorage.getItem('runware_api_key');
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('runware_api_key', apiKey);
  }

  private async connect(): Promise<void> {
    if (!this.apiKey) {
      throw new Error('API key is required');
    }

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket('wss://ws-api.runware.ai/v1');
      
      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.authenticate().then(resolve).catch(reject);
      };

      this.ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        
        if (response.error || response.errors) {
          const errorMessage = response.errorMessage || response.errors?.[0]?.message || "An error occurred";
          toast.error(errorMessage);
          return;
        }

        if (response.data) {
          response.data.forEach((item: any) => {
            if (item.taskType === "authentication") {
              this.isAuthenticated = true;
            } else {
              const callback = this.messageCallbacks.get(item.taskUUID);
              if (callback) {
                callback(item);
                this.messageCallbacks.delete(item.taskUUID);
              }
            }
          });
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket closed");
        this.isAuthenticated = false;
      };
    });
  }

  private authenticate(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket not ready"));
        return;
      }
      
      const authMessage = [{
        taskType: "authentication",
        apiKey: this.apiKey,
      }];
      
      const authCallback = (event: MessageEvent) => {
        const response = JSON.parse(event.data);
        if (response.data?.[0]?.taskType === "authentication") {
          this.ws?.removeEventListener("message", authCallback);
          resolve();
        }
      };
      
      this.ws.addEventListener("message", authCallback);
      this.ws.send(JSON.stringify(authMessage));
    });
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    if (!this.apiKey) {
      throw new Error('Please set your Runware API key first');
    }

    await this.connect();

    const taskUUID = crypto.randomUUID();
    const [width, height] = params.size?.split('x').map(Number) || [1024, 1024];
    
    return new Promise((resolve, reject) => {
      const message = [{
        taskType: "imageInference",
        taskUUID,
        positivePrompt: params.prompt,
        negativePrompt: params.negativePrompt || "",
        model: params.model || "runware:100@1",
        width,
        height,
        numberResults: params.numImages || 1,
        outputFormat: params.format?.toUpperCase() || "WEBP",
        steps: params.steps || 4,
        CFGScale: params.cfgScale || 1,
        scheduler: "FlowMatchEulerDiscreteScheduler",
        seed: params.seed ? parseInt(params.seed) : undefined,
      }];

      // Remove undefined values
      Object.keys(message[0]).forEach(key => {
        if (message[0][key] === undefined) {
          delete message[0][key];
        }
      });

      this.messageCallbacks.set(taskUUID, (data) => {
        if (data.error) {
          reject(new Error(data.errorMessage || 'Generation failed'));
        } else {
          resolve(data);
        }
      });

      this.ws?.send(JSON.stringify(message));
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
