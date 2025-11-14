import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Headphones } from "lucide-react";

export default function NameEntry() {
  const [name, setName] = useState("");
  const [, setLocation] = useLocation();

  const handleContinue = () => {
    if (name.trim().length >= 2) {
      sessionStorage.setItem("requesterName", name.trim());
      setLocation("/request");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Music className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Worship Mixer</h1>
          <p className="text-base text-muted-foreground">
            Enter your name to submit mix requests
          </p>
        </div>

        <div className="space-y-4">
          <Input
            data-testid="input-name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleContinue()}
            className="h-14 text-lg"
            autoFocus
          />
          <Button
            data-testid="button-continue"
            onClick={handleContinue}
            disabled={name.trim().length < 2}
            className="h-14 w-full text-lg font-semibold"
          >
            Continue
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Sound Engineer
              </span>
            </div>
          </div>
          
          <Button
            data-testid="button-mixer-view"
            onClick={() => setLocation("/mixer")}
            variant="outline"
            className="h-14 w-full text-lg font-semibold"
          >
            <Headphones className="h-5 w-5 mr-2" />
            View Mixer
          </Button>
        </div>
      </div>
    </div>
  );
}
