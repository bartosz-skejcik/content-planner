import { create } from "zustand";
import { Tag } from "@/types/tags";
import { initializeStore } from "./database"; // assuming initializeStore is a helper function to set up the database
import { z } from "zod";

const tagSchema = z.object({
  id: z.string(),
  name: z.string({
    message: "Tag name is required",
  }),
  created_at: z.date(),
});

// Tag store to handle tag operations
export const useTagStore = create<{
  tags: Tag[];
  fetchTags: () => Promise<void>;
  getTagByName: (name: string) => Promise<Tag | undefined>;
  addTag: (tag: Tag) => Promise<void>;
}>((set) => ({
  tags: [],

  // Fetch all tags from the database
  fetchTags: async () => {
    const db = await initializeStore();
    if (!db) return;

    try {
      const result = await db.select<Tag[]>("SELECT * FROM tags");

      set({ tags: result });
    } catch (error) {
      throw error;
    }
  },

  // Get a tag by its name
  getTagByName: async (name: string) => {
    const db = await initializeStore();
    if (!db) return undefined;

    try {
      const result = await db.select<Tag[]>(
        "SELECT * FROM tags WHERE name = ?",
        [name],
      );
      if (result.length > 0) {
        return {
          id: result[0].id,
          name: result[0].name,
          created_at: new Date(result[0].created_at),
        };
      }
      return undefined;
    } catch (error) {
      throw error;
    }
  },

  // Add a new tag to the database
  addTag: async (tag: Tag) => {
    const db = await initializeStore();
    if (!db) return;

    try {
      tagSchema.parse(tag); // Validate the tag

      await db.execute("INSERT INTO tags (id, name) VALUES (?, ?)", [
        tag.id,
        tag.name,
      ]);
      set((state) => ({
        tags: [...state.tags, tag],
      }));
    } catch (error) {
      throw error;
    }
  },
}));
