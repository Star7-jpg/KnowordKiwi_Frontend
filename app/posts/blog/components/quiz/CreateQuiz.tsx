import { Field, Label, Switch } from "@headlessui/react";
import { useState } from "react";
import QuizQuestionCreator from "./QuizQuestionCreator";
import InfoModal from "@/components/shared/InfoModal";

interface CreateQuizProps {
  postId?: number; // Optional - if provided, we're adding to existing post
  onQuestionsChange?: (questions: any[]) => void; // Callback cuando se crea un blog y quiz juntos
}

export default function CreateQuiz({
  postId,
  onQuestionsChange,
}: CreateQuizProps) {
  const [quizEnabled, setQuizEnabled] = useState(false);
  const [quizMessage, setQuizMessage] = useState("");

  const handleQuizComplete = () => {
    setQuizMessage("Quiz guardado exitosamente");
  };

  const enableQuizGenetator = () => {
    if (quizEnabled) {
      return (
        <QuizQuestionCreator
          postId={postId}
          onComplete={handleQuizComplete}
          onQuestionsChange={onQuestionsChange}
        />
      );
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <Field>
          <Label className="text-lg">
            {postId
              ? "¿Deseas añadir un quiz a tu publicación existente?"
              : "¿Deseas añadir un quiz a tu nueva publicación?"}
          </Label>
        </Field>
        <Switch
          checked={quizEnabled}
          onChange={setQuizEnabled}
          className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-800 transition data-checked:bg-terciary"
        >
          <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
        </Switch>
      </div>
      {enableQuizGenetator()}
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
