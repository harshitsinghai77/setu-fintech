import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import BankAccountDetails from "@/components/BankAccountDetails";
import PanCardDetails from "@/components/PanCardDetails";
import PanCardInput from "@/components/PanCardInput";
import BankAccountVerification from "@/components/BankAccountVerification";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [panCardData, setPancardData] = useState();
  const [bankAccount, setBankAccount] = useState();

  const reset = () => {
    window.location.reload();
  };

  const incrStep = () => {
    setStep((prevStep) => (prevStep += 1));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PanCardInput setPancardData={setPancardData} incrStep={incrStep} />
        );

      case 2:
        return <PanCardDetails data={panCardData} incrStep={incrStep} />;

      case 3:
        return (
          <BankAccountVerification
            setBankAccount={setBankAccount}
            incrStep={incrStep}
          />
        );

      case 4:
        return <BankAccountDetails data={bankAccount} />;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        KYC (Know Your Customer)
      </h2>
      <Card className="w-[550px]">
        <CardHeader>
          <h2 className="text-lg font-semibold">Step {step} of 4</h2>
          <Progress value={(step / 4) * 100} className="mt-2" />
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
        <Button onClick={reset} className="mb-3">
          Reset
        </Button>
      </Card>
    </div>
  );
}
