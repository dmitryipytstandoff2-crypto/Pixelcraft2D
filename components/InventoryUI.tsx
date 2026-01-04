
import React from 'react';
import { BlockType, InventorySlot } from '../types';
import { BLOCK_DATA, HOTBAR_SIZE } from '../constants';
import ItemIcon from './ItemIcon';

interface InventoryUIProps {
  inventory: InventorySlot[];
  toolDurability: Record<number, number>;
  selectedSlot: number;
  onSelect: (slot: number) => void;
}

const InventoryUI: React.FC<InventoryUIProps> = ({ inventory, toolDurability, selectedSlot, onSelect }) => {
  const hotbarSlots = inventory.slice(0, HOTBAR_SIZE);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/20">
      {hotbarSlots.map((slot, index) => {
        const type = slot.type;
        const info = BLOCK_DATA[type];
        const isSelected = selectedSlot === index;
        
        const currentDurability = toolDurability[type];
        const maxDurability = info?.maxDurability;
        const durabilityPercent = (currentDurability !== undefined && maxDurability !== undefined) 
          ? currentDurability / maxDurability 
          : undefined;

        const isLowDurability = durabilityPercent !== undefined && durabilityPercent < 0.15;

        return (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`
              relative w-14 h-14 flex items-center justify-center rounded-lg transition-all
              ${isSelected ? 'bg-white/30 scale-110 ring-2 ring-white shadow-lg' : 'bg-white/10 hover:bg-white/20'}
              ${isLowDurability ? 'animate-pulse ring-1 ring-red-500 bg-red-500/10' : ''}
              ${type === BlockType.AIR ? 'opacity-40 shadow-inner' : ''}
            `}
          >
            {type !== BlockType.AIR && (
              <>
                <ItemIcon type={type} className="w-10 h-10" durabilityPercent={durabilityPercent} />
                {slot.count > 1 && (
                  <span className="absolute bottom-1 right-1 text-[10px] font-bold text-white pixel-font drop-shadow-md">
                    {slot.count}
                  </span>
                )}
                {isSelected && (
                   <div className="absolute -top-8 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pixel-font uppercase tracking-wider">
                     {info.name}
                   </div>
                )}
              </>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default InventoryUI;
