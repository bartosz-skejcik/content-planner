import { ThemeProvider } from "@/providers/theme-provider";
import "@/index.css";
import { ModeToggle } from "@/components/mode-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import VideosView from "@/views/videos";
import DashboardView from "@/views/dashboard";
import { useVideoStore } from "@/stores/videoStore"; // Import the Zustand store
import VideoModal from "@/components/video-modal";
import { Video } from "@/types/video";
import { Toaster } from "sonner";
import ScheduleView from "./views/schedule";

export type ActiveTab = "videos" | "dashboard" | "schedule";

function App() {
  // Use the Zustand store to access the videos
  const videos = useVideoStore((state) => state.videos);

  const [activeTab, setActiveTab] = useState<ActiveTab>("videos");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load the videos from the store
    useVideoStore.getState().loadVideos();
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster theme="dark" />
      <SidebarProvider
        style={
          {
            "--sidebar-width": "15rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar onNavigate={setActiveTab} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            <ModeToggle />
            {activeTab === "videos" && (
              <VideoModal
                video={selectedVideo}
                open={isModalOpen}
                setOpen={setIsModalOpen}
                resetSelectedVideo={() => setSelectedVideo(null)}
              />
            )}
          </header>
          <div className="flex flex-1 justify-start flex-col gap-4 p-4 pt-0 w-11/12 lg:w-5/6 mx-auto">
            {activeTab === "videos" ? (
              <VideosView
                videos={videos}
                setActiveVideo={setSelectedVideo}
                openModal={setIsModalOpen}
              />
            ) : activeTab === "dashboard" ? (
              <DashboardView videos={videos} />
            ) : (
              <ScheduleView videos={videos} />
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
