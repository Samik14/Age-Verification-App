import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { PinInputDialog } from "./pin-input-dialog";
import { 
  Smartphone, 
  Shield, 
  CheckCircle, 
  ArrowLeft, 
  Settings, 
  ExternalLink,
  QrCode,
  Lock,
  Zap,
  Globe,
  Clock,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ExternalPlatformScreenProps {
  onBack: () => void;
  onSettings: () => void;
  userData: { pin?: string };
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  category: 'social' | 'gaming' | 'ecommerce' | 'finance';
  description: string;
  isConnected: boolean;
  verificationLevel: 'basic' | 'premium' | 'enterprise';
  lastUsed?: string;
}

const platforms: Platform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    category: 'social',
    description: 'Verify your age for age-restricted content',
    isConnected: true,
    verificationLevel: 'basic',
    lastUsed: '2 hours ago'
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: '🎮',
    category: 'social',
    description: 'Access age-restricted servers and features',
    isConnected: true,
    verificationLevel: 'premium',
    lastUsed: '1 day ago'
  },
  {
    id: 'steam',
    name: 'Steam',
    icon: '🎮',
    category: 'gaming',
    description: 'Purchase mature-rated games',
    isConnected: false,
    verificationLevel: 'basic'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    icon: '📦',
    category: 'ecommerce',
    description: 'Buy age-restricted products',
    isConnected: false,
    verificationLevel: 'enterprise'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '💳',
    category: 'finance',
    description: 'Enhanced account verification',
    isConnected: true,
    verificationLevel: 'enterprise',
    lastUsed: '3 days ago'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    category: 'social',
    description: 'Access mature content and features',
    isConnected: false,
    verificationLevel: 'basic'
  }
];

export function ExternalPlatformScreen({ onBack, onSettings, userData }: ExternalPlatformScreenProps) {
  const [selectedTab, setSelectedTab] = useState("connected");
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState(platforms);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pendingPlatformId, setPendingPlatformId] = useState<string | null>(null);

  const handleConnect = (platformId: string) => {
    setPendingPlatformId(platformId);
    setShowPinDialog(true);
  };

  const handlePinConfirm = async (pin: string) => {
    if (pin === userData.pin) { // Use user's actual PIN
      setShowPinDialog(false);
      setConnectingPlatform(pendingPlatformId);
      
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setConnectedPlatforms(prev => 
        prev.map(p => 
          p.id === pendingPlatformId 
            ? { ...p, isConnected: true, lastUsed: 'Just now' }
            : p
        )
      );
      setConnectingPlatform(null);
      setPendingPlatformId(null);
    } else {
      alert("Incorrect PIN. Please try again.");
    }
  };

  const handleDisconnect = (platformId: string) => {
    setConnectedPlatforms(prev => 
      prev.map(p => 
        p.id === platformId 
          ? { ...p, isConnected: false, lastUsed: undefined }
          : p
      )
    );
  };

  const getVerificationBadgeColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'premium': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'enterprise': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social': return '👥';
      case 'gaming': return '🎮';
      case 'ecommerce': return '🛒';
      case 'finance': return '💰';
      default: return '🌐';
    }
  };

  const connectedCount = connectedPlatforms.filter(p => p.isConnected).length;
  const availableCount = connectedPlatforms.filter(p => !p.isConnected).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 pt-8"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">External Platform Integration</h1>
              <p className="text-slate-300 text-base leading-relaxed">Connect your digital ID to apps and services</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onSettings}
            className="flex items-center space-x-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <Card className="p-4 backdrop-blur-sm bg-slate-800/90 border-slate-700/50 shadow-lg">
            <div className="text-center">
              <div className="w-8 h-8 bg-[var(--mint)]/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-4 h-4 text-[var(--mint)]" />
              </div>
              <div>
                <h3 className="text-white">{connectedCount}</h3>
                <p className="text-xs text-slate-300">Connected Platforms</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 backdrop-blur-sm bg-slate-800/90 border-slate-700/50 shadow-lg">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white">{availableCount}</h3>
                <p className="text-xs text-slate-300">Available to Connect</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 backdrop-blur-sm bg-slate-800/90 border-slate-700/50 shadow-lg">
            <div className="text-center">
              <div className="w-8 h-8 bg-[var(--deep-indigo)]/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Zap className="w-4 h-4 text-[var(--deep-indigo)]" />
              </div>
              <div>
                <h3 className="text-white">Instant</h3>
                <p className="text-xs text-slate-300">Verification Speed</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Platform Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 backdrop-blur-sm bg-slate-800/90 border-slate-700/50 shadow-xl">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="connected" className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Connected ({connectedCount})</span>
                </TabsTrigger>
                <TabsTrigger value="available" className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Available ({availableCount})</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="connected" className="space-y-4">
                {connectedPlatforms.filter(p => p.isConnected).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="mb-2 text-white">No Connected Platforms</h3>
                    <p className="text-slate-300 mb-4">Start connecting your digital ID to platforms</p>
                    <Button onClick={() => setSelectedTab("available")}>
                      Browse Available Platforms
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {connectedPlatforms.filter(p => p.isConnected).map((platform, index) => (
                      <motion.div
                        key={platform.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border border-slate-600 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{platform.icon}</div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-white">{platform.name}</h4>
                              <Badge className={getVerificationBadgeColor(platform.verificationLevel)}>
                                {platform.verificationLevel}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-300">{platform.description}</p>
                            {platform.lastUsed && (
                              <div className="flex items-center space-x-1 mt-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span className="text-xs text-slate-400">Last used: {platform.lastUsed}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-[var(--mint)]/20 text-[var(--mint)] border-[var(--mint)]/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                                Manage
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Manage {platform.name} Connection</DialogTitle>
                                <DialogDescription>
                                  Control how your digital ID is shared with this platform.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Alert className="border-amber-200 bg-amber-50">
                                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                                  <AlertDescription className="text-amber-800">
                                    Disconnecting will remove age verification from this platform. You may need to re-verify.
                                  </AlertDescription>
                                </Alert>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => handleDisconnect(platform.id)}
                                    className="flex-1"
                                  >
                                    Disconnect
                                  </Button>
                                  <Button className="flex-1">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Open Platform
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="available" className="space-y-4">
                <div className="mb-6">
                  <Alert className="border-[var(--mint)]/30 bg-[var(--mint)]/10">
                    <Shield className="h-4 w-4 text-[var(--mint)]" />
                    <AlertDescription className="text-[var(--mint)]">
                      Your digital ID can be instantly verified across these platforms without sharing personal information.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="grid gap-4">
                  {['social', 'gaming', 'ecommerce', 'finance'].map((category) => {
                    const categoryPlatforms = connectedPlatforms.filter(p => p.category === category && !p.isConnected);
                    
                    if (categoryPlatforms.length === 0) return null;

                    return (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{getCategoryIcon(category)}</span>
                          <h4 className="capitalize text-white">{category}</h4>
                        </div>
                        
                        <div className="grid gap-3">
                          {categoryPlatforms.map((platform, index) => (
                            <motion.div
                              key={platform.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-4 border border-slate-600 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="text-3xl">{platform.icon}</div>
                                <div>
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="text-white">{platform.name}</h4>
                                    <Badge className={getVerificationBadgeColor(platform.verificationLevel)}>
                                      {platform.verificationLevel}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-300">{platform.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <AnimatePresence>
                                  {connectingPlatform === platform.id ? (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      className="flex items-center space-x-2 text-[var(--deep-indigo)]"
                                    >
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-4 h-4 border-2 border-[var(--deep-indigo)] border-t-transparent rounded-full"
                                      />
                                      <span className="text-sm">Connecting...</span>
                                    </motion.div>
                                  ) : (
                                    <Button
                                      onClick={() => handleConnect(platform.id)}
                                      className="bg-[var(--deep-indigo)] hover:bg-[var(--deep-indigo-light)] text-white"
                                    >
                                      <QrCode className="w-4 h-4 mr-2" />
                                      Connect
                                    </Button>
                                  )}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-6 backdrop-blur-sm bg-slate-800/90 border-slate-700/50 shadow-lg">
            <h3 className="mb-4 text-white">How Platform Integration Works</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="w-10 h-10 bg-[var(--deep-indigo)]/20 rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-[var(--deep-indigo)]" />
                </div>
                <div>
                  <h4 className="text-sm mb-1 text-white">1. Quick Connect</h4>
                  <p className="text-xs text-slate-300">Scan QR code or click connect to link your digital ID</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="w-10 h-10 bg-[var(--mint)]/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[var(--mint)]" />
                </div>
                <div>
                  <h4 className="text-sm mb-1 text-white">2. Secure Verification</h4>
                  <p className="text-xs text-slate-300">Your age is verified without sharing personal details</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm mb-1 text-white">3. Instant Access</h4>
                  <p className="text-xs text-slate-300">Gain immediate access to age-restricted features</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* PIN Input Dialog */}
        <PinInputDialog
          isOpen={showPinDialog}
          onClose={() => {
            setShowPinDialog(false);
            setPendingPlatformId(null);
          }}
          onConfirm={handlePinConfirm}
          title="Connect to Platform"
          description="Enter your PIN to connect to external platforms"
        />
      </div>
    </div>
  );
}