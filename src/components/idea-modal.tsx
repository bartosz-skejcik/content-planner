import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/ui/modal";
import { Idea } from "@/types/idea";
import { useIdeaBankStore } from "@/stores/ideaBankStore";
import { Tag } from "@/types/tags";
import MultiSelector from "./ui/multi-select";
import { useTagStore } from "@/stores/tagStore";
import { generateId } from "@/helpers/idea-bank";
import { useSettingsStore } from "@/stores/settingsStore";

const ideaSchema = z.object({
  id: z.string(),
  title: z.string({
    message: "Title is required",
  }),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(), // Full tag objects
  duration: z
    .string({
      message: "Duration is required",
    })
    .regex(/^\d+:\d+$/),
  content_type: z.string(),
  target_audience: z.string(),
  outline: z.string().nullable().optional(),
  is_favorite: z.boolean().default(false),
  created_at: z.date(),
  updated_at: z.date(),
});

type Props = {
  idea?: Idea | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  resetSelectedIdea: () => void;
  triggerVisible: boolean;
};

function getTagByName(name: string, tags: Tag[]): Tag | undefined {
  return tags.find((tag) => tag.name === name);
}

export default function IdeaBankModal({
  idea,
  open,
  setOpen,
  resetSelectedIdea,
  triggerVisible,
}: Props) {
  const availableTags = useTagStore((state) => state.tags);
  const { toast } = useToast();
  // @ts-expect-error Yet to implement loading state
  const [loading, setLoading] = useState(false);

  const types = useSettingsStore((state) => state.settings["type"]) || {
    items: [],
  };
  const targetAudience = useSettingsStore(
    (state) => state.settings["target audience"],
  ) || {
    items: [],
  };
  const videoTypes = types.items.map((type) => type.value) ?? [];
  const videoTargetAudience =
    targetAudience.items.map((audience) => audience.value) ?? [];

  const form = useForm({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      id: generateId(),
      title: null as string | null,
      description: null as string | null,
      tags: [] as string[],
      duration: null as string | null,
      content_type: "idle", // Default content type
      target_audience: null as string | null,
      outline: null as string | null,
      is_favorite: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  const ideaBankStore = useIdeaBankStore();

  useEffect(() => {
    if (idea) {
      form.reset({
        id: idea.id,
        title: idea.title,
        description: idea.description,
        tags: (idea.tags && idea.tags.map((v) => v.name)) ?? [],
        duration: idea.duration,
        content_type: idea.content_type,
        target_audience: idea.target_audience,
        outline: idea.outline,
        is_favorite: idea.is_favorite,
        created_at: idea.created_at,
        updated_at: idea.updated_at,
      });
    } else {
      form.reset({
        id: generateId(),
        title: null,
        description: "",
        tags: [],
        duration: null,
        content_type: "idle",
        target_audience: "",
        outline: null,
        is_favorite: false,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }, [idea, open]);

  function onSubmit(ideaData: z.infer<typeof ideaSchema>) {
    if (loading) return;
    if (ideaData.tags) {
      ideaData.tags = ideaData.tags.map((tag) => {
        const existingTag = getTagByName(tag, availableTags);
        if (existingTag) {
          return existingTag;
        }
        return {
          id: generateId(),
          name: tag,
          created_at: new Date(),
        } as Tag;
      }) as any;
    }

    try {
      if (idea) {
        ideaBankStore.updateIdea(idea.id!, ideaData as Partial<Idea>);
      } else {
        ideaBankStore.addIdea(ideaData as Idea);
      }
      setOpen(false);
    } catch (error: any) {
      console.error("Form submission error", error);
      toast({
        title: "Error",
        description: "Failed to submit the idea. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            resetSelectedIdea();
            setOpen(true);
          }}
          className={!triggerVisible ? "hidden" : ""}
        >
          Create Idea
        </Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle className="font-medium text-xl">
            {idea ? (
              <>
                Edit{" "}
                <span className="bg-muted ml-1 px-2 text-foreground/80">
                  {idea.title}
                </span>
              </>
            ) : (
              "Create a New Idea"
            )}
          </ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Fill in the details for your new idea.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <Form {...form}>
          {/* @ts-ignore */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Idea title"
                      value={field.value ?? ""}
                    />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Brief description of the idea"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiSelector
                      value={field.value.map((tag) => {
                        return { label: tag, value: tag };
                      })}
                      onChange={(tags) => {
                        field.onChange(tags.map((tag) => tag.value));
                      }}
                      defaultOptions={availableTags.map((tag) => {
                        return { label: tag.name, value: tag.name };
                      })}
                      creatable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., 10:00"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the estimated duration in minutes:minutes format.
                      eg. 10:15
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(videoTypes).map((type) => (
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="target_audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      // @ts-ignore
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the target audience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(videoTargetAudience).map((audience) => (
                          <SelectItem key={audience} value={audience}>
                            {audience.charAt(0).toUpperCase() +
                              audience.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="outline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outline</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Brief outline of the idea"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="relative z-[9999999]">
              {idea ? "Save changes" : "Create Idea"}
            </Button>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
