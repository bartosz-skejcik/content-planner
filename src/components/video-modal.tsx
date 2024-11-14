import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
//import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
//import { format } from "date-fns";
//import {
//  Popover,
//  PopoverContent,
//  PopoverTrigger,
//} from "@/components/ui/popover";
//import { Calendar } from "@/components/ui/calendar";
import {
  //Calendar as CalendarIcon,
  WandSparkles,
} from "lucide-react";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/ui/modal";
import {
  Video,
  VideoStatus,
  VideoType,
  VideoPriority,
  VideoPlatform,
  getPlatformIcon,
} from "@/types/video";
import { useVideoStore } from "@/stores/videoStore";
import { invoke } from "@tauri-apps/api/core";
import { Badge } from "./ui/badge";
import { DateTimePicker } from "./ui/datetime";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  link: z.string().url("Invalid URL").optional(),
  description: z.string(),
  status: z.nativeEnum(VideoStatus),
  platform: z.nativeEnum(VideoPlatform).optional(),
  type: z.nativeEnum(VideoType),
  deadline: z.date(),
  priority: z.nativeEnum(VideoPriority),
  tags: z.string().optional(),
  createdAt: z.date(),
  endDate: z.date().optional(),
});

type Props = {
  video: Video | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  resetSelectedVideo: () => void;
  triggerVisible: boolean;
};

export default function VideoModal({
  video,
  open,
  setOpen,
  resetSelectedVideo,
  triggerVisible,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      link: "",
      description: "",
      status: VideoStatus.Idle,
      type: VideoType.Tutorial,
      deadline: new Date(),
      priority: VideoPriority.Medium,
      tags: "",
      createdAt: new Date(),
      endDate: new Date(),
    },
  });

  const addVideo = useVideoStore((state) => state.addVideo);
  const updateVideo = useVideoStore((state) => state.updateVideo);
  const [loading, setLoading] = useState(false);

  async function generate(
    video: {
      title?: string;
      description?: string;
      tags?: string[];
    },
    generate: "title" | "description" | "tags",
  ): Promise<string> {
    setLoading(true);
    const props = {
      video: video,
      generate: generate,
    };

    const response = await invoke("generate_ai_response", { props });
    console.log(response);
    setLoading(false);
    return response as string;
  }

  useEffect(() => {
    if (video) {
      form.reset({
        title: video.title,
        link: video.link,
        description: video.description,
        status: video.status,
        platform: video.platform,
        type: video.type,
        deadline: video.deadline,
        priority: video.priority,
        tags: video.tags ? video.tags?.join(",") : "",
        createdAt:
          typeof video.createdAt === "string"
            ? new Date(video.createdAt)
            : video.createdAt,
        endDate: video.endDate ?? undefined,
      });
    } else {
      form.reset({
        title: "",
        link: undefined,
        description: "",
        status: VideoStatus.Idle,
        platform: VideoPlatform.YouTube,
        type: VideoType.Tutorial,
        deadline: new Date(),
        priority: VideoPriority.Low,
        tags: "",
        createdAt: new Date(),
        endDate: undefined,
      });
    }
  }, [video, open]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (loading) return;
    try {
      // save the video
      if (video) {
        const updatedValues = {
          ...values,
          tags: values.tags?.split(",").map((tag) => tag.trim()),
        };

        updateVideo(video.id, updatedValues);
      } else {
        const randomId = Math.random().toString(36).substr(2, 9);
        const updatedValues = {
          id: randomId,
          ...values,
          tags: values.tags?.split(",").map((tag) => tag.trim()),
        };
        addVideo(updatedValues);
      }
      setOpen(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen} defaultOpen={false}>
      <ResponsiveModalTrigger asChild>
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            resetSelectedVideo();
            setOpen(true);
          }}
          className={!triggerVisible ? "hidden" : ""}
        >
          Plan content
        </Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent side="bottom">
        <ResponsiveModalHeader>
          <ResponsiveModalTitle className="font-medium text-xl">
            {video ? (
              <>
                Edit{" "}
                <span className="bg-muted ml-1 px-2 text-foreground/80">
                  {video.title}
                </span>
              </>
            ) : (
              "Plan a new video"
            )}
          </ResponsiveModalTitle>
          <ResponsiveModalDescription className="font-light pb-4">
            Fill in the details for your video below.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-1 items-center">
                    Title
                    <Button
                      variant="link"
                      size="sm"
                      className="text-primary"
                      disabled={form.getValues().description.length < 10}
                      onClick={async () => {
                        form.setValue("title", "");
                        const formValues = form.getValues();
                        const title = await generate(
                          {
                            title: "",
                            description: formValues.description,
                            tags: formValues.tags?.split(","),
                          },
                          "title",
                        );

                        form.setValue("title", title.replace(/"/g, ""));
                      }}
                    >
                      Generate
                      <WandSparkles className="h-2 w-2" />
                    </Button>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Video title" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-1 items-center">
                    Description
                    <Button
                      variant="link"
                      size="sm"
                      className="text-primary"
                      disabled={form.getValues().title.length < 10}
                      onClick={async () => {
                        form.setValue("description", "");
                        const formValues = form.getValues();
                        const description = await generate(
                          {
                            title: formValues.title,
                            description: "",
                            tags: formValues.tags?.split(","),
                          },
                          "description",
                        );

                        form.setValue(
                          "description",
                          description.replace(/"/g, ""),
                        );
                      }}
                    >
                      Generate
                      <WandSparkles className="h-2 w-2" />
                    </Button>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A short or long description"
                      className="resize-none"
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="font-normal opacity-60">
                    Resource link for the video
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(VideoPriority).map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority.charAt(0).toUpperCase() +
                                priority.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder="Select the platform"
                              className="flex flex-row items-center"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(VideoPlatform).map((platform) => (
                            <SelectItem
                              key={platform}
                              value={platform}
                              className="text-center flex items-center"
                            >
                              {getPlatformIcon(platform as VideoPlatform)}
                              <span>
                                {platform.charAt(0).toUpperCase() +
                                  platform.slice(1)}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="font-normal opacity-60">
                        Platform where the video will be published
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(VideoStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(VideoType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col pt-1 font-light">
                      <FormLabel className="pb-1.5">
                        {form.getValues("type") === "stream"
                          ? "Start time"
                          : "Deadline"}
                      </FormLabel>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  disabled={form.getValues("type") !== "stream"}
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col pt-1 font-light">
                      <FormLabel className="pb-1.5 disabled:opacity-30">
                        End time
                      </FormLabel>
                      <DateTimePicker
                        disabled={form.getValues("type") !== "stream"}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-1 items-center">
                    Tags
                    <Button
                      variant="link"
                      size="sm"
                      className="text-primary"
                      disabled={
                        form.getValues().description.length < 10 ||
                        form.getValues().title.length < 10
                      }
                      onClick={async () => {
                        form.setValue("tags", "");
                        const formValues = form.getValues();
                        const tags = await generate(
                          {
                            title: formValues.title,
                            description: formValues.description,
                            tags: [],
                          },
                          "tags",
                        );

                        if (tags) {
                          form.setValue("tags", tags.replace(/"/g, ""));
                        }
                      }}
                    >
                      Generate
                      <WandSparkles className="h-2 w-2" />
                    </Button>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Youtube video tags"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="font-normal">
                    <p>Separate tags with commas e.g. "javascript,react,css"</p>
                    <div className="flex items-start justify-start gap-2 flex-wrap mt-2">
                      {form.getValues().tags!.length > 0 &&
                        form
                          .getValues()
                          .tags?.split(",")
                          .map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="font-normal text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                    </div>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              {video ? "Save changes" : "Plan video"}
            </Button>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
