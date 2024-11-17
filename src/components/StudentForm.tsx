import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tables } from "@/integrations/supabase/types";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface StudentFormProps {
  onSubmit: (data: Omit<Tables<'students'>, 'id'>) => void;
  defaultValues?: Tables<'students'>;
}

const StudentForm = ({ onSubmit, defaultValues }: StudentFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      student_number: formData.get('student_number') as string,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      yearandsection: formData.get('yearandsection') as string,
    };
    onSubmit(data);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{defaultValues ? 'Edit Student' : 'Add New Student'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="student_number">Student Number</Label>
          <Input
            id="student_number"
            name="student_number"
            defaultValue={defaultValues?.student_number}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={defaultValues?.name}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultValues?.email}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={defaultValues?.phone}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yearandsection">Year and Section</Label>
          <Input
            id="yearandsection"
            name="yearandsection"
            defaultValue={defaultValues?.yearandsection}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          {defaultValues ? 'Update Student' : 'Add Student'}
        </Button>
      </form>
    </DialogContent>
  );
};

export default StudentForm;