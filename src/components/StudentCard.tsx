import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User } from "lucide-react";

interface StudentCardProps {
  studentNumber: string;
  name: string;
  email: string;
  phone: string;
  section: string;
}

const StudentCard = ({ studentNumber, name, email, phone, section }: StudentCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Latest Paid Student</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <User className="text-gray-400" size={20} />
          <div>
            <p className="text-sm text-gray-500">Student Number: {studentNumber}</p>
            <p className="font-medium">{name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Mail className="text-gray-400" size={20} />
          <p className="text-sm">{email}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Phone className="text-gray-400" size={20} />
          <p className="text-sm">{phone}</p>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-500">Year and Section</p>
          <p className="font-medium">{section}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;