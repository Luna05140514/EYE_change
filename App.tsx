import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ResultCard from './components/ResultCard';
import AiAdvisor from './components/AiAdvisor';
import { calculateContactPower } from './utils/calculations';
import { AlertTriangle, Minus, Plus, Settings2 } from 'lucide-react';

type VisionType = 'myopia' | 'hyperopia';

const App: React.FC = () => {
  // Input value as string to handle user typing flexible formats
  const [inputValue, setInputValue] = useState<string>("500");
  // Vision type: Myopia (-) or Hyperopia (+)
  const [visionType, setVisionType] = useState<VisionType>('myopia');
  
  const [glassesPower, setGlassesPower] = useState<number>(-5.00);
  const [contactPower, setContactPower] = useState<number>(0);
  const [vertexDistance, setVertexDistance] = useState<number>(12);

  // Handle input changes with smart detection
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Process the input value into a valid Diopter number
  useEffect(() => {
    let num = parseFloat(inputValue);
    if (isNaN(num)) {
      setGlassesPower(0);
      return;
    }

    // Smart conversion: If user types > 25, assume they mean "Degrees" (e.g. 500 -> 5.00)
    if (Math.abs(num) >= 25) {
      num = num / 100;
    }

    // Apply sign based on vision type
    const finalPower = visionType === 'myopia' ? -Math.abs(num) : Math.abs(num);
    setGlassesPower(finalPower);
  }, [inputValue, visionType]);

  // Calculate contact lens power whenever glasses power changes
  useEffect(() => {
    const result = calculateContactPower(glassesPower, vertexDistance);
    setContactPower(result);
  }, [glassesPower, vertexDistance]);

  const adjustValue = (delta: number) => {
    let currentAbs = Math.abs(glassesPower);
    const isDegreeFormat = parseFloat(inputValue) >= 25 || (inputValue.indexOf('.') === -1 && currentAbs >= 1);
    
    if (isDegreeFormat) {
        // Adjust by 25 degrees steps (e.g. 500 -> 525)
        let newDeg = (currentAbs * 100) + (delta * 100);
        if (newDeg < 0) newDeg = 0;
        setInputValue(newDeg.toString());
    } else {
        // Adjust by 0.25 Diopter steps (e.g. 5.00 -> 5.25)
        let newDiopter = currentAbs + delta;
        if (newDiopter < 0) newDiopter = 0;
        setInputValue(newDiopter.toFixed(2));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24 selection:bg-blue-100">
      <Header />

      <main className="max-w-md mx-auto px-5 pt-6 space-y-6">
        
        {/* Vision Type Toggle */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex gap-1 relative z-10">
            <button 
                onClick={() => setVisionType('myopia')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    visionType === 'myopia' 
                    ? 'bg-slate-800 text-white shadow-md scale-[1.02]' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
            >
                <Minus className="w-4 h-4" strokeWidth={3} />
                近視 (Myopia)
            </button>
            <button 
                onClick={() => setVisionType('hyperopia')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    visionType === 'hyperopia' 
                    ? 'bg-orange-500 text-white shadow-md scale-[1.02]' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
            >
                <Plus className="w-4 h-4" strokeWidth={3} />
                遠視 (Hyperopia)
            </button>
        </div>

        {/* Main Input Section */}
        <section className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-8 border border-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200"></div>
          
          <div className="flex items-center justify-between mb-8">
            <label className="flex items-center gap-2 text-slate-500 font-semibold text-sm uppercase tracking-wider">
                <Settings2 className="w-4 h-4 text-blue-500" />
                輸入眼鏡度數
            </label>
            <div className="text-[10px] bg-slate-100 text-slate-400 px-2.5 py-1 rounded-full font-medium">
                支援輸入 500 或 5.00
            </div>
          </div>
          
          <div className="relative flex items-center justify-between mb-4 gap-4">
            <button 
                onClick={() => adjustValue(-0.25)} 
                className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:bg-slate-200 active:scale-95 transition-all flex items-center justify-center border border-slate-100 shadow-sm"
            >
                <Minus className="w-5 h-5" />
            </button>

            <div className="flex-1 text-center relative group">
                 <div className="absolute inset-x-0 bottom-0 h-px bg-slate-200 group-focus-within:bg-blue-500 transition-colors"></div>
                 <input
                  type="number"
                  inputMode="decimal"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="w-full text-6xl font-bold text-center text-slate-800 focus:outline-none bg-transparent p-2 placeholder-slate-200 tracking-tight"
                  placeholder="500"
                />
            </div>

            <button 
                onClick={() => adjustValue(0.25)} 
                className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:bg-slate-200 active:scale-95 transition-all flex items-center justify-center border border-slate-100 shadow-sm"
            >
                <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center">
             <p className="text-sm font-medium text-slate-400">
                目前設定：
                <span className={`ml-1 ${visionType === 'myopia' ? 'text-slate-700' : 'text-orange-500'}`}>
                    {visionType === 'myopia' ? '近視' : '遠視'} {Math.abs(glassesPower).toFixed(2)} D
                </span>
             </p>
          </div>
        </section>

        {/* Result Display */}
        <ResultCard glassesPower={glassesPower} contactPower={contactPower} />

        {/* AI Advisor */}
        <AiAdvisor />

        {/* Disclaimer */}
        <footer className="text-center pb-8 px-4">
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
             <AlertTriangle className="w-3 h-3 inline-block mr-1 -mt-0.5" />
             結果僅供參考。每個人的角膜弧度不同，初次配戴隱形眼鏡請務必諮詢眼科醫師或驗光師。
          </p>
        </footer>

      </main>
    </div>
  );
};

export default App;