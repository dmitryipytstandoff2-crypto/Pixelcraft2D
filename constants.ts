
import { BlockType, BlockInfo } from './types';

export const WORLD_WIDTH = 300;
export const WORLD_HEIGHT = 128;
export const TILE_SIZE = 32;
export const GRAVITY = 0.4;
export const JUMP_FORCE = -8.2;
export const MOVE_SPEED = 4.0;
export const FRICTION = 0.82;

export const MAX_HEALTH = 20;
export const MAX_HUNGER = 20;
export const HUNGER_DECAY_RATE = 60000;
export const REGEN_COOLDOWN = 5000; // 5 seconds after damage
export const REGEN_INTERVAL = 4000; // Heal 1HP every 4 seconds

// Smelting Constants
export const SMELT_TIME = 4000; // 4 seconds per item
export const FUEL_TIME_COAL = 16000; // 16 seconds per coal piece
export const FUEL_TIME_WOOD = 4000; // 4 seconds per wood/plank piece

export const MAX_STACK = 64;
export const INVENTORY_SIZE = 27;
export const HOTBAR_SIZE = 9;

export const BLOCK_DATA: Record<number, BlockInfo> = {
  [BlockType.AIR]: { type: BlockType.AIR, color: 'transparent', name: 'Air', isSolid: false, hardness: 0 },
  [BlockType.GRASS]: { type: BlockType.GRASS, color: '#4caf50', secondaryColor: '#388e3c', name: 'Grass', isSolid: true, hardness: 10, toolType: 'shovel', stackSize: 64 },
  [BlockType.DIRT]: { type: BlockType.DIRT, color: '#795548', secondaryColor: '#5d4037', name: 'Dirt', isSolid: true, hardness: 10, toolType: 'shovel', stackSize: 64 },
  [BlockType.STONE]: { type: BlockType.STONE, color: '#9e9e9e', secondaryColor: '#757575', name: 'Stone', isSolid: true, hardness: 40, toolType: 'pickaxe', stackSize: 64 },
  [BlockType.WOOD]: { type: BlockType.WOOD, color: '#5d4037', secondaryColor: '#3e2723', name: 'Oak Wood', isSolid: true, hardness: 25, toolType: 'axe', stackSize: 64 },
  [BlockType.WOOD_BIRCH]: { type: BlockType.WOOD_BIRCH, color: '#e0e0e0', secondaryColor: '#424242', name: 'Birch Wood', isSolid: true, hardness: 25, toolType: 'axe', stackSize: 64 },
  [BlockType.WOOD_SPRUCE]: { type: BlockType.WOOD_SPRUCE, color: '#3e2723', secondaryColor: '#212121', name: 'Spruce Wood', isSolid: true, hardness: 30, toolType: 'axe', stackSize: 64 },
  [BlockType.LEAVES]: { type: BlockType.LEAVES, color: '#2e7d32', secondaryColor: '#1b5e20', name: 'Oak Leaves', isSolid: true, hardness: 5, toolType: 'axe', stackSize: 64 },
  [BlockType.LEAVES_BIRCH]: { type: BlockType.LEAVES_BIRCH, color: '#689f38', secondaryColor: '#33691e', name: 'Birch Leaves', isSolid: true, hardness: 5, toolType: 'axe', stackSize: 64 },
  [BlockType.LEAVES_SPRUCE]: { type: BlockType.LEAVES_SPRUCE, color: '#1b5e20', secondaryColor: '#003300', name: 'Spruce Leaves', isSolid: true, hardness: 5, toolType: 'axe', stackSize: 64 },
  [BlockType.COAL]: { type: BlockType.COAL, color: '#424242', secondaryColor: '#212121', name: 'Coal Ore', isSolid: true, hardness: 45, toolType: 'pickaxe', stackSize: 64 },
  [BlockType.IRON]: { type: BlockType.IRON, color: '#d7ccc8', secondaryColor: '#bcaaa4', name: 'Iron Ore', isSolid: true, hardness: 50, toolType: 'pickaxe', stackSize: 64 },
  [BlockType.DIAMOND_ORE]: { type: BlockType.DIAMOND_ORE, color: '#9e9e9e', secondaryColor: '#00bcd4', name: 'Diamond Ore', isSolid: true, hardness: 70, toolType: 'pickaxe', stackSize: 64 },
  [BlockType.DIAMOND]: { type: BlockType.DIAMOND, color: '#00bcd4', name: 'Diamond', isSolid: false, hardness: 1, stackSize: 64 },
  [BlockType.FLOWER]: { type: BlockType.FLOWER, color: '#f44336', secondaryColor: '#2e7d32', name: 'Poppy', isSolid: false, hardness: 1, stackSize: 64 },
  [BlockType.BEEF]: { type: BlockType.BEEF, color: '#e57373', secondaryColor: '#ef5350', name: 'Raw Beef', isSolid: false, hardness: 1, isFood: true, stackSize: 64 },
  [BlockType.WOOL]: { type: BlockType.WOOL, color: '#eeeeee', secondaryColor: '#bdbdbd', name: 'Wool', isSolid: true, hardness: 5, stackSize: 64 },
  [BlockType.STICK]: { type: BlockType.STICK, color: '#a1887f', name: 'Stick', isSolid: false, hardness: 1, stackSize: 64 },
  [BlockType.PICKAXE_WOOD]: { type: BlockType.PICKAXE_WOOD, color: '#8d6e63', secondaryColor: '#5d4037', name: 'Wooden Pickaxe', isSolid: false, hardness: 1, efficiencyBonus: 2, toolType: 'pickaxe', maxDurability: 60, stackSize: 1 },
  [BlockType.AXE_WOOD]: { type: BlockType.AXE_WOOD, color: '#8d6e63', secondaryColor: '#5d4037', name: 'Wooden Axe', isSolid: false, hardness: 1, efficiencyBonus: 2, toolType: 'axe', maxDurability: 60, stackSize: 1 },
  [BlockType.PICKAXE_STONE]: { type: BlockType.PICKAXE_STONE, color: '#757575', secondaryColor: '#5d4037', name: 'Stone Pickaxe', isSolid: false, hardness: 1, efficiencyBonus: 3, toolType: 'pickaxe', maxDurability: 132, stackSize: 1 },
  [BlockType.AXE_STONE]: { type: BlockType.AXE_STONE, color: '#757575', secondaryColor: '#5d4037', name: 'Stone Axe', isSolid: false, hardness: 1, efficiencyBonus: 3, toolType: 'axe', maxDurability: 132, stackSize: 1 },
  [BlockType.SAND]: { type: BlockType.SAND, color: '#fdd835', secondaryColor: '#fbc02d', name: 'Sand', isSolid: true, hardness: 8, toolType: 'shovel', stackSize: 64 },
  [BlockType.CACTUS]: { type: BlockType.CACTUS, color: '#2e7d32', secondaryColor: '#1b5e20', name: 'Cactus', isSolid: true, hardness: 5, stackSize: 64 },
  [BlockType.PLANKS]: { type: BlockType.PLANKS, color: '#8d6e63', secondaryColor: '#5d4037', name: 'Planks', isSolid: true, hardness: 20, toolType: 'axe', stackSize: 64 },
  [BlockType.SWORD_WOOD]: { type: BlockType.SWORD_WOOD, color: '#8d6e63', secondaryColor: '#5d4037', name: 'Wooden Sword', isSolid: false, hardness: 1, damage: 4, toolType: 'sword', maxDurability: 60, stackSize: 1 },
  [BlockType.SWORD_STONE]: { type: BlockType.SWORD_STONE, color: '#757575', secondaryColor: '#5d4037', name: 'Stone Sword', isSolid: false, hardness: 1, damage: 5, toolType: 'sword', maxDurability: 132, stackSize: 1 },
  [BlockType.SHOVEL_WOOD]: { type: BlockType.SHOVEL_WOOD, color: '#8d6e63', secondaryColor: '#5d4037', name: 'Wooden Shovel', isSolid: false, hardness: 1, efficiencyBonus: 2, toolType: 'shovel', maxDurability: 60, stackSize: 1 },
  [BlockType.SHOVEL_STONE]: { type: BlockType.SHOVEL_STONE, color: '#757575', secondaryColor: '#5d4037', name: 'Stone Shovel', isSolid: false, hardness: 1, efficiencyBonus: 3, toolType: 'shovel', maxDurability: 132, stackSize: 1 },
  [BlockType.IRON_INGOT]: { type: BlockType.IRON_INGOT, color: '#f0f0f0', secondaryColor: '#d1d1d1', name: 'Iron Ingot', isSolid: false, hardness: 1, stackSize: 64 },
  [BlockType.FURNACE]: { type: BlockType.FURNACE, color: '#424242', secondaryColor: '#212121', name: 'Furnace', isSolid: true, hardness: 50, toolType: 'pickaxe', stackSize: 64 },
  [BlockType.PICKAXE_IRON]: { type: BlockType.PICKAXE_IRON, color: '#f0f0f0', secondaryColor: '#5d4037', name: 'Iron Pickaxe', isSolid: false, hardness: 1, efficiencyBonus: 5, toolType: 'pickaxe', maxDurability: 250, stackSize: 1 },
  [BlockType.AXE_IRON]: { type: BlockType.AXE_IRON, color: '#f0f0f0', secondaryColor: '#5d4037', name: 'Iron Axe', isSolid: false, hardness: 1, efficiencyBonus: 5, toolType: 'axe', maxDurability: 250, stackSize: 1 },
  [BlockType.SWORD_IRON]: { type: BlockType.SWORD_IRON, color: '#f0f0f0', secondaryColor: '#5d4037', name: 'Iron Sword', isSolid: false, hardness: 1, damage: 6, toolType: 'sword', maxDurability: 250, stackSize: 1 },
  [BlockType.SHOVEL_IRON]: { type: BlockType.SHOVEL_IRON, color: '#f0f0f0', secondaryColor: '#5d4037', name: 'Iron Shovel', isSolid: false, hardness: 1, efficiencyBonus: 5, toolType: 'shovel', maxDurability: 250, stackSize: 1 },
  [BlockType.PICKAXE_DIAMOND]: { type: BlockType.PICKAXE_DIAMOND, color: '#00bcd4', secondaryColor: '#5d4037', name: 'Diamond Pickaxe', isSolid: false, hardness: 1, efficiencyBonus: 8, toolType: 'pickaxe', maxDurability: 1561, stackSize: 1 },
  [BlockType.AXE_DIAMOND]: { type: BlockType.AXE_DIAMOND, color: '#00bcd4', secondaryColor: '#5d4037', name: 'Diamond Axe', isSolid: false, hardness: 1, efficiencyBonus: 8, toolType: 'axe', maxDurability: 1561, stackSize: 1 },
  [BlockType.SWORD_DIAMOND]: { type: BlockType.SWORD_DIAMOND, color: '#00bcd4', secondaryColor: '#5d4037', name: 'Diamond Sword', isSolid: false, hardness: 1, damage: 7, toolType: 'sword', maxDurability: 1561, stackSize: 1 },
  [BlockType.SHOVEL_DIAMOND]: { type: BlockType.SHOVEL_DIAMOND, color: '#00bcd4', secondaryColor: '#5d4037', name: 'Diamond Shovel', isSolid: false, hardness: 1, efficiencyBonus: 8, toolType: 'shovel', maxDurability: 1561, stackSize: 1 },
};

export const HOTBAR_SLOTS = [
  BlockType.GRASS,
  BlockType.DIRT,
  BlockType.STONE,
  BlockType.WOOD,
  BlockType.WOOD_BIRCH,
  BlockType.WOOD_SPRUCE,
  BlockType.PICKAXE_WOOD,
  BlockType.AXE_WOOD,
  BlockType.BEEF
];

export interface Recipe {
  result: BlockType;
  amount: number;
  ingredients: { type: BlockType; count: number; consumed?: boolean }[];
}

export const CRAFTING_RECIPES: Recipe[] = [
  {
    result: BlockType.PLANKS,
    amount: 4,
    ingredients: [{ type: BlockType.WOOD, count: 1, consumed: true }]
  },
  {
    result: BlockType.PLANKS,
    amount: 4,
    ingredients: [{ type: BlockType.WOOD_BIRCH, count: 1, consumed: true }]
  },
  {
    result: BlockType.PLANKS,
    amount: 4,
    ingredients: [{ type: BlockType.WOOD_SPRUCE, count: 1, consumed: true }]
  },
  {
    result: BlockType.STICK,
    amount: 4,
    ingredients: [{ type: BlockType.PLANKS, count: 2, consumed: true }]
  },
  {
    result: BlockType.FURNACE,
    amount: 1,
    ingredients: [{ type: BlockType.STONE, count: 8, consumed: true }]
  },
  {
    result: BlockType.PICKAXE_WOOD,
    amount: 1,
    ingredients: [{ type: BlockType.PLANKS, count: 3, consumed: true }, { type: BlockType.STICK, count: 2, consumed: true }]
  },
  {
    result: BlockType.AXE_WOOD,
    amount: 1,
    ingredients: [{ type: BlockType.PLANKS, count: 3, consumed: true }, { type: BlockType.STICK, count: 2, consumed: true }]
  },
  {
    result: BlockType.SHOVEL_WOOD,
    amount: 1,
    ingredients: [{ type: BlockType.PLANKS, count: 1, consumed: true }, { type: BlockType.STICK, count: 2, consumed: true }]
  },
  {
    result: BlockType.SWORD_WOOD,
    amount: 1,
    ingredients: [{ type: BlockType.PLANKS, count: 2, consumed: true }, { type: BlockType.STICK, count: 1, consumed: true }]
  },
  {
    result: BlockType.PICKAXE_STONE,
    amount: 1,
    ingredients: [{ type: BlockType.STONE, count: 3, consumed: true }, { type: BlockType.STICK, count: 2, consumed: true }]
  },
  {
    result: BlockType.AXE_STONE,
    amount: 1,
    ingredients: [{ type: BlockType.STONE, count: 3, consumed: true }, { type: BlockType.STICK, count: 2, consumed: true }]
  },
  {
    result: BlockType.SHOVEL_STONE,
    amount: 1,
    ingredients: [{ type: BlockType.STONE, count: 1, consumed: true }, { type: BlockType.STICK, count: 2, consumed: true }]
  },
  {
    result: BlockType.SWORD_STONE,
    amount: 1,
    ingredients: [{ type: BlockType.STONE, count: 2, consumed: true }, { type: BlockType.STICK, count: 1, consumed: true }]
  },
  {
    result: BlockType.PICKAXE_IRON,
    amount: 1,
    ingredients: [{ type: BlockType.IRON_INGOT, count: 3, consumed: true }, { type: BlockType.STICK, count: 2, consumed: true }]
  },
  {
    result: BlockType.AXE_IRON,
    amount: 1,
    ingredients: [{ type: BlockType.IRON_INGOT, count: 3, consumed: true }, { type: BlockType.STICK, count: 2, consumed: true }]
  },
  {
    result: BlockType.SHOVEL_IRON,
    amount: 1,
    ingredients: [{ type: BlockType.IRON_INGOT, count: 1, consumed: true }, { type: BlockType.STICK, count: 2, consumed: true }]
  },
  {
    result: BlockType.SWORD_IRON,
    amount: 1,
    ingredients: [{ type: BlockType.IRON_INGOT, count: 2, consumed: true }, { type: BlockType.STICK, count: 1, consumed: true }]
  },
  {
    result: BlockType.PICKAXE_DIAMOND,
    amount: 1,
    ingredients: [{ type: BlockType.DIAMOND, count: 3, consumed: true }, { type: BlockType.STICK, count: 2, consumed: true }]
  },
  {
    result: BlockType.AXE_DIAMOND,
    amount: 1,
    ingredients: [{ type: BlockType.DIAMOND, count: 3, consumed: true }, { type: BlockType.STICK, count: 2, consumed: true }]
  },
  {
    result: BlockType.SHOVEL_DIAMOND,
    amount: 1,
    ingredients: [{ type: BlockType.DIAMOND, count: 1, consumed: true }, { type: BlockType.STICK, count: 2, consumed: true }]
  },
  {
    result: BlockType.SWORD_DIAMOND,
    amount: 1,
    ingredients: [{ type: BlockType.DIAMOND, count: 2, consumed: true }, { type: BlockType.STICK, count: 1, consumed: true }]
  }
];
