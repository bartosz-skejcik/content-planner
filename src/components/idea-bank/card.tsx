import { Idea } from "@/types";
import { Clock, Edit2, Star, Tag, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConfirmationModal } from "@/providers/modal-provider";
import { useIdeaBankStore } from "@/stores/ideaBankStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSettingsStore } from "@/stores/settingsStore";
import { DateTimePicker } from "../ui/datetime";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";

type Props = {
  idea: Idea;
  handleDelete: (id: string) => Promise<void>;
  toggleFavorite: (idea: Idea) => Promise<void>;
  setActiveIdea: (idea: Idea) => void;
  openModal: (isOpen: boolean) => void;
};

function Card({
  idea,
  handleDelete,
  toggleFavorite,
  setActiveIdea,
  openModal,
}: Props) {
  const { showModal, hideModal } = useConfirmationModal();

  const convertToVideo = useIdeaBankStore((state) => state.convertToVideoPlan);
  const settingsStore = useSettingsStore();
  const priorities = settingsStore.settings["priority"] || { items: [] };

  const { toast } = useToast();

  const handleConvertClick = () => {
    showModal({
      title: "Convert Idea to Video",
      description: "Are you sure you want to convert this idea to a video?",
      components: [
        (formState, setFormValue) => (
          <>
            <Label>Select the priority</Label>
            <br />
            <Select
              value={formState.priority || ""}
              onValueChange={(value) => setFormValue("priority", value)}
            >
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="Select a priority" />
              </SelectTrigger>
              <SelectContent id="priority">
                {priorities.items.map((item) => (
                  <SelectItem key={item.id} value={item.value}>
                    {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        ),
        (formState, setFormValue) => (
          <>
            <Label>Select a deadline</Label>
            <br />
            <DateTimePicker
              className="w-1/2"
              value={formState.deadline}
              onChange={(date) => setFormValue("deadline", date)}
            />
          </>
        ),
      ],
      buttons: [
        {
          text: "Cancel",
          onClick: hideModal,
          variant: "secondary",
        },
        {
          text: "Convert",
          onClick: async (formState) => {
            // Access form values directly from the context
            try {
              await convertToVideo(
                idea,
                formState.deadline,
                formState.priority,
              );
            } catch (error) {
              console.error("Failed to convert idea to video:", error);
              // Handle error (e.g., show toast notification
              toast({
                title: "Error",
                description: "Failed to convert idea to video, " + error,
                variant: "destructive",
              });
            }
            hideModal();
          },
          variant: "default",
        },
      ],
    });
  };

  return (
    <div className="transition-shadow border rounded-lg hover:shadow-md">
      {/* Main Content Area */}
      <div className="p-4">
        <div className="flex items-start justify-between pb-3">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium">{idea.title}</h3>
              <Button
                onClick={async () => await toggleFavorite(idea)}
                variant="link"
                size="icon"
              >
                <Star
                  style={{
                    fill: idea.is_favorite ? "currentcolor" : "none",
                  }}
                  className={`w-5 h-5 ${
                    idea.is_favorite
                      ? "text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </Button>
            </div>

            {/* Meta Information */}
            <div className="flex gap-4 pb-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {idea.duration.split(":").join("-")} minutes
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {idea.target_audience.charAt(0).toUpperCase() +
                  idea.target_audience.slice(1)}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {idea.content_type.charAt(0).toUpperCase() +
                  idea.content_type.slice(1)}
              </span>
            </div>

            {/* Tags */}
            {idea.tags && idea.tags.length > 0 && (
              <div className="flex gap-2">
                {idea.tags.map((tag, index) => (
                  <Badge
                    key={tag.id}
                    className={index === 0 ? "rounded-l-lg" : ""}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="h-9" onClick={handleConvertClick}>
              Convert to Video
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => {
                setActiveIdea(idea);
                openModal(true);
              }}
              className="hover:text-primary"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => {
                showModal({
                  title: "Delete Idea",
                  description: "Are you sure you want to delete this idea?",
                  buttons: [
                    {
                      text: "Cancel",
                      onClick: () => hideModal(),
                      variant: "secondary",
                    },
                    {
                      text: "Delete",
                      onClick: async () => {
                        await handleDelete(idea.id!);
                        hideModal();
                      },
                      variant: "destructive",
                    },
                  ],
                });
              }}
              variant="secondary"
              size="icon"
              className="hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Outline Preview (collapsible) */}
        {idea.outline != "" && (
          <div className="pb-3 mt-4 rounded-lg bg-muted/30 text-muted-foreground">
            <h4 className="mb-2 text-xs font-medium">Outline:</h4>
            <ul className="space-y-1 text-sm">{idea.outline}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
