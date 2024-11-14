import { Button } from "@/components/ui/button";
import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarEvent,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
} from "@/components/ui/full-calendar";
import { Video } from "@/types/video";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  videos: Video[] | null;
};

function addTimeToDate(date: Date, timeToAdd: number = 1): Date {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + timeToAdd);
  return newDate;
}

function transformVideosToEvents(videos: Video[]): CalendarEvent[] {
  // add one hour to the end date
  console.log("transformVideosToEvents", videos);
  return videos.map((video) => ({
    id: video.id,
    start: new Date(video.deadline),
    end: addTimeToDate(new Date(video.deadline), 1),
    title: video.title,
    color: "blue",
  }));
}

function ScheduleView({ videos }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  useEffect(() => {
    if (videos) {
      setEvents(transformVideosToEvents(videos));
    }
  }, [videos]);

  console.log("Schedule view:", events);

  return (
    <main className="w-full gap-4 items-center justify-center flex-col flex">
      {events.length > 0 && (
        <Calendar events={events}>
          <div className="h-dvh w-full py-6 flex flex-col">
            <div className="flex px-6 items-center gap-2 mb-6">
              <CalendarViewTrigger
                className="aria-[current=true]:bg-accent font-normal"
                view="day"
              >
                Day
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="week"
                className="aria-[current=true]:bg-accent font-normal"
              >
                Week
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="month"
                className="aria-[current=true]:bg-accent font-normal"
              >
                Month
              </CalendarViewTrigger>

              <span className="flex-1" />

              <CalendarCurrentDate />

              <CalendarPrevTrigger>
                <ChevronLeft size={20} />
                <span className="sr-only">Previous</span>
              </CalendarPrevTrigger>

              <CalendarTodayTrigger className="font-normal">
                Today
              </CalendarTodayTrigger>

              <CalendarNextTrigger>
                <ChevronRight size={20} />
                <span className="sr-only">Next</span>
              </CalendarNextTrigger>

              <Button
                variant="default"
                className="font-normal"
                onClick={() => console.log("Add event")}
              >
                Add event
              </Button>
            </div>

            <div className="flex-1 overflow-auto px-6 relative">
              <CalendarDayView />
              <CalendarWeekView />
              <CalendarMonthView />
              <CalendarYearView />
            </div>
          </div>
        </Calendar>
      )}
    </main>
  );
}

export default ScheduleView;
