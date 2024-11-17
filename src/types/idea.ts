import { Tag } from "./tags";
import { VideoType } from "./video";

export enum IdeaTargetAudience {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export interface Idea {
  id?: string;
  title: string;
  description?: string;
  duration: `${number}:${number}`;
  content_type: VideoType;
  target_audience: IdeaTargetAudience;
  outline?: string;
  tags?: Tag[];
  created_at: Date;
  updated_at: Date;
}
