import Sidebar from "@/components/Sidebar";
import StudentCard from "@/components/StudentCard";
import StudentChart from "@/components/StudentChart";
import PaymentsTable from "@/components/PaymentsTable";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Admin</h1>
          <p className="text-gray-500">Here's what's happening with your students today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StudentCard
            studentNumber="202110305"
            name="Jelixces Cajontoy"
            email="jelixcescajontoy539@gmail.com"
            phone="09487112541"
            section="BSCS 2-3"
          />
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