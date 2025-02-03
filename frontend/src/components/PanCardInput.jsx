import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TypographyH4 } from "@/components/customs/typography";
import { useToast } from "@/hooks/use-toast";
import ApiService from "@/utils/apiService";

const apiService = new ApiService();

const PanCardInput = ({ setPancardData, incrStep }) => {
  const [panCardNumber, setPanCardNumber] = useState("");
  const [isLoadingPanCard, setIsLoadingPanCard] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [erroMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const handleConsent = async (consent) => {
    setIsDialogOpen(false);
    if (consent.toLowerCase() === "n") {
      setErrorMessage("Consent is required for verification.");
      toast({
        title: "Consent is required for verification.",
      });
      return;
    }

    setIsLoadingPanCard(true);
    try {
      const resp = await apiService.verifyPanCard({
        pan: panCardNumber,
        consent: "Y",
        reason: "To verify if the user is a valid user",
      });

      if (resp && resp.verification.toLowerCase() === "failed") {
        setErrorMessage(resp.message);
        toast({
          title: "Verification Failed",
          description: resp.message,
        });
        return;
      }

      if (resp.data) {
        setPancardData(resp.data);
        incrStep();
      }
    } catch (error) {
      console.log("error", error);
      setErrorMessage(error.errorMessage);
      toast({
        title: "Error",
        description: error.errorMessage,
      });
    } finally {
      setIsLoadingPanCard(false);
    }
  };

  const handlePancardSubmit = async () => {
    if (!panCardNumber) {
      setErrorMessage("Card number is required.");
      toast({
        description: "Card number is required.",
      });
      return;
    }
    setErrorMessage("");
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col space-y-2.5">
      <Label htmlFor="panCardNumber">Enter Pan Card Details</Label>
      <Input
        placeholder="Enter Card Number"
        value={panCardNumber}
        onChange={(e) => setPanCardNumber(e.target.value)}
      />
      {erroMessage && (
        <TypographyH4 text={erroMessage} className="text-rose-600" />
      )}
      <Button onClick={handlePancardSubmit}>
        {isLoadingPanCard ? <Loader2 className="animate-spin" /> : "Next"}
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Consent Required</DialogTitle>
          </DialogHeader>
          <div>
            By submitting your PAN card number, you consent to the processing of
            your personal data for verification purposes.
          </div>
          <div>Please indicate your consent by selecting "Yes" or "No."</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleConsent("N")}>
              No
            </Button>
            <Button onClick={() => handleConsent("Y")}>Yes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PanCardInput;
