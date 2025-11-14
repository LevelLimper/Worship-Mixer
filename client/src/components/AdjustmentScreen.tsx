import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdjustmentScreen() {
  const [adjustment, setAdjustment] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const type = sessionStorage.getItem("selectedType") || "";
    const name = sessionStorage.getItem("selectedName") || "";
    
    if (!type || !name) {
      setLocation("/request");
      return;
    }
    
    setSelectedType(type);
    setSelectedName(name);
  }, [setLocation]);

  const sendRequestMutation = useMutation({
    mutationFn: async (data: {
      requesterName: string;
      itemType: string;
      itemName: string;
      adjustment: number;
    }) => {
      const res = await apiRequest("POST", "/api/mix-requests", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Request sent!",
        description: `${adjustment > 0 ? '+' : ''}${adjustment} for ${selectedName}`,
      });
      setTimeout(() => {
        setLocation("/request");
      }, 500);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      });
      console.error("Error sending request:", error);
    },
  });

  const handleBack = () => {
    setLocation("/request");
  };

  const handleSend = () => {
    if (adjustment === 0) {
      toast({
        title: "No adjustment",
        description: "Please select +1 or -1 to make an adjustment",
        variant: "destructive",
      });
      return;
    }

    const requesterName = sessionStorage.getItem("requesterName");
    
    if (!requesterName) {
      toast({
        title: "Error",
        description: "Please enter your name first",
        variant: "destructive",
      });
      setLocation("/");
      return;
    }

    sendRequestMutation.mutate({
      requesterName,
      itemType: selectedType,
      itemName: selectedName,
      adjustment,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 bg-background border-b border-border">
        <div className="flex items-center px-4 py-3">
          <Button
            data-testid="button-back"
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-6">
        <div className="w-full max-w-md space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">{selectedName}</h1>
            <div 
              data-testid="text-adjustment-value"
              className="text-6xl font-bold text-primary"
            >
              {adjustment > 0 ? '+' : ''}{adjustment}
            </div>
          </div>

          <div className="flex items-center justify-center gap-8">
            <Button
              data-testid="button-decrease"
              onClick={() => setAdjustment(adjustment - 1)}
              size="icon"
              variant="outline"
              className="h-28 w-28 rounded-full border-2"
            >
              <Minus className="h-12 w-12" />
            </Button>
            <Button
              data-testid="button-increase"
              onClick={() => setAdjustment(adjustment + 1)}
              size="icon"
              className="h-28 w-28 rounded-full"
            >
              <Plus className="h-12 w-12" />
            </Button>
          </div>

          <Button
            data-testid="button-send"
            onClick={handleSend}
            disabled={sendRequestMutation.isPending}
            className="h-14 w-full text-lg font-semibold"
          >
            <Send className="h-5 w-5 mr-2" />
            {sendRequestMutation.isPending ? "Sending..." : "Send Request"}
          </Button>
        </div>
      </div>
    </div>
  );
}
