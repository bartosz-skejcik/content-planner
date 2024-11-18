// Define the structure of the result returned by the `SELECT` query for the idea_bank table
export type IdeaRow = {
  id: string;
  title: string;
  description: string | null;
  created_at: string; // We'll convert this to Date later
  updated_at: string | null; // We'll convert this to Date later
  tags: string | null; // This will be a concatenated string of tags (e.g., "id1:name1,id2:name2")
  duration: `${number}:${number}`;
  content_type: string;
  target_audience: string;
  is_favorite: "true" | "false";
  outline?: string;
};

// Define the structure of the result returned by the `SELECT` query for the tags
export type TagRow = {
  id: string;
  name: string;
};
