import { create } from "zustand";
import { z } from "zod";
import { load } from "@tauri-apps/plugin-store";
import {
  Video,
  VideoStatus,
  VideoType,
  VideoPriority,
  VideoPlatform,
} from "@/types/video";

// Define the Zod schema to validate video data
const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  link: z.string().optional(),
  status: z.nativeEnum(VideoStatus),
  platform: z.nativeEnum(VideoPlatform).optional(),
  type: z.nativeEnum(VideoType),
  priority: z.nativeEnum(VideoPriority),
  tags: z.array(z.string()).optional(),
  deadline: z
    .string()
    .transform((val) => new Date(val))
    .or(z.date()),
  createdAt: z
    .string()
    .transform((val) => new Date(val))
    .or(z.date()),
  endDate: z
    .string()
    .transform((val) => new Date(val))
    .or(z.date())
    .optional(),
  updatedAt: z
    .string()
    .transform((val) => new Date(val))
    .or(z.date())
    .optional(),
});

// Initialize the store, ensuring correct typing and structure
const initializeStore = async () => {
  try {
    const store = await load("videoStore.json", { autoSave: false });
    return store;
  } catch (error) {
    console.error("Error loading the store:", error);
    return null;
  }
};

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
    const store = await initializeStore();
    if (!store) return;

    const validatedVideo = videoSchema.parse(video);
    const currentVideos = get().videos;

    const updatedVideos = [...currentVideos, validatedVideo];
    await store.set("videos", updatedVideos);
    set({ videos: updatedVideos });

    await store.save();
  },

  // Updates a video by ID
  updateVideo: async (id, data) => {
    const store = await initializeStore();
    if (!store) return;

    const videos = get().videos;
    const videoIndex = videos.findIndex((video) => video.id === id);

    if (videoIndex === -1) return;

    const updatedVideo = {
      ...videos[videoIndex],
      ...data,
      updatedAt: new Date(),
    };
    try {
      videoSchema.parse(updatedVideo); // Validate with Zod
    } catch (error) {
      console.error("Error updating video:", error);
      return;
    }

    const updatedVideos = [...videos];
    updatedVideos[videoIndex] = updatedVideo;

    await store.set("videos", updatedVideos);

    set({ videos: updatedVideos });
    await store.save();
  },

  // Deletes a video by ID
  deleteVideo: async (id) => {
    const store = await initializeStore();
    if (!store) return;

    const updatedVideos = get().videos.filter((video) => video.id !== id);
    await store.set("videos", updatedVideos);
    set({ videos: updatedVideos });
    await store.save();
  },

  // Loads videos from the store
  loadVideos: async () => {
    const store = await initializeStore();
    if (!store) return;

    const storedVideos = await store.get<Video[]>("videos");
    if (storedVideos) {
      try {
        const validatedVideos = storedVideos.map((video) => {
          console.log("video", video);
          return videoSchema.parse(video);
        });

        set({ videos: validatedVideos });
      } catch (error) {
        console.error("Error parsing stored videos:", error);
      }
    }
  },
}));

// Automatically save any store modifications
initializeStore().then(async (store) => {
  const videosStore = await store?.get<Video[]>("videos");
  console.log("Initialize Store:", videosStore);
});
