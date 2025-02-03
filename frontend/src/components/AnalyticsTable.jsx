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
    <div className="flex justify-center items-center h-full">
      <div className="overflow-x-auto w-[800px] h-[400px]">
        <Table className="min-w-[800px]">
          <TableCaption>
            A list of recent succesful pancard verification.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Full Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Aadhaar Seeding Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPanCard.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.data.full_name}</TableCell>
                <TableCell>{row.data.category}</TableCell>
                <TableCell>{row.data.aadhaar_seeding_status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AnalyticsTable;
