import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { useAuth } from '@/context/AuthContext';
import type { ChatMessage } from '@/types';

const QUICK_QUESTIONS = [
  'Explain JavaScript closures',
  'What are React Hooks?',
  'CSS Flexbox vs Grid',
  'How do Promises work?',
  'Python list comprehension',
  'What is recursion?',
];

const AI_RESPONSES: Record<string, string> = {
  default: "Hey there! I'm your AI coding mentor. Ask me anything about HTML, CSS, JavaScript, React, Python, or any programming concept!",
  hello: "Hello! Ready to level up your coding skills? Ask me anything!",
  javascript: "JavaScript is the language of the web! Key concepts: variables (let/const), functions, arrays, objects, and async programming with Promises. What specifically would you like to learn?",
  python: "Python is known for its clean syntax. Great for beginners! Topics: variables, lists, dictionaries, functions, classes. What's your Python question?",
  html: "HTML structures web content. Key: semantic tags, forms, accessibility. The `<!DOCTYPE html>` declaration and `<head>` vs `<body>` are fundamental. Want to dive deeper?",
  css: "CSS styles web pages. Master: selectors, box model, Flexbox, Grid, and responsive design with media queries. Which CSS topic interests you?",
  react: "React uses components and hooks! useState for state, useEffect for side effects. JSX lets you write HTML in JavaScript. Ask about a specific React concept!",
  function: "Functions are reusable code blocks. JS has: declarations, expressions, arrow functions. Python uses `def`. Higher-order functions take other functions as args!",
  array: "Arrays store ordered data. JS: map(), filter(), reduce(), find(). Python: list comprehensions, slicing. These are powerful tools for data manipulation!",
  loop: "Loops repeat code: `for`, `while`, `forEach`. Modern JS prefers array methods like map/filter over traditional loops. Python has elegant `for item in items` syntax!",
  debug: "Debugging: 1) Read errors carefully, 2) Use console.log() to trace values, 3) Use DevTools (F12), 4) Isolate the problem, 5) Rubber duck debugging explains it line by line!",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return AI_RESPONSES.default;
}

export default function AIMentorPage() {
  const { isLoggedIn } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: AI_RESPONSES.default, timestamp: new Date().toISOString() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatMutation = trpc.mentor.chat.useMutation();

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    let response: string;
    if (isLoggedIn) {
      try { const result = await chatMutation.mutateAsync({ message: userMsg.content }); response = result.response; }
      catch { response = getAIResponse(userMsg.content); }
    } else {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
      response = getAIResponse(userMsg.content);
    }

    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#CE82FF] flex items-center justify-center shadow-md">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-gray-800">AI Mentor</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#58CC02] animate-pulse" />
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="flex-shrink-0 mb-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {QUICK_QUESTIONS.map(q => (
          <button
            key={q}
            onClick={() => { setInput(q); }}
            className="flex-shrink-0 px-3 py-1.5 bg-white border-2 border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:border-[#CE82FF]/40 hover:text-[#CE82FF] transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide space-y-3 pb-2">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant' ? 'bg-[#CE82FF]' : 'bg-[#1CB0F6]'
              }`}>
                {msg.role === 'assistant' ? <Sparkles className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'assistant' ? 'bg-white border-2 border-gray-100 text-gray-700' : 'bg-[#1CB0F6] text-white'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#CE82FF] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border-2 border-gray-100 px-4 py-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[#CE82FF] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#CE82FF] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#CE82FF] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about coding..."
          className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#CE82FF]/50 transition-all font-medium"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="w-12 h-12 bg-[#CE82FF] text-white rounded-2xl flex items-center justify-center disabled:opacity-40 bitxy-btn-purple"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
