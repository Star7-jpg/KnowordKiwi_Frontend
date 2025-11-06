import { Question } from "@/types/posts/quiz/question";

interface QuizDisplayProps {
  questions: Question[];
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ questions }) => {
  return (
    <div className="w-full p-8 my-8 text-gray-100 font-sans">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-extrabold text-white">Quiz Guardado</h3>
        <p className="text-gray-400 mt-2">
          Preguntas guardadas: {questions.length}
        </p>
      </div>

      <div className="space-y-8">
        {questions.map((question, questionIndex) => (
          <div
            key={questionIndex}
            className="p-6 rounded-xl bg-bg-gray border border-gray-700 shadow-lg"
          >
            <h4 className="text-xl font-bold text-white mb-4">
              Pregunta {questionIndex + 1}: {question.question}
            </h4>

            <div className="space-y-3">
              {question.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={`
                    flex items-center p-4 rounded-xl
                    ${
                      option.isCorrect
                        ? "bg-green-900/30 border-2 border-green-500"
                        : "bg-bg-gray border border-gray-600"
                    }
                  `}
                >
                  <div
                    className={`
                    w-10 h-10 rounded-lg flex justify-center items-center 
                    text-xl font-bold text-white mr-4 flex-shrink-0
                    ${
                      option.isCorrect
                        ? "bg-green-500 border-green-500"
                        : "bg-gray-700 border-gray-600"
                    }
                  `}
                  >
                    {String.fromCharCode(65 + optionIndex)}
                  </div>
                  <div className="flex-grow">
                    <span
                      className={
                        option.isCorrect
                          ? "text-green-400 font-medium"
                          : "text-gray-300"
                      }
                    >
                      {option.text}
                    </span>
                    {option.isCorrect && (
                      <span className="ml-2 text-green-400 font-medium">
                        (Correcta)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizDisplay;
