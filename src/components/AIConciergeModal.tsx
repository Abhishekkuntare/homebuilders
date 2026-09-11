import React, { useState, useRef, useEffect } from "react";
import { Property } from "../types";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  Compass,
  MessageCircle,
  Building,
  RotateCcw
} from "lucide-react";

interface AIConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onBookTour: (propertyTitle: string) => void;
}

interface ChatMessage {
  role: "assistant" | "user";
  text: string;
  matchedProperties?: Property[];
}

export const AIConciergeModal: React.FC<AIConciergeModalProps> = ({
  isOpen,
  onClose,
  properties,
  onSelectProperty,
  onBookTour
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Good day. I am the Smith & Stone Private Property Concierge. Whether you seek an oceanfront villa in Goa, a 64th-floor duplex penthouse in Dubai, or a heritage bungalow in Koregaon Park, how may I assist your acquisition today?"
    }
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Show me residences with private plunge pools",
    "What penthouses are available in Dubai or Bangalore?",
    "Tell me about the architecture of The Oak Residence",
    "Which properties are best for entertaining 40+ guests?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: newMessages.slice(-6).map((m) => ({
            role: m.role,
            content: m.text
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Find if any properties are mentioned in AI reply or query
        const matched = properties.filter((p) => {
          const titleLow = p.title.toLowerCase();
          const cityLow = p.city.toLowerCase();
          const qLow = text.toLowerCase();
          const replyLow = (data.reply || "").toLowerCase();
          return (
            replyLow.includes(titleLow) ||
            replyLow.includes(p.slug) ||
            (qLow.includes(cityLow) && replyLow.includes(cityLow))
          );
        });

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.reply,
            matchedProperties: matched.slice(0, 2)
          }
        ]);
      } else {
        throw new Error("API error");
      }
    } catch (err) {
      console.error(err);
      // Sophisticated local fallback response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Thank you for your inquiry. For exquisite private residences matching "${text}", I recommend exploring The Oak Residence in Bandra West or Azure Heights in Dubai, both offering exceptional double-height living spaces, panoramic views, and private plunge spas. Would you like to view architectural floor plans or reserve an exclusive twilight walkthrough?`,
          matchedProperties: properties.slice(0, 2)
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#101218] border border-neutral-800 rounded-2xl max-w-2xl w-full h-[640px] flex flex-col justify-between text-white relative shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-[#14161f]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#c5a880]/20 border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#c5a880] font-semibold">
                Private Advisory Intelligence
              </span>
              <h3 className="font-serif text-lg text-white">Smith & Stone Concierge</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-[#c5a880]/20 border border-[#c5a880]/30 flex-shrink-0 flex items-center justify-center text-[#c5a880] mt-1">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-4 rounded-2xl leading-relaxed font-light ${
                  msg.role === "user"
                    ? "bg-[#c5a880] text-[#0c0d11] font-medium rounded-br-none"
                    : "bg-[#181a24] text-neutral-200 border border-neutral-800 rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-line text-[13px]">{msg.text}</p>

                {/* Inline property recommendations if any */}
                {msg.matchedProperties && msg.matchedProperties.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-neutral-700/60 space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-[#c5a880] font-medium">
                      Matched Residences:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.matchedProperties.map((prop) => (
                        <div
                          key={prop.id}
                          className="bg-[#111319] p-2.5 rounded-xl border border-neutral-700 flex items-center gap-2 text-left"
                        >
                          <img
                            src={prop.heroImage}
                            alt={prop.title}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-serif text-xs text-white truncate font-medium">
                              {prop.title}
                            </h5>
                            <p className="text-[11px] text-[#c5a880]">{prop.priceFormatted}</p>
                            <button
                              onClick={() => {
                                onClose();
                                onSelectProperty(prop);
                              }}
                              className="text-[10px] text-neutral-300 hover:text-white underline mt-0.5"
                            >
                              Explore Residence →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-neutral-800 flex-shrink-0 flex items-center justify-center text-white mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start items-center text-xs text-neutral-400">
              <div className="w-7 h-7 rounded-full bg-[#c5a880]/20 flex items-center justify-center text-[#c5a880]">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="bg-[#181a24] px-4 py-2.5 rounded-2xl border border-neutral-800 text-neutral-300 italic">
                Reviewing private portfolio catalog & architectural specifications...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-6 py-2 bg-[#12141a] border-t border-neutral-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-3 py-1.5 rounded-full bg-[#181a24] hover:bg-[#202330] border border-neutral-800 text-neutral-300 hover:text-white text-[11px] whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#14161f] border-t border-neutral-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask about architectural styles, price, bedroom configurations..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-[#1a1d28] text-white px-4 py-3 rounded-xl border border-neutral-700 text-xs focus:outline-none focus:border-[#c5a880] transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="px-5 py-3 rounded-xl bg-[#c5a880] hover:bg-[#d5ba92] disabled:opacity-40 text-[#0c0d11] font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <span>Consult</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
