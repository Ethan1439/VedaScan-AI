import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, Sparkles, Trash2, ArrowRight, CornerDownLeft, BrainCircuit } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function AyurBot() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("ayurbot_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("ayurbot_history", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text) return;

    if (!textToSend) {
      setInput("");
    }

    const newUserMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with VedaBot");
      }

      const data = await response.json();
      
      const newBotMessage: Message = {
        role: "assistant",
        content: data.text || "I was unable to retrieve a response at this time. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("VedaBot error:", error);
      const errorMsg: Message = {
        role: "assistant",
        content: "I apologize, but I am experiencing difficulties connecting to my inner wisdom right now. Please check your internet connection or try again shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your conversation history?")) {
      setMessages([]);
      localStorage.removeItem("ayurbot_history");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const starterDoubtPrompts = [
    {
      title: "Understanding Doshas",
      text: "Explain Vata, Pitta, and Kapha. How do they affect health?",
      icon: "💨🔥🌊"
    },
    {
      title: "Stoking Digestive Fire",
      text: "What is Agni and how do I prevent the accumulation of Ama?",
      icon: "🔥"
    },
    {
      title: "Adaptogenic Herbs",
      text: "What are the benefits of Ashwagandha and Tulsi in daily life?",
      icon: "🌿"
    },
    {
      title: "Dinacharya Routine",
      text: "What is a traditional daily routine (Dinacharya) for mental calm?",
      icon: "🌅"
    }
  ];

  return (
    <div id="ayurbot-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Traditional Credentials & Intro Info (Spans 4 Columns) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="p-6 md:p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-[#C5A36B]/20 flex items-center justify-center border border-[#C5A36B]/30">
              <BrainCircuit className="w-5 h-5 text-[#C5A36B]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F2EBE4] tracking-wide uppercase">Acharya Veda Chat</h3>
              <p className="text-[11px] text-[#C5A36B]">Ask anything to clear your doubts</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-[#E0D8D0]/75 leading-relaxed font-sans">
            <p>
              Welcome to the digital sanctuary of **Acharya Veda**, a traditional Ayurvedic Doctor (Vaidya) and cognitive health consultant.
            </p>
            <p>
              In our sacred system, questions and doubts are the key to discovering your unique bodily constitution (**Prakriti**) and stoking the inner intellect (**Dhi**).
            </p>
            <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#C5A36B]">Topics of Inquiry:</h4>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-[#E0D8D0]/90">
                <li>Vata, Pitta, Kapha properties</li>
                <li>Agni (Digestive Fire) & Ama (Toxins)</li>
                <li>Herbal teas & kitchen remedy spices</li>
                <li>Dinacharya (Daily routine) steps</li>
                <li>Sattvic nutritional guidelines</li>
              </ul>
            </div>
            <p className="text-[10px] text-white/40 italic">
              *Disclaimer: Acharya Veda provides educational and traditional lifestyle support. Always consult a licensed clinical practitioner for any acute or severe conditions.
            </p>
          </div>

          {messages.length > 0 && (
            <button
              id="clear-chat-btn"
              onClick={handleClearChat}
              className="w-full bg-red-950/20 border border-red-500/20 hover:bg-red-950/40 text-red-300 font-semibold px-4 py-3 rounded-2xl transition duration-300 flex items-center justify-center gap-2 text-xs uppercase cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Clear Chat History
            </button>
          )}
        </div>
      </div>

      {/* Right Column: Scrollable Chat Interface (Spans 8 Columns) */}
      <div className="lg:col-span-8 flex flex-col h-[650px] rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-hidden">
        {/* Chat Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/10">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <h4 className="text-sm font-bold text-[#F2EBE4] font-serif">Vaidya Acharya Veda</h4>
              <p className="text-[10px] text-white/40">Powered by Gemini AI • Active</p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-[#C5A36B]" />
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-[#C5A36B]/15 border border-[#C5A36B]/30 flex items-center justify-center text-3xl">
                  🕉️
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-lg font-serif text-[#F2EBE4]">What doubt can I clear for you?</h3>
                  <p className="text-xs text-white/50">
                    Ask me any question about Ayurvedic sciences, herbs, or body systems, or select one of the traditional doubts below to begin:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl text-left">
                  {starterDoubtPrompts.map((doubt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(doubt.text)}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C5A36B]/30 hover:bg-white/[0.08] transition text-left space-y-1.5 cursor-pointer group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{doubt.icon}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#C5A36B] transition" />
                      </div>
                      <h4 className="text-xs font-bold text-[#F2EBE4] group-hover:text-[#C5A36B] transition">{doubt.title}</h4>
                      <p className="text-[10px] text-white/40 line-clamp-1">{doubt.text}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {/* Introduction greeting message if there is chat */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C5A36B]/20 flex items-center justify-center border border-[#C5A36B]/30 text-xs flex-shrink-0">
                    🕉️
                  </div>
                  <div className="max-w-[85%] bg-white/5 rounded-2xl rounded-tl-none p-4 border border-white/5">
                    <p className="text-xs text-[#E0D8D0]/90 leading-relaxed font-sans">
                      Namaste. I am here to assist you and resolve your doubts. Please ask any questions or choose an option above.
                    </p>
                  </div>
                </div>

                {messages.map((msg, index) => {
                  const isUser = msg.role === "user";
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-full bg-[#C5A36B]/20 flex items-center justify-center border border-[#C5A36B]/30 text-xs flex-shrink-0 font-bold">
                          🕉️
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-4 border ${
                          isUser
                            ? "bg-[#C5A36B]/15 border-[#C5A36B]/30 rounded-tr-none text-right"
                            : "bg-white/5 border-white/5 rounded-tl-none"
                        }`}
                      >
                        <div className={`prose prose-invert prose-xs text-xs text-[#E0D8D0]/95 leading-relaxed font-sans space-y-2 markdown-body text-left`}>
                          {isUser ? (
                            <p className="whitespace-pre-wrap text-left">{msg.content}</p>
                          ) : (
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          )}
                        </div>
                        <div className={`text-[9px] text-white/30 mt-2 ${isUser ? "text-right" : "text-left"}`}>
                          {msg.timestamp}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-xs flex-shrink-0 font-bold text-white/70">
                          👤
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-[#C5A36B]/20 flex items-center justify-center border border-[#C5A36B]/30 text-xs flex-shrink-0 animate-spin">
                🌀
              </div>
              <div className="max-w-[85%] bg-white/5 rounded-2xl rounded-tl-none p-4 border border-white/5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#C5A36B] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-1.5 h-1.5 bg-[#C5A36B] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-1.5 h-1.5 bg-[#C5A36B] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                <span className="text-[10px] text-[#C5A36B] font-medium ml-1.5">Consulting ancient treatises...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-black/10 flex gap-2 items-center">
          <input
            id="ayurbot-input-field"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your doubts here (e.g. 'How do I balance high Pitta heat?')..."
            disabled={loading}
            className="flex-1 bg-white/5 hover:bg-white/[0.08] focus:bg-white/[0.08] text-white border border-white/10 focus:border-[#C5A36B]/50 rounded-2xl px-4 py-3 text-xs placeholder-white/35 outline-none transition h-11 flex items-center"
          />
          <button
            id="ayurbot-send-btn"
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || loading}
            className="w-11 h-11 bg-[#C5A36B] text-black hover:bg-white transition duration-200 rounded-2xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
