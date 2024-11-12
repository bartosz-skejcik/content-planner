import { Video } from "@/types/video";
import { calculateDashboardStats } from "@/lib/dashboard";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  LabelList,
  YAxis,
} from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  videos: Video[];
};

const monthlyChartConfig = {
  "monthly-completed": {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  "monthly-in-progress": {
    label: "In Progress",
    color: "hsl(var(--chart-2))",
  },
  "monthly-planned": {
    label: "Planned",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const timelineChartConfig = {
  videos: {
    label: "Videos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const statusChartConfig = {
  "status-completed": {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  "status-in-progress": {
    label: "In Progress",
    color: "hsl(var(--chart-2))",
  },
  "status-planned": {
    label: "Planned",
    color: "hsl(var(--chart-3))",
  },
  "status-created": {
    label: "Created",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

function DashboardView({ videos }: Props) {
  const {
    generalStats,
    statusDistribution,
    monthlyData,
    timelineData,
    productionStats,
  } = calculateDashboardStats(videos);
  //
  //const generalStats = {
  //  totalVideos: 46,
  //  completedVideos: 14,
  //  inProgressVideos: 10,
  //  avgDaysPerVideo: 12,
  //};
  //
  //const productionStats = [
  //  { name: "Average Days per Video", value: 12, target: 15 },
  //  { name: "Videos per Month", value: 36, target: 45 },
  //  { name: "Completion Rate", value: 30, target: 100 },
  //];
  //
  //const statusDistribution = [
  //  { name: "Completed", value: 14 },
  //  { name: "In Progress", value: 10 },
  //  { name: "Planned", value: 14 },
  //  { name: "Created", value: 8 },
  //];
  //
  //const timelineData = [
  //  { date: "2024-01", videos: 5 },
  //  { date: "2024-02", videos: 7 },
  //  { date: "2024-03", videos: 6 },
  //  { date: "2024-04", videos: 9 },
  //];
  //
  //const monthlyData = [
  //  { month: "Jan", completed: 4, inProgress: 2, planned: 3 },
  //  { month: "Feb", completed: 3, inProgress: 3, planned: 4 },
  //  { month: "Mar", completed: 5, inProgress: 1, planned: 2 },
  //  { month: "Apr", completed: 2, inProgress: 4, planned: 5 },
  //];

  return (
    <main className="w-full gap-4 items-center justify-center flex-col flex">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <TooltipProvider>
          <Card className="py-0 col-span-1 lg:col-span-2 w-full">
            <CardHeader className="flex items-center justify-between flex-row w-full">
              <CardTitle className="text-lg font-medium">
                Total Videos
              </CardTitle>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-blue-600 -mt-1.5" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Cumulative number of videos across all stages - including
                    completed, in progress, planned, and draft content
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{generalStats.totalVideos}</p>
            </CardContent>
          </Card>
        </TooltipProvider>

        <TooltipProvider>
          <Card className="py-0 col-span-1 lg:col-span-2 w-full">
            <CardHeader className="flex items-center justify-between flex-row w-full">
              <CardTitle className="text-lg font-medium">Completed</CardTitle>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-green-600 -mt-1.5" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Number of videos fully produced, edited, and ready for
                    distribution - represents 30% of total content
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {generalStats.completedVideos}
              </p>
            </CardContent>
          </Card>
        </TooltipProvider>

        <TooltipProvider>
          <Card className="py-0 col-span-1 lg:col-span-2 w-full">
            <CardHeader className="flex items-center justify-between flex-row w-full">
              <CardTitle className="text-lg font-medium">In Progress</CardTitle>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-yellow-600 -mt-1.5" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Videos currently being filmed or edited - actively moving
                    through the production pipeline
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {generalStats.inProgressVideos}
              </p>
            </CardContent>
          </Card>
        </TooltipProvider>

        <TooltipProvider>
          <Card className="py-0 col-span-1 lg:col-span-2 w-full">
            <CardHeader className="flex items-center justify-between flex-row w-full">
              <CardTitle className="text-lg font-semibold">
                Avg. Days/Video
              </CardTitle>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-purple-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Average time from starting production to completion - helps
                    track production efficiency
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {generalStats.avgDaysPerVideo}
              </p>
            </CardContent>
          </Card>
        </TooltipProvider>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {/* Video Status Distribution */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Video Status Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of videos by current production stage
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={statusChartConfig}
              className="min-h-[300px] w-full [&_.recharts-pie-label-text]:fill-foreground"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  {statusDistribution.map((entry) => (
                    <Cell
                      key={`cell-${entry.name.replace(" ", "-").toLowerCase()}`}
                      fill={`var(--color-status-${entry.name.replace(" ", "-").toLowerCase()})`}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex justify-center gap-3 flex-wrap">
            {statusDistribution.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1 text-sm">
                <div
                  className="rounded-full w-3 h-3"
                  style={{
                    backgroundColor: `hsl(var(--chart-${i + 1}))`,
                  }}
                />
                <p className="whitespace-nowrap">{entry.name}</p>
              </div>
            ))}
          </CardFooter>
        </Card>

        {/* Monthly Video Production */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Monthly Video Production
            </CardTitle>
            <CardDescription>Monthly breakdown of video status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={monthlyChartConfig}
              className="min-h-[300px] w-full"
            >
              <BarChart
                margin={{
                  top: 20,
                }}
                data={monthlyData}
                accessibilityLayer
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey="completed"
                  fill="var(--color-monthly-completed)"
                  radius={4}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
                <Bar
                  dataKey="inProgress"
                  fill="var(--color-monthly-in-progress)"
                  radius={4}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
                <Bar
                  dataKey="planned"
                  fill="var(--color-monthly-planned)"
                  radius={4}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex justify-center gap-3 flex-wrap">
            {/* Map the key-value pairs of the monthlyChartConfig */}
            {Object.entries(monthlyChartConfig).map(([key, value], i) => (
              <div key={key} className="flex items-center gap-1 text-sm">
                <div
                  className="rounded-full w-3 h-3"
                  style={{
                    backgroundColor: `hsl(var(--chart-${i + 1}))`,
                  }}
                />
                <p className="whitespace-nowrap">{value.label}</p>
              </div>
            ))}
          </CardFooter>
        </Card>

        {/* Video Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Video Production Timeline
            </CardTitle>
            <CardDescription>
              Historical trend of video completion rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={timelineChartConfig}
              className="min-h-[300px] w-full -ml-6"
            >
              <LineChart
                data={timelineData}
                margin={{
                  left: 12,
                  right: 12,
                }}
                accessibilityLayer
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleString("en", { month: "short" })
                  }
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={4}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        new Date(value).toLocaleString("en", { month: "long" })
                      }
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="videos"
                  stroke="var(--color-videos)"
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Productivity Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Production Statistics
            </CardTitle>
            <CardDescription>
              Key performance indicators tracking production efficiency and
              output quality
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {productionStats.map((stat, idx) => (
              <div key={idx}>
                <p className="text-sm text-foreground">{stat.name}</p>
                <p className="text-xs text-muted-foreground mb-1">
                  Time from production start to completion
                </p>
                <div className="flex items-center">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${stat.name.includes("per Video") ? "bg-blue-500" : stat.name.includes("per Month") ? "bg-green-500" : "bg-yellow-500"} rounded-full`}
                      style={{
                        width: `${stat.value < 0 ? 0 : (stat.value / stat.target) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 whitespace-nowrap w-[10%] text-end">
                    {stat.value}
                    {stat.name.includes("Rate") && "%"}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default DashboardView;
