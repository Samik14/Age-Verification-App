import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { UserPlus, Mail, Phone, Calendar, MapPin, Shield, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

interface RegistrationScreenProps {
  onNext: (userData: UserData) => void;
  onBack: () => void;
  userData: UserData;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  country: string;
  password: string;
  confirmPassword: string;
}

const countries = [
  { name: "United States", code: "+1", flag: "🇺🇸", key: "US" },
  { name: "Canada", code: "+1", flag: "🇨🇦", key: "CA" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", key: "UK" },
  { name: "Germany", code: "+49", flag: "🇩🇪", key: "DE" },
  { name: "France", code: "+33", flag: "🇫🇷", key: "FR" },
  { name: "Spain", code: "+34", flag: "🇪🇸", key: "ES" },
  { name: "Italy", code: "+39", flag: "🇮🇹", key: "IT" },
  { name: "Australia", code: "+61", flag: "🇦🇺", key: "AU" },
  { name: "Japan", code: "+81", flag: "🇯🇵", key: "JP" },
  { name: "South Korea", code: "+82", flag: "🇰🇷", key: "KR" }
];

const passwordRequirements = [
  { id: "length", text: "At least 8 characters", regex: /.{8,}/ },
  { id: "uppercase", text: "One uppercase letter", regex: /[A-Z]/ },
  { id: "lowercase", text: "One lowercase letter", regex: /[a-z]/ },
  { id: "number", text: "One number", regex: /\d/ },
  { id: "special", text: "One special character", regex: /[!@#$%^&*]/ },
];

export function RegistrationScreen({ onNext, onBack, userData }: RegistrationScreenProps) {
  const calculateAge = (isoDate: string) => {
    if (!isoDate) return 0;
    const birthDate = new Date(isoDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const [formData, setFormData] = useState<FormData>({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    phone: userData.phone || "",
    dateOfBirth: userData.dateOfBirth || "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedPhoneCode, setSelectedPhoneCode] = useState("");
  const [selectedPhoneCodeKey, setSelectedPhoneCodeKey] = useState("");

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
      case "dateOfBirth": {
        if (value.trim() === "") {
          newErrors.dateOfBirth = "This field is required";
        } else {
          const age = calculateAge(value);
          if (age < 16) {
            newErrors.dateOfBirth = "You must be at least 16 years old";
          } else {
            delete newErrors.dateOfBirth;
          }
        }
        break;
      }
      case "phone":
        if (value && !/^\+?[\d\s\-\(\)]{10,}$/.test(value)) {
          newErrors.phone = "Please enter a valid phone number";
        } else {
          delete newErrors.phone;
        }
        break;
      case "confirmPassword":
        if (value && value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      default:
        if (value.trim() === "" && name !== "confirmPassword") {
          newErrors[name as keyof FormData] = "This field is required";
        } else {
          delete newErrors[name as keyof FormData];
        }
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName);
  };

  const handlePhoneCodeChange = (key: string) => {
    const country = countries.find(c => c.key === key);
    setSelectedPhoneCode(country ? country.code : "");
    setSelectedPhoneCodeKey(key);
  };

  const getPasswordStrength = () => {
    const metRequirements = passwordRequirements.filter(req => req.regex.test(formData.password)).length;
    return (metRequirements / passwordRequirements.length) * 100;
  };

  const getFormProgress = () => {
    // Count only the required form fields (excluding country since we have separate dropdowns)
    const requiredFormFields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'password', 'confirmPassword'];
    const filledFormFields = requiredFormFields.filter(field => formData[field as keyof typeof formData].trim() !== "").length;
    const additionalFields = [selectedCountry, selectedPhoneCodeKey];
    const filledAdditionalFields = additionalFields.filter(field => field.trim() !== "").length;
    const totalFields = requiredFormFields.length + additionalFields.length;
    const totalFilledFields = filledFormFields + filledAdditionalFields;
    return (totalFilledFields / totalFields) * 100;
  };

  const isFormValid = () => {
    // Check all formData fields except country (since we have separate dropdowns now)
    const requiredFormFields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'password', 'confirmPassword'];
    const hasAllFormFields = requiredFormFields.every(field => formData[field as keyof typeof formData].trim() !== "");
    const hasNoErrors = Object.keys(errors).length === 0;
    const passwordsMatch = formData.password === formData.confirmPassword;
    const passwordStrong = getPasswordStrength() === 100;
    const ageOk = calculateAge(formData.dateOfBirth) >= 16;
    const countrySelected = selectedCountry !== "";
    const phoneCodeSelected = selectedPhoneCodeKey !== "";
    
    return hasAllFormFields && hasNoErrors && passwordsMatch && passwordStrong && ageOk && countrySelected && phoneCodeSelected;
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
              <UserPlus className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-3">Create Your Account</h1>
            <p className="text-slate-300 text-base leading-relaxed">Join Age Verification App for fast and secure verification</p>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-400">Profile Completion</span>
              <span className="text-sm">{Math.round(getFormProgress())}%</span>
            </div>
            <Progress value={getFormProgress()} className="h-2" />
          </div>

          {/* Security Notice */}
          <Alert className="mb-6 border-[var(--mint)]/20 bg-[var(--mint)]/5">
            <Shield className="h-4 w-4 text-[var(--mint-dark)]" />
            <AlertDescription className="text-[var(--mint-dark)]">
              Your information is encrypted and stored securely using bank-grade security.
            </AlertDescription>
          </Alert>

          <form className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  onFocus={() => setFocusedField("firstName")}
                  onBlur={() => setFocusedField(null)}
                  className={`mt-1 ${errors.firstName ? "border-red-500" : ""} ${
                    focusedField === "firstName" ? "ring-2 ring-[var(--deep-indigo)]/20" : ""
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  onFocus={() => setFocusedField("lastName")}
                  onBlur={() => setFocusedField(null)}
                  className={`mt-1 ${errors.lastName ? "border-red-500" : ""} ${
                    focusedField === "lastName" ? "ring-2 ring-[var(--deep-indigo)]/20" : ""
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                )}
              </motion.div>
            </div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--grey)]" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className={`pl-10 mt-1 ${errors.email ? "border-red-500" : ""} ${
                    focusedField === "email" ? "ring-2 ring-[var(--deep-indigo)]/20" : ""
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex space-x-2">
                <div className="w-28">
                  <Select value={selectedPhoneCodeKey} onValueChange={handlePhoneCodeChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Code">
                        {selectedPhoneCodeKey && (
                          <div className="flex items-center space-x-2">
                            <span>{countries.find(c => c.key === selectedPhoneCodeKey)?.flag}</span>
                            <span>{selectedPhoneCode}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.key} value={country.key}>
                          <div className="flex items-center space-x-2">
                            <span>{country.flag}</span>
                            <span>{country.code}</span>
                            <span className="text-slate-400 text-sm">({country.name})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--grey)]" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField(null)}
                    className={`pl-10 mt-1 ${errors.phone ? "border-red-500" : ""} ${
                      focusedField === "phone" ? "ring-2 ring-[var(--deep-indigo)]/20" : ""
                    }`}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
              )}
            </motion.div>

            {/* Date of Birth & Country */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--grey)]" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    onFocus={() => setFocusedField("dateOfBirth")}
                    onBlur={() => setFocusedField(null)}
                    className={`pl-10 mt-1 ${errors.dateOfBirth ? "border-red-500" : ""} ${
                      focusedField === "dateOfBirth" ? "ring-2 ring-[var(--deep-indigo)]/20" : ""
                    }`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Label htmlFor="country">Country</Label>
                <Select value={selectedCountry} onValueChange={handleCountryChange}>
                  <SelectTrigger className={`mt-1 ${errors.country ? "border-red-500" : ""}`}>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-[var(--grey)]" />
                      <SelectValue placeholder="Select country" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.name} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-xs text-red-500 mt-1">{errors.country}</p>
                )}
              </motion.div>
            </div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className={`mt-1 pr-10 ${
                    focusedField === "password" ? "ring-2 ring-[var(--deep-indigo)]/20" : ""
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--grey)] hover:text-[var(--deep-indigo)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[var(--grey)]">Password Strength</span>
                    <span className="text-xs">{Math.round(getPasswordStrength())}%</span>
                  </div>
                  <Progress value={getPasswordStrength()} className="h-1" />
                  
                  <div className="grid grid-cols-1 gap-1">
                    {passwordRequirements.map((req) => (
                      <div key={req.id} className="flex items-center space-x-2">
                        {req.regex.test(formData.password) ? (
                          <CheckCircle className="w-3 h-3 text-[var(--mint)]" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-[var(--grey)]" />
                        )}
                        <span className={`text-xs ${
                          req.regex.test(formData.password) ? "text-[var(--mint-dark)]" : "text-[var(--grey)]"
                        }`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  className={`mt-1 pr-10 ${errors.confirmPassword ? "border-red-500" : ""} ${
                    focusedField === "confirmPassword" ? "ring-2 ring-[var(--deep-indigo)]/20" : ""
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--grey)] hover:text-[var(--deep-indigo)]"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </motion.div>
          </form>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-slate-400 hover:text-white"
            >
              Back
            </Button>
            <Button
              onClick={() => onNext({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: selectedPhoneCode + formData.phone,
                dateOfBirth: formData.dateOfBirth
              })}
              disabled={!isFormValid()}
              className="bg-[var(--deep-indigo)] hover:bg-[var(--deep-indigo-light)] text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}