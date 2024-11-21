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
import { Toaster } from "./components/ui/toaster";
import ScheduleView from "./views/schedule";
import IdeaBank from "./views/idea-bank";
import { useIdeaBankStore } from "./stores/ideaBankStore";
import { Idea } from "./types/idea";
import IdeaBankModal from "./components/idea-modal";
import { useSettingsStore } from "./stores/settingsStore";
import SettingsView from "./views/settings";
import { useUpdater } from "./hooks/use-updater";
import ProgressBar from "./components/progress-bar";
import { useToast } from "./hooks/use-toast";

export type ActiveTab =
  | "videos"
  | "dashboard"
  | "schedule"
  | "ideas"
  | "settings";

function App() {
  // Use the Zustand store to access the videos
  const videos = useVideoStore((state) => state.videos);
  const ideas = useIdeaBankStore((state) => state.ideas);
  const settingsStore = useSettingsStore((state) => state);
  const settings = settingsStore.settings;

  const [activeTab, setActiveTab] = useState<ActiveTab>("settings");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);

  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  const { toast } = useToast(); // Use the toast hook

  const { progress, showProgressDialog, checkForUpdates } = useUpdater(toast); // Use the updater hook

  // @ts-ignore
  const RUNNING_IN_TAURI = window.__TAURI__ !== undefined;
  if (RUNNING_IN_TAURI) {
    checkForUpdates();
  }

  useEffect(() => {
    // Load the videos from the store
    useVideoStore.getState().loadVideos();
    useIdeaBankStore.getState().loadIdeas();

    settingsStore.initializeSettings();
    settingsStore.loadSetings();
  }, []);

  const ActiveTabComponent = () => {
    switch (activeTab) {
      case "videos":
        return (
          <VideosView
            videos={videos}
            setActiveVideo={setSelectedVideo}
            openModal={setIsModalOpen}
          />
        );
      case "ideas":
        return (
          <IdeaBank
            ideas={ideas}
            openModal={setIsIdeaModalOpen}
            setActiveIdea={setSelectedIdea}
          />
        );
      case "settings":
        return <SettingsView settings={settings} />;
      case "schedule":
        return (
          <ScheduleView
            openModal={() => {
              setSelectedVideo(null);
              setIsModalOpen(true);
            }}
            videos={videos}
          />
        );
      default:
        return <DashboardView videos={videos} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster />
      <SidebarProvider
        style={
          {
            "--sidebar-width": "15rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar onNavigate={setActiveTab} currentTab={activeTab} />
        <SidebarInset>
          <header className="flex shrink-0 sticky top-0 bg-background items-center gap-2 px-4 pt-4 pb-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            <ModeToggle />
            <VideoModal
              video={selectedVideo}
              open={isModalOpen}
              setOpen={setIsModalOpen}
              resetSelectedVideo={() => setSelectedVideo(null)}
              triggerVisible={activeTab === "videos"}
            />
            <IdeaBankModal
              idea={selectedIdea}
              open={isIdeaModalOpen}
              setOpen={setIsIdeaModalOpen}
              resetSelectedIdea={() => setSelectedIdea(null)}
              triggerVisible={activeTab === "ideas"}
            />
          </header>
          <div className="flex flex-1 justify-start flex-col gap-4 w-full mx-auto pb-2">
            <ActiveTabComponent />
          </div>
        </SidebarInset>
      </SidebarProvider>
      {showProgressDialog && <ProgressBar progress={progress} />}
    </ThemeProvider>
  );
}

export default App;
