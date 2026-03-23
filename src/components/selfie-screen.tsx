import { useState, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Camera, CheckCircle, RotateCcw, Shield, Eye, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SelfieScreenProps {
  onNext: () => void;
  onBack: () => void;
}

type CaptureState = 'ready' | 'capturing' | 'captured' | 'retake';

export function SelfieScreen({ onNext, onBack }: SelfieScreenProps) {
  const [captureState, setCaptureState] = useState<CaptureState>('ready');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [showGuidance, setShowGuidance] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 480, 
          height: 640,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      // Simulate face detection
      setTimeout(() => setFaceDetected(true), 2000);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    setCaptureState('capturing');
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
        setCaptureState('captured');
        stopCamera();
      }, 1500);
    }
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setCaptureState('ready');
    setFaceDetected(false);
    startCamera();
  }, [startCamera]);

  const tips = [
    "Look directly at the camera",
    "Keep your face centered in the frame",
    "Ensure good lighting on your face",
    "Remove any accessories covering your face",
    "Stay still during capture"
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
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--deep-indigo)] to-[var(--deep-indigo-light)] rounded-2xl mb-4"
            >
              <Camera className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-3">Take Your Selfie</h1>
            <p className="text-slate-300 text-base leading-relaxed">We'll compare this with your ID document</p>
          </div>

          {/* Security Badge */}
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="bg-[var(--mint)]/10 text-[var(--mint-dark)] border-[var(--mint)]/20">
              <Eye className="w-3 h-3 mr-1" />
              Biometric Verification
            </Badge>
          </div>

          {/* Guidance Tips */}
          <AnimatePresence>
            {showGuidance && captureState === 'ready' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription>
                    <div className="text-amber-800">
                      <p className="mb-2">For best results:</p>
                      <ul className="text-sm space-y-1">
                        {tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGuidance(false)}
                  className="mt-2 text-[var(--grey)] hover:text-[var(--deep-indigo)]"
                >
                  <X className="w-4 h-4 mr-1" />
                  Hide Tips
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Camera Section */}
          <div className="mb-8">
            <div className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-[3/4] mx-auto max-w-sm">
              
              {/* Video Preview */}
              {captureState !== 'captured' && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  onLoadedMetadata={startCamera}
                />
              )}

              {/* Captured Image */}
              {captureState === 'captured' && capturedImage && (
                <motion.img
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={capturedImage}
                  alt="Captured selfie"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Face Detection Overlay */}
              <AnimatePresence>
                {captureState === 'ready' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {/* Face Guide Frame */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ 
                        scale: faceDetected ? 1 : 0.9,
                        opacity: faceDetected ? 1 : 0.7
                      }}
                      className={`w-48 h-64 border-4 rounded-full transition-all duration-300 ${
                        faceDetected 
                          ? "border-[var(--mint)] shadow-lg shadow-[var(--mint)]/20" 
                          : "border-white/50"
                      }`}
                    >
                      {/* Corner indicators */}
                      <div className="relative w-full h-full">
                        {[0, 1, 2, 3].map((corner) => (
                          <motion.div
                            key={corner}
                            initial={{ scale: 0 }}
                            animate={{ scale: faceDetected ? 1 : 0.8 }}
                            transition={{ delay: corner * 0.1 }}
                            className={`absolute w-4 h-4 border-2 ${
                              faceDetected ? "border-[var(--mint)]" : "border-white/50"
                            } ${
                              corner === 0 ? "top-2 left-2 border-r-0 border-b-0" :
                              corner === 1 ? "top-2 right-2 border-l-0 border-b-0" :
                              corner === 2 ? "bottom-2 left-2 border-r-0 border-t-0" :
                              "bottom-2 right-2 border-l-0 border-t-0"
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Processing Overlay */}
              <AnimatePresence>
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                  >
                    <div className="text-center text-white">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"
                      />
                      <p className="text-sm">Processing...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status Indicators */}
              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <AnimatePresence>
                  {faceDetected && captureState === 'ready' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-[var(--mint)] text-white px-3 py-1 rounded-full text-xs flex items-center"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Face Detected
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {captureState === 'captured' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[var(--deep-indigo)] text-white px-3 py-1 rounded-full text-xs flex items-center"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Captured
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Camera Controls */}
            <div className="flex justify-center mt-6 space-x-4">
              {captureState === 'ready' && (
                <Button
                  onClick={capturePhoto}
                  disabled={!faceDetected || isProcessing}
                  size="lg"
                  className="bg-[var(--deep-indigo)] hover:bg-[var(--deep-indigo-light)] text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full w-16 h-16 p-0"
                >
                  <Camera className="w-6 h-6" />
                </Button>
              )}

              {captureState === 'captured' && (
                <Button
                  onClick={retakePhoto}
                  variant="outline"
                  size="lg"
                  className="border-[var(--deep-indigo)] text-[var(--deep-indigo)] hover:bg-[var(--deep-indigo)] hover:text-white transition-all duration-200 rounded-full w-16 h-16 p-0"
                >
                  <RotateCcw className="w-6 h-6" />
                </Button>
              )}
            </div>
          </div>

          {/* Security Notice */}
          {captureState === 'captured' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert className="border-[var(--mint)]/20 bg-[var(--mint)]/5">
                <Shield className="h-4 w-4 text-[var(--mint-dark)]" />
                <AlertDescription className="text-[var(--mint-dark)]">
                  Your biometric data is encrypted and processed securely. We never store your photos permanently.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-slate-400 hover:text-white"
            >
              Back
            </Button>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={onNext}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                Skip for Demo
              </Button>
              <Button
                onClick={onNext}
                disabled={captureState !== 'captured'}
                className="bg-[var(--deep-indigo)] hover:bg-[var(--deep-indigo-light)] text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit for Verification
              </Button>
            </div>
          </div>
        </Card>

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </div>
  );
}