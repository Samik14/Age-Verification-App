import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { PinInputDialog } from "./pin-input-dialog";
import { 
  IdCard, 
  QrCode, 
  Lock, 
  Smartphone, 
  Share2, 
  Download, 
  Shield, 
  Settings, 
  CheckCircle,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DigitalIdCardScreenProps {
  onUseExternal: () => void;
  onSettings: () => void;
  userData: { firstName: string; lastName: string; dateOfBirth: string; pin?: string };
}

export function DigitalIdCardScreen({ onUseExternal, onSettings, userData }: DigitalIdCardScreenProps) {
  const [selectedTab, setSelectedTab] = useState("card");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [pinSet, setPinSet] = useState(false);
  const [cardRotated, setCardRotated] = useState(false);
  const [showWalletId, setShowWalletId] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pinDialogType, setPinDialogType] = useState<'wallet' | 'platform'>('wallet');

  const getAge = (isoDate: string) => {
    if (!isoDate) return 0;
    const dob = new Date(isoDate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  };
  const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'User';
  const age = getAge(userData.dateOfBirth);

  const handleSetPin = () => {
    if (pin === confirmPin && pin.length >= 4) {
      setPinSet(true);
      setPin("");
      setConfirmPin("");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handlePinConfirm = (enteredPin: string) => {
    // Use the user's actual PIN instead of hardcoded 123456
    if (enteredPin === userData.pin) {
      if (pinDialogType === 'wallet') {
        setShowWalletId(true);
      } else if (pinDialogType === 'platform') {
        onUseExternal();
      }
      setShowPinDialog(false);
    } else {
      // Show error - PIN incorrect
      alert("Incorrect PIN. Please try again.");
    }
  };

  const handleWalletIdClick = () => {
    setPinDialogType('wallet');
    setShowPinDialog(true);
  };

  const handlePlatformConnect = () => {
    setPinDialogType('platform');
    setShowPinDialog(true);
  };

  const qrCodeData = "https://secureid.example.com/verify/abc123def456";
  const walletId = "SEC-ID-789-ABC-DEF";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--deep-indigo)] to-[var(--deep-indigo-light)] rounded-xl flex items-center justify-center">
              <IdCard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Digital Age ID Card</h1>
          </div>
          <p className="text-slate-300 text-base leading-relaxed">Your secure digital identity credential</p>
        </motion.div>

        <div className="space-y-6">
          {/* Digital ID Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 backdrop-blur-sm bg-slate-800/90 border-slate-700/50 shadow-xl">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="card" className="flex items-center space-x-2">
                    <IdCard className="w-4 h-4" />
                    <span>ID Card</span>
                  </TabsTrigger>
                  <TabsTrigger value="qr" className="flex items-center space-x-2">
                    <QrCode className="w-4 h-4" />
                    <span>QR Code</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="card" className="space-y-6">
                  {/* Interactive Card */}
                  <div className="relative">
                    <motion.div
                      className="relative w-full max-w-sm mx-auto cursor-pointer"
                      style={{ perspective: "1000px" }}
                      onClick={() => setCardRotated(!cardRotated)}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="relative w-full h-64 rounded-2xl shadow-2xl"
                        style={{ transformStyle: "preserve-3d" }}
                        animate={{ rotateY: cardRotated ? 180 : 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        {/* Front of Card */}
                        <div 
                          className="absolute inset-0 w-full h-full bg-gradient-to-br from-[var(--deep-indigo)] to-[var(--deep-indigo-light)] rounded-2xl p-6 text-white"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          {/* Background Pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full"></div>
                            <div className="absolute bottom-4 left-4 w-24 h-24 border border-white/20 rounded-full"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/10 rounded-full"></div>
                          </div>
                          
                          <div className="relative h-full flex flex-col justify-between">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                  <Shield className="w-4 h-4" />
                                </div>
                                <span className="text-sm opacity-90">Age Verification App</span>
                              </div>
                              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            </div>

                            {/* Personal Info */}
                            <div className="space-y-2">
                              <h3 className="text-xl">{fullName}</h3>
                              <div className="space-y-1">
                                <p className="text-sm opacity-75">Age Verified • {age > 0 ? `${age}+` : '16+'}</p>
                                <p className="text-xs opacity-60">Date of Birth: {userData.dateOfBirth || '—'}</p>
                                <p className="text-xs opacity-60">Valid until: Dec 2025</p>
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center">
                              <div className="text-xs opacity-60">
                                ID: {walletId.substring(0, 11)}...
                              </div>
                              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <div className="w-8 h-8 bg-white/30 rounded grid grid-cols-3 gap-0.5 p-1">
                                  {Array.from({ length: 9 }).map((_, i) => (
                                    <div key={i} className="bg-white/60 rounded-sm"></div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Back of Card */}
                        <div 
                          className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 text-white"
                          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                        >
                          <div className="h-full flex flex-col">
                            {/* Header */}
                            <div className="text-center mb-6">
                              <h4 className="text-sm font-semibold text-white mb-1">Security Features</h4>
                              <div className="w-12 h-0.5 bg-[var(--mint)] mx-auto rounded-full"></div>
                            </div>

                            {/* Main Content - Side by Side Layout */}
                            <div className="flex-1 flex items-center justify-between">
                              {/* Security Features - Left Side */}
                              <div className="flex-1 pr-4">
                                <div className="space-y-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-[var(--mint)]/20 rounded-lg flex items-center justify-center">
                                      <CheckCircle className="w-4 h-4 text-[var(--mint)]" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-white">256-bit Encryption</p>
                                      <p className="text-xs text-slate-300">Bank-grade security</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-[var(--mint)]/20 rounded-lg flex items-center justify-center">
                                      <CheckCircle className="w-4 h-4 text-[var(--mint)]" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-white">Biometric Verified</p>
                                      <p className="text-xs text-slate-300">Face recognition</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-[var(--mint)]/20 rounded-lg flex items-center justify-center">
                                      <CheckCircle className="w-4 h-4 text-[var(--mint)]" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-white">Government Validated</p>
                                      <p className="text-xs text-slate-300">Official verification</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* QR Code - Right Side */}
                              <div className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-white rounded-xl shadow-lg flex items-center justify-center mb-3">
                                  <QrCode className="w-16 h-16 text-slate-800" />
                                </div>
                                <p className="text-xs text-slate-300 text-center">Scan to verify</p>
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="text-center mt-6">
                              <p className="text-xs text-slate-400">Click to flip card</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                    
                    <p className="text-center text-sm text-[var(--grey)] mt-4">
                      Click the card to see security features
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={handlePlatformConnect}
                      className="bg-[var(--deep-indigo)] hover:bg-[var(--deep-indigo-light)] text-white"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Use with Apps
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Add to Wallet
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="qr" className="space-y-6">
                  {/* QR Code Display */}
                  <div className="text-center">
                    <div className="w-64 h-64 bg-white border-2 border-slate-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-slate-400" />
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-4">
                      Scan this QR code to verify your digital ID
                    </p>
                    
                    {/* QR Code Actions */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-3 bg-slate-700/50 rounded-lg">
                        <code className="flex-1 text-xs text-left text-slate-300">{qrCodeData}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(qrCodeData)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <Alert className="border-amber-600/50 bg-amber-900/20">
                        <Shield className="h-4 w-4 text-amber-400" />
                        <AlertDescription className="text-amber-200">
                          Only share this QR code with trusted platforms. It contains your verification link.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >

            {/* Quick Actions */}
            <Card className="p-6 backdrop-blur-sm bg-slate-800/90 border-slate-700/50 shadow-xl">
              <h3 className="mb-4 text-white">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={handlePlatformConnect}
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Connect to Platform
                </Button>
                <Button
                  variant="outline"
                  onClick={onSettings}
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings & Support
                </Button>
              </div>
            </Card>

            {/* Wallet Integration */}
            <Card className="p-6 backdrop-blur-sm bg-slate-800/90 border-slate-700/50 shadow-xl">
              <h3 className="mb-4 text-white">Wallet Integration</h3>
              <div className="space-y-4">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white">Wallet ID</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleWalletIdClick}
                    >
                      <Lock className="w-3 h-3" />
                    </Button>
                  </div>
                  {showWalletId ? (
                    <code className="text-xs text-slate-300">{walletId}</code>
                  ) : (
                    <code className="text-xs text-slate-500">••••••••••••••••</code>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                    Apple Wallet
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                    Google Pay
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* PIN Input Dialog */}
        <PinInputDialog
          isOpen={showPinDialog}
          onClose={() => setShowPinDialog(false)}
          onConfirm={handlePinConfirm}
          title={pinDialogType === 'wallet' ? "View Wallet ID" : "Connect to Platform"}
          description={pinDialogType === 'wallet' 
            ? "Enter your PIN to view your wallet ID" 
            : "Enter your PIN to connect to external platforms"
          }
        />
      </div>
    </div>
  );
}