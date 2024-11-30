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
import { Printer } from "lucide-react";

const PaymentsTable = () => {
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading, error } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          student:students(*)
        `)
        .order('id', { ascending: false });
      
      if (error) throw error;
      return data || [];
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

  const printReceipt = (payment: any) => {
    const receiptContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto;">
        <h2 style="text-align: center;">Payment Receipt</h2>
        <hr style="margin: 20px 0;" />
        
        <div style="margin-bottom: 20px;">
          <p><strong>Receipt No:</strong> ${payment.id}</p>
          <p><strong>Date:</strong> ${new Date(payment.payment_date).toLocaleDateString()}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3>Student Information</h3>
          <p><strong>Name:</strong> ${payment.student?.name}</p>
          <p><strong>Student Number:</strong> ${payment.student?.student_number}</p>
          <p><strong>Year & Section:</strong> ${payment.student?.yearandsection}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3>Payment Details</h3>
          <p><strong>Amount Paid:</strong> ₱${payment.amount_paid}</p>
        </div>

        <hr style="margin: 20px 0;" />
        
        <div style="text-align: center; font-size: 0.8em; color: #666;">
          <p>Thank you for your payment!</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">Error loading payments</div>;
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
              <TableCell colSpan={6} className="text-center">
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
                    onClick={() => printReceipt(payment)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
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
