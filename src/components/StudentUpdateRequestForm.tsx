import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const StudentUpdateRequestForm = () => {
  const [studentNumber, setStudentNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [formData, setFormData] = useState({
    requested_name: "",
    requested_email: "",
    requested_phone: "",
    requested_yearandsection: "",
  });

  const handleStudentSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("student_number", studentNumber)
        .single();

      if (error) throw error;
      if (!data) {
        toast.error("Student not found");
        return;
      }
      setStudent(data);
      setFormData({
        requested_name: data.name || "",
        requested_email: data.email || "",
        requested_phone: data.phone || "",
        requested_yearandsection: data.yearandsection || "",
      });
    } catch (error) {
      toast.error("Error finding student");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) {
      toast.error("Please search for a student first");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("student_update_requests").insert([
        {
          student_id: student.id,
          ...formData,
        },
      ]);

      if (error) throw error;
      toast.success("Update request submitted successfully");
      // Reset form
      setStudent(null);
      setStudentNumber("");
      setFormData({
        requested_name: "",
        requested_email: "",
        requested_phone: "",
        requested_yearandsection: "",
      });
    } catch (error) {
      toast.error("Error submitting update request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Student Information Update Request</h1>
        <p className="text-gray-500 mt-2">
          Submit a request to update your student information
        </p>
      </div>

      {!student ? (
        <form onSubmit={handleStudentSearch} className="space-y-4">
          <div>
            <Label htmlFor="student_number">Student Number</Label>
            <Input
              id="student_number"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              placeholder="Enter your student number"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Searching..." : "Search Student"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="requested_name">Name</Label>
            <Input
              id="requested_name"
              value={formData.requested_name}
              onChange={(e) =>
                setFormData({ ...formData, requested_name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="requested_email">Email</Label>
            <Input
              id="requested_email"
              type="email"
              value={formData.requested_email}
              onChange={(e) =>
                setFormData({ ...formData, requested_email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="requested_phone">Phone</Label>
            <Input
              id="requested_phone"
              value={formData.requested_phone}
              onChange={(e) =>
                setFormData({ ...formData, requested_phone: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="requested_yearandsection">Year and Section</Label>
            <Input
              id="requested_yearandsection"
              value={formData.requested_yearandsection}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requested_yearandsection: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Update Request"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setStudent(null);
                setStudentNumber("");
              }}
            >
              Search Different Student
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StudentUpdateRequestForm;