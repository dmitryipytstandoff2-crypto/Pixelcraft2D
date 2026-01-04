
import React from 'react';
import { BlockType, InventorySlot, FurnaceState, Language } from '../types';
import { BLOCK_DATA } from '../constants';
import ItemIcon from './ItemIcon';
import { t } from '../utils/translations';

interface FurnaceOverlayProps {
  furnace: FurnaceState;
  inventory: InventorySlot[];
  language: Language;
  onUpdateFurnace: (updates: Partial<FurnaceState>) => void;
  onUpdateInventory: (inventory: InventorySlot[]) => void;
  onClose: () => void;
}

const FurnaceOverlay: React.FC<FurnaceOverlayProps> = ({ 
  furnace, 
  inventory, 
  language, 
  onUpdateFurnace,
  onUpdateInventory,
  onClose 
}) => {
  
  // Helper to add item to first available slot in inventory
  const addToPlayerInventory = (type: BlockType, count: number) => {
    let amount = count;
    const newInv = [...inventory.map(s => ({ ...s }))];
    
    // First pass: stack with existing items
    for (let i = 0; i < newInv.length; i++) {
      if (newInv[i].type === type && newInv[i].count < 64) {
        const canAdd = Math.min(amount, 64 - newInv[i].count);
        newInv[i].count += canAdd;
        amount -= canAdd;
        if (amount <= 0) break;
      }
    }
    
    // Second pass: fill empty slots
    if (amount > 0) {
      for (let i = 0; i < newInv.length; i++) {
        if (newInv[i].type === BlockType.AIR) {
          newInv[i] = { type, count: amount };
          amount = 0;
          break;
        }
      }
    }
    
    onUpdateInventory(newInv);
    return amount; // Return what couldn't be added (usually 0)
  };

  const handleFurnaceSlotClick = (slotKey: 'input' | 'fuel' | 'output') => {
    const slot = furnace[slotKey];
    if (slot.type === BlockType.AIR) return;

    const remaining = addToPlayerInventory(slot.type, slot.count);
    onUpdateFurnace({ 
      [slotKey]: remaining > 0 
        ? { type: slot.type, count: remaining } 
        : { type: BlockType.AIR, count: 0 } 
    });
  };

  const handleInventoryClick = (index: number) => {
    const slot = inventory[index];
    if (slot.type === BlockType.AIR) return;

    const isFuel = slot.type === BlockType.COAL || 
                   slot.type === BlockType.WOOD || 
                   slot.type === BlockType.PLANKS || 
                   slot.type === BlockType.WOOD_BIRCH || 
                   slot.type === BlockType.WOOD_SPRUCE;
    
    const isSmeltable = slot.type === BlockType.IRON;

    if (isSmeltable && (furnace.input.type === BlockType.AIR || furnace.input.type === slot.type)) {
       const space = 64 - furnace.input.count;
       const toMove = Math.min(slot.count, space);
       if (toMove > 0) {
         onUpdateFurnace({ input: { type: slot.type, count: furnace.input.count + toMove } });
         const newInv = [...inventory];
         if (slot.count - toMove <= 0) {
            newInv[index] = { type: BlockType.AIR, count: 0 };
         } else {
            newInv[index].count -= toMove;
         }
         onUpdateInventory(newInv);
       }
    } else if (isFuel && (furnace.fuel.type === BlockType.AIR || furnace.fuel.type === slot.type)) {
       const space = 64 - furnace.fuel.count;
       const toMove = Math.min(slot.count, space);
       if (toMove > 0) {
         onUpdateFurnace({ fuel: { type: slot.type, count: furnace.fuel.count + toMove } });
         const newInv = [...inventory];
         if (slot.count - toMove <= 0) {
            newInv[index] = { type: BlockType.AIR, count: 0 };
         } else {
            newInv[index].count -= toMove;
         }
         onUpdateInventory(newInv);
       }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-200">
      <div className="bg-[#c6c6c6] border-[4px] border-t-[#ffffff] border-l-[#ffffff] border-b-[#555555] border-r-[#555555] p-1 shadow-2xl">
        <div className="bg-[#c6c6c6] p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-[#404040] pixel-font text-xl font-bold uppercase">{BLOCK_DATA[BlockType.FURNACE].name}</h2>
            <button onClick={onClose} className="text-[#404040] hover:text-black text-2xl font-black leading-none transition-transform hover:scale-110 active:scale-90">×</button>
          </div>

          {/* Smelting Area */}
          <div className="flex items-center justify-center gap-12 bg-[#8b8b8b] p-8 border-[3px] border-b-[#ffffff] border-r-[#ffffff] border-t-[#555555] border-l-[#555555] shadow-inner rounded-sm">
            <div className="flex flex-col gap-8 items-center">
              {/* Input Slot */}
              <div className="relative group">
                <button 
                  onClick={() => handleFurnaceSlotClick('input')}
                  className="w-16 h-16 bg-[#8b8b8b] border-[3px] border-t-[#555555] border-l-[#555555] border-b-[#ffffff] border-r-[#ffffff] flex items-center justify-center relative hover:bg-[#a0a0a0] transition-colors"
                >
                  {furnace.input.type !== BlockType.AIR ? (
                    <>
                      <ItemIcon type={furnace.input.type} className="w-10 h-10" />
                      <span className="absolute bottom-1 right-1 text-white text-xs font-bold drop-shadow-md pixel-font">{furnace.input.count}</span>
                    </>
                  ) : (
                    <div className="opacity-20 grayscale pointer-events-none">
                       <ItemIcon type={BlockType.IRON} className="w-8 h-8" />
                    </div>
                  )}
                </button>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white/60 pixel-font uppercase opacity-0 group-hover:opacity-100 transition-opacity">Input</span>
              </div>
              
              {/* Fuel Area */}
              <div className="relative flex flex-col items-center gap-1">
                {/* Flame Indicator */}
                <div className="w-10 h-10 flex items-center justify-center relative mb-1">
                  <div className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center">
                    <div 
                      className="w-6 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-300 rounded-t-full transition-all duration-300 shadow-[0_0_15px_rgba(234,88,12,0.6)]" 
                      style={{ height: `${furnace.fuelLeft}%`, opacity: furnace.isBurning ? 1 : 0.1 }}
                    />
                  </div>
                </div>

                {/* Fuel Slot */}
                <button 
                  onClick={() => handleFurnaceSlotClick('fuel')}
                  className="w-16 h-16 bg-[#8b8b8b] border-[3px] border-t-[#555555] border-l-[#555555] border-b-[#ffffff] border-r-[#ffffff] flex items-center justify-center relative hover:bg-[#a0a0a0] transition-colors"
                >
                  {furnace.fuel.type !== BlockType.AIR ? (
                    <>
                      <ItemIcon type={furnace.fuel.type} className="w-10 h-10" />
                      <span className="absolute bottom-1 right-1 text-white text-xs font-bold drop-shadow-md pixel-font">{furnace.fuel.count}</span>
                    </>
                  ) : (
                    <div className="opacity-20 grayscale pointer-events-none">
                       <ItemIcon type={BlockType.COAL} className="w-8 h-8" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Large Progress Arrow */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-12 bg-[#555555] rounded-sm relative overflow-hidden shadow-md border border-[#333]">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-200" 
                  style={{ width: `${furnace.smeltProgress}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-black drop-shadow-md">▶</div>
              </div>
            </div>

            {/* Result Slot */}
            <div className="relative group">
              <button 
                onClick={() => handleFurnaceSlotClick('output')}
                className="w-24 h-24 bg-[#8b8b8b] border-[4px] border-t-[#555555] border-l-[#555555] border-b-[#ffffff] border-r-[#ffffff] flex items-center justify-center relative hover:bg-[#a0a0a0] transition-all active:scale-95 shadow-lg"
              >
                {furnace.output.type !== BlockType.AIR ? (
                  <>
                    <ItemIcon type={furnace.output.type} className="w-14 h-14" />
                    <span className="absolute bottom-2 right-2 text-white text-lg font-bold drop-shadow-lg pixel-font">{furnace.output.count}</span>
                  </>
                ) : (
                   <div className="w-4 h-4 bg-black/10 rounded-full" />
                )}
              </button>
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white/60 pixel-font uppercase opacity-0 group-hover:opacity-100 transition-opacity">Result</span>
            </div>
          </div>

          {/* Player Inventory Section */}
          <div className="mt-4 flex flex-col gap-2">
            <h3 className="text-[#404040] text-[10px] uppercase font-bold pixel-font ml-1">Inventory</h3>
            <div className="grid grid-cols-9 gap-1 bg-[#8b8b8b] p-2 border-[2px] border-t-[#555555] border-l-[#555555] border-b-[#ffffff] border-r-[#ffffff]">
              {inventory.map((slot, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleInventoryClick(idx)}
                  className={`
                    w-10 h-10 border-[2px] flex items-center justify-center relative transition-all active:scale-90
                    ${slot.type === BlockType.AIR 
                      ? 'bg-black/10 border-transparent cursor-default' 
                      : 'bg-[#8b8b8b] border-t-[#ffffff] border-l-[#ffffff] border-b-[#555555] border-r-[#555555] hover:bg-[#a0a0a0] shadow-sm'}
                  `}
                >
                  {slot.type !== BlockType.AIR && (
                    <>
                      <ItemIcon type={slot.type} className="w-7 h-7" />
                      {slot.count > 1 && (
                        <span className="absolute bottom-0.5 right-1 text-[8px] text-white font-bold pixel-font drop-shadow-sm">{slot.count}</span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#555555] p-2 text-white/40 text-[9px] text-center pixel-font uppercase">
           Click items to transfer • Smelting {furnace.isBurning ? 'Active' : 'Idle'}
        </div>
      </div>
    </div>
  );
};

export default FurnaceOverlay;
