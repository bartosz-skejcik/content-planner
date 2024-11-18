import { useEffect, useState } from "react";
import { Idea } from "@/types/idea";
import { useIdeaBankStore } from "@/stores/ideaBankStore";
import Card from "@/components/idea-bank/card";
import { AnimatePresence, motion } from "framer-motion";
import IdeaSearchFilter from "@/components/idea-search-filter";

type Props = {
  ideas: Idea[];
  setActiveIdea: (idea: Idea) => void;
  openModal: (isOpen: boolean) => void;
};

function IdeaBank({ ideas, setActiveIdea, openModal }: Props) {
  const [filteredIdeas, setFilteredIdeas] = useState(ideas);
  const updateIdea = useIdeaBankStore((state) => state.updateIdea);
  const handleDelete = useIdeaBankStore((state) => state.deleteIdea);

  useEffect(() => {
    setFilteredIdeas(ideas);
  }, [ideas]);

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

  const toggleFavoriteIdea = async (idea: Idea) => {
    const ideaIdx = ideas.findIndex((i) => i.id === idea.id);

    if (ideaIdx === -1) return;

    const updatedIdeas = [...ideas];

    updatedIdeas[ideaIdx] = {
      ...idea,
      is_favorite: !idea.is_favorite,
    };

    setFilteredIdeas(updatedIdeas);

    // Update the store
    await updateIdea(idea.id!, { is_favorite: !idea.is_favorite });
  };

  return (
    <main className="flex flex-col items-center justify-center w-full gap-4 px-7">
      <IdeaSearchFilter ideas={ideas} onFilter={setFilteredIdeas} />

      <div className="grid w-full gap-4">
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
              <Card
                idea={idea}
                handleDelete={handleDeleteWithAnimation}
                toggleFavorite={toggleFavoriteIdea}
                setActiveIdea={setActiveIdea}
                openModal={openModal}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default IdeaBank;
