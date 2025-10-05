"use client";

import { useState, FormEvent, useEffect } from "react";
import { Send, Bot, CornerDownLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatInput } from "@/components/ui/chat-input";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat";
import { ChatMessageList } from "@/components/ui/chat-message-list";

interface WeatherData {
  location: string;
  coordinates: string;
  date: string;
  yearsSampled: number;
  probabilities: {
    veryHot: number;
    veryCold: number;
    veryWindy: number;
    veryWet: number;
    veryUncomfortable: number;
  };
  counts: {
    veryHot: number;
    veryCold: number;
    veryWindy: number;
    veryWet: number;
    veryUncomfortable: number;
  };
}

interface Message {
  id: number;
  content: string;
  sender: "ai" | "user";
  timestamp: Date;
}

interface WeatherChatAssistantProps {
  weatherData: WeatherData;
}

export function WeatherChatAssistant({ weatherData }: WeatherChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Generate initial AI message
  const generateInitialMessage = (data: WeatherData) => {
    const highestRisk = Object.entries(data.probabilities)
      .reduce((a, b) =>
        data.probabilities[a[0] as keyof typeof data.probabilities] >
        data.probabilities[b[0] as keyof typeof data.probabilities]
          ? a
          : b
      )[0];

    const riskPercentage = (
      Math.max(...Object.values(data.probabilities)) * 100
    ).toFixed(1);
    const riskLevel =
      Math.max(...Object.values(data.probabilities)) >= 0.3
        ? "High"
        : Math.max(...Object.values(data.probabilities)) >= 0.15
        ? "Medium"
        : "Low";

    const conditionName = highestRisk
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

    return `🌟 Hi! I'm your AI Weather Planning Assistant! I've analyzed your weather data for **${data.location}** on **${data.date}**.

📊 **Key Findings:**
• Highest risk: ${conditionName} (${riskPercentage}% probability)
• Risk level: ${riskLevel}
• Based on ${data.yearsSampled} years of NASA satellite data

🎯 I'm here to help you plan your outdoor activities! Ask me about:
• Event planning strategies
• Risk mitigation suggestions  
• Alternative arrangements
• Seasonal insights

What would you like to plan for? 🚀`;
  };

  useEffect(() => {
    const initialMessage: Message = {
      id: 1,
      content: generateInitialMessage(weatherData),
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [weatherData]);

  // ✅ FIXED: Correct Gemini API call
  const callGeminiAPI = async (prompt: string, context: string): Promise<string> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "YOUR_API_KEY_HERE";
      if (!apiKey) throw new Error("Missing Gemini API Key");

   const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${context}

User Question: ${prompt}

🧭 Guidelines:
- Keep responses under **6-7 lines**.
- Focus on practical and clear weather planning advice.
- Avoid repetition or lengthy explanations.
- Bold the highlighted text that is neccessary
- Always end with a short concluding line.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.6,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 220, // ✅ shorter, ensures complete message
      },
    }),
  }
);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Gemini API response:", data);

      // 🔍 Handle both new and old response formats
      const aiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        data.candidates?.[0]?.content?.[0]?.parts?.[0]?.text ||
        "I'm here to help you with your weather planning!";

      return aiResponse.trim();
    } catch (error) {
      console.error("❌ Gemini API Error:", error);

      // Fallback offline response
      const highRisk = Math.max(...Object.values(weatherData.probabilities));
      const riskCondition = Object.entries(weatherData.probabilities)
        .find(([_, prob]) => prob === highRisk)?.[0]
        ?.replace(/([A-Z])/g, " $1")
        .toLowerCase();

      return `I'm having some trouble connecting right now 🤖  

But based on your weather analysis for **${weatherData.location}** on **${weatherData.date}**:

${highRisk > 0.3 ? `⚠️ High risk of ${riskCondition} conditions. Consider indoor alternatives or backup plans.` :
highRisk > 0.15 ? `⚡ Moderate risk detected. Stay flexible and check forecasts regularly.` :
`✅ Low risk! Great conditions expected for outdoor events.`}

Would you like me to suggest some event strategies? 🌤️`;
    }
  };

  const generateContextPrompt = (data: WeatherData) => {
    const risks = Object.entries(data.probabilities)
      .map(
        ([key, prob]) =>
          `${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}: ${(prob * 100).toFixed(1)}%`
      )
      .join(", ");

    return `You are a weather planning assistant helping users make decisions about outdoor events.

📍 Location: ${data.location} (${data.coordinates})
📅 Date: ${data.date}
🛰️ Data source: ${data.yearsSampled} years of NASA POWER satellite data

Probabilities → ${risks}

Focus on actionable advice, encouragement, and weather risk mitigation.`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const contextPrompt = generateContextPrompt(weatherData);
      const aiResponse = await callGeminiAPI(input.trim(), contextPrompt);

      const aiMessage: Message = {
        id: messages.length + 2,
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickSuggestions = [
    "What should I plan for outdoor events?",
    "How can I mitigate weather risks?",
    "What are good backup plans?",
    "When is the best time for my event?",
  ];

  const handleQuickSuggestion = (suggestion: string) => setInput(suggestion);

  return (
    <ExpandableChat
      size="md"
      position="bottom-right"
      icon={<Sparkles className="h-5 w-5" />}
      className="z-40"
    >
      <ExpandableChatHeader className=" flex-col text-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 py-3">
        <div className="flex items-center justify-center space-x-1.5">
          <Bot className="h-5 w-5 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-800">
            Weather AI
          </h1>
          <Sparkles className="h-4 w-4 text-purple-500" />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Planning advice for {weatherData.location}
        </p>
      </ExpandableChatHeader>

      <ExpandableChatBody className="bg-zinc-100">
        <ChatMessageList>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                className="h-7 w-7 shrink-0"
                fallback={message.sender === "user" ? "👤" : "🤖"}
              />
             <ChatBubbleMessage
  variant={message.sender === "user" ? "sent" : "received"}
  className={
    message.sender === "ai"
      ? "bg-white border border-gray-200 text-gray-800 whitespace-pre-wrap prose prose-sm max-w-none dark:prose-invert"
      : ""
  }
>
  {message.sender === "ai" ? (
    <ReactMarkdown>{message.content}</ReactMarkdown>
  ) : (
    message.content
  )}
</ChatBubbleMessage>

            </ChatBubble>
          ))}

          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar className="h-7 w-7 shrink-0" fallback="🤖" />
              <ChatBubbleMessage isLoading className="bg-white border border-gray-200" />
            </ChatBubble>
          )}

          {messages.length === 1 && (
            <div className="px-3 py-1.5">
              <p className="text-sm h-6 text-gray-500 mb-1.5">💡 Quick suggestions:</p>
              <div className="grid grid-cols-1 gap-1.5">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="text-left text-sm h-9 bg-white hover:bg-blue-50 border border-gray-200 rounded-md px-2.5 py-1.5 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </ChatMessageList>
      </ExpandableChatBody>

      <ExpandableChatFooter className="bg-white py-2">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
        >
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about weather planning..."
            className="min-h-10 resize-none rounded-lg bg-background border-0 p-2.5 shadow-none focus-visible:ring-0 text-sm"
            disabled={isLoading}
          />
          <div className="flex items-center p-2 pt-0 justify-end">
            <Button
              type="submit"
              size="sm"
              className="ml-auto gap-1 bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1.5"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
              <CornerDownLeft className="size-3" />
            </Button>
          </div>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}
