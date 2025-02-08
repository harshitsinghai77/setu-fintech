import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ApiService from "@/utils/apiService";

const apiService = new ApiService();

const failedStatuses = [
  "BAV_REVERSE_PENNY_DROP_EXPIRED",
  "BAV_REVERSE_PENNY_DROP_PAYMENT_FAILED",
  "BAV_REVERSE_PENNY_DROP_ERROR",
  "BAV_REVERSE_PENNY_DROP_FAILED",
];

const BankAccountVerification = ({ incrStep, setBankAccount }) => {
  const [status, setStatus] = useState();
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [requestId, setRequestId] = useState();
  const { toast } = useToast();

  let countdownInterval, pollInterval;

  const handleMakePayment = async () => {
    setIsPaymentLoading(true);
    setStatus("");
    setTimeLeft(60);

    try {
      const resp = await apiService.createReversePennyDrop();

      if (
        resp &&
        resp.status.toUpperCase() === "BAV_REVERSE_PENNY_DROP_CREATED"
      ) {
        setRequestId(resp.id);
        window.open(resp.shortUrl, "_blank");
        startCountdown();
        await pollPaymentStatus(4, resp.id);
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Some error occurred, please try again.",
        });
        setIsPaymentLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      toast({
        title: "Uh oh! Something went wrong.",
        description:
          error.errorMessage || "Some error occurred, please try again.",
      });
      setIsPaymentLoading(false);
    }
  };

  const startCountdown = () => {
    countdownInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getPaymentStatus = async (_id) => {
    try {
      if (!_id) return;
      const response = await apiService.getPaymentStatusCache(_id);
      return response;
    } catch (error) {
      console.log("Error fetching payment status", error);
      return null;
    }
  };

  const pollPaymentStatus = async (maxAttempts, _id) => {
    let attempts = 1;
    pollInterval = setInterval(async () => {
      if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        clearInterval(countdownInterval);
        setStatus("TIMEOUT: No payment detected within 60 seconds.");
        setIsPaymentLoading(false);
        return;
      }

      try {
        const response = await getPaymentStatus(_id);
        if (
          response &&
          response.status?.toUpperCase() === "SUCCESS" &&
          response.bankDetails
        ) {
          clearInterval(pollInterval);
          clearInterval(countdownInterval);
          setBankAccount(response.bankDetails);
          incrStep();
          setIsPaymentLoading(false);
          toast({
            title: "Bank Account Verified Successfully! 🎉",
            description: response.event,
          });
          return;
        }

        if (
          response &&
          response.status?.toUpperCase() === "FAILED" &&
          failedStatuses.includes(response?.failure_code)
        ) {
          clearInterval(pollInterval);
          clearInterval(countdownInterval);
          setIsPaymentLoading(false);
          setStatus("Payment Failed - Please Try Again");
          toast({
            title: "Uh oh! Something went wrong.",
            description: `${response.failure_code} - ${response.failure_reason}`,
          });
        }
      } catch (error) {
        console.log("Error fetching payment status", error);
        setStatus("Error fetching payment status");
        clearInterval(pollInterval);
        clearInterval(countdownInterval);
        setIsPaymentLoading(false);
        return;
      }

      attempts++;
    }, 15000); // Poll every 15 seconds
  };

  useEffect(() => {
    return () => {
      clearInterval(countdownInterval);
      clearInterval(pollInterval);
    };
  }, []);

  return (
    <Card className="max-w-lg mx-auto sm:p-8">
      <CardHeader>
        <CardTitle>Bank Information Verification</CardTitle>
        <CardDescription>
          We need to verify your bank account by making a ₹1 payment through
          UPI. Please follow the instructions below:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ul className="text-left list-disc pl-5 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <li>
              Make a ₹1 payment to a unique UPI ID associated with your account.
            </li>
            <li>
              Our app will extract your bank account details from the
              transaction.
            </li>
            <li>The ₹1 payment will be refunded within 48 hours.</li>
          </ul>
          <p className="text-left text-sm text-zinc-500 dark:text-zinc-400 mt-4">
            Please click the button below to initiate the payment process. A new
            tab will open where you can complete the payment.
          </p>
        </div>
        {isPaymentLoading && (
          <div className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
            <p>Please complete the ₹1 payment in the new tab.</p>
          </div>
        )}
      </CardContent>
      {status && <p className="mb-4 text-lg text-rose-400">{status}</p>}
      <CardFooter className="flex justify-center">
        <Button onClick={handleMakePayment} disabled={isPaymentLoading}>
          {isPaymentLoading ? (
            <>
              <Loader2 className="animate-spin" /> Waiting for Payment
              Confirmation{" "}
            </>
          ) : (
            "Make ₹1 Payment"
          )}
        </Button>
      </CardFooter>
      {isPaymentLoading && requestId && (
        <Button
          variant="link"
          onClick={() => window.open(`/mock-payment/${requestId}`, "_blank")}
          className="text-blue-600"
        >
          Mock Payment
        </Button>
      )}
      {isPaymentLoading && (
        <div className="m-4 sm:m-0 sm:mt-4 text-center">
          <p>Waiting for payment confirmation...</p>
          <p>
            We'll check for payment confirmation for up to {timeLeft} seconds.
          </p>
        </div>
      )}
    </Card>
  );
};

export default BankAccountVerification;
