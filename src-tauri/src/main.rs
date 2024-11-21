// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::env;
use tauri_plugin_sql::{Builder, Migration, MigrationKind};

#[tauri::command]
fn graceful_restart() {
    // Perform any necessary cleanup, then restart the app
    std::process::exit(0);
}

// Define the structure for the video attributes
#[derive(Serialize, Deserialize, Debug)]
pub struct Video {
    title: String,
    description: String,
    tags: Vec<String>,
}

// Structure for the function props
#[derive(Serialize, Deserialize, Debug)]
pub struct Props {
    video: Video,
    generate: String,
}

// Define the response structure to parse the Groq API response
#[derive(Deserialize, Debug)]
struct ApiResponse {
    choices: Vec<Choice>,
}

#[derive(Deserialize, Debug)]
struct Choice {
    message: Message,
}

#[derive(Deserialize, Debug)]
struct Message {
    content: String,
}

// Main function that Tauri calls from the frontend
#[tauri::command]
async fn generate_ai_response(props: Props) -> Result<String, String> {
    match get_groq_chat_completion(&props).await {
        Ok(content) => Ok(content),
        Err(err) => Err(format!("Error generating content: {}", err)),
    }
}

// Core function to interact with Groq's API
async fn get_groq_chat_completion(props: &Props) -> Result<String, String> {
    // Load the API key
    let api_key = env::var("GROQ_API_KEY")
        .map_err(|_| "GROQ_API_KEY is not set in the environment".to_string())?;

    // Initialize the HTTP client
    let client = Client::new();

    // craft 3 messages for each possible generation type: title, description, tags

    // Craft specific prompts for each generation type
    let prompt = match props.generate.as_str() {
        "title" => format!(
            "You are a professional YouTube content creator known for creating viral, attention-grabbing, clickbaity titles. \
            Create a short, engaging, clickbaity title for a video with these attributes: {:?}. \
            The title should be under 30 characters and create curiosity. \
            RESPOND ONLY WITH THE TITLE TEXT, no explanations or markers.",
            props.video
        ),
        "description" => format!(
            "You are a skilled YouTube content optimizer. \
            Create an engaging video description for a video with these attributes: {:?}. \
            Follow these rules:\
            1. First 2-3 sentences should hook the viewer and summarize the value they'll get\
            2. Use short paragraphs and easy-to-read formatting\
            3. Include a call-to-action for likes and subscriptions\
            4. Keep it positive and enthusiastic\
            5. Aim for 150-200 words\
            RESPOND ONLY WITH THE DESCRIPTION TEXT, no explanations or markers.",
            props.video
        ),
        "tags" => format!(
            "You are a YouTube SEO expert specialized in tag optimization. \
            Create a list of 15-20 highly relevant tags for a video with these attributes: {:?}. \
            The tags should:\
            1. Include both broad and specific keywords\
            2. Use relevant search terms people actually look for\
            3. Include some trending/popular related terms\
            4. Be ordered from most to least relevant\
            RESPOND ONLY WITH THE TAGS IN THIS FORMAT: tag1,tag2,tag3 (no spaces after commas)",
            props.video
        ),
        _ => return Err("Invalid generation type".to_string()),
    };

    let messages = vec![json!({
        "role": "user",
        "content": prompt,
    })];

    let payload = json!({
        "n": 1,
        "model": "llama-3.1-70b-versatile",
        "messages": messages,
    });

    // Send the request to the API
    let response = client
        .post("https://api.groq.com/openai/v1/chat/completions")
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&payload)
        .send()
        .await
        .map_err(|err| format!("Request failed: {}", err))?;

    // Parse the response
    let response_json: ApiResponse = response
        .json()
        .await
        .map_err(|err| format!("Failed to parse response JSON: {}", err))?;

    // Extract the generated content
    response_json
        .choices
        .first()
        .map(|choice| choice.message.content.clone())
        .ok_or_else(|| "No message content found in the response".to_string())
}

fn main() {
    let sql_query = "
DROP TABLE IF EXISTS videos;
DROP TABLE IF EXISTS subtasks;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS idea_bank;
DROP TABLE IF EXISTS idea_tags;
DROP TABLE IF EXISTS settings;


-- Table: videos
CREATE TABLE videos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    link TEXT,
    status TEXT NOT NULL CHECK (status IN ('idle', 'scripted', 'recorded', 'edited', 'thumbnail', 'created', 'published')),
    platform TEXT CHECK (platform IN ('youtube', 'tiktok', 'instagram', 'twitch', 'twitter')),
    type TEXT NOT NULL CHECK (type IN ('tutorial', 'vlog', 'review', 'talking', 'stream', 'other')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    tags TEXT,
    deadline DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    end_date DATE
);

CREATE TABLE subtasks (
    id TEXT PRIMARY KEY,
    video_id TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'In Progress', 'Completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (video_id) REFERENCES videos (id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE idea_bank (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT NOT NULL,
    content_type TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    outline TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE

);

CREATE TABLE idea_tags (
    idea_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (idea_id, tag_id),
    FOREIGN KEY (idea_id) REFERENCES idea_bank (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);

CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT
);
";

    let sql_create_settings = "
DROP TABLE IF EXISTS settings;

CREATE TABLE settings (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    value TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
";

    let sql_update_settings = "
ALTER TABLE settings DROP COLUMN title;
";

    let migrations = vec![
        Migration {
            version: 3,
            description: "initialize the database tables",
            sql: sql_query,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "initialize the settings table",
            sql: sql_create_settings,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "update the settings table",
            sql: sql_update_settings,
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(
            Builder::default()
                .add_migrations("sqlite:content-planner.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            generate_ai_response,
            graceful_restart
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
