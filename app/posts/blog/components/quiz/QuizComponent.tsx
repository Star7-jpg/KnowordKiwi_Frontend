import { useState } from 'react';
import { Button } from '@headlessui/react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { BlogById } from '@/types/posts/blog/blogById';

interface QuizComponentProps {
  questions: BlogById['questions'];
}

interface AnswerState {
  [questionId: number]: string | null; // Stores the selected option text for each question
}

interface SubmittedState {
  [questionId: number]: boolean; // Whether the question has been submitted
}

const QuizComponent: React.FC<QuizComponentProps> = ({ questions }) => {
  const [answers, setAnswers] = useState<AnswerState>({});
  const [submitted, setSubmitted] = useState<SubmittedState>({});
  const [showResults, setShowResults] = useState(false);

  if (!questions || questions.length === 0) {
    return null;
  }

  const handleAnswerSelect = (questionId: number, optionText: string) => {
    if (submitted[questionId]) return; // Don't allow changing answers after submission
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionText,
    }));
  };

  const handleSubmit = () => {
    // Mark all questions as submitted
    const newSubmitted: SubmittedState = {};
    questions.forEach(q => {
      newSubmitted[q.id] = true;
    });
    setSubmitted(newSubmitted);
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted({});
    setShowResults(false);
  };

  const calculateScore = () => {
    if (!showResults) return 0;
    
    let correct = 0;
    questions?.forEach(q => {
      const selectedAnswer = answers[q.id];
      const correctOption = q.options.find(opt => opt.isCorrect);
      if (selectedAnswer === correctOption?.text) {
        correct++;
      }
    });
    
    return Math.round((correct / (questions?.length || 1)) * 100);
  };

  const score = calculateScore();

  return (
    <div className="mt-12 p-6 bg-gray-800 rounded-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Test de Conocimiento</h2>
      
      <div className="space-y-8">
        {questions.map((question) => {
          const selectedAnswer = answers[question.id];
          const correctOption = question.options.find(opt => opt.isCorrect);
          const isSubmitted = submitted[question.id];
          const isCorrect = selectedAnswer === correctOption?.text;

          return (
            <div 
              key={question.id} 
              className={`p-5 rounded-lg border ${
                isSubmitted 
                  ? isCorrect 
                    ? 'border-green-500 bg-green-900/20' 
                    : 'border-red-500 bg-red-900/20'
                  : 'border-gray-600 bg-gray-700'
              }`}
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                {question.title}
              </h3>
              
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswer === option.text;
                  const shouldShowCorrect = isSubmitted && option.isCorrect;
                  const shouldShowIncorrect = isSubmitted && isSelected && !option.isCorrect;
                  
                  return (
                    <div
                      key={optionIndex}
                      onClick={() => !isSubmitted && handleAnswerSelect(question.id, option.text)}
                      className={`
                        flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                        ${
                          isSubmitted
                            ? shouldShowCorrect
                              ? 'bg-green-500/20 border border-green-500'
                              : shouldShowIncorrect
                                ? 'bg-red-500/20 border border-red-500'
                                : 'border border-gray-600'
                            : isSelected
                              ? 'bg-primary/20 border border-primary'
                              : 'border border-gray-600 hover:border-gray-500'
                        }
                      `}
                    >
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center mr-3
                        font-bold
                        ${
                          isSubmitted
                            ? shouldShowCorrect
                              ? 'bg-green-500 text-white'
                              : shouldShowIncorrect
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-600 text-gray-300'
                            : isSelected
                              ? 'bg-primary text-white'
                              : 'bg-gray-700 text-gray-300'
                        }
                      `}>
                        {String.fromCharCode(65 + optionIndex)}
                      </div>
                      <span className="text-gray-200 flex-1">{option.text}</span>
                      {isSubmitted && option.isCorrect && (
                        <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                      )}
                      {isSubmitted && isSelected && !option.isCorrect && (
                        <XCircle className="w-5 h-5 text-red-500 ml-2" />
                      )}
                    </div>
                  );
                })}
              </div>
              
              {isSubmitted && (
                <div className={`mt-3 text-sm ${
                  isCorrect ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isCorrect 
                    ? '¡Correcto!' 
                    : `Incorrecto. La respuesta correcta es: ${correctOption?.text}`}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {!showResults ? (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== questions.length}
            className={`
              py-3 px-6 rounded-xl font-semibold text-lg transition duration-200
              ${
                Object.keys(answers).length === questions.length
                  ? 'bg-primary hover:bg-primary-hover text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Enviar Respuestas
          </Button>
        </div>
      ) : (
        <div className="mt-8 text-center">
          <div className="text-xl font-bold mb-2">
            Puntuación: <span className="text-green-400">{score}%</span>
          </div>
          <Button
            onClick={handleReset}
            className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium flex items-center gap-2 mx-auto"
          >
            <RotateCcw size={16} />
            Reiniciar Quiz
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;