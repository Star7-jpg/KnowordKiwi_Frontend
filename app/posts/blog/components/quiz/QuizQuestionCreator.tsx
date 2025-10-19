import { Question } from "@/types/posts/quiz/question";
import { Option } from "@/types/posts/quiz/option";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { QuizQuestionFormData, quizQuestionSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@headlessui/react";
import InfoModal from "@/components/shared/InfoModal";

interface QuizQuestionCreatorProps {
  onQuestionSubmit: (question: Question) => void;
}

const QuizQuestionCreator: React.FC<QuizQuestionCreatorProps> = ({
  onQuestionSubmit,
}) => {
  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<QuizQuestionFormData>({
    resolver: zodResolver(quizQuestionSchema),
    mode: "onChange",
    defaultValues: {
      questionTitle: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  });

  const questionTitle = watch("questionTitle");

  const [options, setOptions] = useState<Option[]>([
    {
      text: "",
      isCorrect: false,
      id: "A",
      color: "bg-purple-600 border-purple-600",
    },
    {
      text: "",
      isCorrect: false,
      id: "B",
      color: "bg-yellow-500 border-yellow-500",
    },
    {
      text: "",
      isCorrect: false,
      id: "C",
      color: "bg-green-500 border-green-500",
    },
    { text: "", isCorrect: false, id: "D", color: "bg-red-600 border-red-600" },
  ]);
  const [selectedCorrectOption, setSelectedCorrectOption] = useState<
    string | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOptionTextChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleCorrectOptionChange = (id: string) => {
    const newOptions = options.map((option) => ({
      ...option,
      isCorrect: option.id === id,
    }));
    setOptions(newOptions);
    setSelectedCorrectOption(id);
  };

  const onSubmit = () => {
    if (
      !questionTitle.trim() ||
      options.some((opt) => !opt.text.trim()) ||
      !selectedCorrectOption
    ) {
      setErrorMessage(
        "Por favor, completa el título de la pregunta, todas las opciones y selecciona la respuesta correcta.",
      );
      return;
    }
    const newQuestion: Question = {
      question: questionTitle,
      // Las opciones se mapean para eliminar propiedades innecesarias y solo mantener text y isCorrect.
      options: options.map(({ text, isCorrect }) => ({ text, isCorrect })),
    };
    onQuestionSubmit(newQuestion);
    // Reiniciar el formulario después de enviar
    reset();
    setOptions([
      {
        text: "",
        isCorrect: false,
        id: "A",
        color: "bg-purple-600 border-purple-600",
      },
      {
        text: "",
        isCorrect: false,
        id: "B",
        color: "bg-yellow-500 border-yellow-500",
      },
      {
        text: "",
        isCorrect: false,
        id: "C",
        color: "bg-green-500 border-green-500",
      },
      {
        text: "",
        isCorrect: false,
        id: "D",
        color: "bg-red-600 border-red-600",
      },
    ]);
    setSelectedCorrectOption(null);
  };

  return (
    <div className="w-full p-8 my-8 rounded-md shadow-2xl text-gray-100 font-sans">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-extrabold text-white">
          Crear Nueva Pregunta
        </h3>
      </div>

      {/* Área de la Pregunta */}
      <div className="mb-8">
        <label
          htmlFor="question-text"
          className="block mb-3 text-lg font-medium text-gray-400"
        >
          Título de la Pregunta:
        </label>
        <Input
          id="question-text"
          className="w-full p-4 border border-gray-700 rounded-xl bg-bg-gray placeholder-gray-500 focus:ring-primary focus:border-primary-hover transition duration-200"
          placeholder="Escribe el texto de tu pregunta aquí..."
          {...register("questionTitle")}
        />
        {errors.questionTitle && (
          <p className="text-gray-400 text-sm mt-1">
            {errors.questionTitle.message}
          </p>
        )}
      </div>

      <p className="mb-5 text-gray-400">
        Selecciona la respuesta correcta y escribe todas las opciones para tu
        pregunta.
      </p>

      {/* Opciones de Respuesta */}
      <div className="grid grid-cols-2 gap-5 mb-10">
        {options.map((option, index) => (
          <div
            key={option.id}
            // Clases base para la tarjeta de opción
            className={`
              flex items-center p-4 rounded-xl cursor-pointer transition duration-300 transform hover:scale-[1.02]
              bg-gray-800 shadow-lg border-2 border-transparent
              ${selectedCorrectOption === option.id ? `${option.color} ring-4 ring-offset-2 ring-offset-gray-900` : ""}
            `}
            onClick={() => handleCorrectOptionChange(option.id)}
          >
            {/* Letra de Opción (ID) */}
            <div
              className={`
                w-10 h-10 rounded-lg flex justify-center items-center text-xl font-bold text-white mr-4 flex-shrink-0
                ${option.color.split(" ")[0]}
              `}
            >
              {option.id}
            </div>

            {/* Input de la Opción */}
            <input
              type="text"
              className="flex-grow bg-transparent border-none text-white text-base placeholder-gray-400 focus:ring-0 focus:outline-none p-0"
              value={option.text}
              onChange={(e) => handleOptionTextChange(index, e.target.value)}
              placeholder={`Escribe la respuesta ${option.id} aqui...`}
              // Importante: Detiene la propagación para que hacer clic en el input no marque la opción como correcta.
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ))}
      </div>

      {/* Botón de Guardar */}
      <Button
        onClick={onSubmit}
        className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-extrabold text-xl rounded-xl transition duration-200 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 transform hover:-translate-y-0.5"
      >
        Guardar Pregunta
      </Button>
      {errorMessage && (
        <InfoModal
          isOpen={!!errorMessage}
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </div>
  );
};

export default QuizQuestionCreator;
