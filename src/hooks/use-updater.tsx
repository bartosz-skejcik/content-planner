import { useState } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { invoke } from "@tauri-apps/api/core"; // Import Tauri invoke
import { ToastAction } from "@/components/ui/toast";

// Custom hook for handling updates
export const useUpdater = (toast: any) => {
  const [progress, setProgress] = useState(0);
  const [showProgressDialog, setShowProgressDialog] = useState(false);

  const checkForUpdates = async () => {
    // Check for updates
    const update = await check();
    if (update === null) {
      toast({
        title: "Failed to check for updates",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    } else if (update?.available) {
      toast({
        title: "Update Available",
        description: `Version ${update.version} is available!`,
        action: (
          <ToastAction
            onClick={async () => {
              try {
                setShowProgressDialog(true);

                let downloaded = 0;
                let contentLength = 0;

                await update.downloadAndInstall((event) => {
                  switch (event.event) {
                    case "Started":
                      contentLength = event.data.contentLength || 0;
                      break;
                    case "Progress":
                      downloaded += event.data.chunkLength;
                      const percentage = (downloaded / contentLength) * 100;
                      setProgress(percentage);
                      break;
                    case "Finished":
                      setProgress(100);
                      break;
                  }
                });

                setShowProgressDialog(false);
                // After the update is downloaded and installed, gracefully restart the app
                await invoke("graceful_restart");
              } catch (error) {
                console.error("Error during update check:", error);
                toast({
                  title: "An error occurred while checking for updates",
                  description: "Please try again later.",
                  variant: "destructive",
                });
              }
            }}
            altText="Update"
          >
            Update
          </ToastAction>
        ),
      });
    }
  };

  return { checkForUpdates, progress, showProgressDialog };
};
