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
  handleDelete: (id: string) => Promise<void>;
  toggleFavorite: (idea: Idea) => Promise<void>;
};

function Card({ idea, handleDelete, toggleFavorite }: Props) {
  return (
    <div className="transition-shadow border rounded-lg hover:shadow-md">
      {/* Main Content Area */}
      <div className="p-4">
        <div className="flex items-start justify-between">
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
        <div className="p-3 mt-4 rounded-lg bg-muted/30 text-muted-foreground">
          <h4 className="mb-2 text-xs font-medium">Outline:</h4>
          <ul className="space-y-1 text-sm">{idea.outline}</ul>
        </div>
      </div>
    </div>
  );
}

export default Card;
