import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";

const PanCardDetails = ({ data, incrStep }) => {
  return (
    <Card className="max-w-lg mx-auto p-8">
      <CardHeader>
        <CardTitle>PAN Verification Successful</CardTitle>
        <CardDescription>Details of the PAN card holder</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="mb-2" />
        <div className="space-y-1">
          <div className="flex items-center">
            <p
              variant="body1"
              className="text-sm text-zinc-500 dark:text-zinc-400 w-48"
            >
              Full Name:
            </p>
            <p
              variant="body1"
              className="font-semibold leading-none tracking-tight"
            >
              {data.full_name}
            </p>
          </div>
          <div className="flex items-center">
            <p
              variant="body1"
              className="text-sm text-zinc-500 dark:text-zinc-400 w-48"
            >
              Category:
            </p>
            <p
              variant="body1"
              className="font-semibold leading-none tracking-tight"
            >
              {data.category}
            </p>
          </div>
          <div className="flex items-center">
            <p
              variant="body1"
              className="text-sm text-zinc-500 dark:text-zinc-400 w-48"
            >
              Aadhaar Seeding Status:
            </p>
            <p
              variant="body1"
              className="font-semibold leading-none tracking-tight"
            >
              {data.aadhaar_seeding_status}
            </p>
          </div>
        </div>
        <Separator className="mt-2" />
      </CardContent>
      <CardFooter className="flex justify-center">
        <p variant="body2" className="text-sm text-zinc-500">
          All details are provided SETU
        </p>
      </CardFooter>
      <div className="flex flex-col space-y-2.5">
        <Button onClick={incrStep}>Fetch Bank Information</Button>
      </div>
    </Card>
  );
};

export default PanCardDetails;
