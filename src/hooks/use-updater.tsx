import { useCallback, useState } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { ask, message } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core"; // Import Tauri invoke

// Custom hook for handling updates
export const useUpdater = () => {
  const [progress, setProgress] = useState(0);
  const [showProgressDialog, setShowProgressDialog] = useState(false);

  const checkForUpdates = useCallback(async (onUserClick = false) => {
    try {
      // Check for updates
      const update = await check();
      if (update === null) {
        await message("Failed to check for updates.\nPlease try again later.", {
          title: "Error",
          kind: "error",
          okLabel: "OK",
        });
        return;
      } else if (update?.available) {
        const userConfirmed = await ask(
          `Update to ${update.version} is available!\n\nRelease notes: ${update.body}`,
          {
            title: "Update Available",
            kind: "info",
            okLabel: "Update",
            cancelLabel: "Cancel",
          },
        );
        if (userConfirmed) {
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
        }
      } else if (onUserClick) {
        await message("You are on the latest version. Stay awesome!", {
          title: "No Update Available",
          kind: "info",
          okLabel: "OK",
        });
      }
    } catch (error) {
      console.error("Error during update check:", error);
      await message(
        "An error occurred while checking for updates. Please try again later.",
        {
          title: "Error",
          kind: "error",
          okLabel: "OK",
        },
      );
    }
  }, []);

  return { checkForUpdates, progress, showProgressDialog };
};
