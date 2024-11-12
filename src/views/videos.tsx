import VideoCard from "@/components/video/card";
import { Video } from "@/types/video";
import { useState } from "react";
import VideoSearchFilter from "@/components/video-search-filter";

type Props = {
  videos: Video[];
  setActiveVideo: (video: Video) => void;
  openModal: (open: boolean) => void;
};

function VideosView({ videos, setActiveVideo, openModal }: Props) {
  const [filteredVideos, setFilteredVideos] = useState(videos);

  const handleFilter = (updatedVideos: Video[]) => {
    setFilteredVideos(updatedVideos);
  };

  return (
    <main className="w-full gap-4 items-center justify-center flex-col flex">
      <VideoSearchFilter videos={videos} onFilter={handleFilter} />
      {filteredVideos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          setActiveVideo={setActiveVideo}
          openModal={openModal}
        />
      ))}
    </main>
  );
}

export default VideosView;
