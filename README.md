# Content planner

Content Planner is a powerful and efficient tool for planning and managing your content creation process, written primarily in TypeScript with some components in Rust.

## Quick Demo

To see Content Planner in action, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/bartosz-skejcik/content-planner.git
   cd content-planner
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Build the project:

   ```sh
   npm run build
   ```

4. Start the server:
   ```sh
   npm start
   ```

Visit `http://localhost:3000` in your browser to access the application.

## Features

### Idea Bank

- **Basic Functionality:** Store and manage your content ideas.
- **Schema, Search, Tagging:** Organize your ideas with schemas, search functionality, and tags.
- **Integration with Video Entries:** Integrate your content ideas directly with video entries.

### Task Tracker

- **Subtasks:** Break down tasks into smaller, manageable subtasks.
- **Drag-and-Drop Calendar:** Easily manage deadlines and tasks with a drag-and-drop calendar.

### AI-Powered Suggestions

- **Script and Thumbnail Suggestions:** Utilize AI to generate script ideas and thumbnail suggestions.

### Notifications and Labels

- **Deadline Notifications:** Receive notifications for upcoming deadlines, integrated with calendar and tasks.
- **Status Labels:** Track video progress with customizable status labels.

### Analytics and Reporting

- **Progress Charts:** Visualize workflow efficiency with progress charts and analytics.

### Scriptwriting and Storyboarding

- **Script Editor:** Use a distraction-free script editor with templates and version control.
- **Readability Analyzer:** Analyze scripts for readability and runtime estimates.
- **Storyboarding Tools:** Visualize scenes and shots with storyboarding tools.

### Collaboration

- **Multi-User Support:** Collaborate with team members in real-time.
- **Cloud Storage:** Store video data, scripts, and assets in the cloud.

### From Releases

You can download and install Content Planner from the [releases page](https://github.com/bartosz-skejcik/content-planner/releases). The following files are available for each release:

- `content-planner.x86_64.rpm`: RPM package for Linux (x86_64)
- `content-planner_aarch64.dmg`: DMG package for macOS (Apple Silicon)
- `content-planner_amd64.AppImage`: AppImage for Linux (AMD64)
- `content-planner_amd64.deb`: DEB package for Linux (AMD64)
- `content-planner_x64-setup.exe`: Setup executable for Windows (x64)
- `content-planner_x64.dmg`: DMG package for macOS (Intel)
- `content-planner_x64_en-US.msi`: MSI installer for Windows (x64)
- `content-planner_aarch64.app.tar.gz`: Tarball for Linux (Apple Silicon)
- `content-planner_x64.app.tar.gz`: Tarball for Linux (x64)
- `Source code (zip)`
- `Source code (tar.gz)`

Download the appropriate file for your operating system and follow the installation instructions.

### Running Locally

To run Content Planner locally, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/bartosz-skejcik/content-planner.git
   cd content-planner
   ```

2. Install dependencies:

   ```sh
   bun install
   ```

3. Start the development server:
   ```sh
   bun dev:tauri
   ```

This application is built using Tauri and Bun, ensuring a lightweight and fast experience.

## Roadmap

| **Stage**   | **Goals**                                                                                           | **Timeline**   | **Status**    |
| ----------- | --------------------------------------------------------------------------------------------------- | -------------- | ------------- |
| **Stage 1** | **Foundational Improvements:**                                                                      | **2-3 weeks**  | `in-progress` |
|             | - [x] Refactor store for performance.                                                               |                | `done`        |
|             | - [x] Implement **Idea Bank** (basic functionality):                                                |                | `done`        |
|             | - [ ] Schema, search, tagging, and integration with video entries.                                  |                | `in-progress` |
|             | - [ ] Add subtasks to Task Tracker.                                                                 |                | `in-progress` |
|             | - [ ] Drag-and-drop in the calendar (for deadlines and tasks).                                      |                | `backlog`     |
| **Stage 2** | **Core Feature Enhancements:**                                                                      | **4-5 weeks**  | `backlog`     |
|             | - [ ] AI-powered script and thumbnail suggestions.                                                  |                | `backlog`     |
|             | - [ ] Deadline notifications (integrated with calendar and tasks).                                  |                | `backlog`     |
|             | - [ ] Implement **Status Labels** (customizable states for tracking video progress).                |                | `backlog`     |
|             | - [ ] Progress charts and analytics for tracking workflow efficiency.                               |                | `backlog`     |
| **Stage 3** | **Scriptwriting and Storyboarding:**                                                                | **4-6 weeks**  | `backlog`     |
|             | - [ ] Distraction-free Script Editor with templates and version control.                            |                | `backlog`     |
|             | - [ ] Readability analyzer for scripts (e.g., runtime estimates).                                   |                | `backlog`     |
|             | - [ ] Storyboarding tools for visualizing scenes/shots.                                             |                | `backlog`     |
| **Stage 4** | **Scalability and Collaboration:**                                                                  | **1-2 months** | `backlog`     |
|             | - [ ] Multi-user support for team collaboration.                                                    |                | `backlog`     |
|             | - [ ] Cloud storage for video data, scripts, and assets.                                            |                | `backlog`     |
|             | - [ ] Real-time collaboration on tasks and scripts.                                                 |                | `backlog`     |
| **Ongoing** | - [ ] UX and UI polish based on feedback.<br>- [ ] Ensure scalability and performance optimization. | **Continuous** | `backlog`     |

## Contributing

We welcome contributions of all kinds! If you have an idea for a new feature or have found a bug, please open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch (`git checkout -b feat/feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'add: new feature'`)
5. Push to the branch (`git push origin feat/feature-name`)
6. Open a pull request

Please make sure to update tests as appropriate.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
