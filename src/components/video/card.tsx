import {
  Card as UiCard,
  CardContent as UiCardContent,
} from "@/components/ui/card";
import {
  getPlatformIcon,
  getStatusColor,
  Video,
  VideoPlatform,
  VideoStatus,
} from "@/types/video";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { shortenString } from "@/lib/utils";
import { AlarmClock, EllipsisVertical, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useVideoStore } from "@/stores/videoStore";

type Props = {
  video: Video;
  setActiveVideo: (video: Video) => void;
  openModal: (open: boolean) => void;
};

function calculateDeadlineSeverityInDays(deadline: Date) {
  const diff = deadline.getTime() - new Date().getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function colorByDeadlineSeverity(deadline: Date) {
  const days = calculateDeadlineSeverityInDays(deadline) + 1;
  if (days <= 1) {
    return "red-500";
  } else if (days < 3) {
    return "yellow-500";
  } else {
    return "foreground";
  }
}

function VideoCard({ video, setActiveVideo, openModal }: Props) {
  // shorten the array to only three tags
  const parsedTags = video.tags ? video.tags.split(",") : [];
  const tags = parsedTags.slice(0, 3);

  const updateVideo = useVideoStore((state) => state.updateVideo);
  const deleteVideo = useVideoStore((state) => state.deleteVideo);

  return (
    <UiCard className="w-full">
      <UiCardContent className="flex w-full flex-col pt-5 gap-y-3 justify-center items-center">
        <div className="flex flex-row justify-between w-full items-start">
          <div className="flex items-start justify-between w-full flex-col">
            <button
              onClick={() => {
                setActiveVideo(video);
                openModal(true);
              }}
              className={`hover:underline ${colorByDeadlineSeverity(video.deadline) == "foreground" ? "decoration-foreground" : colorByDeadlineSeverity(video.deadline) == "yellow-500" ? "decoration-yellow-500" : "decoration-red-500"}`}
            >
              <h4
                className={`font-medium text-base lg:text-lg ${colorByDeadlineSeverity(video.deadline) == "foreground" ? "text-foreground" : colorByDeadlineSeverity(video.deadline) == "yellow-500" ? "text-yellow-500" : "text-red-500"}`}
              >
                {shortenString(video.title, 50)}
              </h4>
            </button>
            {video.description && (
              <p className="text-sm lg:text-base text-muted-foreground/70 font-light whitespace-pre-wrap">
                {shortenString(video.description, 100)}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <EllipsisVertical size={15} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="space-y-1">
              <DropdownMenuItem
                onClick={() => {
                  setActiveVideo(video);
                  openModal(true);
                }}
              >
                <Pencil size={15} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  deleteVideo(video.id);
                }}
              >
                <div className="flex items-center gap-2">
                  <Trash size={15} />
                  Delete
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="text-sm flex items-center flex-wrap text-muted-foreground justify-start w-full gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex gap-2 items-center hover:bg-muted-foreground/10 px-1 rounded-md">
                <div
                  style={{
                    backgroundColor: getStatusColor(video.status).bg,
                    borderColor: getStatusColor(video.status).border,
                  }}
                  className="rounded-full w-3 h-3 border dark:border-none"
                />
                <p
                  style={{ color: getStatusColor(video.status).border }}
                  className="capitalize"
                >
                  {video.status}
                </p>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.values(VideoStatus).map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => {
                    updateVideo(video.id, { status });
                  }}
                >
                  <div
                    style={{
                      backgroundColor: getStatusColor(status).bg,
                      borderColor: getStatusColor(status).border,
                    }}
                    className="rounded-full w-3 h-3 border dark:border-none"
                  />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {video.platform && (
            <>
              |
              <div className="flex gap-2 items-center text-sm">
                {getPlatformIcon(video.platform as VideoPlatform)}
                <span className="-ml-2.5 text-sm">
                  {video.platform.charAt(0).toUpperCase() +
                    video.platform.slice(1)}
                </span>
              </div>
            </>
          )}
          |
          <div className="flex gap-2 items-center text-sm">
            <AlarmClock size={15} />
            {video.deadline.toDateString()}
          </div>
          {video.tags && video.tags.length > 1 && (
            <>
              |
              <div className="flex gap-1 flex-wrap">
                {parsedTags.length! > 1 &&
                  tags.map((tag, index) => (
                    <>
                      <Badge
                        key={index}
                        variant="outline"
                        className="whitespace-nowrap"
                      >
                        {shortenString(tag, 15)}
                      </Badge>
                    </>
                  ))}
                {((video.tags && video.tags.length) || 0) > 3 && "…"}
              </div>
            </>
          )}
        </div>
      </UiCardContent>
    </UiCard>
  );
}

export default VideoCard;
