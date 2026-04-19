import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const PREDEFINED_RESPONSES: Record<string, string> = {
  carbon:
    "Carbon emissions are measured in kg CO2e per kg of material. Lower values are better. Negative values indicate carbon sequestration (the material stores more carbon than it emits). Materials like CLT and hempcrete can actually remove carbon from the atmosphere!",
  lifespan:
    "Material lifespan refers to how long the material is expected to last before needing replacement. Longer lifespans reduce the environmental impact over time by avoiding frequent replacements. For example, clay brick can last 100+ years while bamboo might last 25 years.",
  health:
    "Public health impacts include three factors: 1) Urban heat island effect (how much heat the material retains), 2) Air quality impact (emissions during use), and 3) Construction exposure (health risks during installation). Lower scores are better for all three metrics.",
  regulation:
    "Regulatory compliance ensures materials meet required building codes and standards. Some innovative materials like hempcrete may not be approved in all jurisdictions. Always check local building codes before selecting materials.",
  score:
    "The overall score is calculated using weighted factors: Carbon Emissions (35%), Material Lifespan (25%), Public Health (25%), and Regulatory Compliance (15%). Scores range from 0-100, with higher being better.",
  comparison:
    "To compare materials effectively, look at: 1) Overall score for quick assessment, 2) Individual metrics to understand trade-offs, 3) Regulatory compliance for feasibility, and 4) Your project's specific priorities (e.g., if carbon reduction is critical, prioritize carbon scores).",
};

export function Chatbot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your MaterialSense AI assistant. I can help you understand material sustainability metrics, scoring methodology, and regulatory requirements. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Check for keywords
    if (lowerMessage.includes("carbon") || lowerMessage.includes("emission")) {
      return PREDEFINED_RESPONSES.carbon;
    }
    if (lowerMessage.includes("lifespan") || lowerMessage.includes("durability")) {
      return PREDEFINED_RESPONSES.lifespan;
    }
    if (
      lowerMessage.includes("health") ||
      lowerMessage.includes("air quality") ||
      lowerMessage.includes("heat")
    ) {
      return PREDEFINED_RESPONSES.health;
    }
    if (lowerMessage.includes("regulation") || lowerMessage.includes("compliance")) {
      return PREDEFINED_RESPONSES.regulation;
    }
    if (lowerMessage.includes("score") || lowerMessage.includes("calculate")) {
      return PREDEFINED_RESPONSES.score;
    }
    if (lowerMessage.includes("compare") || lowerMessage.includes("comparison")) {
      return PREDEFINED_RESPONSES.comparison;
    }
    if (
      lowerMessage.includes("concrete") ||
      lowerMessage.includes("clt") ||
      lowerMessage.includes("timber")
    ) {
      return "I can provide information about specific materials. Low-carbon concrete reduces emissions by ~50% compared to standard concrete. CLT (Cross-Laminated Timber) is an excellent sustainable option with carbon sequestration benefits. Which material would you like to know more about?";
    }
    if (lowerMessage.includes("best") || lowerMessage.includes("recommend")) {
      return "The 'best' material depends on your project priorities. For lowest carbon footprint, consider hempcrete or CLT. For longest lifespan, choose rammed earth or clay brick. For regulatory compliance everywhere, stick with standard options like concrete or steel. What's most important for your project?";
    }
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! How can I assist you with sustainable material selection today?";
    }

    return "That's a great question! I can help you with: carbon emissions, material lifespan, public health impacts, regulatory compliance, scoring methodology, or material comparisons. You can also visit the Methodology page for detailed information about our calculation process.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md">
      <Card className="shadow-2xl border-slate-200">
        {/* Header */}
        <div className="bg-pink-accent text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-xs text-white/90">Always here to help</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-96 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user"
                      ? "bg-slate-200"
                      : "bg-pink-accent text-white"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4 text-slate-700" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-pink-chatbot text-white"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon" className="bg-pink-accent hover:bg-pink-accent/90">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
