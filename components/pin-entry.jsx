"use client";

import { useState } from "react";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function PinEntry({ 
  username, 
  isNewPin = false, 
  onPinSubmit, 
  onCancel,
  error = null
}) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isPinComplete, setIsPinComplete] = useState(false);
  const [isConfirmPinComplete, setIsConfirmPinComplete] = useState(false);
  const [pinMismatch, setPinMismatch] = useState(false);

  const handlePinChange = (value) => {
    setPin(value);
    setIsPinComplete(value.length === 4);
    setPinMismatch(false);
  };

  const handleConfirmPinChange = (value) => {
    setConfirmPin(value);
    setIsConfirmPinComplete(value.length === 4);
    setPinMismatch(false);
  };

  const handleSubmit = () => {
    if (isNewPin) {
      if (pin !== confirmPin) {
        setPinMismatch(true);
        return;
      }
    }
    onPinSubmit(pin);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isNewPin ? "Create PIN" : "Enter PIN"}
        </CardTitle>
        <CardDescription>
          {isNewPin 
            ? `Set a 4-digit PIN to secure your username "${username}"`
            : `Enter the PIN for username "${username}"`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <div className="text-sm font-medium mb-2">
            {isNewPin ? "Create a 4-digit PIN" : "Enter your 4-digit PIN"}
          </div>
          <div className="flex justify-center">
            <InputOTP 
              maxLength={4} 
              value={pin}
              onChange={handlePinChange}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
        </div>
        
        {isNewPin && (
          <div className="space-y-2 mt-4">
            <div className="text-sm font-medium mb-2">Confirm your PIN</div>
            <div className="flex justify-center">
              <InputOTP 
                maxLength={4} 
                value={confirmPin}
                onChange={handleConfirmPinChange}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            {pinMismatch && (
              <p className="text-sm text-red-500 text-center mt-2">
                PINs don&apos;t match. Please try again.
              </p>
            )}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          {isNewPin 
            ? "This PIN will be required when you use this username again."
            : "Forgot your PIN? You'll need to use a different username."}
        </p>
        
        <div className="text-xs text-muted-foreground text-center mt-2 p-2 bg-muted rounded-md">
          <p className="font-medium mb-1">Security Note:</p>
          <p>Your PIN is only stored securely on the server. For your protection, we never store your PIN in your browser.</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isNewPin ? (!isPinComplete || !isConfirmPinComplete) : !isPinComplete}
        >
          {isNewPin ? "Create PIN" : "Submit"}
        </Button>
      </CardFooter>
    </Card>
  );
} 