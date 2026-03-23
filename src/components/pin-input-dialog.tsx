import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

interface PinInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pin: string) => void;
  title: string;
  description: string;
}

export function PinInputDialog({ isOpen, onClose, onConfirm, title, description }: PinInputDialogProps) {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");

  const handlePinChange = (value: string) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setPin(value);
      setError("");
    }
  };

  const handleSubmit = () => {
    if (pin.length !== 6) {
      setError("Please enter a 6-digit PIN");
      return;
    }
    onConfirm(pin);
    setPin("");
    setError("");
  };

  const handleClose = () => {
    setPin("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm w-full mx-4">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center space-x-2 text-lg">
            <Lock className="w-4 h-4 text-[var(--deep-indigo)]" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="pin" className="text-sm">Enter your 6-digit PIN</Label>
            <div className="relative">
              <Input
                id="pin"
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                placeholder="000000"
                className="text-center text-lg tracking-widest h-10"
                maxLength={6}
                autoComplete="off"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-2 py-2 hover:bg-transparent"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {error && (
              <Alert className="bg-red-900/50 border-red-700 text-red-200 py-2">
                <AlertCircle className="h-3 w-3" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={handleClose} size="sm">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={pin.length !== 6}
              size="sm"
              className="bg-[var(--deep-indigo)] hover:bg-[var(--deep-indigo-light)] text-white"
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
