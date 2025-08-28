'use client';

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Clock, 
  Check, 
  X, 
  RotateCcw, 
  Trophy, 
  Target,
  Play,
  Pause,
  Star
} from 'lucide-react';
import { BeautifulName, UserPreferences, useNamesStore } from '../hooks/useNamesStore';

interface QuizGameProps {
  names: BeautifulName[];
  preferences: UserPreferences;
  isDark?: boolean;
}

interface QuizQuestion {
  name: BeautifulName;
  options: string[];
  correctAnswer: string;
  type: 'arabic-to-english' | 'english-to-arabic' | 'meaning-to-name';
}

export default function QuizGame({
  names,
  preferences,
  isDark = false
}: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [startTime, setStartTime] = useState<number>(0);

  const { addQuizResult, updateLearningProgress } = useNamesStore();

  const themeClasses = {
    text: isDark ? "text-white" : "text-gray-900",
    subtitle: isDark ? "text-gray-300" : "text-gray-600",
    card: isDark ? "bg-gray-800/60 border-gray-700/50" : "bg-white/90 border-gray-200/50",
    button: isDark
      ? "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300 hover:text-white"
      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900",
    activeButton: isDark
      ? "bg-blue-600 text-white"
      : "bg-blue-500 text-white",
    correctButton: "bg-green-500 text-white",
    incorrectButton: "bg-red-500 text-white",
    arabic: isDark ? "text-amber-300" : "text-amber-700",
    accent: isDark ? "text-blue-400" : "text-blue-600",
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const generateQuestions = (count: number = 10) => {
    const shuffledNames = [...names].sort(() => Math.random() - 0.5).slice(0, count);
    const questionTypes: QuizQuestion['type'][] = ['arabic-to-english', 'english-to-arabic', 'meaning-to-name'];
    
    return shuffledNames.map(name => {
      const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      const otherNames = names.filter(n => n.id !== name.id).sort(() => Math.random() - 0.5).slice(0, 3);
      
      let question: QuizQuestion;
      
      switch (type) {
        case 'arabic-to-english':
          question = {
            name,
            type,
            options: [name.english, ...otherNames.map(n => n.english)].sort(() => Math.random() - 0.5),
            correctAnswer: name.english
          };
          break;
        case 'english-to-arabic':
          question = {
            name,
            type,
            options: [name.arabic, ...otherNames.map(n => n.arabic)].sort(() => Math.random() - 0.5),
            correctAnswer: name.arabic
          };
          break;
        case 'meaning-to-name':
          question = {
            name,
            type,
            options: [name.transliteration, ...otherNames.map(n => n.transliteration)].sort(() => Math.random() - 0.5),
            correctAnswer: name.transliteration
          };
          break;
      }
      
      return question;
    });
  };

  const startQuiz = () => {
    const newQuestions = generateQuestions();
    setQuestions(newQuestions);
    setCurrentQuestion(newQuestions[0]);
    setQuestionIndex(0);
    setScore(0);
    setQuizStarted(true);
    setQuizCompleted(false);
    setTimeLeft(30);
    setIsTimerActive(true);
    setStartTime(Date.now());
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    setIsTimerActive(false);
    
    const isCorrect = answer === currentQuestion?.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Update learning progress
    if (currentQuestion) {
      updateLearningProgress(currentQuestion.name.id, isCorrect, isCorrect);
    }
    
    // Auto-advance after 2 seconds
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const handleTimeUp = () => {
    if (!showResult) {
      setSelectedAnswer('');
      setShowResult(true);
      setIsTimerActive(false);
      
      // Update learning progress as incorrect
      if (currentQuestion) {
        updateLearningProgress(currentQuestion.name.id, false, false);
      }
      
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
  };

  const nextQuestion = () => {
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(prev => prev + 1);
      setCurrentQuestion(questions[questionIndex + 1]);
      setSelectedAnswer('');
      setShowResult(false);
      setTimeLeft(30);
      setIsTimerActive(true);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
    setIsTimerActive(false);
    
    // Save quiz result
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    addQuizResult({
      date: new Date().toISOString(),
      score,
      totalQuestions: questions.length,
      timeSpent,
    });
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestion(null);
    setQuestions([]);
    setScore(0);
    setQuestionIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setTimeLeft(30);
    setIsTimerActive(false);
  };

  const getQuestionText = () => {
    if (!currentQuestion) return '';
    
    switch (currentQuestion.type) {
      case 'arabic-to-english':
        return `What is the English meaning of: ${currentQuestion.name.arabic}`;
      case 'english-to-arabic':
        return `What is the Arabic text for: ${currentQuestion.name.english}`;
      case 'meaning-to-name':
        return `Which name has this meaning: "${currentQuestion.name.meaning}"`;
      default:
        return '';
    }
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (!quizStarted) {
    return (
      <div className={`max-w-2xl mx-auto text-center ${themeClasses.card} backdrop-blur-xl border rounded-2xl p-8`}>
        <div className="text-6xl mb-6">🧠</div>
        <h2 className={`text-3xl font-bold ${themeClasses.text} mb-4`}>
          Quiz: Test Your Knowledge
        </h2>
        <p className={`${themeClasses.subtitle} mb-6 text-lg`}>
          Test your knowledge of Allah's Beautiful Names with this interactive quiz.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'}`}>
            <div className={`text-2xl font-bold ${themeClasses.accent}`}>10</div>
            <div className={`text-sm ${themeClasses.subtitle}`}>Questions</div>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'}`}>
            <div className={`text-2xl font-bold ${themeClasses.accent}`}>30s</div>
            <div className={`text-sm ${themeClasses.subtitle}`}>Per Question</div>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'}`}>
            <div className={`text-2xl font-bold ${themeClasses.accent}`}>3</div>
            <div className={`text-sm ${themeClasses.subtitle}`}>Question Types</div>
          </div>
        </div>

        <button
          onClick={startQuiz}
          disabled={names.length < 4}
          className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 ${
            names.length >= 4 ? themeClasses.activeButton : themeClasses.button
          }`}
        >
          <Play className="w-6 h-6" />
          <span>Start Quiz</span>
        </button>

        {names.length < 4 && (
          <p className={`mt-4 text-sm ${themeClasses.subtitle}`}>
            Need at least 4 names to start the quiz. Please adjust your filters.
          </p>
        )}
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className={`max-w-2xl mx-auto text-center ${themeClasses.card} backdrop-blur-xl border rounded-2xl p-8`}>
        <div className="text-6xl mb-6">
          {percentage >= 80 ? '🏆' : percentage >= 60 ? '🥈' : '📚'}
        </div>
        
        <h2 className={`text-3xl font-bold ${themeClasses.text} mb-4`}>
          Quiz Completed!
        </h2>
        
        <div className={`text-6xl font-bold ${getScoreColor()} mb-4`}>
          {score}/{questions.length}
        </div>
        
        <div className={`text-2xl font-bold ${getScoreColor()} mb-6`}>
          {percentage}%
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'}`}>
            <div className={`text-xl font-bold ${themeClasses.text}`}>
              {Math.round((Date.now() - startTime) / 1000)}s
            </div>
            <div className={`text-sm ${themeClasses.subtitle}`}>Total Time</div>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'}`}>
            <div className={`text-xl font-bold ${themeClasses.text}`}>
              {Math.round(((Date.now() - startTime) / 1000) / questions.length)}s
            </div>
            <div className={`text-sm ${themeClasses.subtitle}`}>Avg per Question</div>
          </div>
        </div>

        <div className="flex space-x-4 justify-center">
          <button
            onClick={startQuiz}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.activeButton}`}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
          
          <button
            onClick={resetQuiz}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${themeClasses.button}`}
          >
            <Target className="w-5 h-5" />
            <span>New Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Quiz Header */}
      <div className={`${themeClasses.card} backdrop-blur-xl border rounded-2xl p-6 mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className={`text-lg font-bold ${themeClasses.text}`}>
              Question {questionIndex + 1} of {questions.length}
            </span>
            
            <div className={`w-32 h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${themeClasses.text}`}>
              <Trophy className="w-5 h-5" />
              <span className="font-bold">{score}</span>
            </div>
            
            <div className={`flex items-center space-x-2 ${timeLeft <= 10 ? 'text-red-500' : themeClasses.text}`}>
              <Clock className="w-5 h-5" />
              <span className="font-bold">{timeLeft}s</span>
            </div>
          </div>
        </div>

        <div className={`w-full h-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
          <div
            className={`h-full transition-all duration-1000 ${
              timeLeft <= 10 ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      {currentQuestion && (
        <div className={`${themeClasses.card} backdrop-blur-xl border rounded-2xl p-8`}>
          <h3 className={`text-xl font-bold ${themeClasses.text} mb-6 text-center`}>
            {getQuestionText()}
          </h3>

          {/* Display the question content based on type */}
          {currentQuestion.type === 'arabic-to-english' && (
            <div className="text-center mb-8">
              <div className={`text-4xl ${themeClasses.arabic} font-arabic font-bold`}>
                {currentQuestion.name.arabic}
              </div>
              <div className={`text-lg ${themeClasses.subtitle} mt-2`}>
                {currentQuestion.name.transliteration}
              </div>
            </div>
          )}

          {currentQuestion.type === 'english-to-arabic' && (
            <div className="text-center mb-8">
              <div className={`text-2xl font-bold ${themeClasses.text}`}>
                {currentQuestion.name.english}
              </div>
              <div className={`text-lg ${themeClasses.subtitle} mt-2`}>
                {currentQuestion.name.transliteration}
              </div>
            </div>
          )}

          {currentQuestion.type === 'meaning-to-name' && (
            <div className="text-center mb-8">
              <div className={`text-lg ${themeClasses.text} italic`}>
                "{currentQuestion.name.meaning}"
              </div>
            </div>
          )}

          {/* Answer Options */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = themeClasses.button;
              
              if (showResult) {
                if (option === currentQuestion.correctAnswer) {
                  buttonClass = themeClasses.correctButton;
                } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                  buttonClass = themeClasses.incorrectButton;
                }
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`p-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed ${buttonClass}`}
                >
                  <div className={`${currentQuestion.type === 'english-to-arabic' ? 'font-arabic text-xl' : ''}`}>
                    {option}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result Feedback */}
          {showResult && (
            <div className="mt-6 text-center">
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <div className="text-green-500">
                  <Check className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold">Correct! Well done!</p>
                </div>
              ) : (
                <div className="text-red-500">
                  <X className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold">
                    {selectedAnswer ? 'Incorrect.' : 'Time\'s up!'} The correct answer is: {currentQuestion.correctAnswer}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
