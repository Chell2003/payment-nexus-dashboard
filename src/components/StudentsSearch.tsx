import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface StudentsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedSection: string;
  onSectionChange: (value: string) => void;
}

const StudentsSearch = ({
  searchQuery,
  onSearchChange,
  selectedSection,
  onSectionChange,
}: StudentsSearchProps) => {
  const { data: sections = [] } = useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('yearandsection')
        .not('yearandsection', 'is', null)
        .order('yearandsection');
      
      if (error) throw error;
      
      // Get unique sections and remove any nulls
      const uniqueSections = [...new Set(data.map(item => item.yearandsection))].filter(Boolean);
      return uniqueSections;
    }
  });

  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1">
        <Input
          type="search"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <Select value={selectedSection} onValueChange={onSectionChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select section" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sections</SelectItem>
          {sections.map((section) => (
            <SelectItem key={section} value={section}>
              {section}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StudentsSearch;