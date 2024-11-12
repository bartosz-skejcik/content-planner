import { Instagram, Twitch, Twitter } from "lucide-react";
import { Tiktok, Youtube } from "iconoir-react/regular";

export enum VideoStatus {
  Idle = "idle",
  Scripted = "scripted",
  Recorded = "recorded",
  Edited = "edited",
  Thumbnail = "thumbnail",
  Created = "created",
  Published = "published",
}

export enum VideoType {
  Tutorial = "tutorial",
  Devlog = "devlog",
  Review = "review",
  Talking = "talking",
  Stream = "stream",
  Other = "other",
}

export enum VideoPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export enum VideoPlatform {
  YouTube = "youtube",
  TikTok = "tiktok",
  Instagram = "instagram",
  Twitch = "twitch",
  Twitter = "twitter",
}

export interface Video {
  id: string;
  title: string;
  description: string;
  link?: string;
  status: VideoStatus;
  platform?: VideoPlatform;
  type: VideoType;
  priority: VideoPriority;
  tags?: string[];
  deadline: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export function getStatusColor(status: VideoStatus) {
  switch (status) {
    case VideoStatus.Idle:
      return {
        bg: "#f9fafb",
        border: "#959595",
      };
    case VideoStatus.Scripted:
      return {
        bg: "#f59e0b",
        border: "#ed8936",
      };
    case VideoStatus.Recorded:
      return {
        bg: "#22c55e",
        border: "#16a34a",
      };
    case VideoStatus.Edited:
      return {
        bg: "#2563eb",
        border: "#1d4ed8",
      };
    case VideoStatus.Thumbnail:
      return {
        bg: "#d946ef",
        border: "#c026d3",
      };
    case VideoStatus.Created:
      return {
        bg: "#f97316",
        border: "#ea580c",
      };
    case VideoStatus.Published:
      return {
        bg: "#22d3ee",
        border: "#0ed7b5",
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
          className="w-5 h-5 aspect-square inline-flex mr-2 text-red-500"
        />
      );
    case VideoPlatform.TikTok:
      return (
        <Tiktok
          width={60}
          height={60}
          className="w-5 h-5 aspect-square inline-flex mr-2 text-pink-500"
        />
      );
    case VideoPlatform.Instagram:
      return (
        <Instagram
          size={60}
          className="w-5 h-5 aspect-square inline-flex mr-2 text-orange-400"
        />
      );
    case VideoPlatform.Twitch:
      return (
        <Twitch
          size={60}
          className="w-5 h-5 aspect-square inline-flex mr-2 text-purple-500"
        />
      );
    case VideoPlatform.Twitter:
      return (
        <Twitter
          size={60}
          className="w-5 h-5 aspect-square inline-flex mr-2 text-blue-400"
        />
      );
  }
}
