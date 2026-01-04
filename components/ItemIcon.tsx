
import React from 'react';
import { BlockType } from '../types';
import { BLOCK_DATA } from '../constants';

interface ItemIconProps {
  type: BlockType;
  className?: string;
  durabilityPercent?: number;
}

const ItemIcon: React.FC<ItemIconProps> = ({ type, className = "w-8 h-8", durabilityPercent }) => {
  const info = BLOCK_DATA[type];
  if (!info) return null;

  const renderDurability = () => {
    if (durabilityPercent === undefined || durabilityPercent >= 1) return null;
    let color = '#4ade80';
    if (durabilityPercent < 0.2) color = '#ef4444';
    else if (durabilityPercent < 0.5) color = '#facc15';
    return (
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/50 border border-black/20 overflow-hidden">
        <div className="h-full transition-all duration-300" style={{ width: `${durabilityPercent * 100}%`, backgroundColor: color }} />
      </div>
    );
  };

  const renderIconContent = () => {
    // Handling Tools separately with more detailed shapes
    const isPickaxe = [BlockType.PICKAXE_WOOD, BlockType.PICKAXE_STONE, BlockType.PICKAXE_IRON, BlockType.PICKAXE_DIAMOND].includes(type);
    const isAxe = [BlockType.AXE_WOOD, BlockType.AXE_STONE, BlockType.AXE_IRON, BlockType.AXE_DIAMOND].includes(type);
    const isSword = [BlockType.SWORD_WOOD, BlockType.SWORD_STONE, BlockType.SWORD_IRON, BlockType.SWORD_DIAMOND].includes(type);
    const isShovel = [BlockType.SHOVEL_WOOD, BlockType.SHOVEL_STONE, BlockType.SHOVEL_IRON, BlockType.SHOVEL_DIAMOND].includes(type);

    if (isPickaxe || isAxe || isSword || isShovel) {
      const isIron = [BlockType.PICKAXE_IRON, BlockType.AXE_IRON, BlockType.SWORD_IRON, BlockType.SHOVEL_IRON].includes(type);
      const isStone = [BlockType.PICKAXE_STONE, BlockType.AXE_STONE, BlockType.SWORD_STONE, BlockType.SHOVEL_STONE].includes(type);
      const isDiamond = [BlockType.PICKAXE_DIAMOND, BlockType.AXE_DIAMOND, BlockType.SWORD_DIAMOND, BlockType.SHOVEL_DIAMOND].includes(type);
      const headColor = isDiamond ? '#00bcd4' : (isIron ? '#f3f4f6' : (isStone ? '#6b7280' : '#854d0e'));
      
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-1 h-full bg-[#451a03] rotate-45 rounded-sm" />
          {isPickaxe && (
            <div className="absolute top-1 w-full h-1/3" style={{ background: `radial-gradient(circle at 50% 100%, transparent 20%, ${headColor} 21%)` }}>
               <div className="absolute top-0 left-0 w-full h-2 bg-white/20 rounded-t-full" />
            </div>
          )}
          {isAxe && (
            <div className="absolute top-1 right-1 w-1/2 h-1/2 bg-white/10 rounded-sm" style={{ backgroundColor: headColor }}>
               <div className="absolute top-0 right-0 w-full h-1 bg-white/30" />
            </div>
          )}
          {isSword && (
            <div className="absolute top-0 w-1/4 h-3/4 rotate-45 -translate-y-1 shadow-md" style={{ backgroundColor: headColor }}>
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#451a03]" />
               <div className="absolute top-1 left-1 w-1 h-1/2 bg-white/40 rounded-full" />
            </div>
          )}
          {isShovel && (
            <div className="absolute top-0 w-1/2 h-1/2 rounded-t-xl shadow-md" style={{ backgroundColor: headColor }}>
               <div className="absolute top-1 left-2 w-1 h-1 bg-white/40 rounded-full" />
            </div>
          )}
        </div>
      );
    }

    // Individual block patterns
    switch (type) {
      case BlockType.GRASS:
        return (
          <div className="w-full h-full relative overflow-hidden rounded-sm bg-[#795548]">
            <div className="absolute top-0 left-0 w-full h-1/3 bg-[#4caf50] border-b border-black/10" />
            <div className="absolute top-0 left-0 w-full h-1 bg-[#81c784]" />
            <div className="absolute top-1/2 left-2 w-1 h-1 bg-black/10" />
          </div>
        );
      case BlockType.DIRT:
        return (
          <div className="w-full h-full relative overflow-hidden rounded-sm bg-[#795548]">
            <div className="absolute top-2 left-2 w-1 h-1 bg-black/20" />
            <div className="absolute bottom-2 right-3 w-1.5 h-1.5 bg-black/20" />
            <div className="absolute top-5 right-2 w-1 h-1 bg-black/10" />
          </div>
        );
      case BlockType.STONE:
        return (
          <div className="w-full h-full relative overflow-hidden rounded-sm bg-[#9e9e9e]">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
            <div className="absolute inset-2 border border-black/5" />
            <div className="absolute bottom-2 right-2 w-2 h-0.5 bg-black/20" />
          </div>
        );
      case BlockType.COAL:
      case BlockType.IRON:
      case BlockType.DIAMOND_ORE:
        return (
          <div className="w-full h-full relative overflow-hidden rounded-sm bg-[#9e9e9e]">
            <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${type === BlockType.COAL ? 'bg-black/70' : (type === BlockType.IRON ? 'bg-white/80' : 'bg-[#00bcd4]')}`} />
            <div className={`absolute bottom-3 right-2 w-3 h-2 rounded-full ${type === BlockType.COAL ? 'bg-black/70' : (type === BlockType.IRON ? 'bg-white/80' : 'bg-[#00bcd4]')}`} />
            <div className={`absolute top-1 right-3 w-1 h-1 rounded-full ${type === BlockType.COAL ? 'bg-black/50' : 'bg-white/40'}`} />
          </div>
        );
      case BlockType.WOOD:
      case BlockType.WOOD_BIRCH:
      case BlockType.WOOD_SPRUCE:
        return (
          <div className="w-full h-full relative overflow-hidden rounded-sm" style={{ backgroundColor: info.color }}>
            <div className="absolute inset-y-0 left-1 w-1 bg-black/20" />
            <div className="absolute inset-y-0 right-2 w-1 bg-black/20" />
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-black/10" />
            <div className="absolute top-1/4 left-0 w-full h-0.5 bg-black/5" />
          </div>
        );
      case BlockType.LEAVES:
      case BlockType.LEAVES_BIRCH:
      case BlockType.LEAVES_SPRUCE:
        return (
          <div className="w-full h-full relative overflow-hidden rounded-sm" style={{ backgroundColor: info.color }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20" />
            <div className="absolute top-1 left-1 w-2 h-2 bg-white/20 rounded-full blur-[1px]" />
            <div className="absolute bottom-2 right-1 w-3 h-3 bg-black/20 rounded-full blur-[1px]" />
          </div>
        );
      case BlockType.PLANKS:
        return (
          <div className="w-full h-full relative overflow-hidden rounded-sm" style={{ backgroundColor: info.color }}>
            <div className="absolute inset-x-0 top-1/3 h-0.5 bg-black/30" />
            <div className="absolute inset-x-0 top-2/3 h-0.5 bg-black/30" />
            <div className="absolute top-1 left-1/4 w-0.5 h-1/4 bg-black/20" />
            <div className="absolute top-1/2 left-3/4 w-0.5 h-1/4 bg-black/20" />
          </div>
        );
      case BlockType.FURNACE:
        return (
          <div className="w-full h-full relative overflow-hidden rounded-sm bg-[#424242] border-2 border-[#212121]">
            <div className="absolute top-1 left-1 right-1 h-1/2 bg-[#212121] rounded-sm" />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-3 bg-black rounded-t-md" />
          </div>
        );
      case BlockType.IRON_INGOT:
      case BlockType.DIAMOND:
        return (
          <div className={`w-full h-1/2 ${type === BlockType.IRON_INGOT ? 'bg-[#f0f0f0]' : 'bg-[#00bcd4]'} border border-black/20 rounded-sm rotate-[15deg] shadow-md relative mt-2`}>
            <div className="absolute top-0.5 left-1 right-1 h-1 bg-white/50" />
            <div className="absolute bottom-0.5 left-1 right-1 h-0.5 bg-black/10" />
          </div>
        );
      case BlockType.STICK:
        return (
          <div className="w-full h-full relative flex items-center justify-center">
            <div className="w-1.5 h-full bg-[#854d0e] rotate-45 rounded-full shadow-sm" />
          </div>
        );
      case BlockType.BEEF:
        return (
          <div className="w-full h-full relative flex items-center justify-center">
            <div className="w-4/5 h-3/5 bg-[#e57373] rounded-lg border-2 border-[#ef5350] rotate-[-10deg] shadow-md overflow-hidden">
               <div className="absolute top-1 left-1 w-1/2 h-1/2 bg-white/20 rounded-full" />
               <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-black/10" />
            </div>
          </div>
        );
      case BlockType.FLOWER:
        return (
          <div className="w-full h-full relative flex flex-col items-center justify-center">
            <div className="w-1 h-1/2 bg-[#2e7d32]" />
            <div className="w-4 h-4 bg-[#f44336] rounded-full border border-black/10 shadow-sm" />
          </div>
        );
      case BlockType.SAND:
        return (
          <div className="w-full h-full relative overflow-hidden rounded-sm bg-[#fdd835]">
            <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-black/10" />
            <div className="absolute bottom-2 right-4 w-1 h-1 bg-black/5" />
            <div className="absolute top-4 right-1 w-0.5 h-0.5 bg-black/10" />
          </div>
        );
      case BlockType.CACTUS:
        return (
          <div className="w-full h-full relative overflow-hidden rounded-sm bg-[#2e7d32]">
            <div className="absolute inset-y-0 left-1 w-1 bg-black/20" />
            <div className="absolute inset-y-0 right-1 w-1 bg-black/20" />
            <div className="absolute top-2 left-2 w-1 h-1 bg-white/60 rounded-full" />
            <div className="absolute bottom-4 right-2 w-1 h-1 bg-white/60 rounded-full" />
          </div>
        );
      default:
        return (
          <div className="w-full h-full rounded-md shadow-inner relative overflow-hidden" style={{ backgroundColor: info.color }}>
            <div className="absolute inset-0 opacity-20 bg-black/10 mix-blend-overlay" />
            <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20" />
          </div>
        );
    }
  };

  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {renderIconContent()}
      {renderDurability()}
    </div>
  );
};

export default ItemIcon;
