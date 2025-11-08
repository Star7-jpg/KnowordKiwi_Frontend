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
  const { getValues, setValue } = formMethods;
  const [isQuizEnabled, setIsQuizEnabled] = useState(false);
  const [activeView, setActiveView] = useState<ViewMode>("blog");
  const [savedQuiz, setSavedQuiz] = useState<Question[] | null>(null);

  // Load saved quiz from form if exists
  const formValues = getValues();
  const quizFromForm = formValues.quiz || null;
  
  // Set initial savedQuiz if it exists in form
  if (quizFromForm && !savedQuiz) {
    setSavedQuiz(quizFromForm);
  }

  const handlePreview = () => {
    if (activeView === "blog") {
      const { title, subtitle, content } = getValues();
      return (
        <BlogPreview title={title} subtitle={subtitle} content={content} />
      );
    } else if (activeView === "quiz") {
      if (savedQuiz && savedQuiz.length > 0) {
        return <QuizDisplay questions={savedQuiz} />;
      } else {
        return (
          <QuizQuestionCreator 
            onComplete={handleOnComplete} 
            onQuestionsChange={handleQuestionsChange} 
          />
        );
      }
    }
    return null;
  };

  const handleQuestionsChange = (questions: any[]) => {
    // This is called when questions are being created, but not yet completed
    // We might want to save draft here as well if we want real-time saving
  };

  const handleOnComplete = (questions?: Question[]) => {
    if (questions && questions.length > 0) {
      setSavedQuiz(questions);
      // Update the form with the new quiz data
      setValue("quiz", questions);
    }
    setIsQuizEnabled(false);
    setActiveView("blog");
  };

  const handleShowSavedQuiz = () => {
    setActiveView("quiz");
    setIsQuizEnabled(true);
  };

  return (
    <>
      <Field as="div" className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          {savedQuiz ? (
            <>
              <Label className="text-lg">
                Quiz guardado en el borrador
              </Label>
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
        {!savedQuiz && (
          <Switch
            checked={isQuizEnabled}
            onChange={setIsQuizEnabled}
            className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-800 transition data-checked:bg-primary"
          >
            <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
          </Switch>
        )}
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
