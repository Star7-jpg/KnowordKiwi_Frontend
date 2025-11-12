import { Field, Label, Switch } from "@headlessui/react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { BlogPostFormData } from "@/app/posts/blog/schemas";
import QuizModal from "../modals/QuizModal";
import BlogPreview from "../blog/BlogPreview";
import QuizQuestionCreator from "./QuizQuestionCreator";
import QuizDisplay from "./QuizDisplay";
import ViewModeToggler, { ViewMode } from "./ViewModeToggler";
import { Question } from "@/types/posts/quiz/question";

interface QuizCreatorProps {
  formMethods: UseFormReturn<BlogPostFormData>;
}

export default function QuizCreator({ formMethods }: QuizCreatorProps) {
  const { watch, setValue } = formMethods;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewMode>("quiz");

  const savedQuiz = watch("quiz");
  const hasSavedQuiz = Array.isArray(savedQuiz) && savedQuiz.length > 0;

  const handlePreview = () => {
    if (activeView === "blog") {
      const { title, subtitle, content } = formMethods.getValues();
      return (
        <BlogPreview title={title} subtitle={subtitle} content={content} />
      );
    } else if (activeView === "quiz") {
      if (savedQuiz && savedQuiz.length > 0) {
        return <QuizDisplay questions={savedQuiz} />;
      } else {
        return (
          <QuizQuestionCreator
            initialQuestions={savedQuiz}
            onSave={handleOnSave}
          />
        );
      }
    }
    return null;
  };

  const handleOnSave = (questions?: Question[]) => {
    if (questions && questions.length > 0) {
      setValue("quiz", questions);
    } else {
      setValue("quiz", undefined); // Si no hay preguntas, limpiamos el campo
    }
    setIsModalOpen(false);
  };

  const handleShowSavedQuiz = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Field as="div" className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          {hasSavedQuiz ? (
            <>
              <Label className="text-lg">Quiz guardado en el borrador</Label>
              <button
                onClick={handleShowSavedQuiz}
                className="text-blue-500 hover:text-blue-400 underline text-lg"
              >
                Ver quiz
              </button>
            </>
          ) : (
            <>
              <Label className="text-lg">
                ¿Deseas añadir un quiz a tu publicación?
              </Label>
            </>
          )}
        </div>
        {!hasSavedQuiz && (
          <Switch
            checked={isModalOpen}
            onChange={setIsModalOpen}
            className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-800 transition data-checked:bg-primary"
          >
            <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
          </Switch>
        )}
      </Field>
      <QuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={hasSavedQuiz ? "Editar Quiz" : "Crear Quiz"}
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
