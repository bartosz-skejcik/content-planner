import { useEffect, useState } from "react";
import { Idea, IdeaTargetAudience } from "@/types/idea";
import { useIdeaBankStore } from "@/stores/ideaBankStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { VideoType } from "@/types/video";
import { generateId } from "@/helpers/idea-bank";
import Card from "@/components/idea-bank/card";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  ideas: Idea[];
  setActiveIdea: (idea: Idea) => void;
};

function IdeaBank({ ideas, setActiveIdea }: Props) {
  const [filteredIdeas, setFilteredIdeas] = useState(ideas);
  const { toast } = useToast();
  const addIdea = useIdeaBankStore((state) => state.addIdea);
  const updateIdea = useIdeaBankStore((state) => state.updateIdea);
  const handleDelete = useIdeaBankStore((state) => state.deleteIdea);

  useEffect(() => {
    setFilteredIdeas(ideas);
  }, [ideas]);

  async function handleUpdateIdea() {
    try {
      await updateIdea(ideas[0].id!, {
        title: "Updated Test Idea",
        description: "This is an updated test idea",
        tags: [
          {
            id: "1",
            name: "Test Tag",
            created_at: new Date(),
          },
          {
            id: "2",
            name: "Updated Test Tag",
            created_at: new Date(),
          },
        ],
      });
    } catch (e: any) {
      if (e.message && e.message === "Required") {
        e.message = `Expected: ${e.expected} but received: ${e.received} for ${e.path}`;
      }
      toast({
        title: "Error",
        description: e.message ?? e,
        variant: "destructive",
      });
    }
  }

  async function createNewTestIdea() {
    try {
      const idea: Idea = {
        title: "React Context vs Redux Comparison",
        target_audience: IdeaTargetAudience.ADVANCED,
        duration: "10:15",
        content_type: VideoType.Tutorial,
        outline:
          "Understanding Context API Redux Overview Performance Comparisons When to Use Each",
        tags: [
          {
            id: generateId(),
            name: "react",
            created_at: new Date(),
          },
          {
            id: generateId(),
            name: "redux",
            created_at: new Date(),
          },
          {
            id: generateId(),
            name: "context-api",
            created_at: new Date(),
          },
        ],
        created_at: new Date(),
        updated_at: new Date(),
      };
      await addIdea(idea);
    } catch (e: any) {
      if (e.message === "Required") {
        e.message = `Expected: ${e.expected} but received: ${e.received} for ${e.path}`;
      }
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
    }
  }

  const handleDeleteWithAnimation = async (id: string) => {
    try {
      // First, update the local state to trigger the animation
      setFilteredIdeas((prevIdeas) =>
        prevIdeas.filter((idea) => idea.id !== id),
      );

      // Then delete from the store after a short delay
      setTimeout(async () => {
        await handleDelete(id);
      }, 300); // Match this with your animation duration
    } catch (error) {
      console.error("Error deleting idea:", error);
      // Revert the local state if deletion fails
      setFilteredIdeas(ideas);
    }
  };

  return (
    <main className="w-full flex flex-col items-center justify-center gap-4 px-7">
      <div className="flex gap-4">
        <Button onClick={createNewTestIdea}>Create Test Idea</Button>
        <Button onClick={handleUpdateIdea} variant="secondary">
          Update Test Idea
        </Button>
      </div>

      <div className="w-full grid gap-4">
        <AnimatePresence>
          {filteredIdeas.map((idea) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 1, height: "auto" }}
              exit={{
                opacity: 0,
                height: 0,
                marginBottom: 0,
                overflow: "hidden",
                transition: { duration: 0.3 },
              }}
              transition={{
                opacity: { duration: 0.2 },
                height: { duration: 0.3 },
              }}
            >
              <Card idea={idea} handleDelete={handleDeleteWithAnimation} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default IdeaBank;
