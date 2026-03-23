import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Shield, CheckCircle, Globe, ArrowRight, Lock, Fingerprint } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "./language-context";

interface OnboardingScreenProps {
  onNext: () => void;
}

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

export function OnboardingScreen({ onNext }: OnboardingScreenProps) {
  const { language, setLanguage, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const securityFeatures = [
    { icon: Shield, title: t('security.bankGrade'), description: t('security.bankGradeDesc') },
    { icon: Fingerprint, title: t('security.biometric'), description: t('security.biometricDesc') },
    { icon: Lock, title: t('security.privacy'), description: t('security.privacyDesc') },
  ];

  const steps = [
    {
      title: t('welcome.title'),
      subtitle: t('welcome.subtitle'),
      description: t('welcome.description'),
    },
    {
      title: t('language.title'),
      subtitle: t('language.subtitle'),
      description: t('language.description'),
    },
    {
      title: t('security.title'),
      subtitle: t('security.subtitle'),
      description: t('security.description'),
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? "bg-[var(--deep-indigo)]" : "bg-slate-300"
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: index === currentStep ? 1.2 : 1 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-br from-[var(--deep-indigo)] to-[var(--deep-indigo-light)] rounded-2xl flex items-center justify-center"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-3">{steps[currentStep].title}</h1>
            <h3 className="text-lg text-slate-300 mb-4">{steps[currentStep].subtitle}</h3>
            <p className="text-slate-300 leading-relaxed text-base">
              {steps[currentStep].description}
            </p>
          </motion.div>

          {/* Language Selection */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full border-slate-300 focus:border-[var(--deep-indigo)] focus:ring-[var(--deep-indigo)]/20">
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-slate-400" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center">
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}

          {/* Security Features */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 space-y-4"
            >
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/50"
                >
                  <div className="w-8 h-8 bg-[var(--mint)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-[var(--mint-dark)]" />
                  </div>
                  <div>
                    <h4 className="text-sm mb-1">{feature.title}</h4>
                    <p className="text-xs text-slate-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="text-slate-400 hover:text-white"
            >
              {t('back')}
            </Button>
            <Button
              onClick={handleNext}
              className="bg-[var(--deep-indigo)] hover:bg-[var(--deep-indigo-light)] text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {currentStep === steps.length - 1 ? t('getStarted') : t('continue')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}