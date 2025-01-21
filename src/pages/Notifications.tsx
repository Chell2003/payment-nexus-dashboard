import Sidebar from "@/components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";
import { format } from "date-fns";

const Notifications = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_update_requests')
        .select('*, students(name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div>Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Notifications
          </h1>
          <p className="text-gray-500">View all student update requests</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          {notifications?.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {notifications?.map((notification) => (
                <div key={notification.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Update Request from {notification.students?.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {format(new Date(notification.created_at), 'PPpp')}
                      </p>
                      <div className="mt-2 space-y-1">
                        {notification.requested_name && (
                          <p className="text-sm">New Name: {notification.requested_name}</p>
                        )}
                        {notification.requested_email && (
                          <p className="text-sm">New Email: {notification.requested_email}</p>
                        )}
                        {notification.requested_phone && (
                          <p className="text-sm">New Phone: {notification.requested_phone}</p>
                        )}
                        {notification.requested_yearandsection && (
                          <p className="text-sm">New Year/Section: {notification.requested_yearandsection}</p>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      notification.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : notification.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;