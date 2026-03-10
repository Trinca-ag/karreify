"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { deductCredits, checkCredits } from "@/services/credits";
import { MessageSquare, Send, Bot, User } from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Ola! Sou seu assistente de carreira. Posso ajudar com duvidas sobre curriculos, entrevistas, planejamento de carreira e muito mais. Como posso te ajudar?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user || loading) return;

    const hasCredits = await checkCredits(user.uid, "chat");
    if (!hasCredits) { toast.error("Creditos insuficientes."); return; }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const context = messages.slice(-6).map((m) => `${m.role}: ${m.content}`).join("\n");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, context, userId: user.uid }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      await deductCredits(user.uid, "chat", "Chat com IA");

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar mensagem.");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-12rem)]">
      <div>
        <h1 className="text-2xl font-bold text-white font-heading flex items-center gap-3">
          <MessageSquare className="w-7 h-7 text-primary-400" />
          Chat com IA
        </h1>
        <p className="text-gray-400 mt-1">Converse com nossa IA especializada em carreira.</p>
      </div>

      <div className="flex flex-col h-[calc(100%-5rem)] bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.06] shadow-lg shadow-black/10 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Welcome message */}
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="w-8 h-8 bg-primary-500/10 border border-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary-400" />
                </div>
              )}
              <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                message.role === "user"
                  ? "bg-primary-500/10 border border-primary-500/10 text-gray-200 rounded-br-md"
                  : "bg-white/[0.03] border border-white/[0.06] text-gray-300 rounded-bl-md"
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-500/10 border border-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary-400" />
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-primary-400/60 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary-400/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-primary-400/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/[0.06] p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/30 text-white placeholder-gray-500 transition-all duration-200"
              placeholder="Digite sua mensagem..."
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-lg shadow-primary-600/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">1 credito por mensagem</p>
        </div>
      </div>
    </div>
  );
}
