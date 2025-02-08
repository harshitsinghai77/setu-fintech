import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AnalyticsTable = ({ pancardRawData }) => {
  const filteredPanCard = pancardRawData.filter(
    (row) => row.verification === "SUCCESS" && row.data,
  );

  return (
    <div className="flex justify-center items-center w-full">
      <div className="overflow-x-auto w-full max-w-screen-lg">
        <Table className="min-w-full">
          <TableCaption>
            A list of recent successful PAN card verifications.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm sm:text-base">Full Name</TableHead>
              <TableHead className="text-sm sm:text-base">Category</TableHead>
              <TableHead className="text-sm sm:text-base">Aadhaar Seeding Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPanCard.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="text-sm text-left sm:text-base">{row.data.full_name}</TableCell>
                <TableCell className="text-sm text-left sm:text-base">{row.data.category}</TableCell>
                <TableCell className="text-sm text-left sm:text-base">{row.data.aadhaar_seeding_status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AnalyticsTable;
