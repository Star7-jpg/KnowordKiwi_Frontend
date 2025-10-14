import React, { useState } from "react";

// Colores personalizados basados en la imagen (puedes definirlos en tailwind.config.js o usarlos inline)
// bg-purple-600, bg-yellow-500, bg-green-500, bg-red-600

const QuizQuestionCreator = ({ onQuestionSubmit }) => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [options, setOptions] = useState([
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
  const [selectedCorrectOption, setSelectedCorrectOption] = useState(null);

  const handleOptionTextChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleCorrectOptionChange = (id) => {
    const newOptions = options.map((option) => ({
      ...option,
      isCorrect: option.id === id,
    }));
    setOptions(newOptions);
    setSelectedCorrectOption(id);
  };

  const handleSubmit = () => {
    if (
      !questionTitle.trim() ||
      options.some((opt) => !opt.text.trim()) ||
      !selectedCorrectOption
    ) {
      alert(
        "Por favor, completa la pregunta y todas las opciones, y selecciona la respuesta correcta.",
      );
      return;
    }
    const newQuestion = {
      question: questionTitle,
      // Las opciones se mapean para eliminar propiedades innecesarias y solo mantener text y isCorrect.
      options: options.map(({ text, isCorrect }) => ({ text, isCorrect })),
    };
    onQuestionSubmit(newQuestion);
    // Opcional: Resetear el formulario
    setQuestionTitle("");
    setOptions(options.map((opt) => ({ ...opt, text: "", isCorrect: false })));
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
        <textarea
          id="question-text"
          className="w-full p-4 border border-gray-700 rounded-xl bg-bg-gray text-white placeholder-gray-500 focus:ring-orange-500 focus:border-orange-500 transition duration-200 resize-none h-24 shadow-inner"
          value={questionTitle}
          onChange={(e) => setQuestionTitle(e.target.value)}
          placeholder="Escribe el texto de tu pregunta aquí..."
        />
      </div>

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
      <button
        className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-extrabold text-xl rounded-xl transition duration-200 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 transform hover:-translate-y-0.5"
        onClick={handleSubmit}
      >
        Guardar Pregunta
      </button>
    </div>
  );
};

export default QuizQuestionCreator;
