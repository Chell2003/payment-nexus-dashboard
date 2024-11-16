import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const payments = [
  {
    studentNumber: "202110305",
    name: "Jelixces Cajontoy",
    email: "jelixcescajontoy539@gmail.com",
    section: "BSCS 2-3",
    status: "paid",
  },
  {
    studentNumber: "202110306",
    name: "John Smith",
    email: "john.smith@gmail.com",
    section: "BSCS 2-3",
    status: "not paid",
  },
];

const PaymentsTable = () => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Year & Section</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.studentNumber}>
              <TableCell>{payment.studentNumber}</TableCell>
              <TableCell>{payment.name}</TableCell>
              <TableCell>{payment.email}</TableCell>
              <TableCell>{payment.section}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`${
                    payment.status === "paid"
                      ? "border-green-500 text-green-500"
                      : "border-red-500 text-red-500"
                  }`}
                >
                  {payment.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentsTable;