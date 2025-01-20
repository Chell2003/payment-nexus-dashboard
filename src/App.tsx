import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Students from "@/pages/Students";
import Login from "@/pages/Login";
import Reports from "@/pages/Reports";
import Payments from "@/pages/Payments";
import StudentUpdateRequest from "@/pages/StudentUpdateRequest";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Students />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/update-request" element={<StudentUpdateRequest />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;