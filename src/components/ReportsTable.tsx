import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ReportsTableProps {
  searchQuery: string;
}

const ReportsTable = ({ searchQuery }: ReportsTableProps) => {
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          student:students(*)
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const filteredReports = reports.filter(
    (report) =>
      report.student?.student_number?.includes(searchQuery) ||
      report.student?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

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
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No reports found
              </TableCell>
            </TableRow>
          ) : (
            filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.student?.student_number}</TableCell>
                <TableCell>{report.student?.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-green-500 text-green-500"
                  >
                    paid
                  </Badge>
                </TableCell>
                <TableCell>{report.student?.yearandsection}</TableCell>
                <TableCell>₱{report.amount_paid}</TableCell>
                <TableCell>{new Date(report.payment_date || '').toLocaleDateString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportsTable;