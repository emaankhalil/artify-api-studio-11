
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, Plus, Eye, EyeOff, Copy, Trash2, AlertTriangle, Shield, Zap } from "lucide-react";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: Date;
  lastUsed: Date | null;
  requests: number;
  status: 'active' | 'revoked';
}

const ApiKeyManager = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production Key',
      key: 'sk-art1234567890abcdef',
      created: new Date('2024-01-15'),
      lastUsed: new Date('2024-01-20'),
      requests: 1250,
      status: 'active'
    },
    {
      id: '2',
      name: 'Development Key',
      key: 'sk-dev0987654321fedcba',
      created: new Date('2024-01-10'),
      lastUsed: null,
      requests: 45,
      status: 'active'
    }
  ]);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [newKeyName, setNewKeyName] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleToggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard!");
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key");
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      created: new Date(),
      lastUsed: null,
      requests: 0,
      status: 'active'
    };

    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName('');
    setShowCreateDialog(false);
    toast.success("API key created successfully!");
  };

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, status: 'revoked' as const } : key
    ));
    toast.success("API key revoked successfully!");
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '•'.repeat(key.length - 12) + key.substring(key.length - 4);
  };

  const totalRequests = apiKeys.reduce((sum, key) => sum + key.requests, 0);
  const activeKeys = apiKeys.filter(key => key.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Key className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Active Keys</p>
                <p className="text-2xl font-bold text-white">{activeKeys}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Requests</p>
                <p className="text-2xl font-bold text-white">{totalRequests.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Rate Limit</p>
                <p className="text-2xl font-bold text-white">100/min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys Management */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-400" />
                API Keys
              </CardTitle>
              <p className="text-slate-400 text-sm mt-1">
                Manage your API keys for accessing the Artify API
              </p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-purple-500 hover:bg-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Key
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New API Key</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName" className="text-white">Key Name</Label>
                    <Input
                      id="keyName"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Production Key, Development Key"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <Alert className="bg-yellow-500/10 border-yellow-500/30">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription className="text-yellow-200">
                      Make sure to copy your API key after creation. It won't be shown again for security reasons.
                    </AlertDescription>
                  </Alert>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateDialog(false)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateKey}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      Create Key
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id} className="bg-slate-700/30 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold">{apiKey.name}</h3>
                        <Badge 
                          variant="outline" 
                          className={apiKey.status === 'active' 
                            ? "border-green-500/30 text-green-300" 
                            : "border-red-500/30 text-red-300"
                          }
                        >
                          {apiKey.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <code className="bg-slate-800/50 text-purple-300 text-sm px-2 py-1 rounded border border-slate-600">
                          {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                        <Button
                          onClick={() => handleToggleKeyVisibility(apiKey.id)}
                          size="sm"
                          variant="ghost"
                          className="text-slate-400 hover:text-white hover:bg-slate-600 p-1"
                        >
                          {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          onClick={() => handleCopyKey(apiKey.key)}
                          size="sm"
                          variant="ghost"
                          className="text-slate-400 hover:text-white hover:bg-slate-600 p-1"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-400">
                        <span>Created: {apiKey.created.toLocaleDateString()}</span>
                        <span>Last used: {apiKey.lastUsed ? apiKey.lastUsed.toLocaleDateString() : 'Never'}</span>
                        <span>Requests: {apiKey.requests.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {apiKey.status === 'active' && (
                        <Button
                          onClick={() => handleRevokeKey(apiKey.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 text-red-300 hover:bg-red-500/10 hover:border-red-500/50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Best Practices */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Security Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-slate-300">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">Never share your API keys publicly or commit them to version control</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">Use environment variables to store API keys in your applications</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">Regularly rotate your API keys and revoke unused ones</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">Monitor your API usage for any unusual activity</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyManager;
