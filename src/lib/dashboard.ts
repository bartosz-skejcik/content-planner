import { Video, VideoStatus } from "@/types/video";

// Helper function to check if a video is completed
const isVideoCompleted = (status: VideoStatus) =>
  status === VideoStatus.Published;

// Helper function to check if a video is in progress
const isVideoInProgress = (status: VideoStatus) =>
  [
    VideoStatus.Scripted,
    VideoStatus.Recorded,
    VideoStatus.Edited,
    VideoStatus.Thumbnail,
  ].includes(status);

// Helper function to check if a video is planned
const isVideoPlanned = (status: VideoStatus) => status === VideoStatus.Idle;

// Helper function to check if a video is created but not published
const isVideoCreated = (status: VideoStatus) => status === VideoStatus.Created;

// Helper to get the month-year string from a date
const getMonthYear = (date: Date | string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// Helper to get month abbreviation
const getMonthAbbrev = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleString("default", { month: "short" });
};

export interface DashboardStats {
  generalStats: {
    totalVideos: number;
    completedVideos: number;
    inProgressVideos: number;
    avgDaysPerVideo: number;
  };
  statusDistribution: Array<{ name: string; value: number }>;
  monthlyData: Array<{
    month: string;
    completed: number;
    inProgress: number;
    planned: number;
  }>;
  timelineData: Array<{ date: string; videos: number }>;
  productionStats: Array<{ name: string; value: number; target: number }>;
}

export const calculateDashboardStats = (videos: Video[]): DashboardStats => {
  // Calculate general stats
  const completedVideos = videos.filter((v) => isVideoCompleted(v.status));
  const inProgressVideos = videos.filter((v) => isVideoInProgress(v.status));

  // Calculate average days per video for completed videos
  const avgDaysPerVideo =
    completedVideos.reduce((acc, video) => {
      const start = new Date(video.createdAt);
      const end = new Date(video.deadline);
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );
      return acc + days;
    }, 0) / (completedVideos.length || 1);

  // Calculate status distribution
  const statusCounts = {
    Completed: completedVideos.length,
    "In Progress": inProgressVideos.length,
    Planned: videos.filter((v) => isVideoPlanned(v.status)).length,
    Created: videos.filter((v) => isVideoCreated(v.status)).length,
  };

  // Calculate monthly data
  const monthlyStats = new Map<
    string,
    { completed: number; inProgress: number; planned: number }
  >();

  videos.forEach((video) => {
    const month = getMonthAbbrev(video.createdAt);
    const stats = monthlyStats.get(month) || {
      completed: 0,
      inProgress: 0,
      planned: 0,
    };

    if (isVideoCompleted(video.status)) stats.completed++;
    else if (isVideoInProgress(video.status)) stats.inProgress++;
    else if (isVideoPlanned(video.status)) stats.planned++;

    monthlyStats.set(month, stats);
  });

  // Calculate timeline data
  const timelineStats = new Map<string, number>();

  completedVideos.forEach((video) => {
    const monthYear = getMonthYear(video.updatedAt!);
    timelineStats.set(monthYear, (timelineStats.get(monthYear) || 0) + 1);
  });

  // calculate production statistics
  const productionStats = [
    {
      name: "Days per Video",
      value: Math.round(avgDaysPerVideo * 10) / 10,
      target: 10, // Example target, adjust as needed
    },
    {
      name: "Videos per Month",
      value:
        Math.round(
          (completedVideos.length /
            (videos.length > 0
              ? Math.ceil(
                  (new Date().getTime() -
                    new Date(
                      Math.min(
                        ...videos.map((v) => new Date(v.createdAt).getTime()),
                      ),
                    ).getTime()) /
                    (1000 * 60 * 60 * 24 * 30),
                )
              : 1)) *
            10,
        ) / 10,
      target: 5, // Example target, adjust as needed
    },
    {
      name: "Completion Rate",
      value: Math.round((completedVideos.length / videos.length) * 100),
      target: 90, // Example target, adjust as needed
    },
  ];

  return {
    generalStats: {
      totalVideos: videos.length,
      completedVideos: completedVideos.length,
      inProgressVideos: inProgressVideos.length,
      avgDaysPerVideo: Math.round(avgDaysPerVideo * 10) / 10,
    },
    statusDistribution: Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    })),
    monthlyData: Array.from(monthlyStats.entries()).map(([month, stats]) => ({
      month,
      ...stats,
    })),
    timelineData: Array.from(timelineStats.entries()).map(([date, videos]) => ({
      date,
      videos,
    })),
    productionStats,
  };
};

// Function to calculate recent trends and changes
export const calculateTrends = (videos: Video[]) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentVideos = videos.filter(
    (v) => new Date(v.createdAt) >= thirtyDaysAgo,
  );
  const previousVideos = videos.filter(
    (v) => new Date(v.createdAt) < thirtyDaysAgo,
  );

  const recentCompletionRate =
    recentVideos.filter((v) => isVideoCompleted(v.status)).length /
    recentVideos.length;
  const previousCompletionRate =
    previousVideos.filter((v) => isVideoCompleted(v.status)).length /
    previousVideos.length;

  return {
    completionRateChange:
      ((recentCompletionRate - previousCompletionRate) /
        previousCompletionRate) *
      100,
    recentProductionRate: recentVideos.length / 30, // videos per day
    totalProductionRate:
      videos.length /
      Math.ceil(
        (now.getTime() -
          new Date(
            Math.min(...videos.map((v) => new Date(v.createdAt).getTime())),
          ).getTime()) /
          (1000 * 60 * 60 * 24),
      ),
  };
};
