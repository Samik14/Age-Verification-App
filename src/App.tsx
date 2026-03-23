import React, { useState } from "react";
import { OnboardingScreen } from "./components/onboarding-screen";
import { RegistrationScreen } from "./components/registration-screen";
import { PrivacyTermsScreen } from "./components/privacy-terms-screen";
import { IdUploadScreen } from "./components/id-upload-screen";
import { SelfieScreen } from "./components/selfie-screen";
import { VerificationProgressScreen } from "./components/verification-progress-screen";
import { VerificationResultScreen } from "./components/verification-result-screen";
import { PinSetupScreen } from "./components/pin-setup-screen";
import { DigitalIdCardScreen } from "./components/digital-id-card-screen";
import { ExternalPlatformScreen } from "./components/external-platform-screen";
import { SettingsScreen } from "./components/settings-screen";
import { LanguageProvider } from "./components/language-context";

type AppScreen = 
  | "onboarding"
  | "registration"
  | "privacy-terms"
  | "id-upload"
  | "selfie"
  | "verification-progress"
  | "verification-result"
  | "pin-setup"
  | "digital-id-card"
  | "external-platform"
  | "settings";

interface VerificationData {
  isApproved: boolean;
  retryReason?: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  pin?: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("onboarding");
  const [verificationData, setVerificationData] = useState<VerificationData>({ isApproved: true });
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    pin: ""
  });

  const navigateToScreen = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  const handleVerificationComplete = (approved: boolean, reason?: string) => {
    // Age verification check - must be 16 or older
    if (approved && userData.dateOfBirth) {
      const birthDate = new Date(userData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (age < 16 || (age === 16 && monthDiff < 0) || (age === 16 && monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        setVerificationData({ 
          isApproved: false, 
          retryReason: "Age verification failed - must be 16 years or older to proceed" 
        });
      } else {
        setVerificationData({ isApproved: approved, retryReason: reason });
      }
    } else {
      setVerificationData({ isApproved: approved, retryReason: reason });
    }
    setCurrentScreen("verification-result");
  };

  const handleUserDataUpdate = (data: UserData) => {
    setUserData(data);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "onboarding":
        return (
          <OnboardingScreen 
            onNext={() => navigateToScreen("privacy-terms")} 
          />
        );

      case "privacy-terms":
        return (
          <PrivacyTermsScreen 
            onNext={() => navigateToScreen("registration")}
            onBack={() => navigateToScreen("onboarding")}
          />
        );

      case "registration":
        return (
          <RegistrationScreen 
            onNext={(data) => {
              handleUserDataUpdate(data);
              navigateToScreen("id-upload");
            }}
            onBack={() => navigateToScreen("privacy-terms")}
            userData={userData}
          />
        );

      case "id-upload":
        return (
          <IdUploadScreen 
            onNext={() => navigateToScreen("selfie")}
            onBack={() => navigateToScreen("registration")}
          />
        );

      case "selfie":
        return (
          <SelfieScreen 
            onNext={() => navigateToScreen("verification-progress")}
            onBack={() => navigateToScreen("id-upload")}
          />
        );

      case "verification-progress":
        return (
          <VerificationProgressScreen 
            onComplete={(approved, reason) => handleVerificationComplete(approved, reason)}
          />
        );

      case "verification-result":
        return (
          <VerificationResultScreen 
            isApproved={verificationData.isApproved}
            retryReason={verificationData.retryReason}
            onContinue={() => navigateToScreen("pin-setup")}
            onRetry={() => navigateToScreen("selfie")}
            onSupport={() => navigateToScreen("settings")}
            userData={userData}
          />
        );

      case "pin-setup":
        return (
          <PinSetupScreen 
            onNext={(pin) => {
              handleUserDataUpdate({ ...userData, pin });
              navigateToScreen("digital-id-card");
            }}
            onBack={() => navigateToScreen("verification-result")}
          />
        );

      case "digital-id-card":
        return (
          <DigitalIdCardScreen 
            onUseExternal={() => navigateToScreen("external-platform")}
            onSettings={() => navigateToScreen("settings")}
            userData={userData}
          />
        );

      case "external-platform":
        return (
          <ExternalPlatformScreen 
            onBack={() => navigateToScreen("digital-id-card")}
            onSettings={() => navigateToScreen("settings")}
            userData={userData}
          />
        );

      case "settings":
        return (
          <SettingsScreen 
            onBack={() => navigateToScreen("digital-id-card")}
          />
        );

      default:
        return (
          <OnboardingScreen 
            onNext={() => navigateToScreen("registration")} 
          />
        );
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background dark">
        {renderCurrentScreen()}
      </div>
    </LanguageProvider>
  );
}