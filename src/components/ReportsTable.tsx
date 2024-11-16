import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ReportsTableProps {
  searchQuery: string;
}

const reports = [
  {
    studentNumber: "202110305",
    name: "Jelixces Cajontoy",
    status: "paid",
    section: "BSCS 2-3",
    amount: 100,
  },
  {
    studentNumber: "202110305",
    name: "Jelixces Cajontoy",
    status: "paid",
    section: "BSCS 2-3",
    amount: 100,
  },
];

const ReportsTable = ({ searchQuery }: ReportsTableProps) => {
  const filteredReports = reports.filter(
    (report) =>
      report.studentNumber.includes(searchQuery) ||
      report.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Year & Section</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReports.map((report, index) => (
            <TableRow key={index}>
              <TableCell>{report.studentNumber}</TableCell>
              <TableCell>{report.name}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`${
                    report.status === "paid"
                      ? "border-green-500 text-green-500"
                      : "border-red-500 text-red-500"
                  }`}
                >
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell>{report.section}</TableCell>
              <TableCell>{report.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportsTable;