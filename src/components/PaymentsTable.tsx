import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PaymentsTable = () => {
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          student:students(*)
        `)
        .order('id', { ascending: false }); // Order by id descending (latest first)
      
      if (error) throw error;
      return data;
    },
  });

  const deletePayment = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete payment');
      console.error('Error:', error);
    },
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Year & Section</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No payments found
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.student?.student_number}</TableCell>
                <TableCell>{payment.student?.name}</TableCell>
                <TableCell>{payment.student?.yearandsection}</TableCell>
                <TableCell>₱{payment.amount_paid}</TableCell>
                <TableCell>{new Date(payment.payment_date || '').toLocaleDateString()}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                    onClick={() => deletePayment.mutate(payment.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentsTable;
