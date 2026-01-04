
import React, { useState, useEffect } from 'react';
import { BlockType, InventorySlot, Language } from '../types';
import { BLOCK_DATA, CRAFTING_RECIPES, INVENTORY_SIZE } from '../constants';
import ItemIcon from './ItemIcon';
import { t } from '../utils/translations';

interface InventoryOverlayProps {
  inventory: InventorySlot[];
  toolDurability: Record<number, number>;
  language: Language;
  onCraft: (result: BlockType) => void;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
  onClose: () => void;
}

const InventoryOverlay: React.FC<InventoryOverlayProps> = ({ 
  inventory, 
  toolDurability, 
  language, 
  onCraft, 
  onMoveItem,
  onClose 
}) => {
  const [heldSlotIndex, setHeldSlotIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getTotalCount = (type: BlockType) => {
    return inventory.reduce((acc, slot) => slot.type === type ? acc + slot.count : acc, 0);
  };

  const handleSlotClick = (index: number) => {
    if (heldSlotIndex === null) {
      if (inventory[index].type !== BlockType.AIR) {
        setHeldSlotIndex(index);
      }
    } else {
      onMoveItem(heldSlotIndex, index);
      setHeldSlotIndex(null);
    }
  };

  const heldSlot = heldSlotIndex !== null ? inventory[heldSlotIndex] : null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 select-none">
      {/* Visual Cursor Item */}
      {heldSlotIndex !== null && heldSlot && (
        <div 
          className="fixed pointer-events-none z-[100] transition-transform duration-75 flex flex-col items-center"
          style={{ 
            left: mousePos.x, 
            top: mousePos.y, 
            transform: 'translate(-50%, -110%)' 
          }}
        >
          <div className="p-2 bg-slate-700 border-2 border-white rounded-lg shadow-2xl scale-125">
             <ItemIcon type={heldSlot.type} className="w-10 h-10" />
             {heldSlot.count > 1 && (
               <span className="absolute bottom-1 right-1 text-[10px] font-bold text-white pixel-font drop-shadow-md">
                 {heldSlot.count}
               </span>
             )}
          </div>
        </div>
      )}

      <div className="bg-slate-800 border-4 border-slate-700 rounded-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900">
          <h2 className="text-white pixel-font text-xl uppercase font-bold">{t('inventoryTitle', language)}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl font-bold transition-colors hover:scale-110">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8">
          {/* Grid Inventory Section */}
          <section>
            <h3 className="text-slate-400 text-[10px] uppercase tracking-widest mb-4 pixel-font">{t('resources', language)}</h3>
            <div className="grid grid-cols-9 gap-2">
              {inventory.map((slot, index) => {
                const info = BLOCK_DATA[slot.type];
                const currentDurability = toolDurability[slot.type];
                const maxDurability = info?.maxDurability;
                const durabilityPercent = (currentDurability !== undefined && maxDurability !== undefined) 
                  ? currentDurability / maxDurability 
                  : undefined;

                const isLowDurability = durabilityPercent !== undefined && durabilityPercent < 0.15;
                const isEmpty = slot.type === BlockType.AIR;
                const isHeld = heldSlotIndex === index;

                return (
                  <button 
                    key={index} 
                    onClick={() => handleSlotClick(index)}
                    className={`
                      aspect-square p-1 rounded border flex flex-col items-center justify-center group relative transition-all
                      ${isEmpty ? 'bg-slate-900/40 border-slate-700 hover:bg-slate-800/60' : 
                        isHeld ? 'bg-white/20 border-white ring-2 ring-white/50 animate-pulse' :
                        isLowDurability ? 'bg-red-900/20 border-red-500 hover:bg-red-900/30' : 
                        'bg-slate-700 border-slate-600 hover:bg-slate-600 active:scale-95'}
                    `}
                  >
                    {!isEmpty && (
                      <>
                        <ItemIcon type={slot.type} className={`w-8 h-8 ${isHeld ? 'opacity-30' : ''}`} durabilityPercent={durabilityPercent} />
                        {slot.count > 1 && (
                          <span className={`absolute bottom-0.5 right-1 text-[8px] font-bold text-white pixel-font drop-shadow-md ${isHeld ? 'opacity-30' : ''}`}>
                            {slot.count}
                          </span>
                        )}
                        {!isHeld && (
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 uppercase">
                            {info.name}
                          </div>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Crafting Section */}
          <section className="bg-slate-900/30 p-4 rounded-xl border border-slate-700">
            <h3 className="text-slate-400 text-[10px] uppercase tracking-widest mb-4 pixel-font">{t('crafting', language)}</h3>
            <div className="flex flex-col gap-3">
              {CRAFTING_RECIPES.map((recipe) => {
                const info = BLOCK_DATA[recipe.result];
                const canCraft = recipe.ingredients.every(ing => getTotalCount(ing.type) >= ing.count);

                return (
                  <div key={recipe.result} className={`bg-slate-700 p-3 rounded-xl border-2 ${canCraft ? 'border-green-600/50' : 'border-slate-600'} flex items-center justify-between transition-all hover:translate-x-1 shadow-sm`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 shadow-inner">
                        <ItemIcon type={recipe.result} className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-[10px] pixel-font uppercase leading-tight">{info.name} ({recipe.amount})</div>
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                          {recipe.ingredients.map(ing => (
                            <div key={ing.type} className={`text-[7px] pixel-font ${ getTotalCount(ing.type) >= ing.count ? 'text-green-400' : 'text-red-400'}`}>
                              {ing.count}x {BLOCK_DATA[ing.type].name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      disabled={!canCraft}
                      onClick={() => onCraft(recipe.result)}
                      className={`px-3 py-2 rounded-lg pixel-font text-[10px] font-bold uppercase transition-all
                        ${canCraft ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg active:scale-95' : 'bg-slate-600 text-slate-500 cursor-not-allowed'}
                      `}
                    >
                      {t('craftBtn', language)}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="p-4 bg-slate-900 text-slate-500 text-[9px] text-center pixel-font uppercase tracking-tighter">
          {t('closeHint', language)}
        </div>
      </div>
    </div>
  );
};

export default InventoryOverlay;
