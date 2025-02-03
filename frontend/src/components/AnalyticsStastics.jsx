import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

const AnalyticsStastics = ({ rpdAnalytics, pancardAnalytics }) => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-7xl">
        {/* Total KYC Attempted */}
        <div className="w-full">
          <Card className="w-full shadow-lg bg-neutral-100 rounded-lg">
            <CardHeader>
              <CardTitle>Total KYC Attempted</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {rpdAnalytics.totalKycAttempted}
              </p>
              <p className="text-sm text-gray-600">
                Total number of KYC verification attempts by users.
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500">
                Includes both successful and failed attempts.
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Total KYC Successful */}
        <div className="w-full">
          <Card className="w-full shadow-lg bg-neutral-100 rounded-lg">
            <CardHeader>
              <CardTitle>Total KYC Successful</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {rpdAnalytics.totalKycSuccessful}
              </p>
              <p className="text-sm text-gray-600">
                Number of successful KYC verifications completed.
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500">
                Users successfully completed their verification process.
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Total KYC Failed */}
        <div className="w-full">
          <Card className="w-full shadow-lg bg-neutral-100 rounded-lg">
            <CardHeader>
              <CardTitle>Total KYC Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{rpdAnalytics.totalFailed}</p>
              <p className="text-sm text-gray-600">
                Number of KYC verifications that failed for various reasons.
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500">
                including failures by RPD_DEBIT_ATTEMPT_FAILED and
                RPD_VERIFICATION_UPDATE
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Failed Due to Expire/Timeout session */}
        <div className="w-full">
          <Card className="w-full shadow-lg bg-neutral-100 rounded-lg">
            <CardHeader>
              <CardTitle>Failed Due to Expire/Timeout session</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {rpdAnalytics.totalKycFailedByVerificationUpdate}
              </p>
              <p className="text-sm text-gray-600">
                KYC failures resulting from RPD_VERIFICATION_UPDATE events
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500">
                which occur when an end user attempts a payment but it either
                expires or fails
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Failed Due to Bank Account */}
        <div className="w-full">
          <Card className="w-full shadow-lg bg-neutral-100 rounded-lg">
            <CardHeader>
              <CardTitle>Failed Due to Bank Account</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {rpdAnalytics.totalFailedDueToBankAccount}
              </p>
              <p className="text-sm text-gray-600">
                KYC failures resulting from RPD_DEBIT_ATTEMPT_FAILED due to bank
                account issues
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500">
                including cases where an end user attempts a payment but the
                debit fails due to some reason
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Total PAN Card Verification Attempts */}
        <div className="w-full">
          <Card className="w-full shadow-lg bg-neutral-100 rounded-lg">
            <CardHeader>
              <CardTitle>Total PAN Card Verification Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {pancardAnalytics.totalPancardAttempts}
              </p>
              <p className="text-sm text-gray-600">
                Succesful verification {pancardAnalytics.totalSuccessAttempts}
              </p>
              <p className="text-sm text-gray-600">
                Failed verification {pancardAnalytics.totalFailedAttempts}
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500">
                The total number of PAN card verifications initiated by users.
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* KYC Failed Due to PAN */}
        {/* <div className="w-full">
          <Card className="w-full shadow-lg bg-neutral-100 rounded-lg">
            <CardHeader>
              <CardTitle>PanCard Verification By Numbers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Succesful verification {pancardAnalytics.totalSuccessAttempts}</p>
              <p className="text-sm text-gray-600">Failed verification {pancardAnalytics.totalFailedAttempts}</p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500"></p>
            </CardFooter>
          </Card>
        </div> */}

        {/* Total KYC failed due to PAN and Bank Account */}
        <div className="w-full">
          <Card className="w-full shadow-lg bg-neutral-100 rounded-lg">
            <CardHeader>
              <CardTitle>
                Total KYC failed due to PAN and Bank Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {pancardAnalytics.totalFailedAttempts} +{" "}
                {rpdAnalytics.totalFailed} ={" "}
                {pancardAnalytics.totalFailedAttempts +
                  rpdAnalytics.totalFailed}
              </p>
              <p className="text-sm text-gray-600">
                Total KYC failed because both PAN and bank account failed
                verification.
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500">
                Both PAN and bank account verification encountered issues.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsStastics;
