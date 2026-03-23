import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle, XCircle, RefreshCw, MessageCircle, IdCard, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

interface VerificationResultScreenProps {
  isApproved: boolean;
  retryReason?: string;
  onContinue: () => void;
  onRetry: () => void;
  onSupport: () => void;
  userData: { firstName: string; lastName: string; dateOfBirth: string };
}

export function VerificationResultScreen({ 
  isApproved, 
  retryReason, 
  onContinue, 
  onRetry, 
  onSupport,
  userData
}: VerificationResultScreenProps) {
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
  
  const successMessages = [
    "Identity verified successfully",
    "Your digital ID card is ready",
    "Welcome to SecureID platform"
  ];

  const nextSteps = [
    { icon: IdCard, text: "Access your digital ID card", action: "view" },
    { icon: CheckCircle, text: "Use with external platforms", action: "integrate" },
    { icon: MessageCircle, text: "Set up security preferences", action: "configure" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="p-8 backdrop-blur-sm bg-slate-800/90 border-slate-700/50 shadow-xl">
          {/* Success State */}
          {isApproved && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.2, 
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--mint)] to-[var(--mint-light)] rounded-full mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h1 className="text-3xl font-bold text-white mb-3">Verification Successful!</h1>
                  <p className="text-slate-300 text-base leading-relaxed">Your identity has been verified and approved</p>
                </motion.div>
              </div>

              {/* Success Messages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <div className="space-y-3">
                  {successMessages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-[var(--mint)]/20 rounded-lg border border-[var(--mint)]/30"
                    >
                      <CheckCircle className="w-4 h-4 text-[var(--mint)] flex-shrink-0" />
                      <span className="text-sm text-white">{message}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Digital ID Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="mb-8"
              >
                <h3 className="mb-4 text-white">Your Digital ID Card Preview</h3>
                <div className="bg-gradient-to-br from-[var(--deep-indigo)] to-[var(--deep-indigo-light)] rounded-xl p-6 text-white relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-24 h-24 border border-white/20 rounded-full"></div>
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <IdCard className="w-4 h-4" />
                        </div>
                        <span className="text-sm opacity-90">SecureID</span>
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        Verified
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-lg">{fullName}</h4>
                      <p className="text-sm opacity-75">Age Verified • {age > 0 ? `${age}+` : '16+'}</p>
                      <p className="text-xs opacity-60">Valid until: Dec 2025</p>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-xs opacity-60">
                        ID: SEC***789
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/30 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="mb-8"
              >
                <h3 className="mb-4 text-white">How Platform Integration Works</h3>
                <div className="grid grid-cols-1 gap-4">
                  {nextSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 + index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600"
                    >
                      <div className="w-10 h-10 bg-[var(--deep-indigo)]/20 rounded-lg flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-[var(--deep-indigo)]" />
                      </div>
                      <div>
                        <h4 className="text-sm mb-1 text-white">{index + 1}. {step.text}</h4>
                        <p className="text-xs text-slate-300">
                          {index === 0 && "Scan QR code or click connect to link your digital ID"}
                          {index === 1 && "Your age is verified without sharing personal details"}
                          {index === 2 && "Gain immediate access to age-restricted features"}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
              >
                <Button
                  onClick={onContinue}
                  className="w-full bg-[var(--deep-indigo)] hover:bg-[var(--deep-indigo-light)] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  Access Digital ID Card
                </Button>
              </motion.div>
            </>
          )}

          {/* Failure State */}
          {!isApproved && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.2, 
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-6"
                >
                  <XCircle className="w-10 h-10 text-white" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h1 className="text-3xl font-bold text-red-400 mb-3">Verification Failed</h1>
                  <p className="text-slate-300 text-base leading-relaxed">We couldn't verify your identity at this time</p>
                </motion.div>
              </div>

              {/* Error Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <Alert className="border-red-500/30 bg-red-500/20">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    <p className="mb-2">Reason for failure:</p>
                    <p className="text-sm">{retryReason || "Unable to verify document authenticity"}</p>
                  </AlertDescription>
                </Alert>
              </motion.div>

              {/* Retry Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-8"
              >
                <h3 className="mb-4 text-white">How to fix this:</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-blue-400">1</span>
                    </div>
                    <div>
                      <h4 className="text-sm mb-1 text-white">Check your document quality</h4>
                      <p className="text-xs text-slate-300">Ensure photos are clear, well-lit, and all text is readable</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-blue-400">2</span>
                    </div>
                    <div>
                      <h4 className="text-sm mb-1 text-white">Retake your selfie</h4>
                      <p className="text-xs text-slate-300">Make sure your face is clearly visible and matches your ID</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-blue-400">3</span>
                    </div>
                    <div>
                      <h4 className="text-sm mb-1 text-white">Use a different document</h4>
                      <p className="text-xs text-slate-300">Try uploading a different form of government-issued ID</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="space-y-3"
              >
                <Button
                  onClick={onRetry}
                  className="w-full bg-[var(--deep-indigo)] hover:bg-[var(--deep-indigo-light)] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <Button
                  onClick={onSupport}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white transition-all duration-200"
                  size="lg"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </motion.div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}