import { useState, useEffect } from "react";
import {
  Video,
  VideoStatus,
  VideoType,
  VideoPriority,
  VideoPlatform,
} from "@/types/video";
import { Input } from "@/components/ui/input";
import MultiSelector from "@/components/ui/multi-select";

type VideoSearchFilterProps = {
  videos: Video[];
  onFilter: (filteredVideos: Video[]) => void;
};

const VideoSearchFilter: React.FC<VideoSearchFilterProps> = ({
  videos,
  onFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState<VideoStatus[]>([]);
  const [typeFilters, setTypeFilters] = useState<VideoType[]>([]);
  const [priorityFilters, setPriorityFilters] = useState<VideoPriority[]>([]);
  const [platformFilters, setPlatformFilters] = useState<VideoPlatform[]>([]);

  useEffect(() => {
    handleSearch();
  }, [
    searchTerm,
    statusFilters,
    typeFilters,
    priorityFilters,
    platformFilters,
    videos,
  ]);

  const handleSearch = () => {
    let filteredVideos = videos.filter((video) => {
      const matchesSearchTerm =
        searchTerm.trim() === "" ||
        video.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatusFilters =
        statusFilters.length === 0 || statusFilters.includes(video.status);
      const matchesTypeFilters =
        typeFilters.length === 0 || typeFilters.includes(video.type);
      const matchesPriorityFilters =
        priorityFilters.length === 0 ||
        priorityFilters.includes(video.priority);
      const matchesPlatformFilters =
        platformFilters.length === 0 ||
        (video.platform &&
          platformFilters.includes(video.platform as VideoPlatform));

      return (
        matchesSearchTerm &&
        matchesStatusFilters &&
        matchesTypeFilters &&
        matchesPriorityFilters &&
        matchesPlatformFilters
      );
    });

    onFilter(filteredVideos);
  };

  return (
    <div className="grid w-full grid-cols-1 gap-4 pt-4 mb-8">
      <Input
        placeholder="Search videos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MultiSelector
          // @ts-ignore
          defaultOptions={Object.values(VideoStatus).map((status) => ({
            value: status,
            label: status.charAt(0).toUpperCase() + status.slice(1),
          }))}
          onChange={(options) => {
            setStatusFilters(
              options.map((option) => option.value as VideoStatus),
            );
          }}
        />

        <MultiSelector
          defaultOptions={Object.values(VideoType).map((type) => ({
            value: type,
            label: type.charAt(0).toUpperCase() + type.slice(1),
          }))}
          onChange={(options) => {
            setTypeFilters(options.map((option) => option.value as VideoType));
          }}
        />

        <MultiSelector
          defaultOptions={Object.values(VideoPriority).map((priority) => ({
            value: priority,
            label: priority.charAt(0).toUpperCase() + priority.slice(1),
          }))}
          onChange={(options) => {
            setPriorityFilters(
              options.map((option) => option.value as VideoPriority),
            );
          }}
        />

        <MultiSelector
          defaultOptions={Object.values(VideoPlatform).map((platform) => ({
            value: platform,
            label: platform.charAt(0).toUpperCase() + platform.slice(1),
          }))}
          onChange={(options) => {
            setPlatformFilters(
              options.map((option) => option.value as VideoPlatform),
            );
          }}
        />
      </div>
    </div>
  );
};

export default VideoSearchFilter;
