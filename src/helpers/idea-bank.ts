import { type Idea, type Tag, type TagRow } from "@/types";
import type Database from "@tauri-apps/plugin-sql";

// Helper to generate ID (could be moved to a utils file)
export const generateId = () => Math.random().toString(36).substring(2, 11);

// Helper to handle tag management
async function manageTagUpdates(
  db: Database,
  ideaId: string,
  newTags?: Tag[],
  existingTags?: Tag[],
): Promise<Tag[]> {
  // If no tags provided and no existing tags, nothing to do
  if (!newTags && !existingTags?.length) {
    return [];
  }

  // If new tags explicitly set to undefined/empty, delete all existing
  if (!newTags?.length && existingTags?.length) {
    await db.execute("DELETE FROM idea_tags WHERE idea_id = ?", [ideaId]);
    return [];
  }

  if (!newTags) return existingTags || [];

  // Find tags to remove and add
  const tagsToDelete =
    existingTags?.filter((tag) => !newTags.some((t) => t.name === tag.name)) ||
    [];

  const tagsToAdd = newTags.filter(
    (tag) => !existingTags?.some((t) => t.name === tag.name),
  );

  // Delete removed tags if any
  if (tagsToDelete.length) {
    await db.execute(
      `DELETE FROM idea_tags 
       WHERE idea_id = ? AND tag_id IN (${tagsToDelete.map(() => "?").join(",")})`,
      [ideaId, ...tagsToDelete.map((t) => t.id)],
    );
  }

  // Add new tags
  for (const tag of tagsToAdd) {
    // Check if tag exists
    const [existingTag] = await db.select<TagRow[]>(
      "SELECT id, name FROM tags WHERE name = ?",
      [tag.name],
    );

    const tagId = existingTag?.id || (await createNewTag(db, tag.name));

    // Create idea-tag relationship
    await db.execute("INSERT INTO idea_tags (idea_id, tag_id) VALUES (?, ?)", [
      ideaId,
      tagId,
    ]);
  }

  // Return updated tags list
  return [
    ...(existingTags?.filter((tag) => !tagsToDelete.includes(tag)) || []),
    ...tagsToAdd,
  ];
}

// Helper to create a new tag
async function createNewTag(db: Database, tagName: string): Promise<string> {
  const tagId = generateId();
  await db.execute(
    "INSERT INTO tags (id, name, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
    [tagId, tagName],
  );
  return tagId;
}

// Helper to build update query
function buildUpdateQuery(data: Partial<Idea>): {
  query: string;
  params: any[];
} {
  const updateFields = Object.entries(data)
    .filter(([key]) => key !== "tags") // Handle tags separately
    .map(([key]) => `${key} = ?`);

  const params = Object.entries(data)
    .filter(([key]) => key !== "tags")
    .map(([_, value]) => value);

  return {
    query: `UPDATE idea_bank SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP`,
    params,
  };
}

// Main update function
export async function updateIdea(
  db: Database,
  id: string,
  data: Partial<Idea>,
  currentIdeas: Idea[],
): Promise<Idea[]> {
  const ideaIndex = currentIdeas.findIndex((idea) => idea.id === id);
  if (ideaIndex === -1) {
    throw new Error("Idea not found");
  }

  try {
    const currentIdea = currentIdeas[ideaIndex];
    const { query, params } = buildUpdateQuery(data);

    // Update idea details
    await db.execute(`${query} WHERE id = ?`, [...params, id]);

    // Handle tag updates if needed
    const updatedTags = await manageTagUpdates(
      db,
      id,
      data.tags,
      currentIdea.tags,
    );

    // Create updated idea object
    const updatedIdea: Idea = {
      ...currentIdea,
      ...data,
      tags: updatedTags,
      updated_at: new Date(),
    };

    // Update ideas array
    const updatedIdeas = [...currentIdeas];
    updatedIdeas[ideaIndex] = updatedIdea;

    return updatedIdeas;
  } catch (error) {
    console.error("Error updating idea:", error);
    throw error;
  }
}
