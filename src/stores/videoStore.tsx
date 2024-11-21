import { create } from "zustand";
import { z } from "zod";
import { Video, VideoPlatform } from "@/types/video";
import { initializeStore } from "./database";

// Define the Zod schema to validate video data
export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  link: z.string().nullable().optional(),
  status: z.string(),
  platform: z.nativeEnum(VideoPlatform),
  type: z.string(),
  priority: z.string(),
  tags: z.string().optional(),
  deadline: z
    .string()
    .transform((val) => new Date(val))
    .or(z.date()),
  created_at: z
    .string()
    .transform((val) => new Date(val))
    .or(z.date()),
  updated_at: z
    .string()
    .transform((val) => new Date(val))
    .or(z.date())
    .optional(),
  end_date: z
    .string()
    .transform((val) => new Date(val))
    .or(z.date())
    .nullable()
    .optional(),
});

// Define Zustand store for video management
export const useVideoStore = create<{
  videos: Video[];
  addVideo: (video: Video) => Promise<void>;
  updateVideo: (id: string, data: Partial<Video>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  loadVideos: () => Promise<void>;
}>((set, get) => ({
  videos: [],

  // Adds a new video
  addVideo: async (video) => {
    const db = await initializeStore();
    if (!db) return;
    let validatedVideo: Video;

    try {
      validatedVideo = videoSchema.parse(video);
    } catch (error: any) {
      throw error.message;
    }

    const query = `
      INSERT INTO videos (id, title, description, link, status, platform, type, priority, tags, deadline, created_at, updated_at, end_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)
    `;
    const params = [
      validatedVideo.id,
      validatedVideo.title,
      validatedVideo.description ?? null,
      validatedVideo.link ?? null,
      validatedVideo.status,
      validatedVideo.platform,
      validatedVideo.type,
      validatedVideo.priority,
      validatedVideo.tags ?? null,
      validatedVideo.deadline.toISOString(),
      // here is the current timestamp
      validatedVideo.updated_at?.toISOString() ?? null,
      validatedVideo.end_date?.toISOString() ?? null,
    ];

    try {
      await db.execute(query, params);

      set({ videos: [...get().videos, validatedVideo] });
    } catch (error: any) {
      throw error.message;
    }
  },

  // Updates a video by ID
  updateVideo: async (id, data) => {
    const db = await initializeStore();
    if (!db) return;

    const currentVideos = get().videos;
    const videoIndex = currentVideos.findIndex((v) => v.id === id);
    if (videoIndex === -1) return;

    const updatedVideo = {
      ...currentVideos[videoIndex],
      ...data,
      updated_at: new Date(),
    };
    videoSchema.parse(updatedVideo);

    const query = `
      UPDATE videos
      SET title = ?, description = ?, link = ?, status = ?, platform = ?, type = ?, priority = ?, tags = ?, deadline = ?, updated_at = ?, end_date = ?
      WHERE id = ?
    `;
    const params = [
      updatedVideo.title,
      updatedVideo.description ?? null,
      updatedVideo.link ?? null,
      updatedVideo.status,
      updatedVideo.platform,
      updatedVideo.type,
      updatedVideo.priority,
      updatedVideo.tags ?? null,
      updatedVideo.deadline.toISOString(),
      updatedVideo.updated_at?.toISOString() ?? null,
      updatedVideo.end_date?.toISOString() ?? null,
      id,
    ];

    try {
      await db.execute(query, params);
      const updatedVideos = [...currentVideos];
      updatedVideos[videoIndex] = updatedVideo;
      set({ videos: updatedVideos });
    } catch (error: any) {
      throw error.message;
    }
  },

  // Deletes a video by ID
  deleteVideo: async (id) => {
    const db = await initializeStore();
    if (!db) return;

    const query = `DELETE FROM videos WHERE id = ?`;

    try {
      await db.execute(query, [id]);
      const updatedVideos = get().videos.filter((v) => v.id !== id);
      set({ videos: updatedVideos });
    } catch (error: any) {
      throw error.message;
    }
  },

  // Loads videos from the database
  loadVideos: async () => {
    const db = await initializeStore();
    if (!db) return;

    const query = `SELECT * FROM videos`;

    try {
      const result = await db.select<Video[]>(query);
      console.log(result);
      const validatedVideos = result.map((row) =>
        videoSchema.parse({
          ...row,
          deadline: new Date(row.deadline),
          created_at: new Date(row.created_at),
          updated_at: row.updated_at ? new Date(row.updated_at) : undefined,
          end_date: row.end_date ? new Date(row.end_date) : undefined,
        }),
      );
      set({ videos: validatedVideos });
    } catch (error: any) {
      throw error.message;
    }
  },
}));
