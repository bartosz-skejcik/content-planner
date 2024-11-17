import { Idea } from "@/types";
import {
  Clock,
  Edit2,
  MoreVertical,
  Star,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type Props = {
  idea: Idea;
  handleDelete: (id: string) => void;
};

function Card({ idea, handleDelete }: Props) {
  return (
    <div className="border rounded-lg hover:shadow-md transition-shadow">
      {/* Main Content Area */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium">{idea.title}</h3>
              <Star className={`w-4 h-4`} />
            </div>

            {/* Meta Information */}
            <div className="flex gap-4 text-sm text-muted-foreground pb-1">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {idea.duration.split(":").join("-")} minutes
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {idea.target_audience}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {idea.content_type}
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
            <Button variant="secondary" size="icon">
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => handleDelete(idea.id!)}
              variant="secondary"
              size="icon"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Outline Preview (collapsible) */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg text-muted-foreground">
          <h4 className="text-xs font-medium mb-2">Outline:</h4>
          <ul className="space-y-1 text-sm">{idea.outline}</ul>
        </div>
      </div>
    </div>
  );
}

export default Card;
