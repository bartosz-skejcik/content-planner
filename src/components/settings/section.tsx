import { Settings } from "@/types/settings";
import { useState, KeyboardEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  id: string;
  settingKey: string;
  config: Settings;
  onAddItem: (category: string, value: string) => void;
  onRemoveItem: (id: string) => void;
};

function SettingSection({
  id,
  settingKey,
  config,
  onAddItem,
  onRemoveItem,
}: Props) {
  const [newItem, setNewItem] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddItem = () => {
    onAddItem(settingKey, newItem);
    setNewItem("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  return (
    <section id={id} className="py-4 w-full">
      <h2 className="text-xl font-semibold mb-1">{config.title}</h2>
      <p className="text-sm text-muted-foreground mb-4">{config.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {config.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center bg-muted px-3 py-1 rounded-full text-sm"
          >
            <span>{item.value}</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 h-auto p-0"
              onClick={() => onRemoveItem(item.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-1 max-w-3xl">
        <Input
          ref={inputRef}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={config.addPlaceholder}
          className="flex-grow"
        />
        <Button onClick={handleAddItem}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
    </section>
  );
}

export default SettingSection;
