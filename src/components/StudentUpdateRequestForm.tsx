import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const StudentUpdateRequestForm = () => {
  const navigate = useNavigate();
  const [studentNumber, setStudentNumber] = useState("");
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    yearandsection: "",
  });
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentNumber) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("student_number", studentNumber)
        .single();

      if (error) {
        toast.error("Error finding student");
        setLoading(false);
        return;
      }

      if (data) {
        setStudent(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          yearandsection: data.yearandsection || "",
        });
      }
      setLoading(false);
    };

    fetchStudent();
  }, [studentNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    try {
      const { error } = await supabase.from("student_update_requests").insert([
        {
          student_id: student.id,
          requested_name: formData.name !== student.name ? formData.name : null,
          requested_email: formData.email !== student.email ? formData.email : null,
          requested_phone: formData.phone !== student.phone ? formData.phone : null,
          requested_yearandsection: formData.yearandsection !== student.yearandsection ? formData.yearandsection : null,
          status: status,
        },
      ]);

      if (error) throw error;

      toast.success("Update request submitted successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error submitting update request");
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Student Information Update Request</h1>
      
      <div className="mb-6">
        <Label htmlFor="studentNumber">Student Number</Label>
        <Input
          id="studentNumber"
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
          placeholder="Enter student number"
          className="mt-1"
        />
      </div>

      {student && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="yearandsection">Year and Section</Label>
            <Input
              id="yearandsection"
              value={formData.yearandsection}
              onChange={(e) => setFormData({ ...formData, yearandsection: e.target.value })}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <Label>Request Status</Label>
            <RadioGroup
              value={status}
              onValueChange={setStatus}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="pending" />
                <Label htmlFor="pending">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="approved" id="approved" />
                <Label htmlFor="approved">Approved</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rejected" id="rejected" />
                <Label htmlFor="rejected">Rejected</Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full">
            Submit Update Request
          </Button>
        </form>
      )}

      {loading && <p className="text-center mt-4">Loading...</p>}
    </div>
  );
};

export default StudentUpdateRequestForm;