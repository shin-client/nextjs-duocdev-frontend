import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

const Quantity = ({
  onChange,
  value,
}: {
  onChange: (value: number) => void;
  value: number;
}) => {
  return (
    <div className="flex gap-1">
      <Button
        className="h-6 w-6 p-0"
        disabled={value === 0}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input
        type="number"
        readOnly
        className="h-6 w-8 p-1 text-center"
        value={value}
        onChange={(e) => {
          const value = e.target.value;
          onChange(value === "" ? 0 : Number(value));
        }}
      />
      <Button className="h-6 w-6 p-0" onClick={() => onChange(value + 1)}>
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
};
export default Quantity;
