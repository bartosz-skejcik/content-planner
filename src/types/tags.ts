// Tag Table
export interface Tag {
  id?: string;
  name: string;
  created_at: Date;
}

// Join Table: Idea Tags
export interface IdeaTag {
  ideaId: string;
  tagId: string;
}
