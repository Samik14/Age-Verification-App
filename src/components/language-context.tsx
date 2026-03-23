import { createContext, useContext, useState, ReactNode } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Onboarding
    'welcome.title': 'Welcome to Age Verification App',
    'welcome.subtitle': 'Your digital identity verification platform',
    'welcome.description': 'Experience fast, secure, and compliant age verification powered by cutting-edge AI technology.',
    'language.title': 'Choose Your Language',
    'language.subtitle': 'Select your preferred language',
    'language.description': 'Age Verification App supports multiple languages to serve users worldwide.',
    'security.title': 'Security & Privacy',
    'security.subtitle': 'Your security is our priority',
    'security.description': 'Learn about our commitment to protecting your personal information.',
    'continue': 'Continue',
    'back': 'Back',
    'getStarted': 'Get Started',
    
    // Registration
    'registration.title': 'Create Your Account',
    'registration.subtitle': 'Enter your personal information to get started',
    'firstName': 'First Name',
    'lastName': 'Last Name',
    'email': 'Email Address',
    'phone': 'Phone Number',
    'dateOfBirth': 'Date of Birth',
    'country': 'Country',
    'password': 'Password',
    'confirmPassword': 'Confirm Password',
    
    // Security Features
    'security.bankGrade': 'Bank-Grade Security',
    'security.bankGradeDesc': '256-bit encryption protects your data',
    'security.biometric': 'Biometric Verification',
    'security.biometricDesc': 'Advanced facial recognition technology',
    'security.privacy': 'Privacy First',
    'security.privacyDesc': 'Your data never leaves secure servers',
    
    // Settings
    'settings.title': 'Settings & Support',
    'settings.subtitle': 'Manage your account preferences and get help',
    'settings.general': 'General',
    'settings.security': 'Security',
    'settings.auditLogs': 'Audit Logs',
    'settings.support': 'Support',
    'settings.language': 'Language & Region',
    'settings.displayLanguage': 'Display Language',
    'settings.notifications': 'Notifications',
    'settings.deleteAccount': 'Delete Account',
    'settings.deleteAccountDesc': 'Permanently remove your account and data',
    'delete': 'Delete',
  },
  es: {
    // Onboarding
    'welcome.title': 'Bienvenido a Age Verification App',
    'welcome.subtitle': 'Tu plataforma de verificación de identidad digital',
    'welcome.description': 'Experimenta verificación de edad rápida, segura y conforme impulsada por tecnología de IA de vanguardia.',
    'language.title': 'Elige tu idioma',
    'language.subtitle': 'Selecciona tu idioma preferido',
    'language.description': 'Age Verification App admite múltiples idiomas para servir a usuarios en todo el mundo.',
    'security.title': 'Seguridad y Privacidad',
    'security.subtitle': 'Tu seguridad es nuestra prioridad',
    'security.description': 'Aprende sobre nuestro compromiso de proteger tu información personal.',
    'continue': 'Continuar',
    'back': 'Atrás',
    'getStarted': 'Comenzar',
    
    // Registration
    'registration.title': 'Crea tu cuenta',
    'registration.subtitle': 'Ingresa tu información personal para comenzar',
    'firstName': 'Nombre',
    'lastName': 'Apellido',
    'email': 'Correo electrónico',
    'phone': 'Número de teléfono',
    'dateOfBirth': 'Fecha de nacimiento',
    'country': 'País',
    'password': 'Contraseña',
    'confirmPassword': 'Confirmar contraseña',
    
    // Security Features
    'security.bankGrade': 'Seguridad de Grado Bancario',
    'security.bankGradeDesc': 'El cifrado de 256 bits protege tus datos',
    'security.biometric': 'Verificación Biométrica',
    'security.biometricDesc': 'Tecnología avanzada de reconocimiento facial',
    'security.privacy': 'Privacidad Primero',
    'security.privacyDesc': 'Tus datos nunca salen de servidores seguros',
    
    // Settings
    'settings.title': 'Configuración y Soporte',
    'settings.subtitle': 'Administra las preferencias de tu cuenta y obtén ayuda',
    'settings.general': 'General',
    'settings.security': 'Seguridad',
    'settings.auditLogs': 'Registros de Auditoría',
    'settings.support': 'Soporte',
    'settings.language': 'Idioma y Región',
    'settings.displayLanguage': 'Idioma de Visualización',
    'settings.notifications': 'Notificaciones',
    'settings.deleteAccount': 'Eliminar Cuenta',
    'settings.deleteAccountDesc': 'Eliminar permanentemente tu cuenta y datos',
    'delete': 'Eliminar',
  },
  fr: {
    // Onboarding
    'welcome.title': 'Bienvenue dans Age Verification App',
    'welcome.subtitle': 'Votre plateforme de vérification d\'identité numérique',
    'welcome.description': 'Découvrez une vérification d\'âge rapide, sécurisée et conforme alimentée par une technologie IA de pointe.',
    'language.title': 'Choisissez votre langue',
    'language.subtitle': 'Sélectionnez votre langue préférée',
    'language.description': 'Age Verification App prend en charge plusieurs langues pour servir les utilisateurs du monde entier.',
    'security.title': 'Sécurité et Confidentialité',
    'security.subtitle': 'Votre sécurité est notre priorité',
    'security.description': 'Découvrez notre engagement à protéger vos informations personnelles.',
    'continue': 'Continuer',
    'back': 'Retour',
    'getStarted': 'Commencer',
    
    // Registration
    'registration.title': 'Créez votre compte',
    'registration.subtitle': 'Entrez vos informations personnelles pour commencer',
    'firstName': 'Prénom',
    'lastName': 'Nom de famille',
    'email': 'Adresse e-mail',
    'phone': 'Numéro de téléphone',
    'dateOfBirth': 'Date de naissance',
    'country': 'Pays',
    'password': 'Mot de passe',
    'confirmPassword': 'Confirmer le mot de passe',
    
    // Security Features
    'security.bankGrade': 'Sécurité de Niveau Bancaire',
    'security.bankGradeDesc': 'Le cryptage 256 bits protège vos données',
    'security.biometric': 'Vérification Biométrique',
    'security.biometricDesc': 'Technologie avancée de reconnaissance faciale',
    'security.privacy': 'Confidentialité d\'abord',
    'security.privacyDesc': 'Vos données ne quittent jamais les serveurs sécurisés',
    
    // Settings
    'settings.title': 'Paramètres et Support',
    'settings.subtitle': 'Gérez les préférences de votre compte et obtenez de l\'aide',
    'settings.general': 'Général',
    'settings.security': 'Sécurité',
    'settings.auditLogs': 'Journaux d\'Audit',
    'settings.support': 'Support',
    'settings.language': 'Langue et Région',
    'settings.displayLanguage': 'Langue d\'Affichage',
    'settings.notifications': 'Notifications',
    'settings.deleteAccount': 'Supprimer le Compte',
    'settings.deleteAccountDesc': 'Supprimer définitivement votre compte et vos données',
    'delete': 'Supprimer',
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}