import Sidebar from "@/components/Sidebar";
import PaymentsTable from "@/components/PaymentsTable";
import PaymentForm from "@/components/PaymentForm";

const Payments = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500">Manage student payments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <PaymentForm />
          </div>
          <div className="md:col-span-2">
            <PaymentsTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payments;