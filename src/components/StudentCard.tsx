import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StudentCard = () => {
  const { data: latestPayment, isLoading } = useQuery({
    queryKey: ['latestPayment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          student:students(*)
        `)
        .order('id', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data?.[0] || null;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!latestPayment?.student) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Latest Paid Student</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No payment records found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Latest Paid Student</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <User className="text-gray-400" size={20} />
          <div>
            <p className="text-sm text-gray-500">Student Number: {latestPayment.student.student_number}</p>
            <p className="font-medium">{latestPayment.student.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Mail className="text-gray-400" size={20} />
          <p className="text-sm">{latestPayment.student.email}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Phone className="text-gray-400" size={20} />
          <p className="text-sm">{latestPayment.student.phone}</p>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-500">Year and Section</p>
          <p className="font-medium">{latestPayment.student.yearandsection}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;