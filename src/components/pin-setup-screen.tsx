import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Shield, Eye, EyeOff, Lock, CheckCircle } from "lucide-react";

interface PinSetupScreenProps {
  onNext: (pin: string) => void;
  onBack: () => void;
}

export function PinSetupScreen({ onNext, onBack }: PinSetupScreenProps) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validatePin = (value: string) => {
    if (value.length !== 6) return "PIN must be exactly 6 digits";
    if (!/^\d+$/.test(value)) return "PIN must contain only numbers";
    return "";
  };

  const handlePinChange = (value: string) => {
    if (value.length <= 6) {
      setPin(value);
      const error = validatePin(value);
      setError(error);
      setIsValid(!error && value === confirmPin && confirmPin.length === 6);
    }
  };

  const handleConfirmPinChange = (value: string) => {
    if (value.length <= 6) {
      setConfirmPin(value);
      if (value !== pin && value.length > 0) {
        setError("PINs do not match");
        setIsValid(false);
      } else if (value === pin && value.length === 6 && !validatePin(pin)) {
        setError("");
        setIsValid(true);
      }
    }
  };

  const handleSubmit = () => {
    if (isValid) {
      onNext(pin);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="p-8 backdrop-blur-sm bg-slate-800/90 border-slate-700/50 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--deep-indigo)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[var(--deep-indigo)]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Set Security PIN</h1>
            <p className="text-slate-300 text-base leading-relaxed">Create a secure PIN to protect your digital ID</p>
          </div>

          <div className="space-y-6">
            {/* Security Features */}
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="w-5 h-5 text-[var(--mint)]" />
                <span className="text-sm text-white">Security Features</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• 6 digit numeric PIN</li>
                <li>• Encrypted local storage</li>
                <li>• Required for ID access</li>
                <li>• Can be changed anytime</li>
              </ul>
            </div>

            {/* PIN Input */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin" className="text-white">Security PIN</Label>
                <div className="relative">
                  <Input
                    id="pin"
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => handlePinChange(e.target.value)}
                  placeholder="Enter 6 digit PIN"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                  maxLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-white"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPin" className="text-white">Confirm PIN</Label>
                <div className="relative">
                  <Input
                    id="confirmPin"
                    type={showConfirmPin ? "text" : "password"}
                    value={confirmPin}
                    onChange={(e) => handleConfirmPinChange(e.target.value)}
                    placeholder="Confirm your PIN"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                    maxLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-white"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                  >
                    {showConfirmPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Validation */}
            {error && (
              <Alert className="bg-red-900/50 border-red-700 text-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isValid && (
              <Alert className="bg-green-900/50 border-green-700 text-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>PIN is valid and secure</AlertDescription>
              </Alert>
            )}

            {/* PIN Strength Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">PIN Progress</span>
                <span className={`${pin.length === 6 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {pin.length}/6 digits
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    pin.length === 6 ? 'bg-green-500 w-full' : 
                    'bg-yellow-500'
                  }`}
                  style={{ width: `${(pin.length / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-slate-400 hover:text-white"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isValid}
                className="bg-[var(--deep-indigo)] hover:bg-[var(--deep-indigo-light)] text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Set PIN & Continue
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}