import { Tag } from "./tags";

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
  content_type: string;
  target_audience: IdeaTargetAudience;
  outline?: string;
  is_favorite: boolean;
  tags?: Tag[];
  created_at: Date;
  updated_at: Date;
}
