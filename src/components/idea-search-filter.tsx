import { useState, useEffect } from "react";
import { Idea, IdeaTargetAudience } from "@/types/idea";
import { Input } from "@/components/ui/input";
import { useTagStore } from "@/stores/tagStore";
import MultiSelector from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settingsStore";

type IdeaSearchFilterProps = {
  ideas: Idea[];
  onFilter: (filteredIdeas: Idea[]) => void;
};

const IdeaSearchFilter: React.FC<IdeaSearchFilterProps> = ({
  ideas,
  onFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tagsFilters, setTagsFilters] = useState<string[]>([]);
  const [contentTypesFilters, setContentTypesFilters] = useState<string[]>([]);
  const [targetAudienceFilters, setTargetAudienceFilters] = useState<string[]>(
    [],
  );
  const [staredIdeas, setStaredIdeas] = useState<boolean>(false);

  const types = useSettingsStore((state) => state.settings["type"]);
  const VideoType = types.items.map((type) => type.value) ?? [];

  const tagStore = useTagStore();

  useEffect(() => {
    tagStore.fetchTags();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [
    searchTerm,
    ideas,
    tagsFilters,
    contentTypesFilters,
    targetAudienceFilters,
    staredIdeas,
  ]);

  const handleSearch = () => {
    let filteredIdeas = ideas.filter((idea) => {
      const matchesSearchTerm =
        searchTerm.trim() === "" ||
        idea.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTagsFilters =
        tagsFilters.length === 0 ||
        tagsFilters.some(
          (tag) => idea.tags?.some((ideaTag) => ideaTag.name === tag) ?? false,
        );
      const matchesContentTypesFilters =
        contentTypesFilters.length === 0 ||
        contentTypesFilters.includes(idea.content_type);
      const matchesTargetAudienceFilters =
        targetAudienceFilters.length === 0 ||
        targetAudienceFilters.includes(idea.target_audience);
      const matchesStaredIdeas =
        staredIdeas === false || idea.is_favorite === true;

      return (
        matchesSearchTerm &&
        matchesTagsFilters &&
        matchesContentTypesFilters &&
        matchesTargetAudienceFilters &&
        matchesStaredIdeas
      );
    });

    onFilter(filteredIdeas);
  };

  return (
    <div className="grid w-full grid-cols-1 gap-4 pt-4 mb-8">
      <Input
        placeholder="Search ideas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MultiSelector
          defaultOptions={tagStore.tags.map((tag) => ({
            value: tag.name,
            label: tag.name.charAt(0).toUpperCase() + tag.name.slice(1),
          }))}
          onChange={setTagsFilters as any}
          placeholder="Tags"
        />
        <MultiSelector
          defaultOptions={Object.values(VideoType).map((type) => ({
            value: type,
            label: type.charAt(0).toUpperCase() + type.slice(1),
          }))}
          onChange={(options) => {
            setContentTypesFilters(options.map((option) => option.value));
          }}
          placeholder="Content Type"
        />

        <MultiSelector
          defaultOptions={Object.values(IdeaTargetAudience).map((audience) => ({
            value: audience,
            label: audience.charAt(0).toUpperCase() + audience.slice(1),
          }))}
          onChange={(options) => {
            setTargetAudienceFilters(options.map((option) => option.value));
          }}
          placeholder="Target Audience"
        />

        <Button
          variant={staredIdeas ? "default" : "secondary"}
          onClick={() => setStaredIdeas(!staredIdeas)}
          className="font-normal"
        >
          Show only starred ideas
        </Button>
      </div>
    </div>
  );
};

export default IdeaSearchFilter;
