
import React from 'react';
import { Language } from '../types';
import { t } from '../utils/translations';

interface SettingsOverlayProps {
  volume: number;
  language: Language;
  onVolumeChange: (val: number) => void;
  onLanguageChange: (lang: Language) => void;
  onClose: () => void;
}

const SettingsOverlay: React.FC<SettingsOverlayProps> = ({ 
  volume, 
  language, 
  onVolumeChange, 
  onLanguageChange, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-slate-800 border-4 border-slate-700 rounded-2xl w-full max-w-sm overflow-hidden flex flex-col p-8 gap-8 shadow-2xl">
        <h2 className="text-white pixel-font text-3xl uppercase font-bold text-center drop-shadow-md">
          {t('settings', language)}
        </h2>

        <div className="flex flex-col gap-6">
          {/* Volume Control */}
          <div className="flex flex-col gap-3">
            <label className="text-slate-400 pixel-font text-xs uppercase tracking-widest flex justify-between">
              {t('volume', language)}
              <span className="text-white">{Math.round(volume * 100)}%</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume} 
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Language Control */}
          <div className="flex flex-col gap-3">
            <label className="text-slate-400 pixel-font text-xs uppercase tracking-widest">
              {t('language', language)}
            </label>
            <div className="flex gap-2">
              <button 
                onClick={() => onLanguageChange('en')}
                className={`flex-1 py-2 rounded-lg pixel-font text-xs font-bold border-2 transition-all ${language === 'en' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-700 border-slate-600 text-slate-400'}`}
              >
                ENGLISH
              </button>
              <button 
                onClick={() => onLanguageChange('ru')}
                className={`flex-1 py-2 rounded-lg pixel-font text-xs font-bold border-2 transition-all ${language === 'ru' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-700 border-slate-600 text-slate-400'}`}
              >
                РУССКИЙ
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg border-b-4 border-slate-800 transition-all active:translate-y-1 active:border-b-0 pixel-font"
        >
          {t('back', language)}
        </button>
      </div>
    </div>
  );
};

export default SettingsOverlay;
