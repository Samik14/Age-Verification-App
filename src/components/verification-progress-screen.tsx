import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Shield, CheckCircle, Clock, Database, Fingerprint, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VerificationProgressScreenProps {
  onComplete: (approved: boolean, reason?: string) => void;
}

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  duration: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

const verificationSteps: VerificationStep[] = [
  {
    id: 'encrypt',
    title: 'Encrypting Data',
    description: 'Securing your personal information with 256-bit encryption',
    icon: Lock,
    duration: 2000,
    status: 'pending'
  },
  {
    id: 'analyze',
    title: 'Analyzing Documents',
    description: 'AI-powered document authenticity verification',
    icon: Fingerprint,
    duration: 3000,
    status: 'pending'
  },
  {
    id: 'database',
    title: 'Database Verification',
    description: 'Cross-referencing with government databases',
    icon: Database,
    duration: 4000,
    status: 'pending'
  },
  {
    id: 'biometric',
    title: 'Biometric Matching',
    description: 'Comparing facial features with ID document',
    icon: CheckCircle,
    duration: 2500,
    status: 'pending'
  }
];

export function VerificationProgressScreen({ onComplete }: VerificationProgressScreenProps) {
  const [steps, setSteps] = useState(verificationSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(12);

  useEffect(() => {
    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        // Start processing current step
        setCurrentStepIndex(i);
        setSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'processing' } : step
        ));

        // Update progress gradually
        const stepProgress = 100 / steps.length;
        const startProgress = i * stepProgress;
        
        let progress = 0;
        const interval = setInterval(() => {
          progress += 2;
          const currentProgress = startProgress + (progress / 100) * stepProgress;
          setOverallProgress(Math.min(currentProgress, (i + 1) * stepProgress));
          
          // Update estimated time
          const remaining = Math.max(0, estimatedTime - (currentProgress / 100) * 12);
          setEstimatedTime(Math.ceil(remaining));
          
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, steps[i].duration / 50);

        // Wait for step to complete
        await new Promise(resolve => setTimeout(resolve, steps[i].duration));
        clearInterval(interval);

        // Mark step as completed
        setSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'completed' } : step
        ));
      }

      // Final completion
      setOverallProgress(100);
      setEstimatedTime(0);
      
      // Simulate verification result (90% success rate)
      const isApproved = Math.random() > 0.1;
      const reasons = [
        "Document quality insufficient - please retake photos",
        "Facial recognition confidence too low",
        "Document appears to be expired",
        "Unable to verify with government database"
      ];
      
      setTimeout(() => {
        onComplete(isApproved, isApproved ? undefined : reasons[Math.floor(Math.random() * reasons.length)]);
      }, 1000);
    };

    processSteps();
  }, [onComplete]);

  const securityFeatures = [
    "End-to-end encryption",
    "Zero-knowledge architecture", 
    "GDPR compliant processing",
    "Automatic data deletion"
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
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--deep-indigo)] to-[var(--deep-indigo-light)] rounded-3xl mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-3">Verification in Progress</h1>
            <p className="text-slate-300 text-base leading-relaxed">Your identity is being securely verified</p>
          </div>

          {/* Security Badges */}
          <div className="flex justify-center gap-2 mb-8">
            <Badge variant="secondary" className="bg-[var(--mint)]/10 text-[var(--mint-dark)] border-[var(--mint)]/20">
              <Shield className="w-3 h-3 mr-1" />
              Bank-Grade Security
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Clock className="w-3 h-3 mr-1" />
              ~{estimatedTime}s remaining
            </Badge>
          </div>

          {/* Overall Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-white">Overall Progress</span>
              <span className="text-sm text-white">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>

          {/* Verification Steps */}
          <div className="space-y-4 mb-8">
            <h3 className="text-white">Verification Steps</h3>
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start space-x-4 p-4 rounded-lg transition-all ${
                  step.status === 'processing' 
                    ? 'bg-[var(--deep-indigo)]/20 border border-[var(--deep-indigo)]/30' 
                    : step.status === 'completed'
                    ? 'bg-[var(--mint)]/20 border border-[var(--mint)]/30'
                    : 'bg-slate-700/30 border border-slate-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.status === 'processing'
                    ? 'bg-[var(--deep-indigo)]/20 text-[var(--deep-indigo)]'
                    : step.status === 'completed'
                    ? 'bg-[var(--mint)]/20 text-[var(--mint)]'
                    : 'bg-slate-600 text-slate-400'
                }`}>
                  {step.status === 'processing' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <step.icon className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm text-white">{step.title}</h4>
                    <AnimatePresence>
                      {step.status === 'completed' && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-[var(--mint)]"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </motion.div>
                      )}
                      {step.status === 'processing' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex space-x-1"
                        >
                          {[0, 1, 2].map((dot) => (
                            <motion.div
                              key={dot}
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: dot * 0.2
                              }}
                              className="w-1 h-1 bg-[var(--deep-indigo)] rounded-full"
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="text-xs text-slate-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Security Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-700/30 rounded-lg p-6 border border-slate-600"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-[var(--mint)]/20 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-[var(--mint)]" />
              </div>
              <h4 className="text-white">Your Privacy is Protected</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="w-3 h-3 text-[var(--mint)] flex-shrink-0" />
                  <span className="text-xs text-slate-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}