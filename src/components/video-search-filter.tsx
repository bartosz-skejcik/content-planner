import { useState, useEffect } from "react";
import { Video, VideoPlatform } from "@/types/video";
import { Input } from "@/components/ui/input";
import MultiSelector from "@/components/ui/multi-select";
import { useSettingsStore } from "@/stores/settingsStore";

type VideoSearchFilterProps = {
  videos: Video[];
  onFilter: (filteredVideos: Video[]) => void;
};

const VideoSearchFilter: React.FC<VideoSearchFilterProps> = ({
  videos,
  onFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [priorityFilters, setPriorityFilters] = useState<string[]>([]);
  const [platformFilters, setPlatformFilters] = useState<VideoPlatform[]>([]);

  const types = useSettingsStore((state) => state.settings["type"]);
  const VideoType = types.items.map((type) => type.value) ?? [];

  const statuses = useSettingsStore((state) => state.settings["status"]);
  const VideoStatus = statuses.items.map((status) => status.value) ?? [];

  const priorities = useSettingsStore((state) => state.settings["priority"]);
  const VideoPriority =
    priorities.items.map((priority) => priority.value) ?? [];

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
            setStatusFilters(options.map((option) => option.value));
          }}
          placeholder="Enter status"
        />

        <MultiSelector
          defaultOptions={Object.values(VideoType).map((type) => ({
            value: type,
            label: type.charAt(0).toUpperCase() + type.slice(1),
          }))}
          onChange={(options) => {
            setTypeFilters(options.map((option) => option.value));
          }}
          placeholder="Enter type"
        />

        <MultiSelector
          defaultOptions={Object.values(VideoPriority).map((priority) => ({
            value: priority,
            label: priority.charAt(0).toUpperCase() + priority.slice(1),
          }))}
          onChange={(options) => {
            setPriorityFilters(options.map((option) => option.value));
          }}
          placeholder="Enter priority"
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
          placeholder="Enter platform"
        />
      </div>
    </div>
  );
};

export default VideoSearchFilter;
