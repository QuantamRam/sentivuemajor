import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Loader2, MessageSquareText } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

const suggestions = [
  "What is Lexical Complexity?",
  "Can it detect sarcasm?",
  "Who created SentiVue?"
];

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am your SentiVue Assistant. Need help analyzing sentiment patterns or understanding the lexical metrics?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;
    
    const newMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, newMsg]);
    if (!overrideInput) setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      setIsTyping(false);
      let aiResponse = "I can help analyze data! Enter text into the main dashboard and SentiVue will generate lexical metrics, charts, and deep dives for you.";
      
      const lower = textToSend.toLowerCase();
      if (lower.includes("lexical complexity")) {
        aiResponse = "Lexical Complexity in SentiVue measures how sophisticated the text is based on vocabulary density (unique words) and syllabic word length. It ranks text as Basic, Intermediate, or Advanced!";
      } else if (lower.includes("sarcasm")) {
        aiResponse = "While pure rule-based algorithms struggle with sarcasm, our AI integration looks at contextual word embeddings. If you use conflicting emotional terms, the Sentiment Journey graph often reflects an erratic swing!";
      } else if (lower.includes("who created")) {
        aiResponse = "SentiVue is an enterprise-grade sentiment analysis engine meticulously architected for real-time production analytics!";
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponse
      }]);
    }, 1200);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 w-[360px] h-[500px] glass-panel rounded-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center relative">
                  <Bot className="w-5 h-5 text-primary" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-display font-medium text-foreground text-sm">SentiVue Assistant</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Sparkles className="w-3 h-3"/> Pretrained AI</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-secondary text-secondary-foreground rounded-tl-none border border-border'}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-secondary border border-border text-secondary-foreground rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-3 border-t border-border/50 bg-transparent">
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(''); handleSend(s); }}
                    className="whitespace-nowrap px-3 py-1.5 bg-secondary/50 hover:bg-secondary border border-border rounded-full text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-full border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent border-none focus:outline-none px-4 py-2 text-sm text-foreground"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-50 transition-colors shadow-sm shrink-0 mr-0.5"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-[var(--shadow-glow)] flex items-center justify-center z-50 overflow-hidden animate-pulse-glow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquareText className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isOpen && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-background rounded-full"></span>
        )}
      </motion.button>
    </>
  );
};

export default AIChatBot;
