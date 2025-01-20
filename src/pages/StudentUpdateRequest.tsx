import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save } from "lucide-react";

const StudentUpdateRequest = () => {
  const navigate = useNavigate();
  const [studentNumber, setStudentNumber] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    yearandsection: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // First, find the student by student number
      const { data: students, error: findError } = await supabase
        .from('students')
        .select('id')
        .eq('student_number', studentNumber)
        .single();

      if (findError || !students) {
        toast.error("Student not found. Please check your student number.");
        return;
      }

      // Submit the update request
      const { error: submitError } = await supabase
        .from('student_update_requests')
        .insert([
          {
            student_id: students.id,
            requested_name: formData.name || null,
            requested_email: formData.email || null,
            requested_phone: formData.phone || null,
            requested_yearandsection: formData.yearandsection || null,
          }
        ]);

      if (submitError) throw submitError;
      
      toast.success("Update request submitted successfully!");
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to submit update request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Request Information Update
          </h1>
          <p className="text-gray-500 mb-6">
            Submit a request to update your student information
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="student_number">Student Number *</Label>
              <Input
                id="student_number"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                placeholder="Enter your student number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter new name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter new email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter new phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearandsection">Year and Section</Label>
              <Input
                id="yearandsection"
                value={formData.yearandsection}
                onChange={(e) => setFormData({ ...formData, yearandsection: e.target.value })}
                placeholder="Enter new year and section"
              />
            </div>

            <Button type="submit" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Submit Update Request
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentUpdateRequest;