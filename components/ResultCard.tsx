import React from 'react';
import { formatDiopter } from '../utils/calculations';
import { ArrowRight, Sparkles, Eye, Glasses } from 'lucide-react';

interface ResultCardProps {
  glassesPower: number;
  contactPower: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ glassesPower, contactPower }) => {
  const diff = Math.abs(Math.abs(glassesPower) - Math.abs(contactPower));
  const isChanged = diff >= 0.1; // floating point tolerance

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-xl transform transition-all duration-500 hover:scale-[1.02]">
      {/* Background Gradient - Dynamic based on power type */}
      <div className={`absolute inset-0 z-0 bg-gradient-to-br ${
        glassesPower < 0 
          ? 'from-blue-500 to-indigo-600'  // Myopia (Cool colors)
          : 'from-orange-400 to-rose-500'  // Hyperopia (Warm colors)
      }`}></div>
      
      {/* Decorative Abstract Shapes */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-black opacity-5 rounded-full blur-2xl"></div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      <div className="relative z-10 p-6 text-white">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 opacity-90">
                <Sparkles className="w-4 h-4 text-yellow-200" />
                <span className="text-xs font-bold tracking-widest uppercase text-white/90">換算結果 Result</span>
            </div>
            <div className="px-2 py-1 rounded-full bg-white/20 text-[10px] font-medium backdrop-blur-md border border-white/10">
              Vertex: 12mm
            </div>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          {/* From: Glasses */}
          <div className="flex-1 flex flex-col items-start">
            <div className="flex items-center gap-1.5 mb-2 text-blue-50">
                <Glasses className="w-4 h-4 opacity-70" />
                <span className="text-xs font-medium opacity-80">眼鏡度數</span>
            </div>
            <p className="text-3xl font-semibold text-white/90 tracking-tight">
              {formatDiopter(glassesPower)}
            </p>
          </div>

          {/* Arrow Indicator */}
          <div className="flex flex-col items-center justify-center px-2">
             <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
                <ArrowRight className="w-5 h-5 text-white drop-shadow-sm" />
             </div>
          </div>

          {/* To: Contacts (Highlighted) */}
          <div className="flex-1 flex flex-col items-end">
            <div className="flex items-center gap-1.5 mb-2 text-blue-50">
                 <span className="text-xs font-medium opacity-80">隱眼建議</span>
                 <Eye className="w-4 h-4 opacity-70" />
            </div>
            <div className="relative">
                <div className="absolute -inset-2 bg-white/20 blur-lg rounded-full opacity-0 animate-pulse"></div>
                <p className="text-4xl font-bold text-white tracking-tight drop-shadow-md relative z-10">
                {formatDiopter(contactPower)}
                </p>
            </div>
          </div>
        </div>

        {/* Explanation Footer */}
        <div className="mt-8 pt-5 border-t border-white/10 flex items-start gap-3">
            <div className="w-1 h-8 bg-white/40 rounded-full flex-shrink-0 mt-1"></div>
            <div className="text-sm text-blue-50 leading-relaxed font-light opacity-95">
                {isChanged ? (
                    <span>
                        因為隱形眼鏡貼在角膜上，距離為 0，
                        <span className="font-bold text-white">
                            {glassesPower < 0 ? "近視需降度" : "遠視需補正"}
                        </span>
                        以獲得相同視覺效果。
                    </span>
                ) : (
                    <span>
                        度數較輕微（±4.00D 以內），眼鏡與隱形眼鏡度數通常通用，<span className="font-bold text-white">無需換算</span>。
                    </span>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;