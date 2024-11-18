import Database from "@tauri-apps/plugin-sql";

// Initialize the database connection
export const initializeStore = async () => {
  try {
    const db = await Database.load("sqlite:content-manager.db");
    return db;
  } catch (error) {
    console.error("Error loading the database:", error);
    return null;
  }
};
