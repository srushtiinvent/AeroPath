import { useMemo, useState } from "react";

type Message = {
  id: string;
  text: string;
  sender: "user" | "assistant";
};

const initialMessages: Message[] = [
  { id: "m1", text: "Hi AeroPath! Can you help me find the best terminal dining near CDG?", sender: "user" },
  { id: "m2", text: "Absolutely! For CDG, try Terminal 2E food hall for quick bites, or head to Salon Air France for premium lounge dining.", sender: "assistant" },
];

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    if (!draft.trim()) return;
    const userMessage: Message = { id: `u-${Date.now()}`, text: draft.trim(), sender: "user" };
    const assistantMessage: Message = {
      id: `a-${Date.now()}`,
      text: "Great question! I recommend checking your boarding pass details first, then I can suggest airport lounges or destination highlights tailored to your schedule.",
      sender: "assistant",
    };
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setDraft("");
  };

  const threadHeight = useMemo(() => ({ minHeight: "48vh" }), []);

  return (
    <section className="flex h-full min-h-[650px] flex-col gap-6">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-700/60 dark:bg-slate-950/90">
        <h2 className="text-3xl font-semibold">Travel Assistant</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Ask AeroPath anything about your journey, boarding, or destination planning.</p>
      </div>

      <div className="flex-1 overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50 shadow-soft dark:border-slate-700/60 dark:bg-slate-950/90">
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6" style={threadHeight}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={message.sender === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={`max-w-[78%] rounded-3xl px-5 py-4 shadow-sm ${
                    message.sender === "user"
                      ? "bg-sky-500 text-white"
                      : "bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                  }`}>
                    <p className="whitespace-pre-line text-sm leading-6">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200/80 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask AeroPath a travel question..."
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
              />
              <button onClick={handleSend} type="button" className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIChat;
