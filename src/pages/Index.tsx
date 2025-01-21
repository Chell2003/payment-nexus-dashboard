import Sidebar from "@/components/Sidebar";
import StudentCard from "@/components/StudentCard";
import StudentChart from "@/components/StudentChart";
import PaymentsTable from "@/components/PaymentsTable";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  useEffect(() => {
    // Subscribe to real-time updates for student_update_requests
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'student_update_requests'
        },
        (payload) => {
          // Show a toast notification when a new request is received
          toast.info("New Update Request", {
            description: `A new student update request has been submitted.`,
            action: {
              label: "View",
              onClick: () => window.location.href = "/students"
            }
          });
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Admin</h1>
          <p className="text-gray-500">Here's what's happening with your students today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StudentCard />
          <StudentChart />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Payments</h2>
          <PaymentsTable />
        </div>
      </main>
    </div>
  );
};

export default Index;