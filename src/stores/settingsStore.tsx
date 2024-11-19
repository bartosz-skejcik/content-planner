import { create } from "zustand";
import { initializeStore } from "./database"; // assuming initializeStore is a helper function to set up the database
import { z } from "zod";
import { Setting, Settings } from "@/types/settings";
import {
  addSettingToGroup,
  groupedSettings,
  updateSetting,
  validateSettingCategoryExists,
  deleteSetting,
} from "@/helpers/settings";
import { generateId } from "@/helpers/idea-bank";

const settingSchema = z.object({
  id: z.string(),
  value: z.string(),
  category: z.string(),
});

// Tag store to handle tag operations
export const useSettingsStore = create<{
  settings: Record<Setting["category"] | string, Settings>;
  loadSetings: () => Promise<void>;
  addSetting: (tag: Setting) => Promise<void>;
  updateSetting: (tag: Setting) => Promise<void>;
  deleteSetting: (id: string) => Promise<void>;
  initializeSettings: () => Promise<void>;
  isSettingIdle: (id: string) => Promise<boolean>;
}>((set, get) => ({
  settings: {},

  loadSetings: async () => {
    const db = await initializeStore();
    if (!db) return;

    try {
      const result = await db.select<Setting[]>("SELECT * FROM settings");

      const groupedResult = groupedSettings(result);

      set({ settings: groupedResult });
      console.log("groupedSettings", groupedResult);
    } catch (error) {
      throw error;
    }
  },

  addSetting: async (setting: Setting) => {
    const db = await initializeStore();
    if (!db) return;

    try {
      await settingSchema.parseAsync(setting);
    } catch (error) {
      throw error;
    }

    const settings = get().settings;

    const categoryExists = validateSettingCategoryExists(
      setting.category,
      settings,
    );

    if (!categoryExists) {
      throw new Error("Category does not exist");
    }

    try {
      await db.execute(
        "INSERT INTO settings (id, value, category) VALUES (?, ?, ?)",
        [setting.id, setting.value, setting.category],
      );

      // Update the settings in the store
      const updatedSettings = addSettingToGroup(setting, settings);

      set({ settings: updatedSettings });
    } catch (error) {
      throw error;
    }
  },

  updateSetting: async (setting: Setting) => {
    const db = await initializeStore();
    if (!db) return;

    try {
      await settingSchema.parseAsync(setting);
    } catch (error) {
      throw error;
    }

    const settings = get().settings;

    const categoryExists = validateSettingCategoryExists(
      setting.category,
      settings,
    );

    if (!categoryExists) {
      throw new Error("Category does not exist");
    }

    try {
      await db.execute("UPDATE settings SET value = ? WHERE id = ?", [
        setting.value,
        setting.id,
      ]);

      // Update the settings in the store
      const updatedSettings = updateSetting(setting, settings);

      set({ settings: updatedSettings });
    } catch (error) {
      throw error;
    }
  },

  deleteSetting: async (id) => {
    const db = await initializeStore();
    if (!db) return;

    const settings = get().settings;

    const isIdle = await get().isSettingIdle(id);

    if (isIdle) {
      throw new Error("Cannot delete idle setting");
    }

    try {
      // Update the settings in the store
      const updatedSettings = deleteSetting(id, settings);

      await db.execute("DELETE FROM settings WHERE id = ?", [id]);

      set({ settings: updatedSettings });
    } catch (error) {
      throw error;
    }
  },

  initializeSettings: async () => {
    const settings = get().settings;
    if (Object.keys(settings).length !== 0) return;

    console.log("Initializing settings. Store is empty");

    const db = await initializeStore();
    if (!db) return;

    const settingsArray = await db.select<Setting[]>("SELECT * FROM settings");

    console.log("Loaded settings from the database", settingsArray);

    if (settingsArray.length !== 0) return;

    console.log("Initializing default settings");

    const defaultSettings = [
      { id: generateId(), value: "idle", category: "status" },
      { id: generateId(), value: "scripted", category: "status" },
      { id: generateId(), value: "recorder", category: "status" },
      { id: generateId(), value: "edited", category: "status" },
      { id: generateId(), value: "thumbnail", category: "status" },
      { id: generateId(), value: "created", category: "status" },
      { id: generateId(), value: "published", category: "status" },
      { id: generateId(), value: "tutorial", category: "type" },
      { id: generateId(), value: "vlog", category: "type" },
      { id: generateId(), value: "review", category: "type" },
      { id: generateId(), value: "talking", category: "type" },
      { id: generateId(), value: "stream", category: "type" },
      { id: generateId(), value: "other", category: "type" },
      { id: generateId(), value: "low", category: "priority" },
      { id: generateId(), value: "medium", category: "priority" },
      { id: generateId(), value: "high", category: "" },
      { id: generateId(), value: "everyone", category: "target audience" },
      { id: generateId(), value: "beginner", category: "target audience" },
      { id: generateId(), value: "intermediate", category: "target audience" },
      { id: generateId(), value: "advanced", category: "target audience" },
      { id: generateId(), value: "expert", category: "target audience" },
    ];

    for (const setting of defaultSettings) {
      try {
        await db.execute(
          "INSERT INTO settings (id, value, category) VALUES (?, ?, ?)",
          [setting.id, setting.value, setting.category],
        );
      } catch (error) {
        throw error;
      }
    }

    const groupedResult = groupedSettings(defaultSettings);

    set({ settings: groupedResult });
  },

  isSettingIdle: async (id: string): Promise<boolean> => {
    try {
      const db = await initializeStore();
      if (!db) throw new Error("Database not initialized");

      const setting = await db.select<Setting[]>(
        "SELECT * FROM settings WHERE id = ?",
        [id],
      );

      return (
        (setting[0].value === "idle" && setting[0].category === "status") ??
        false
      );
    } catch (error) {
      console.error(error);
      return false;
    }
  },
}));
