import { Field, Label, Switch } from "@headlessui/react";
import { useState } from "react";
import QuizModal from "../modals/QuizModal";
import BlogPreview from "../blog/BlogPreview";
import QuizQuestionCreator from "./QuizQuestionCreator";
import ViewModeToggler, { ViewMode } from "./ViewModeToggler";

interface QuizCreatorProps {
  blogData: {
    title: string;
    subtitle: string;
    content: string;
  };
}

export default function QuizCreator({
  blogData: { title, subtitle, content },
}: QuizCreatorProps) {
  const [isQuizEnabled, setIsQuizEnabled] = useState(false);
  const [activeView, setActiveView] = useState<ViewMode>("blog");

  const handlePreview = () => {
    if (activeView === "blog") {
      return (
        <BlogPreview title={title} subtitle={subtitle} content={content} />
      );
    } else if (activeView === "quiz") {
      return (
        <QuizQuestionCreator
          onComplete={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      );
    }
    return null;
  };

  return (
    <>
      <Field as="div" className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg">
            ¿Deseas añadir un quiz a tu publicación?
          </Label>
        </div>
        <Switch
          checked={isQuizEnabled}
          onChange={setIsQuizEnabled}
          className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-800 transition data-checked:bg-primary"
        >
          <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
        </Switch>
      </Field>
      <QuizModal
        isOpen={isQuizEnabled}
        onClose={() => setIsQuizEnabled(false)}
        title="Crear Quiz"
      >
        <div className="flex flex-col items-center gap-4">
          <ViewModeToggler
            activeView={activeView}
            onViewChange={setActiveView}
          />
          {handlePreview()}
        </div>
      </QuizModal>
    </>
  );
}
