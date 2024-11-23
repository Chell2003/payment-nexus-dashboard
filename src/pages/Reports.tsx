import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Printer } from "lucide-react";
import ReportsTable from "@/components/ReportsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: payments = [] } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          student:students(*)
        `);
      
      if (error) throw error;
      return data || [];
    }
  });

  const printReport = () => {
    const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount_paid || 0), 0);

    const reportContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
        <h2 style="text-align: center;">Payment Collection Report</h2>
        <hr style="margin: 20px 0;" />
        
        <div style="margin-bottom: 20px;">
          <p><strong>Date Generated:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Total Amount Collected:</strong> ₱${totalAmount.toFixed(2)}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Student Number</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Name</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Year & Section</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">Amount</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${payments.map(payment => `
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${payment.student?.student_number || ''}</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${payment.student?.name || ''}</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${payment.student?.yearandsection || ''}</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">₱${payment.amount_paid?.toFixed(2) || '0.00'}</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${new Date(payment.payment_date || '').toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background-color: #f3f4f6; font-weight: bold;">
              <td colspan="3" style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">Total:</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">₱${totalAmount.toFixed(2)}</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;"></td>
            </tr>
          </tfoot>
        </table>

        <div style="text-align: center; margin-top: 40px; font-size: 0.8em; color: #666;">
          <p>End of Report</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Admin</h1>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex items-center justify-between">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={printReport}
            >
              <Printer className="h-4 w-4" />
              Print Report
            </Button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-[300px]"
              />
            </div>
          </div>

          <ReportsTable searchQuery={searchQuery} />
        </div>
      </main>
    </div>
  );
};

export default Reports;