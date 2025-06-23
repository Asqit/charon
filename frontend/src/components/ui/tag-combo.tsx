import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import React from "react";

interface Props {
  data: { value: string; label: string }[];
  onChange(value: string): void;
}

export function TagCombo({ data, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, _setValue] = React.useState("");
  const [search, setSearch] = React.useState("");

  const setValue = (v: string) => {
    _setValue(v);
    onChange(v);
  };

  const filtered = data.filter((f) =>
    f.value.toLowerCase().includes(search.toLowerCase()),
  );
  const showAdd =
    search &&
    !filtered.some((f) => f.value.toLowerCase() === search.toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-60 justify-between overflow-x-hidden"
        >
          {value || "Select or add..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0">
        <Command>
          <CommandInput
            placeholder="Type or select..."
            value={search}
            onValueChange={(v) => setSearch(v)}
          />
          <CommandList>
            <CommandEmpty>No match.</CommandEmpty>
            <CommandGroup>
              {filtered.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={() => {
                    setValue(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </CommandItem>
              ))}
              {showAdd && (
                <CommandItem
                  value={search}
                  onSelect={() => {
                    setValue(search);
                    setOpen(false);
                  }}
                >
                  Add “{search}”
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
