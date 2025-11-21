import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Bot } from 'lucide-react';
import { getEyeCareAdvice, askGeminiChat } from '../services/geminiService';

const AiAdvisor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tip, setTip] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);

  const fetchRandomTip = async () => {
    setLoading(true);
    const topics = ["dry eyes", "cleaning contacts", "wearing time", "UV protection", "astigmatism"];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const advice = await getEyeCareAdvice(randomTopic);
    setTip(advice);
    setLoading(false);
  };

  const handleAsk = async () => {
      if(!question.trim()) return;
      setLoading(true);
      const currentQ = question;
      setQuestion("");
      setChatHistory(prev => [...prev, { role: 'user', text: currentQ }]);
      
      const answer = await askGeminiChat(currentQ);
      
      setChatHistory(prev => [...prev, { role: 'ai', text: answer }]);
      setLoading(false);
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-6 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="w-24 h-24" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-primary-400" />
          <h3 className="font-semibold text-lg">AI 護眼小顧問</h3>
        </div>

        {/* Quick Tip Section */}
        <div className="mb-6">
            {!tip ? (
                <p className="text-slate-300 text-sm mb-4">
                    不知道如何保養隱形眼鏡嗎？讓 Gemini AI 給你專業建議。
                </p>
            ) : (
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 mb-4 animate-fade-in">
                    <p className="text-sm leading-relaxed text-slate-100">{tip}</p>
                </div>
            )}
            
            {!isOpen && (
                 <button 
                 onClick={() => { setIsOpen(true); fetchRandomTip(); }}
                 className="w-full py-2.5 bg-primary-600 hover:bg-primary-500 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
               >
                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                 獲取護眼小知識
               </button>
            )}
        </div>

        {/* Chat Section - Expanded */}
        {isOpen && (
            <div className="space-y-4">
                 <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                     {chatHistory.map((msg, idx) => (
                         <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                                 msg.role === 'user' 
                                 ? 'bg-primary-600 text-white rounded-br-none' 
                                 : 'bg-slate-700 text-slate-200 rounded-bl-none'
                             }`}>
                                 {msg.text}
                             </div>
                         </div>
                     ))}
                     {loading && (
                         <div className="flex justify-start">
                             <div className="bg-slate-700 rounded-2xl rounded-bl-none px-4 py-2 flex items-center gap-2">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                             </div>
                         </div>
                     )}
                 </div>

                 <div className="flex items-center gap-2 mt-2">
                    <input 
                        type="text" 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                        placeholder="例如：戴隱眼可以點眼藥水嗎？"
                        className="flex-1 bg-slate-900/50 border border-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary-500 text-white placeholder-slate-500"
                    />
                    <button 
                        onClick={handleAsk}
                        disabled={loading || !question.trim()}
                        className="p-2 bg-primary-600 rounded-full hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AiAdvisor;