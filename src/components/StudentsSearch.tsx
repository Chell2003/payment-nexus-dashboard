import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
          <SelectItem value="BSCS 2-3">BSCS 2-3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StudentsSearch;