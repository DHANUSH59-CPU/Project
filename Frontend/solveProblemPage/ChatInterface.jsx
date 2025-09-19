import { useState, useEffect, useRef } from 'react';
import axiosClient from '../../config/axios';

import { 
    UserCircleIcon,
    PaperAirplaneIcon,
    CopyIcon,
    CheckIcon,
} from '../Icons/SolveProblemPageIcons';
import { Bot, Sparkles } from 'lucide-react';

// This helper function prepares the chat history for the AI model.
const createChatHistoryForAI = (chatHistory) => {
  if(!chatHistory)
    return [];
  const chatHistoryForAI = chatHistory.flatMap((chat) => {
    return([
      {
        role: "user",
        parts: [{text: chat.userQuestion?.text}]
      },
      {
        role: "model",
        parts: [{ text: chat.aiResponse?.text}]
      }
    ]);
  });
  chatHistoryForAI.pop();
  return chatHistoryForAI;
};


const ChatInterface = ({ problem, userSolution, qaBlocks, setQaBlocks }) => {
  const [userInput, setUserInput] = useState('');
  const [isOverallLoading, setIsOverallLoading] = useState(false);
  const [copiedStates, setCopiedStates] = useState({});
  const [typingStatuses, setTypingStatuses] = useState({}); 
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const typingIntervals = useRef({});

  // Predefined questions for user guidance
  const predefinedQuestions = [
    `Explain the main challenge of "${problem.title}" in simple terms.`,
    "What's a good data structure to use for this problem and why?",
    "Can you give me a high-level plan to solve this without code?",
    "What are some common edge cases I should consider?",
  ];

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [qaBlocks]);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 100;
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + "px";
    }
  }, [userInput]);
  
  // Cleanup intervals on component unmount
  useEffect(() => {
    return () => {
      Object.values(typingIntervals.current).forEach(clearInterval);
    };
  }, []);

  // Simulates the character-by-character typing effect
  const simulateTypingEffect = (fullText, blockId) => {
    const typingSpeed = 35; 
    let currentIndex = 0;

    setTypingStatuses(prev => ({ ...prev, [blockId]: true }));

    if (typingIntervals.current[blockId]) {
      clearInterval(typingIntervals.current[blockId]);
    }

    const intervalId = setInterval(() => {
      if (currentIndex >= fullText.length) {
        clearInterval(intervalId);
        delete typingIntervals.current[blockId];
        setTypingStatuses(prev => ({ ...prev, [blockId]: false }));
        return;
      }

      setQaBlocks(prevBlocks =>
        prevBlocks.map(block => {
          if (block.id === blockId) {
            return {
              ...block,
              aiResponse: {
                ...block.aiResponse,
                text: fullText.substring(0, currentIndex + 1),
              },
            };
          }
          return block;
        })
      );
      currentIndex++;
    }, typingSpeed);

    typingIntervals.current[blockId] = intervalId;
  };

  // Single function to handle sending any message to the AI.
  const processAndSendMessage = async (questionText) => {
    const trimmedText = questionText.trim();
    if (!trimmedText || isOverallLoading) return;

    const newBlockId = Date.now().toString();
    const newUserQuestion = { text: trimmedText, timestamp: new Date() };
    const newQABlock = { id: newBlockId, userQuestion: newUserQuestion, aiResponse: { text: '', timestamp: new Date(), isLoading: true } };
    
    setQaBlocks((prevBlocks) => [...prevBlocks, newQABlock]);
    setUserInput('');
    setIsOverallLoading(true);
    textareaRef.current?.focus();
    
    const detailsToSend = {
      problemDetails: problem,
      userSolution: userSolution,
      chatHistory: createChatHistoryForAI([...qaBlocks, newQABlock])
    };

    try {
      const { data } = await axiosClient.post("/ai/chatAI", detailsToSend);
      const aiResponseText = data;

      setQaBlocks((prevBlocks) => prevBlocks.map((block) =>
        block.id === newBlockId 
          ? { ...block, aiResponse: { ...block.aiResponse, isLoading: false, timestamp: new Date() } } 
          : block
      ));

      simulateTypingEffect(aiResponseText, newBlockId);

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessageText = "Sorry, I couldn't process your request. Please try again.";
      setQaBlocks((prevBlocks) => prevBlocks.map((block) =>
        block.id === newBlockId ? { ...block, aiResponse: { text: errorMessageText, error: true, timestamp: new Date(), isLoading: false } } : block
      ));
    } finally {
      setIsOverallLoading(false);
      textareaRef.current?.focus();
    }
  };

  // Handles copying code snippets to the clipboard
  const handleCopyCode = (codeContent, blockId, partIndex) => {
    const uniqueKey = `${blockId}-code-${partIndex}`;

    navigator.clipboard.writeText(codeContent).then(() => {
      setCopiedStates((prev) => ({ ...prev, [uniqueKey]: true }))
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [uniqueKey]: false }))
      }, 2000);
    }).catch(err => console.error("Failed to copy code: ", err)); 
  };

  // Renders the AI response text, parsing markdown
  const renderAIReponseText = (text, blockId) => {
    const parts = text.split(/```([\w-]*)?([\s\S]*?)```/g);

    return parts.map((part, index) => {
      if (index % 3 === 0) { // Normal text part
        const boldSplit = part.split(/(\*\*.*?\*\*)/g);
        return (
          <span key={`${blockId}-text-${index}`} className="whitespace-pre-wrap leading-relaxed">
            {boldSplit.map((chunk, i) => {
              if (chunk.startsWith("**") && chunk.endsWith("**")) {
                const boldText = chunk.slice(2, -2);
                return <strong key={`${blockId}-bold-${index}-${i}`} className="font-semibold">{boldText}</strong>;
              }
              return <span key={`${blockId}-norm-${index}-${i}`}>{chunk}</span>;
            })}
          </span>
        );
      } else if (index % 3 === 1) { 
        return null;
      } else { // Code block part
        const codeContent = part.trim();
        const uniqueKey = `${blockId}-code-${Math.floor(index / 3)}`;
        return (
          <div key={uniqueKey} className="relative group my-1">
            <pre className="p-3 rounded-md text-sm overflow-x-auto shadow-sm bg-gray-800 text-gray-100 dark:bg-black/80 dark:text-gray-200">
              <code>{codeContent}</code>
            </pre>
            <button
              onClick={() => handleCopyCode(codeContent, blockId, Math.floor(index / 3))}
              className="absolute top-1.5 right-1.5 p-1 rounded transition-opacity bg-gray-600 hover:bg-gray-500 text-gray-100 dark:bg-slate-500 dark:hover:bg-slate-400 dark:text-black"
              aria-label={copiedStates[uniqueKey] ? "Copied" : "Copy code"}
            >
              {copiedStates[uniqueKey] ? <CheckIcon className="w-3.5 h-3.5" /> : <CopyIcon className="w-3.5 h-3.5" />}
            </button>
          </div>
        );
      }
    });
  };

  // Formats a date object into a readable time string
  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
   <div className="flex flex-col flex-grow bg-white dark:bg-slate-800">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-200 mb-3 px-1">
        Ask AI about "{problem.title}"
      </h2>
      
      {qaBlocks.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center flex-grow overflow-y-auto p-4">
          <Sparkles className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
          <h3 className="text-md font-semibold text-gray-800 dark:text-slate-200">
            Ready to help!
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 mb-6 max-w-xs">
            Start the conversation by asking your own question or choose a suggestion below.
          </p>
          <div className="w-full max-w-md space-y-2.5">
            {predefinedQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => processAndSendMessage(q)}
                disabled={isOverallLoading}
                className="w-full text-left p-3 text-sm font-medium text-gray-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 rounded-lg border border-slate-200 dark:border-slate-600/80 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {qaBlocks.length > 0 && (
        <div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-6">
          {qaBlocks.map(block => (
            <div key={block.id} className='p-4 rounded-lg shadow-md bg-white border border-gray-200 dark:bg-slate-800 dark:border-slate-700'>
              <div>
                <div className="flex items-center mb-1.5">
                  <UserCircleIcon className="w-5 h-5 mr-2 flex-shrink-0 text-orange-500 dark:text-orange-400" />
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-200">Your Question</h3>
                </div>
                <div className={`p-3 rounded-md text-sm bg-blue-50 text-gray-800 dark:bg-blue-900/40 dark:text-slate-100`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{block.userQuestion.text}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1.5 text-right">{formatTimestamp(block.userQuestion.timestamp)}</p>
              </div>

              {block.aiResponse && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-center mb-1.5">
                    <Bot className={`w-5 h-5 mr-2 flex-shrink-0 ${block.aiResponse.error ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-slate-300'}`} />
                    <h3 className={`text-sm font-semibold ${block.aiResponse.error ? 'text-red-600 dark:text-red-300' : 'text-gray-700 dark:text-slate-200'}`}>
                      AI Response
                    </h3>
                  </div>
                  {block.aiResponse.isLoading ? (
                    <div className={`p-3 rounded-md text-sm italic flex items-center bg-gray-100 text-gray-600 dark:bg-slate-700/60 dark:text-slate-300`}>
                      AI is thinking
                      <div className="ml-1.5 w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="ml-1 w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="ml-1 w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                    </div>
                  ) : (
                    <div className={`p-3 rounded-md text-sm 
                      ${block.aiResponse.error 
                          ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50'
                          : 'bg-gray-100 text-gray-800 dark:bg-slate-700/60 dark:text-slate-100'
                      }`}>
                        {renderAIReponseText(block.aiResponse.text, block.id)}
                    </div>
                  )}
                  {!block.aiResponse.isLoading && !typingStatuses[block.id] &&
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1.5 text-right">{formatTimestamp(block.aiResponse.timestamp)}</p>
                  }
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="sticky bottom-0 mt-auto flex items-start border-t bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 p-4 px-1">
        <textarea
          ref={textareaRef}
          className="flex-grow py-2.5 px-3.5 text-sm rounded-lg resize-none border
                     bg-gray-50 text-gray-800 border-gray-300 
                     dark:bg-slate-900 dark:text-slate-100 dark:border-slate-600 
                     focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
                     placeholder-gray-500 dark:placeholder-slate-400 shadow-sm min-h-[48px]"
          placeholder="Ask AI anything..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); processAndSendMessage(userInput); } }}
          aria-label="Chat input"
          rows={1}
          disabled={isOverallLoading}
        />
        <button
          onClick={() => processAndSendMessage(userInput)}
          disabled={isOverallLoading || !userInput.trim()}
          className="ml-2 px-4 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors 
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
                     dark:focus:ring-offset-slate-800 min-h-[48px]"
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="w-5 h-5"/>
        </button>
      </div>
    </div>
  )
};

export default ChatInterface;