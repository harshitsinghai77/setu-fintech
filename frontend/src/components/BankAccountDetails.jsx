import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const BankAccountDetails = ({ data }) => {
  return (
    <Card className="max-w-lg mx-auto p-8">
      <CardHeader>
        <p variant="h4">Bank Account Details</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <p
              variant="body1"
              className="text-sm text-zinc-500 dark:text-zinc-400 w-48"
            >
              Account Type:
            </p>
            <p variant="body1" className="font-semibold leading-none">
              {data.accountType}
            </p>
          </div>

          <div className="flex items-center">
            <p
              variant="body1"
              className="text-sm text-zinc-500 dark:text-zinc-400 w-48"
            >
              Bank Account Type:
            </p>
            <p variant="body1" className="font-semibold leading-none">
              {data.bankAccountType}
            </p>
          </div>

          <div className="flex items-center">
            <p
              variant="body1"
              className="text-sm text-zinc-500 dark:text-zinc-400 w-48"
            >
              Bank IFSC:
            </p>
            <p variant="body1" className="font-semibold leading-none">
              {data.bankAccountIfsc}
            </p>
          </div>

          <div className="flex items-center">
            <p
              variant="body1"
              className="text-sm text-zinc-500 dark:text-zinc-400 w-48"
            >
              Account Name:
            </p>
            <p variant="body1" className="font-semibold leading-none">
              {data.bankAccountName}
            </p>
          </div>

          <div className="flex items-center">
            <p
              variant="body1"
              className="text-sm text-zinc-500 dark:text-zinc-400 w-48"
            >
              Bank Account Number:
            </p>
            <p variant="body1" className="font-semibold leading-none">
              {data.bankAccountNumber}
            </p>
          </div>

          <Separator />

          <div className="flex items-center">
            <p
              variant="body1"
              className="text-sm text-zinc-500 dark:text-zinc-400 w-48"
            >
              Payer VPA:
            </p>
            <p variant="body1" className="font-semibold leading-none">
              {data.payerVpa}
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <p variant="body1" className="font-semibold text-zinc-500">
              IFSC Details
            </p>
            <div className="flex items-center">
              <p
                variant="body1"
                className="text-sm text-zinc-500 dark:text-zinc-400 w-48"
              >
                Address:
              </p>
              <p variant="body1" className="font-semibold leading-none">
                {data.ifscDetails.address}
              </p>
            </div>

            <div className="flex items-center">
              <p
                variant="body1"
                className="text-sm text-zinc-500 dark:text-zinc-400 w-48"
              >
                Branch:
              </p>
              <p variant="body1" className="font-semibold leading-none">
                {data.ifscDetails.branch}
              </p>
            </div>

            <div className="flex items-center">
              <p
                variant="body1"
                className="text-sm text-zinc-500 dark:text-zinc-400 w-48"
              >
                District:
              </p>
              <p variant="body1" className="font-semibold leading-none">
                {data.ifscDetails.district}
              </p>
            </div>

            <div className="flex items-center">
              <p
                variant="body1"
                className="text-sm text-zinc-500 dark:text-zinc-400 w-48"
              >
                City:
              </p>
              <p variant="body1" className="font-semibold leading-none">
                {data.ifscDetails.city}
              </p>
            </div>

            <div className="flex items-center">
              <p
                variant="body1"
                className="text-sm text-zinc-500 dark:text-zinc-400 w-48"
              >
                State:
              </p>
              <p variant="body1" className="font-semibold leading-none">
                {data.ifscDetails.state}
              </p>
            </div>

            <div className="flex items-center">
              <p
                variant="body1"
                className="text-sm text-zinc-500 dark:text-zinc-400 w-48"
              >
                Bank Name:
              </p>
              <p variant="body1" className="font-semibold leading-none">
                {data.ifscDetails.name}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p variant="body2" className="text-sm text-zinc-500">
          All details are provided by the bank.
        </p>
      </CardFooter>
    </Card>
  );
};

export default BankAccountDetails;
