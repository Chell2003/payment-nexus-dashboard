import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StudentChart = () => {
  // Fetching students from Supabase
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  // Group and count students by section
  const groupedData = students.reduce((acc, student) => {
    const section = student.yearandsection || "Unknown"; // Handle missing section field
    acc[section] = (acc[section] || 0) + 1; // Increment count for the section
    return acc;
  }, {});

  // Format data for chart consumption
  const chartData = Object.keys(groupedData).map((section) => ({
    section,
    count: groupedData[section],
  }));

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Student Count by Section</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : chartData.length === 0 ? (
          <p>No data available for chart.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="section" label={{ value: "Section", position: "insideBottom", offset: -5 }} />
              <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
              <Bar dataKey="count" fill="#1e40af" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentChart;
