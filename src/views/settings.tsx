import SettingSection from "@/components/settings/section";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateId } from "@/helpers/idea-bank";
import { useToast } from "@/hooks/use-toast";
import { useSettingsStore } from "@/stores/settingsStore";
import { Setting, Settings } from "@/types/settings";

type Props = {
  settings: Record<Setting["category"] | string, Settings>;
};

function SettingsView({ settings }: Props) {
  const { toast } = useToast();

  const settingsStore = useSettingsStore((state) => state);

  const addItem = async (category: string, value: string) => {
    const newSetting: Setting = {
      id: generateId(),
      value,
      category,
    };

    try {
      await settingsStore.addSetting(newSetting);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: (error as any).message,
        variant: "destructive",
      });
    }
  };

  const removeItem = async (id: string) => {
    try {
      await settingsStore.deleteSetting(id);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: (error as any).message,
        variant: "destructive",
      });
    }
  };

  return (
    <main className="flex flex-col items-center justify-center w-full gap-4 px-7">
      <ScrollArea className="h-full w-full">
        <div className="space-y-8 pb-16 w-full">
          {Object.entries(settings).map(([key, config]) => (
            <SettingSection
              key={key}
              id={key}
              settingKey={key}
              config={config}
              onAddItem={addItem}
              onRemoveItem={removeItem}
            />
          ))}
        </div>
      </ScrollArea>
    </main>
  );
}

export default SettingsView;
