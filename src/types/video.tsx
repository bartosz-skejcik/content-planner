import { Instagram, Twitch, Twitter } from "lucide-react";
import { Tiktok, Youtube } from "iconoir-react/regular";
import { Subtask } from "./subtask";
//
//export enum VideoStatus {
//    Idle = "idle",
//    Scripted = "scripted",
//    Recorded = "recorded",
//    Edited = "edited",
//    Thumbnail = "thumbnail",
//    Created = "created",
//    Published = "published",
//}
//
//export enum VideoType {
//    Tutorial = "tutorial",
//    Vlog = "vlog",
//    Review = "review",
//    Talking = "talking",
//    Stream = "stream",
//    Other = "other",
//}
//
//export enum VideoPriority {
//    Low = "low",
//    Medium = "medium",
//    High = "high",
//}

export enum VideoPlatform {
  YouTube = "youtube",
  TikTok = "tiktok",
  Instagram = "instagram",
  Twitch = "twitch",
  Twitter = "twitter",
}

// Adjustments to Video and Idea Types
export interface Video {
  id: string;
  title: string;
  description?: string;
  link?: string | null;
  status: string;
  platform: string;
  type: string;
  priority: string;
  tags?: string;
  subtasks?: Subtask[];
  deadline: Date;
  created_at: Date;
  updated_at?: Date;
  end_date?: Date | null;
}

export function getStatusColor(status: string) {
  switch (status) {
    case "idle":
      return {
        bg: "#f9fafb",
        border: "#959595",
      };
    case "scripted":
      return {
        bg: "#f59e0b",
        border: "#ed8936",
      };
    case "recorded":
      return {
        bg: "#22c55e",
        border: "#16a34a",
      };
    case "edited":
      return {
        bg: "#2563eb",
        border: "#1d4ed8",
      };
    case "thumbnail":
      return {
        bg: "#d946ef",
        border: "#c026d3",
      };
    case "created":
      return {
        bg: "#f97316",
        border: "#ea580c",
      };
    case "published":
      return {
        bg: "#22d3ee",
        border: "#0ed7b5",
      };
    default:
      return {
        bg: "#f9fafb",
        border: "#959595",
      };
  }
}

export function getPlatformIcon(platform: VideoPlatform) {
  switch (platform) {
    case VideoPlatform.YouTube:
      return (
        <Youtube
          width={100}
          height={100}
          className="inline-flex w-5 h-5 mr-2 text-red-500 aspect-square"
        />
      );
    case VideoPlatform.TikTok:
      return (
        <Tiktok
          width={60}
          height={60}
          className="inline-flex w-5 h-5 mr-2 text-pink-500 aspect-square"
        />
      );
    case VideoPlatform.Instagram:
      return (
        <Instagram
          size={60}
          className="inline-flex w-5 h-5 mr-2 text-orange-400 aspect-square"
        />
      );
    case VideoPlatform.Twitch:
      return (
        <Twitch
          size={60}
          className="inline-flex w-5 h-5 mr-2 text-purple-500 aspect-square"
        />
      );
    case VideoPlatform.Twitter:
      return (
        <Twitter
          size={60}
          className="inline-flex w-5 h-5 mr-2 text-blue-400 aspect-square"
        />
      );
  }
}
