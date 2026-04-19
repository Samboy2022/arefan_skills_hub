"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Smartphone, Download, CheckCircle2 } from "lucide-react";

export function TwoFactorModal({ open, onOpenChange, onEnable }: { open: boolean, onOpenChange: (open: boolean) => void, onEnable: () => void }) {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const MOCK_BACKUPS = [
    "A7R9-X2M4", "Q3P1-K8L5", "B6W2-Z9N7", "C4J8-Y1T6",
    "F5H3-V2G9", "E8D7-U4C3", "R2B6-M9A1", "W1Z5-N7Q4"
  ];

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3); // Go to backup codes
    }, 800);
  };

  const finishSetup = () => {
    onEnable();
    onOpenChange(false);
    setTimeout(() => setStep(1), 500); // reset after close
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            Add an extra layer of security to your account.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-2 mb-6 mt-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors ${
              step === i ? "bg-primary text-primary-foreground" : 
              step > i ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            }`}>
              {i}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 text-center animate-in slide-in-from-right-4 duration-300">
            <div className="bg-muted/30 p-6 rounded-xl inline-block mx-auto border border-border">
              <QrCode className="h-32 w-32 text-foreground" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Scan the QR Code</h4>
              <p className="text-sm text-muted-foreground">
                Use an authenticator app like Google Authenticator or Authy to scan this QR code.
              </p>
            </div>
            <div className="p-3 bg-muted rounded-md text-xs font-mono select-all">
              JBSWY3DPEHPK3PXP
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="button" onClick={() => setStep(2)}>Next Step</Button>
            </DialogFooter>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center animate-in slide-in-from-right-4 duration-300">
             <div className="mx-auto bg-blue-50 h-16 w-16 rounded-full flex items-center justify-center border border-blue-100 mb-2">
               <Smartphone className="h-8 w-8 text-blue-600" />
             </div>
             <div>
               <h4 className="font-semibold mb-2">Verify OTP</h4>
               <p className="text-sm text-muted-foreground mb-4">
                 Enter the 6-digit code from your authenticator app to confirm setup.
               </p>
               <Input 
                 type="text" 
                 placeholder="000000" 
                 maxLength={6} 
                 className="text-center tracking-[0.5em] text-2xl h-14 font-mono w-48 mx-auto"
                 value={otp}
                 onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
               />
             </div>
             <DialogFooter className="mt-4">
               <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
               <Button type="button" onClick={handleVerify} disabled={otp.length !== 6 || isVerifying}>
                 {isVerifying ? "Verifying..." : "Verify Code"}
               </Button>
             </DialogFooter>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center animate-in slide-in-from-right-4 duration-300">
             <div className="mx-auto bg-emerald-50 h-16 w-16 rounded-full flex items-center justify-center border border-emerald-100 mb-2">
               <CheckCircle2 className="h-8 w-8 text-emerald-600" />
             </div>
             <div>
               <h4 className="font-semibold mb-2 text-emerald-700">2FA Verified!</h4>
               <p className="text-sm text-muted-foreground mb-4">
                 Save these backup codes in a secure location. Each can only be used once.
               </p>
               <div className="grid grid-cols-2 gap-2 text-left bg-muted/40 p-4 rounded-lg border border-border">
                 {MOCK_BACKUPS.map((code, idx) => (
                   <code key={idx} className="text-xs font-mono bg-background p-1.5 border rounded px-3 text-center">{code}</code>
                 ))}
               </div>
             </div>
             <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2">
               <Button type="button" variant="outline" className="w-full sm:w-auto gap-2">
                 <Download className="h-4 w-4" /> Download Codes
               </Button>
               <Button type="button" onClick={finishSetup} className="w-full sm:w-auto">
                 Complete Setup
               </Button>
             </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
