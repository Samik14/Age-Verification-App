import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { motion } from "motion/react";

interface PrivacyTermsScreenProps {
  onBack: () => void;
  onNext: () => void;
}

export function PrivacyTermsScreen({ onBack, onNext }: PrivacyTermsScreenProps) {
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsConditions, setShowTermsConditions] = useState(false);

  const isFormValid = () => {
    return privacyAccepted && termsAccepted;
  };

  const handleNext = () => {
    if (isFormValid()) {
      onNext();
    }
  };

  const privacyPolicyContent = `
# Privacy Policy

## Information We Collect

We collect information you provide directly to us, such as when you create an account, upload documents, or contact us for support.

### Personal Information
- Name and contact information
- Date of birth and identity verification documents
- Biometric data (selfie photos) for verification purposes
- Phone number and email address

### Usage Information
- Device information and IP address
- App usage patterns and preferences
- Verification history and audit logs

## How We Use Your Information

We use the information we collect to:
- Verify your identity and age
- Provide our age verification services
- Maintain security and prevent fraud
- Improve our services
- Communicate with you about your account

## Information Sharing

We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:
- To comply with legal obligations
- To protect our rights and safety
- With your explicit consent for platform integration

## Data Security

We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## Your Rights

You have the right to:
- Access your personal information
- Correct inaccurate data
- Delete your account and data
- Withdraw consent for data processing
- Export your data

## Contact Us

If you have questions about this Privacy Policy, please contact us at privacy@ageverification.app
  `;

  const termsConditionsContent = `
# Terms and Conditions

## Acceptance of Terms

By using our age verification service, you agree to be bound by these Terms and Conditions.

## Service Description

Our service provides digital age verification for accessing age-restricted content and services. We verify your identity and age using government-issued documents and biometric verification.

## User Responsibilities

### Eligibility
- You must be at least 16 years old to use this service
- You must provide accurate and truthful information
- You must have valid government-issued identification

### Prohibited Uses
You may not use our service to:
- Provide false or misleading information
- Attempt to circumvent age verification
- Share your digital ID with others
- Use the service for illegal purposes

## Service Availability

We strive to maintain service availability but do not guarantee uninterrupted access. We may suspend or terminate service for maintenance, updates, or security reasons.

## Intellectual Property

All content, trademarks, and intellectual property rights in our service are owned by us or our licensors.

## Limitation of Liability

To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our service.

## Privacy

Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.

## Changes to Terms

We may update these Terms and Conditions from time to time. Continued use of our service after changes constitutes acceptance of the new terms.

## Governing Law

These Terms and Conditions are governed by the laws of [Jurisdiction] and any disputes will be resolved in the courts of [Jurisdiction].

## Contact Information

For questions about these Terms and Conditions, please contact us at legal@ageverification.app
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="p-8 backdrop-blur-sm bg-slate-800/90 border-slate-700/50 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-[var(--deep-indigo)]/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Shield className="w-8 h-8 text-[var(--deep-indigo)]" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-3">Privacy & Terms</h1>
            <p className="text-slate-300 text-base leading-relaxed">
              Please review and accept our Privacy Policy and Terms & Conditions to continue
            </p>
          </div>

          {/* Acceptance Cards */}
          <div className="space-y-6 mb-8">
            {/* Privacy Policy */}
            <Card className="p-6 bg-slate-700/50 border-slate-600/50">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Shield className="w-6 h-6 text-[var(--deep-indigo)] mt-1" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">Privacy Policy</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
                      className="border-slate-500 text-slate-300 hover:bg-slate-600"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {showPrivacyPolicy ? "Hide" : "View"}
                    </Button>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">
                    Learn how we collect, use, and protect your personal information and biometric data.
                  </p>
                  
                  {showPrivacyPolicy && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      <ScrollArea className="h-64 w-full border border-slate-600 rounded-lg p-4">
                        <div className="prose prose-invert prose-sm max-w-none overflow-hidden">
                          <div className="text-sm text-slate-300 leading-relaxed space-y-3">
                            {privacyPolicyContent.split('\n').map((line, index) => {
                              if (line.trim() === '') return <div key={index} className="h-2" />;
                              
                              if (line.startsWith('# ')) {
                                return (
                                  <h1 key={index} className="text-lg font-bold text-white mb-2 mt-4 first:mt-0">
                                    {line.replace('# ', '')}
                                  </h1>
                                );
                              }
                              
                              if (line.startsWith('## ')) {
                                return (
                                  <h2 key={index} className="text-base font-semibold text-slate-100 mb-2 mt-3">
                                    {line.replace('## ', '')}
                                  </h2>
                                );
                              }
                              
                              if (line.startsWith('### ')) {
                                return (
                                  <h3 key={index} className="text-sm font-medium text-slate-200 mb-1 mt-2">
                                    {line.replace('### ', '')}
                                  </h3>
                                );
                              }
                              
                              if (line.startsWith('- ')) {
                                return (
                                  <div key={index} className="flex items-start ml-4">
                                    <span className="text-slate-400 mr-2 mt-1">•</span>
                                    <span className="text-slate-300">{line.replace('- ', '')}</span>
                                  </div>
                                );
                              }
                              
                              return (
                                <p key={index} className="text-slate-300 leading-relaxed">
                                  {line}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      </ScrollArea>
                    </motion.div>
                  )}

                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="privacy"
                      checked={privacyAccepted}
                      onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                    />
                    <label htmlFor="privacy" className="text-sm text-slate-300 cursor-pointer">
                      I have read and accept the Privacy Policy
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            {/* Terms & Conditions */}
            <Card className="p-6 bg-slate-700/50 border-slate-600/50">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <FileText className="w-6 h-6 text-[var(--deep-indigo)] mt-1" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">Terms & Conditions</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTermsConditions(!showTermsConditions)}
                      className="border-slate-500 text-slate-300 hover:bg-slate-600"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {showTermsConditions ? "Hide" : "View"}
                    </Button>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">
                    Review the terms governing your use of our age verification service.
                  </p>
                  
                  {showTermsConditions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      <ScrollArea className="h-64 w-full border border-slate-600 rounded-lg p-4">
                        <div className="prose prose-invert prose-sm max-w-none overflow-hidden">
                          <div className="text-sm text-slate-300 leading-relaxed space-y-3">
                            {termsConditionsContent.split('\n').map((line, index) => {
                              if (line.trim() === '') return <div key={index} className="h-2" />;
                              
                              if (line.startsWith('# ')) {
                                return (
                                  <h1 key={index} className="text-lg font-bold text-white mb-2 mt-4 first:mt-0">
                                    {line.replace('# ', '')}
                                  </h1>
                                );
                              }
                              
                              if (line.startsWith('## ')) {
                                return (
                                  <h2 key={index} className="text-base font-semibold text-slate-100 mb-2 mt-3">
                                    {line.replace('## ', '')}
                                  </h2>
                                );
                              }
                              
                              if (line.startsWith('### ')) {
                                return (
                                  <h3 key={index} className="text-sm font-medium text-slate-200 mb-1 mt-2">
                                    {line.replace('### ', '')}
                                  </h3>
                                );
                              }
                              
                              if (line.startsWith('- ')) {
                                return (
                                  <div key={index} className="flex items-start ml-4">
                                    <span className="text-slate-400 mr-2 mt-1">•</span>
                                    <span className="text-slate-300">{line.replace('- ', '')}</span>
                                  </div>
                                );
                              }
                              
                              return (
                                <p key={index} className="text-slate-300 leading-relaxed">
                                  {line}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      </ScrollArea>
                    </motion.div>
                  )}

                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-sm text-slate-300 cursor-pointer">
                      I have read and accept the Terms & Conditions
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Validation Alert */}
          {!isFormValid() && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert className="border-amber-600/50 bg-amber-900/20">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                <AlertDescription className="text-amber-200">
                  Please accept both the Privacy Policy and Terms & Conditions to continue.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isFormValid()}
              className="bg-[var(--deep-indigo)] hover:bg-[var(--deep-indigo-light)] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
