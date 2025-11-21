import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

const Header: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      // 這會抓取當前 APP 的網址 (在預覽視窗中就是正確的 .csb.app 網址)
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for some browsers if needed, though modern ones support clipboard API
      alert(`請複製此網址分享：\n${window.location.href}`);
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between relative">
        {/* Empty div for spacing balance */}
        <div className="w-8"></div>
        
        <h1 className="font-bold text-lg text-slate-800 tracking-wide">
          眼鏡度數換算
        </h1>

        {/* Share Button */}
        <button 
          onClick={handleShare}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors text-slate-500 relative"
          aria-label="分享 APP"
        >
          {copied ? (
            <div className="flex items-center animate-in fade-in zoom-in duration-200">
               <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs bg-slate-800 text-white px-2 py-1 rounded shadow-lg whitespace-nowrap">已複製網址！</span>
               <Check className="w-5 h-5 text-green-500" />
            </div>
          ) : (
            <Share2 className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;