import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { Upload, Camera, FileText, Shield, CheckCircle, AlertTriangle, X, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IdUploadScreenProps {
  onNext: () => void;
  onBack: () => void;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'front' | 'back';
  status: 'uploading' | 'success' | 'error';
}

const supportedDocuments = [
  { type: "Passport", icon: "🛂", description: "All passport pages with photo" },
  { type: "Driver's License", icon: "🪪", description: "Front and back required" },
  { type: "Birth Certificate", icon: "🆔", description: "Front and back required" },
];

const uploadTips = [
  "Ensure document is well-lit and clearly visible",
  "All four corners should be in frame",
  "Avoid glare and shadows",
  "Text should be sharp and readable",
];

export function IdUploadScreen({ onNext, onBack }: IdUploadScreenProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDocType, setSelectedDocType] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newFile: UploadedFile = {
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: e.target?.result as string,
            type: uploadedFiles.length === 0 ? 'front' : 'back',
            status: 'uploading'
          };
          
          setUploadedFiles(prev => [...prev, newFile]);
          
          // Simulate upload progress
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 30;
            setUploadProgress(progress);
            
            if (progress >= 100) {
              clearInterval(interval);
              setUploadedFiles(prev => 
                prev.map(f => f.id === newFile.id ? { ...f, status: 'success' } : f)
              );
              setUploadProgress(0);
            }
          }, 200);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const retakePhoto = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isDocumentComplete = () => {
    if (selectedDocType === "Passport") {
      return uploadedFiles.length >= 1 && uploadedFiles.every(f => f.status === 'success');
    }
    return uploadedFiles.length >= 2 && uploadedFiles.every(f => f.status === 'success');
  };

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
              <FileText className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-3">Upload Identity Document</h1>
            <p className="text-slate-300 text-base leading-relaxed">Please upload a clear photo of your government-issued ID</p>
          </div>

          {/* Security Badge */}
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="bg-[var(--mint)]/10 text-[var(--mint-dark)] border-[var(--mint)]/20">
              <Shield className="w-3 h-3 mr-1" />
              256-bit SSL Encrypted
            </Badge>
          </div>

          {/* Document Type Selection */}
          {!selectedDocType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <h3 className="mb-4">Select Document Type</h3>
              <div className="grid grid-cols-2 gap-4">
                {supportedDocuments.map((doc, index) => (
                  <motion.button
                    key={doc.type}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedDocType(doc.type)}
                    className="p-4 border-2 border-slate-600 rounded-lg hover:border-[var(--deep-indigo)] hover:bg-slate-700/50 transition-all text-left bg-slate-700/30"
                  >
                    <div className="text-2xl mb-2">{doc.icon}</div>
                    <h4 className="mb-1 text-white">{doc.type}</h4>
                    <p className="text-xs text-slate-300">{doc.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Selected Document Type */}
          {selectedDocType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between bg-slate-700/30 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {supportedDocuments.find(d => d.type === selectedDocType)?.icon}
                  </div>
                  <div>
                    <h4 className="text-white">{selectedDocType}</h4>
                    <p className="text-sm text-slate-300">
                      {supportedDocuments.find(d => d.type === selectedDocType)?.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDocType("");
                    setUploadedFiles([]);
                  }}
                  className="text-slate-300 hover:text-white hover:bg-slate-600"
                >
                  Change
                </Button>
              </div>
            </motion.div>
          )}

          {selectedDocType && (
            <>
              {/* Upload Tips */}
              <Alert className="mb-8 border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription>
                  <div className="text-amber-800">
                    <p className="mb-2">For best results:</p>
                    <ul className="text-sm space-y-1">
                      {uploadTips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Upload Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    dragActive 
                      ? "border-[var(--deep-indigo)] bg-[var(--deep-indigo)]/5" 
                      : "border-slate-300 hover:border-[var(--deep-indigo)]"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-4">
                      <div className="p-3 bg-[var(--deep-indigo)]/10 rounded-full">
                        <Upload className="w-6 h-6 text-[var(--deep-indigo)]" />
                      </div>
                      <div className="p-3 bg-[var(--mint)]/10 rounded-full">
                        <Camera className="w-6 h-6 text-[var(--mint-dark)]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg mb-2 text-white">Drop your files here or click to upload</p>
                      <p className="text-sm text-slate-300">
                        Support: JPG, PNG • Max size: 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upload Progress */}
                <AnimatePresence>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-300">Uploading...</span>
                        <span className="text-sm text-white">{Math.round(uploadProgress)}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Uploaded Files */}
              <AnimatePresence>
                {uploadedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-8 space-y-5"
                  >
                    <h3 className="text-white">Uploaded Documents</h3>
                    <div className="grid gap-4">
                      {uploadedFiles.map((file) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200">
                            <img 
                              src={file.preview} 
                              alt={`${file.type} preview`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-sm capitalize text-white">{file.type} Side</h4>
                              {file.status === 'success' && (
                                <CheckCircle className="w-4 h-4 text-[var(--mint)]" />
                              )}
                            </div>
                            <p className="text-xs text-slate-300">{file.file.name}</p>
                            <p className="text-xs text-slate-300">
                              {(file.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => retakePhoto(file.id)}
                              className="text-slate-300 hover:text-white hover:bg-slate-600"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="text-slate-300 hover:text-red-400 hover:bg-slate-600"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Requirements Check */}
              {uploadedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {selectedDocType === "Passport" ? (
                        uploadedFiles.length >= 1 ? (
                          <CheckCircle className="w-4 h-4 text-[var(--mint)]" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-[var(--grey)] rounded-full" />
                        )
                      ) : (
                        uploadedFiles.some(f => f.type === 'front') ? (
                          <CheckCircle className="w-4 h-4 text-[var(--mint)]" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-[var(--grey)] rounded-full" />
                        )
                      )}
                      <span className="text-sm text-white">
                        {selectedDocType === "Passport" ? "Passport photo page" : "Front side uploaded"}
                      </span>
                    </div>

                    {selectedDocType !== "Passport" && (
                      <div className="flex items-center space-x-2">
                        {uploadedFiles.some(f => f.type === 'back') ? (
                          <CheckCircle className="w-4 h-4 text-[var(--mint)]" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-[var(--grey)] rounded-full" />
                        )}
                        <span className="text-sm text-white">Back side uploaded</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </>
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
            <Button
              onClick={onNext}
              disabled={!isDocumentComplete()}
              className="bg-[var(--deep-indigo)] hover:bg-[var(--deep-indigo-light)] text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Selfie
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}