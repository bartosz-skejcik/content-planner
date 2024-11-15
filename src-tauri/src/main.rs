// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::env;

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
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![generate_ai_response])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
