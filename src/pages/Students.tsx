import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import StudentForm from "@/components/StudentForm";

const Students = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Tables<'students'> | null>(null);
  const queryClient = useQueryClient();

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const createStudent = useMutation({
    mutationFn: async (formData: Omit<Tables<'students'>, 'id'>) => {
      const { data, error } = await supabase
        .from('students')
        .insert([formData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsOpen(false);
      toast.success('Student created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create student');
      console.error('Error:', error);
    }
  });

  const updateStudent = useMutation({
    mutationFn: async (formData: Omit<Tables<'students'>, 'id'>) => {
      if (!editingStudent?.id) return;
      const { data, error } = await supabase
        .from('students')
        .update(formData)
        .eq('id', editingStudent.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsOpen(false);
      setEditingStudent(null);
      toast.success('Student updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update student');
      console.error('Error:', error);
    }
  });

  const deleteStudent = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete student');
      console.error('Error:', error);
    }
  });

  const handleSubmit = (data: Omit<Tables<'students'>, 'id'>) => {
    if (editingStudent) {
      updateStudent.mutate(data);
    } else {
      createStudent.mutate(data);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      (student.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (student.student_number?.includes(searchQuery) || false) ||
      (student.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesSection = selectedSection === "all" ? true : student.yearandsection === selectedSection;
    
    return matchesSearch && matchesSection;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-500">Manage student records</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                + Add Student
              </Button>
            </DialogTrigger>
            <StudentForm onSubmit={handleSubmit} defaultValues={editingStudent || undefined} />
          </Dialog>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              <SelectItem value="BSCS 2-3">BSCS 2-3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Year & Section</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.student_number}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.yearandsection}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                        onClick={() => {
                          setEditingStudent(student);
                          setIsOpen(true);
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                        onClick={() => deleteStudent.mutate(student.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Students;