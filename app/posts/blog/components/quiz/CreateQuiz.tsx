import { Field, Label, Switch } from "@headlessui/react";
import { useState } from "react";
import QuizQuestionCreator from "./QuizQuestionCreator";

export default function CreateQuiz() {
  const [quizEnabled, setQuizEnabled] = useState(false);

  const onQuestionSubmit = (question) => {
    console.log("Nueva pregunta añadida:", question);
  };

  const enableQuizGenetator = () => {
    if (quizEnabled) {
      return <QuizQuestionCreator onQuestionSubmit={onQuestionSubmit} />;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <Field>
          <Label className="text-lg">
            ¿Deseas añadir un quiz a tu publicación?
          </Label>
        </Field>
        <Switch
          checked={quizEnabled}
          onChange={setQuizEnabled}
          className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-800 transition data-checked:bg-secondary"
        >
          <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
        </Switch>
      </div>
      {enableQuizGenetator()}
    </>
  );
}
