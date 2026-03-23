import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { SuccessDialog } from "./success-dialog";
import { 
  ArrowLeft,
  Settings,
  Globe,
  Bell,
  Shield,
  MessageCircle,
  FileText,
  Trash2,
  Download,
  Eye,
  Lock,
  Smartphone,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Fingerprint,
  User
} from "lucide-react";
import { motion } from "motion/react";

interface SettingsScreenProps {
  onBack: () => void;
}

interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  platform?: string;
  status: 'success' | 'failed' | 'pending';
  details: string;
}

const auditLogs: AuditLog[] = [
  {
    id: '1',
    action: 'Platform Connection',
    timestamp: '2024-01-15 14:30:22',
    platform: 'Instagram',
    status: 'success',
    details: 'Successfully connected to Instagram for age verification'
  },
  {
    id: '2',
    action: 'PIN Changed',
    timestamp: '2024-01-15 10:15:10',
    status: 'success',
    details: 'Security PIN updated successfully'
  },
  {
    id: '3',
    action: 'Identity Verification',
    timestamp: '2024-01-14 16:45:33',
    status: 'success',
    details: 'Initial identity verification completed'
  },
  {
    id: '4',
    action: 'Failed Login Attempt',
    timestamp: '2024-01-14 09:22:11',
    status: 'failed',
    details: 'Incorrect PIN entered 3 times'
  },
  {
    id: '5',
    action: 'Data Export',
    timestamp: '2024-01-13 11:30:45',
    status: 'success',
    details: 'Personal data exported to encrypted file'
  }
];

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [selectedTab, setSelectedTab] = useState("general");
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState({
    verification: true,
    security: true,
    platform: false,
    marketing: false
  });
  const [privacy, setPrivacy] = useState({
    analytics: true
  });
  const [biometricSettings, setBiometricSettings] = useState({
    faceRecognition: true,
    fingerprint: false
  });
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: ""
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
  ];

  // Contact form handlers
  const handleContactFormChange = (field: string, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendMessage = () => {
    if (contactForm.subject.trim() && contactForm.message.trim()) {
      // Simulate sending message
      console.log("Sending message:", contactForm);
      
      // Show success dialog
      setShowSuccessDialog(true);
      
      // Clear form
      setContactForm({
        subject: "",
        message: ""
      });
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
  };

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat",
      available: true
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      action: "Send Email",
      available: true
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with a specialist",
      action: "Call Now",
      available: false,
      note: "Available 9AM-5PM EST"
    },
    {
      icon: HelpCircle,
      title: "Help Center",
      description: "Browse our knowledge base",
      action: "Visit Help Center",
      available: true
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-[var(--mint)]" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <Clock className="w-4 h-4 text-[var(--grey)]" />;
    }
  };

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
              <h1 className="text-3xl font-bold text-white">Settings & Support</h1>
              <p className="text-slate-300 text-base leading-relaxed">Manage your account preferences and get help</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 backdrop-blur-sm bg-slate-800/90 border-slate-700/50 shadow-xl">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="general" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="audit" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Audit Logs</span>
                </TabsTrigger>
                <TabsTrigger value="support" className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Support</span>
                </TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general" className="space-y-6">
                <div>
                  <h3 className="mb-4 text-white">Language & Region</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="language">Display Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="mt-1">
                          <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-2 text-[var(--grey)]" />
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
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-4 text-white">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm text-white">Verification Updates</h4>
                        <p className="text-xs text-slate-300">Get notified about verification status changes</p>
                      </div>
                      <Switch
                        checked={notifications.verification}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, verification: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm text-white">Security Alerts</h4>
                        <p className="text-xs text-slate-300">Important security notifications</p>
                      </div>
                      <Switch
                        checked={notifications.security}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, security: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm text-white">Platform Connections</h4>
                        <p className="text-xs text-slate-300">Notifications from connected platforms</p>
                      </div>
                      <Switch
                        checked={notifications.platform}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, platform: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm text-white">Marketing & Updates</h4>
                        <p className="text-xs text-slate-300">Product updates and promotional content</p>
                      </div>
                      <Switch
                        checked={notifications.marketing}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, marketing: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-4 text-white">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm text-white">Analytics</h4>
                        <p className="text-xs text-slate-300">Help improve our service with usage analytics</p>
                      </div>
                      <Switch
                        checked={privacy.analytics}
                        onCheckedChange={(checked) => 
                          setPrivacy(prev => ({ ...prev, analytics: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <div>
                  <h3 className="mb-4 text-white">Account Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-600 rounded-lg bg-slate-700/30">
                      <div className="flex items-center space-x-3">
                        <Lock className="w-5 h-5 text-[var(--deep-indigo)]" />
                        <div>
                          <h4 className="text-sm text-white">Security PIN</h4>
                          <p className="text-xs text-slate-300">Last changed 2 days ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
                        Change PIN
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-600 rounded-lg bg-slate-700/30">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-[var(--deep-indigo)]" />
                        <div>
                          <h4 className="text-sm text-white">Two-Factor Authentication</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-[var(--mint)]/10 text-[var(--mint-dark)] border-[var(--mint)]/20">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Enabled
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
                        Manage
                      </Button>
                    </div>

                    {/* Face Recognition */}
                    <div className="flex items-center justify-between p-4 border border-slate-600 rounded-lg bg-slate-700/30">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-[var(--deep-indigo)]" />
                        <div>
                          <h4 className="text-sm text-white">Face Recognition</h4>
                          <p className="text-xs text-slate-300">
                            {biometricSettings.faceRecognition ? "Facial template stored" : "Not enabled"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={biometricSettings.faceRecognition}
                          onCheckedChange={(checked) => 
                            setBiometricSettings(prev => ({ ...prev, faceRecognition: checked }))
                          }
                        />
                        <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
                          {biometricSettings.faceRecognition ? "Reset" : "Setup"}
                        </Button>
                      </div>
                    </div>

                    {/* Fingerprint Recognition */}
                    <div className="flex items-center justify-between p-4 border border-slate-600 rounded-lg bg-slate-700/30">
                      <div className="flex items-center space-x-3">
                        <Fingerprint className="w-5 h-5 text-[var(--deep-indigo)]" />
                        <div>
                          <h4 className="text-sm text-white">Fingerprint Recognition</h4>
                          <p className="text-xs text-slate-300">
                            {biometricSettings.fingerprint ? "Fingerprint template stored" : "Not enabled"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={biometricSettings.fingerprint}
                          onCheckedChange={(checked) => 
                            setBiometricSettings(prev => ({ ...prev, fingerprint: checked }))
                          }
                        />
                        <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
                          {biometricSettings.fingerprint ? "Reset" : "Setup"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-4 text-white">Data Management</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-600 rounded-lg bg-slate-700/30">
                      <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5 text-[var(--deep-indigo)]" />
                        <div>
                          <h4 className="text-sm text-white">Export Personal Data</h4>
                          <p className="text-xs text-slate-300">Download a copy of your data</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
                        Export
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-red-500/30 rounded-lg bg-red-500/20">
                      <div className="flex items-center space-x-3">
                        <Trash2 className="w-5 h-5 text-red-400" />
                        <div>
                          <h4 className="text-sm text-red-300">Delete Account</h4>
                          <p className="text-xs text-red-400">Permanently remove your account and data</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white"
                        onClick={() => {
                          const password = prompt("Please enter your password to confirm account deletion:");
                          if (password) {
                            // Simulate password verification
                            const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
                            if (confirmed) {
                              alert("Account deletion initiated. You will be redirected to the welcome screen.");
                              // In a real app, this would make an API call
                              window.location.reload(); // This will restart the app
                            }
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>

                <Alert className="border-amber-200 bg-amber-50">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Your security settings help protect your digital identity. We recommend keeping all security features enabled.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {/* Audit Logs */}
              <TabsContent value="audit" className="space-y-6">
                <div>
                  <h3 className="mb-4">Verification History</h3>
                  <p className="text-sm text-[var(--grey)] mb-6">
                    A complete record of all verification attempts and security events for transparency and security.
                  </p>
                  
                  <div className="space-y-3">
                    {auditLogs.map((log, index) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start space-x-4 p-4 border border-slate-600 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {getStatusIcon(log.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm">{log.action}</h4>
                            {log.platform && (
                              <Badge variant="secondary" className="text-xs">
                                {log.platform}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-[var(--grey)] mb-1">{log.details}</p>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-[var(--grey)]" />
                            <span className="text-xs text-[var(--grey)]">{log.timestamp}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-center mt-6">
                    <Button variant="outline">
                      Load More Logs
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Support */}
              <TabsContent value="support" className="space-y-6">
                <div>
                  <h3 className="mb-4">Get Help</h3>
                  <p className="text-sm text-[var(--grey)] mb-6">
                    Our support team is here to help with any questions or issues you may have.
                  </p>
                  
                  <div className="grid gap-4">
                    {supportOptions.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 border border-slate-600 rounded-lg bg-slate-700/30 transition-all ${
                          option.available ? 'hover:bg-slate-700/50 cursor-pointer' : 'opacity-60'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            option.available 
                              ? 'bg-[var(--deep-indigo)]/10 text-[var(--deep-indigo)]'
                              : 'bg-slate-100 text-slate-400'
                          }`}>
                            <option.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm mb-1">{option.title}</h4>
                            <p className="text-xs text-[var(--grey)]">{option.description}</p>
                            {option.note && (
                              <p className="text-xs text-amber-600 mt-1">{option.note}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant={option.available ? "default" : "outline"}
                          size="sm"
                          disabled={!option.available}
                          className={option.available ? "bg-[var(--deep-indigo)] hover:bg-[var(--deep-indigo-light)] text-white" : ""}
                        >
                          {option.action}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-4">Quick Contact</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => handleContactFormChange("subject", e.target.value)}
                        placeholder="Brief description of your issue"
                        className="mt-1 border-slate-600 bg-slate-700/30 text-white text-sm placeholder-slate-400 placeholder:text-sm focus:border-[var(--deep-indigo)]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => handleContactFormChange("message", e.target.value)}
                        placeholder="Describe your issue in detail..."
                        className="mt-1 w-full min-h-[100px] px-3 py-2 border border-slate-600 rounded-md bg-slate-700/30 text-white text-sm placeholder-slate-400 placeholder:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--deep-indigo)]/20 focus:border-[var(--deep-indigo)]"
                      />
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!contactForm.subject.trim() || !contactForm.message.trim()}
                      className="w-full bg-[var(--deep-indigo)] hover:bg-[var(--deep-indigo-light)] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>

                <Alert className="border-[var(--mint)]/20 bg-[var(--mint)]/5">
                  <CheckCircle className="h-4 w-4 text-[var(--mint-dark)]" />
                  <AlertDescription className="text-[var(--mint-dark)]">
                    Our average response time is under 2 hours during business hours.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
      
      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={handleSuccessDialogClose}
        title="Message Sent Successfully!"
        description="Thank you for contacting us. We'll get back to you within 2 hours during business hours."
      />
    </div>
  );
}