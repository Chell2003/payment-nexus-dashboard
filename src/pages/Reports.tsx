import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Printer } from "lucide-react";
import ReportsTable from "@/components/ReportsTable";

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Admin</h1>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex items-center justify-between">
            <Button variant="outline" className="gap-2">
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