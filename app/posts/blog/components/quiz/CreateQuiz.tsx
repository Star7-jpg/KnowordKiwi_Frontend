import { Field, Label, Switch } from "@headlessui/react";
import { useState } from "react";
import QuizQuestionCreator from "./QuizQuestionCreator";
import QuizComponent from "./QuizComponent";
import InfoModal from "@/components/shared/InfoModal";

interface CreateQuizProps {
  postId?: number; // Optional - if provided, we're adding to existing post
  onQuestionsChange?: (questions: any[]) => void; // Callback cuando se crea un blog y quiz juntos
  initialQuestions?: any[]; // Initial questions to display if quiz was already created
}

export default function CreateQuiz({
  postId,
  onQuestionsChange,
  initialQuestions = [],
}: CreateQuizProps) {
  const [quizEnabled, setQuizEnabled] = useState(initialQuestions.length > 0 ? true : false);
  const [quizMessage, setQuizMessage] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<any[]>(initialQuestions);
  const [quizCompleted, setQuizCompleted] = useState(initialQuestions.length > 0);

  const handleQuizComplete = () => {
    setQuizMessage("Quiz guardado exitosamente");
    setQuizCompleted(true); // Mark quiz as completed when it's successfully saved
  };

  const enableQuizGenerator = () => {
    if (quizEnabled) {
      // If quiz is completed, show the quiz instead of the creator
      if (quizCompleted && quizQuestions.length > 0) {
        return <QuizComponent questions={quizQuestions} />;
      } else {
        return (
          <QuizQuestionCreator
            postId={postId}
            onComplete={handleQuizComplete}
            onQuestionsChange={(questions) => {
              onQuestionsChange?.(questions);
              setQuizQuestions(questions);
              setQuizCompleted(true);
            }}
          />
        );
      }
    }
  };

  const handleResetQuiz = () => {
    setQuizQuestions([]);
    setQuizCompleted(false);
    setQuizMessage("");
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Field>
            <Label className="text-lg">
              {postId
                ? "¿Deseas añadir un quiz a tu publicación existente?"
                : "¿Deseas añadir un quiz a tu nueva publicación?"}
            </Label>
          </Field>
          {quizCompleted && quizQuestions.length > 0 && (
            <button
              type="button"
              onClick={handleResetQuiz}
              className="text-sm text-gray-400 hover:text-white underline"
            >
              Editar Quiz
            </button>
          )}
        </div>
        <Switch
          checked={quizEnabled}
          onChange={(enabled) => {
            setQuizEnabled(enabled);
            // If disabling the quiz, reset the completion state
            if (!enabled) {
              setQuizCompleted(false);
              setQuizQuestions([]);
            }
          }}
          className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-800 transition data-checked:bg-primary"
        >
          <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
        </Switch>
      </div>
      {enableQuizGenerator()}
      {quizMessage && (
        <InfoModal
          isOpen={!!quizMessage}
          message={quizMessage}
          onClose={() => setQuizMessage("")}
        />
      )}
    </>
  );
}
