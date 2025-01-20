import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tables } from "@/integrations/supabase/types";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface StudentUpdateRequestFormProps {
  student: Tables<'students'>;
  onClose: () => void;
}

const StudentUpdateRequestForm = ({ student, onClose }: StudentUpdateRequestFormProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase
        .from('student_update_requests')
        .insert([
          {
            student_id: student.id,
            requested_name: formData.get('name') as string || null,
            requested_email: formData.get('email') as string || null,
            requested_phone: formData.get('phone') as string || null,
            requested_yearandsection: formData.get('yearandsection') as string || null,
          }
        ]);

      if (error) throw error;
      
      toast.success("Update request submitted successfully");
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to submit update request");
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Request Information Update</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={student.name || ''}
            placeholder="Enter new name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={student.email || ''}
            placeholder="Enter new email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={student.phone || ''}
            placeholder="Enter new phone"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yearandsection">Year and Section</Label>
          <Input
            id="yearandsection"
            name="yearandsection"
            defaultValue={student.yearandsection || ''}
            placeholder="Enter new year and section"
          />
        </div>
        <Button type="submit" className="w-full">
          Submit Update Request
        </Button>
      </form>
    </DialogContent>
  );
};

export default StudentUpdateRequestForm;