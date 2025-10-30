import { Label, Switch } from "@headlessui/react";
import { useState } from "react";
import QuizQuestionCreator from "./QuizQuestionCreator";
import InfoModal from "@/components/shared/InfoModal";
import QuizComponent from "./QuizComponent";

interface CreateQuizProps {
  postId?: number; // Optional - if provided, we're adding to existing post
  onQuestionsChange?: (questions: any[]) => void; // Callback when creating a blog and quiz together
  initialQuestions?: any[]; // Initial questions to display if quiz was already created
}

export default function CreateQuiz({
  postId,
  onQuestionsChange,
  initialQuestions = [],
}: CreateQuizProps) {
  const [isQuizEnabled, setIsQuizEnabled] = useState(
    initialQuestions.length > 0,
  );
  const [quizMessage, setQuizMessage] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<any[]>(initialQuestions);
  const [isEditing, setIsEditing] = useState(initialQuestions.length === 0);

  const isQuizCreated = quizQuestions.length > 0;

  const handleQuizCreationComplete = (questions: any[]) => {
    setQuizQuestions(questions);
    setQuizMessage("Quiz guardado exitosamente");
    setIsEditing(false);
    onQuestionsChange?.(questions);
  };

  const handleToggleQuiz = (enabled: boolean) => {
    setIsQuizEnabled(enabled);
    if (!enabled) {
      setQuizQuestions([]);
      setIsEditing(true);
      onQuestionsChange?.([]);
    }
  };

  const handleResetQuiz = () => {
    setIsEditing(true);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg">
            {postId
              ? "¿Deseas añadir un quiz a tu publicación existente?"
              : "¿Deseas añadir un quiz a tu nueva publicación?"}
          </Label>
          {isQuizCreated && !isEditing && (
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
          checked={isQuizEnabled}
          onChange={handleToggleQuiz}
          className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-800 transition data-checked:bg-primary"
        >
          <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
        </Switch>
      </div>

      {isQuizEnabled && (
        <>
          {isEditing || !isQuizCreated ? (
            <QuizQuestionCreator
              postId={postId}
              onComplete={() => setIsEditing(false)}
              onQuestionsChange={handleQuizCreationComplete}
            />
          ) : (
            <QuizComponent questions={quizQuestions} />
          )}
        </>
      )}

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
