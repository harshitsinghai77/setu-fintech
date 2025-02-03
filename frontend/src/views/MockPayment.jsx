import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ApiService from "@/utils/apiService";

const apiService = new ApiService();

const MockPayment = () => {
  const { trackId } = useParams();
  const [inputTrackId, setInputTrackId] = useState(trackId || "");
  const [status, setStatus] = useState("successful");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (trackId) {
      setInputTrackId(trackId);
    }
  }, [trackId]);

  const handleMockPayment = async () => {
    setIsLoading(true);
    try {
      const resp = await apiService.mockPayment({
        requestId: inputTrackId,
        paymentStatus: status,
      });
      if (resp.success) {
        toast({
          title: "Successfully Mocked 🎉🎉🎉",
          description: `Successful mocked the payment`,
        });
        return;
      }
      toast({
        title: "Error",
        description: "Some error occured",
      });
    } catch (error) {
      console.error("Error submitting mock payment:", error);
      toast({
        title: "Error",
        description: "Some error occured",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start mt-10">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Mock Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2.5">
              <label
                htmlFor="trackId"
                className="text-lg    text-zinc-800 dark:text-zinc-400"
              >
                Track ID
              </label>
              <Input
                id="trackId"
                placeholder="Enter Track ID"
                value={inputTrackId}
                onChange={(e) => setInputTrackId(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2.5">
              <label
                htmlFor="status"
                className="text-lg text-zinc-800 dark:text-zinc-400"
              >
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="successful">Successful</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleMockPayment} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Mock Payment"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MockPayment;
