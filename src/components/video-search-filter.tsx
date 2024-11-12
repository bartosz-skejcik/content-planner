import { useState, useEffect } from "react";
import {
  Video,
  VideoStatus,
  VideoType,
  VideoPriority,
  VideoPlatform,
} from "@/types/video";
import { Input } from "@/components/ui/input";
import { getPlatformIcon, getStatusColor } from "@/types/video";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/ui/multi-select";

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
        (video.platform && platformFilters.includes(video.platform));

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
    <div className="grid grid-cols-1 gap-4 mb-8">
      <Input
        placeholder="Search videos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MultiSelector
          values={statusFilters}
          onValuesChange={setStatusFilters as any}
          loop
        >
          <MultiSelectorTrigger>
            <MultiSelectorInput placeholder="Select statuses..." />
          </MultiSelectorTrigger>
          <MultiSelectorContent>
            <MultiSelectorList>
              {Object.values(VideoStatus).map((status) => (
                <MultiSelectorItem
                  key={status}
                  value={status}
                  className="justify-start"
                >
                  <div
                    style={{
                      backgroundColor: getStatusColor(status).bg,
                      borderColor: getStatusColor(status).border,
                    }}
                    className="rounded-full w-3 h-3 border dark:border-none"
                  />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MultiSelectorItem>
              ))}
            </MultiSelectorList>
          </MultiSelectorContent>
        </MultiSelector>
        <MultiSelector
          values={typeFilters}
          onValuesChange={setTypeFilters as any}
          loop
        >
          <MultiSelectorTrigger>
            <MultiSelectorInput placeholder="Select types..." />
          </MultiSelectorTrigger>
          <MultiSelectorContent>
            <MultiSelectorList>
              {Object.values(VideoType).map((type) => (
                <MultiSelectorItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MultiSelectorItem>
              ))}
            </MultiSelectorList>
          </MultiSelectorContent>
        </MultiSelector>
        <MultiSelector
          values={priorityFilters}
          onValuesChange={setPriorityFilters as any}
          loop
        >
          <MultiSelectorTrigger>
            <MultiSelectorInput placeholder="Select priorities..." />
          </MultiSelectorTrigger>
          <MultiSelectorContent>
            <MultiSelectorList>
              {Object.values(VideoPriority).map((priority) => (
                <MultiSelectorItem key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </MultiSelectorItem>
              ))}
            </MultiSelectorList>
          </MultiSelectorContent>
        </MultiSelector>
        <MultiSelector
          values={platformFilters}
          onValuesChange={setPlatformFilters as any}
          loop
        >
          <MultiSelectorTrigger>
            <MultiSelectorInput placeholder="Select platforms..." />
          </MultiSelectorTrigger>
          <MultiSelectorContent>
            <MultiSelectorList>
              {Object.values(VideoPlatform).map((platform) => (
                <MultiSelectorItem
                  key={platform}
                  value={platform}
                  className="justify-start text-md"
                >
                  {getPlatformIcon(platform as VideoPlatform)}
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </MultiSelectorItem>
              ))}
            </MultiSelectorList>
          </MultiSelectorContent>
        </MultiSelector>
      </div>
    </div>
  );
};

export default VideoSearchFilter;
