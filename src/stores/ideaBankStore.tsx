import { create } from "zustand";
import { z } from "zod";
import { Idea } from "@/types/idea";
import { Tag } from "@/types/tags";
import { IdeaRow, TagRow } from "@/types/database";
import { initializeStore } from "./database";
import { generateId, updateIdea } from "@/helpers/idea-bank";
import { videoSchema } from "./videoStore";
import { Video, VideoPlatform } from "@/types/video";

// Zod schema for validation
const ideaSchema = z.object({
  id: z.string(),
  title: z.string({
    message: "Title is required",
  }),
  description: z.string().optional(),
  tags: z
    .array(
      z.object({
        id: z.string(),
        name: z.string({
          message: "Tag name is required",
        }),
        created_at: z.date(),
      }),
    )
    .optional(), // Full tag objects
  duration: z
    .string({
      message: "Duration is required",
    })
    .regex(/^\d+:\d+$/),
  content_type: z.string(),
  target_audience: z.string(),
  outline: z.string().optional(),
  is_favorite: z.boolean().default(false),
  created_at: z.date(),
  updated_at: z.date(),
});

// Zustand store
export const useIdeaBankStore = create<{
  ideas: Idea[];
  tags: Tag[];
  addIdea: (idea: Idea) => Promise<void>;
  updateIdea: (id: string, data: Partial<Idea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  loadIdeas: () => Promise<void>;
  convertToVideoPlan: (
    idea: Idea,
    deadline: Date,
    priority: Video["priority"],
  ) => Promise<void>;
}>((set, get) => ({
  ideas: [],
  tags: [],

  // Load all ideas
  loadIdeas: async () => {
    const db = await initializeStore();
    if (!db) return;

    const query = `
    SELECT
      idea_bank.*,
      GROUP_CONCAT(tags.id || ':' || tags.name) AS tags
    FROM idea_bank
    LEFT JOIN idea_tags ON idea_bank.id = idea_tags.idea_id
    LEFT JOIN tags ON idea_tags.tag_id = tags.id
    GROUP BY idea_bank.id
  `;

    try {
      const result = await db.select<IdeaRow[]>(query);
      const validatedIdeas = result.map((row) => {
        const tags = row.tags
          ? row.tags.split(",").map((tag) => {
              const [id, name] = tag.split(":");
              return { id, name }; // Returning the tag object without Zod validation
            })
          : [];

        // Ensure we conform to the 'Idea' type using type assertion
        return {
          id: row.id,
          title: row.title,
          description: row.description ?? undefined,
          duration: row.duration,
          content_type: row.content_type,
          target_audience: row.target_audience,
          outline: row.outline ?? "",
          is_favorite: row.is_favorite === "true",
          created_at: new Date(row.created_at),
          updated_at: row.updated_at ? new Date(row.updated_at) : undefined,
          tags,
        } as Idea; // Type assertion to `Idea`
      });

      console.log("[loadIdeas] result", result);
      set({ ideas: validatedIdeas });
    } catch (error: any) {
      throw error.message;
    }
  },

  // Add a new idea
  addIdea: async (idea) => {
    const db = await initializeStore();
    if (!db) return;

    idea.id = idea.id ?? generateId();
    let validatedIdea: Idea;

    try {
      // @ts-ignore
      validatedIdea = ideaSchema.parse(idea);
    } catch (error: any) {
      throw error.message;
    }

    const queryIdea = `
    INSERT INTO idea_bank (id, title, description, duration, content_type, target_audience, outline, is_favorite, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `;
    const paramsIdea = [
      validatedIdea.id,
      validatedIdea.title,
      validatedIdea.description ?? null,
      validatedIdea.duration,
      validatedIdea.content_type,
      validatedIdea.target_audience,
      validatedIdea.outline ?? "",
      validatedIdea.is_favorite,
      validatedIdea.updated_at.toISOString(),
    ];

    try {
      // Insert the idea
      await db.execute(queryIdea, paramsIdea);

      // Insert tags into idea_tags if provided
      if (validatedIdea.tags && validatedIdea.tags.length > 0) {
        const queryTags = `
        INSERT INTO idea_tags (idea_id, tag_id)
        VALUES (?, ?)
      `;

        for (const tag of validatedIdea.tags) {
          // Check if tag exists in the tags table
          const existingTagQuery = `SELECT id FROM tags WHERE name = ? LIMIT 1`;
          const existingTagResult = await db.select<TagRow[]>(
            existingTagQuery,
            [tag.name],
          );

          let tagId: string;
          if (existingTagResult.length > 0) {
            // Tag exists, use the existing tag id
            tagId = existingTagResult[0].id;
          } else {
            // Tag doesn't exist, create it first
            tag.id = Math.random().toString(36).substring(2, 11); // Generate new ID
            await db.execute(
              `INSERT INTO tags (id, name, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)`,
              [tag.id, tag.name],
            );
            tagId = tag.id;
          }

          // Link the tag to the idea
          await db.execute(queryTags, [validatedIdea.id, tagId]);
        }
      }

      set({ ideas: [...get().ideas, validatedIdea as Idea] });
    } catch (error: any) {
      console.error(error);
      throw { message: error };
    }
  },

  // Update an idea
  updateIdea: async (id: string, data: Partial<Idea>) => {
    const db = await initializeStore();
    if (!db) return;

    try {
      const updatedIdeas = await updateIdea(db, id, data, get().ideas);
      set({ ideas: updatedIdeas });
    } catch (error) {
      console.error("Failed to update idea:", error);
      // Handle error (e.g., show toast notification)
    }
  },

  // Delete an idea
  deleteIdea: async (id) => {
    const db = await initializeStore();
    if (!db) return;

    const query = `DELETE FROM idea_bank WHERE id = ?`;

    try {
      await db.execute(query, [id]);
      const updatedIdeas = get().ideas.filter((idea) => idea.id !== id);
      set({ ideas: updatedIdeas });
    } catch (error: any) {
      throw error.message;
    }
  },

  // Convert an idea to a video plan
  convertToVideoPlan: async (idea, deadline, priority) => {
    const db = await initializeStore();
    if (!db) return;
    let validatedVideo;

    const video: Video = {
      id: idea.id ?? generateId(),
      title: idea.title,
      description: idea.description,
      link: "",
      status: "idle",
      platform: VideoPlatform.YouTube,
      type: idea.content_type,
      deadline,
      priority,
      created_at: new Date(),
    };

    try {
      validatedVideo = videoSchema.parse(video);
    } catch (error: any) {
      console.error("Failed to validate video:", error);
      throw error.message;
    }

    const query = `INSERT INTO videos (id, title, description, link, status, platform, type, priority, tags, deadline, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      validatedVideo.id,
      validatedVideo.title,
      validatedVideo.description ?? null,
      validatedVideo.link ?? null,
      validatedVideo.status,
      validatedVideo.platform,
      validatedVideo.type,
      validatedVideo.priority,
      validatedVideo.tags ?? "",
      validatedVideo.deadline.toISOString(),
      validatedVideo.created_at.toISOString(),
    ];

    try {
      await db.execute(query, params);

      // remove idea from the idea bank
      await db.execute(`DELETE FROM idea_bank WHERE id = ?`, [idea.id]);

      const updatedIdeas = get().ideas.filter((i) => i.id !== idea.id);
      set({ ideas: updatedIdeas });
    } catch (error: any) {
      console.error("Failed to convert idea to video:", error);
      throw error;
    }
  },
}));
