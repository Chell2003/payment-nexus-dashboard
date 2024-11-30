import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";

interface StudentsTableProps {
  students: Tables<'students'>[];
  isLoading: boolean;
  onEdit: (student: Tables<'students'>) => void;
  onDelete: (id: number) => void;
}

const StudentsTable = ({ students, isLoading, onEdit, onDelete }: StudentsTableProps) => {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center py-4">
          Loading...
        </TableCell>
      </TableRow>
    );
  }

  if (students.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center py-4">
          No students found
        </TableCell>
      </TableRow>
    );
  }

  return (
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
        {students.map((student) => (
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
                onClick={() => onEdit(student)}
              >
                Update
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                onClick={() => onDelete(student.id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StudentsTable;