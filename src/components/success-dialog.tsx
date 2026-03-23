import React from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { CheckCircle } from "lucide-react";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export function SuccessDialog({ isOpen, onClose, title, description }: SuccessDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm w-full mx-4">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center space-x-2 text-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center pt-2">
          <Button 
            onClick={onClose}
            size="sm"
            className="bg-[var(--deep-indigo)] hover:bg-[var(--deep-indigo-light)] text-white"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
