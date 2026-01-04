
export enum BlockType {
  AIR = 0,
  GRASS = 1,
  DIRT = 2,
  STONE = 3,
  WOOD = 4,
  LEAVES = 5,
  COAL = 6,
  IRON = 7,
  FLOWER = 8,
  BEEF = 9,
  WOOL = 10,
  STICK = 11,
  PICKAXE_WOOD = 12,
  AXE_WOOD = 13,
  PICKAXE_STONE = 14,
  AXE_STONE = 15,
  SAND = 16,
  CACTUS = 17,
  PLANKS = 18,
  SWORD_WOOD = 19,
  SWORD_STONE = 20,
  SHOVEL_WOOD = 21,
  SHOVEL_STONE = 22,
  WOOD_BIRCH = 23,
  LEAVES_BIRCH = 24,
  WOOD_SPRUCE = 25,
  LEAVES_SPRUCE = 26,
  IRON_INGOT = 27,
  FURNACE = 28,
  PICKAXE_IRON = 29,
  AXE_IRON = 30,
  SWORD_IRON = 31,
  SHOVEL_IRON = 32,
  DIAMOND_ORE = 33,
  DIAMOND = 34,
  PICKAXE_DIAMOND = 35,
  AXE_DIAMOND = 36,
  SWORD_DIAMOND = 37,
  SHOVEL_DIAMOND = 38
}

export enum BiomeType {
  PLAINS = 0,
  FOREST = 1,
  MOUNTAINS = 2,
  DESERT = 3
}

export interface InventorySlot {
  type: BlockType;
  count: number;
}

export interface FurnaceState {
  input: InventorySlot;
  fuel: InventorySlot;
  output: InventorySlot;
  smeltProgress: number; // 0 to 100
  fuelLeft: number; // 0 to 100 (percentage of current fuel piece remaining)
  isBurning: boolean;
}

export enum EntityType {
  SHEEP = 'SHEEP',
  COW = 'COW'
}

export type Language = 'en' | 'ru';

export enum GameMode {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  INVENTORY = 'INVENTORY',
  SETTINGS = 'SETTINGS',
  FURNACE = 'FURNACE'
}

export interface BlockInfo {
  type: BlockType;
  color: string;
  secondaryColor?: string;
  name: string;
  isSolid: boolean;
  hardness: number; // 0-100
  isFood?: boolean;
  toolType?: 'pickaxe' | 'axe' | 'shovel' | 'sword';
  efficiencyBonus?: number;
  maxDurability?: number;
  stackSize?: number;
  damage?: number;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  inventory: InventorySlot[];
  toolDurability: Record<number, number>; // Current durability for tool types
  selectedSlot: number;
  health: number;
  hunger: number;
  lastHungerTick: number;
  lastDamageTime: number; // For regen cooldown
}

export interface Entity {
  id: string;
  type: EntityType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  health: number;
  isGrounded: boolean;
  direction: number; // -1 or 1
  lastActionTime: number;
}
