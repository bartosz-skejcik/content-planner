import { useState, useEffect } from "react";
import { Idea, IdeaTargetAudience } from "@/types/idea";
import { Input } from "@/components/ui/input";
import { useTagStore } from "@/stores/tagStore";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/ui/multi-select";
import { VideoType } from "@/types/video";
import { Button } from "@/components/ui/button";

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
          values={tagsFilters}
          onValuesChange={setTagsFilters as any}
          loop
        >
          <MultiSelectorTrigger>
            <MultiSelectorInput placeholder="Select tags..." />
          </MultiSelectorTrigger>
          <MultiSelectorContent>
            <MultiSelectorList>
              {tagStore.tags.map((tag) => (
                <MultiSelectorItem key={tag.id} value={tag.name}>
                  {tag.name}
                </MultiSelectorItem>
              ))}
            </MultiSelectorList>
          </MultiSelectorContent>
        </MultiSelector>

        <MultiSelector
          values={contentTypesFilters}
          onValuesChange={setContentTypesFilters as any}
          loop
        >
          <MultiSelectorTrigger>
            <MultiSelectorInput placeholder="Select content types..." />
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
          values={targetAudienceFilters}
          onValuesChange={setTargetAudienceFilters as any}
          loop
        >
          <MultiSelectorTrigger>
            <MultiSelectorInput placeholder="Select target audience..." />
          </MultiSelectorTrigger>
          <MultiSelectorContent>
            <MultiSelectorList>
              {Object.values(IdeaTargetAudience).map((audience) => (
                <MultiSelectorItem key={audience} value={audience}>
                  {audience.charAt(0).toUpperCase() + audience.slice(1)}
                </MultiSelectorItem>
              ))}
            </MultiSelectorList>
          </MultiSelectorContent>
        </MultiSelector>

        <Button
          variant={staredIdeas ? "default" : "secondary"}
          onClick={() => setStaredIdeas(!staredIdeas)}
          className="font-normal"
        >
          Show only stared ideas
        </Button>
      </div>
    </div>
  );
};

export default IdeaSearchFilter;
