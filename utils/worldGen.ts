
import { BlockType, BiomeType } from '../types';
import { WORLD_WIDTH, WORLD_HEIGHT } from '../constants';

// Simplified Noise implementation for deterministic terrain
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const noise1D = (x: number, frequency: number, seed: number = 123) => {
  const scaledX = x * frequency;
  const x0 = Math.floor(scaledX);
  const x1 = x0 + 1;
  const t = scaledX - x0;
  
  const v0 = pseudoRandom(x0 + seed);
  const v1 = pseudoRandom(x1 + seed);
  
  return lerp(v0, v1, t * t * (3 - 2 * t)); // Smoothstep
};

const noise2D = (x: number, y: number, frequency: number, seed: number = 456) => {
  const sx = x * frequency;
  const sy = y * frequency;
  const x0 = Math.floor(sx);
  const y0 = Math.floor(sy);
  const tX = sx - x0;
  const tY = sy - y0;
  
  const v00 = pseudoRandom(x0 + y0 * 57 + seed);
  const v10 = pseudoRandom(x0 + 1 + y0 * 57 + seed);
  const v01 = pseudoRandom(x0 + (y0 + 1) * 57 + seed);
  const v11 = pseudoRandom(x0 + 1 + (y0 + 1) * 57 + seed);
  
  const i1 = lerp(v00, v10, tX);
  const i2 = lerp(v01, v11, tX);
  
  return lerp(i1, i2, tY);
};

export const getBiomeAt = (x: number, seed: number): BiomeType => {
  const bNoise = noise1D(x, 0.05, seed + 999);
  if (bNoise < 0.25) return BiomeType.DESERT;
  if (bNoise < 0.5) return BiomeType.PLAINS;
  if (bNoise < 0.8) return BiomeType.FOREST;
  return BiomeType.MOUNTAINS;
};

export const generateWorld = (seed: number): number[][] => {
  const world: number[][] = Array.from({ length: WORLD_HEIGHT }, () =>
    Array(WORLD_WIDTH).fill(BlockType.AIR)
  );

  const groundLevel = Math.floor(WORLD_HEIGHT / 2);

  // 1. Generate Surface & Subsurface
  for (let x = 0; x < WORLD_WIDTH; x++) {
    // Determine Biome
    const biome = getBiomeAt(x, seed);

    // Terrain parameters per biome
    let amplitude = 4;
    let frequency = 0.1;
    let treeChance = 0.05;

    if (biome === BiomeType.MOUNTAINS) {
      amplitude = 12;
      frequency = 0.15;
      treeChance = 0.02;
    } else if (biome === BiomeType.FOREST) {
      amplitude = 6;
      frequency = 0.08;
      treeChance = 0.22;
    } else if (biome === BiomeType.DESERT) {
      amplitude = 3;
      frequency = 0.05;
      treeChance = 0.08; // Used for cacti
    }

    const height = Math.floor(groundLevel + noise1D(x, frequency, seed) * amplitude);

    for (let y = height; y < WORLD_HEIGHT; y++) {
      let block = BlockType.STONE;
      
      const depth = y - height;
      if (depth === 0) {
        block = biome === BiomeType.DESERT ? BlockType.SAND : BlockType.GRASS;
      } else if (depth < 4) {
        block = biome === BiomeType.DESERT ? BlockType.SAND : BlockType.DIRT;
      }
      
      world[y][x] = block;
    }

    // 2. Decorations (Trees/Cacti/Flowers)
    if (x > 3 && x < WORLD_WIDTH - 3 && Math.random() < treeChance) {
      const surfaceY = height - 1;
      if (surfaceY >= 0 && world[surfaceY + 1][x] !== BlockType.AIR) {
        if (biome === BiomeType.DESERT) {
          // Cactus
          const cHeight = 2 + Math.floor(Math.random() * 2);
          for (let cy = 0; cy < cHeight; cy++) {
            if (surfaceY - cy >= 0) world[surfaceY - cy][x] = BlockType.CACTUS;
          }
        } else if (biome !== BiomeType.MOUNTAINS || Math.random() < 0.5) {
          // Tree variants
          const rand = Math.random();
          let woodType = BlockType.WOOD;
          let leafType = BlockType.LEAVES;
          let tHeight = 4 + Math.floor(Math.random() * 3);
          let treeShape: 'round' | 'cone' | 'tall' = 'round';

          if (biome === BiomeType.FOREST) {
            if (rand < 0.4) {
              woodType = BlockType.WOOD_BIRCH;
              leafType = BlockType.LEAVES_BIRCH;
              tHeight = 5 + Math.floor(Math.random() * 2);
            } else if (rand < 0.7) {
              woodType = BlockType.WOOD_SPRUCE;
              leafType = BlockType.LEAVES_SPRUCE;
              tHeight = 6 + Math.floor(Math.random() * 4);
              treeShape = 'cone';
            } else if (rand < 0.85) {
               // Tall Oak
               tHeight = 7 + Math.floor(Math.random() * 3);
               treeShape = 'tall';
            }
          }

          // Generate Trunk
          for (let ty = 0; ty < tHeight; ty++) {
            if (surfaceY - ty >= 0) world[surfaceY - ty][x] = woodType;
          }

          // Generate Canopy
          const canopyY = surfaceY - tHeight + 1;
          if (treeShape === 'round' || treeShape === 'tall') {
            const radius = treeShape === 'tall' ? 3 : 2;
            for (let ly = -radius; ly <= 0; ly++) {
              for (let lx = -radius; lx <= radius; lx++) {
                const lyPos = canopyY + ly;
                const lxPos = x + lx;
                if (lyPos >= 0 && lxPos >= 0 && lxPos < WORLD_WIDTH) {
                  if (world[lyPos][lxPos] === BlockType.AIR) {
                    const dist = Math.abs(lx) + Math.abs(ly);
                    if (dist <= radius + 1 && (Math.random() > 0.1 || dist < radius)) {
                      world[lyPos][lxPos] = leafType;
                    }
                  }
                }
              }
            }
          } else if (treeShape === 'cone') {
            // Spruce cone shape
            for (let ly = -2; ly <= 1; ly++) {
              const width = Math.max(1, 3 - (ly + 2)); // Gets narrower towards top
              for (let lx = -width; lx <= width; lx++) {
                const lyPos = canopyY + ly;
                const lxPos = x + lx;
                if (lyPos >= 0 && lxPos >= 0 && lxPos < WORLD_WIDTH) {
                  if (world[lyPos][lxPos] === BlockType.AIR) {
                     world[lyPos][lxPos] = leafType;
                  }
                }
              }
            }
            // Add top-most leaf
            if (canopyY - 2 >= 0) world[canopyY - 2][x] = leafType;
          }
        }
      }
    } else if (biome === BiomeType.PLAINS && Math.random() < 0.05) {
      const surfaceY = height - 1;
      if (surfaceY >= 0 && world[surfaceY][x] === BlockType.AIR) {
        world[surfaceY][x] = BlockType.FLOWER;
      }
    }
  }

  // 3. Caves (Noise thresholding)
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    for (let x = 0; x < WORLD_WIDTH; x++) {
      if (world[y][x] === BlockType.STONE || world[y][x] === BlockType.DIRT) {
        const caveNoise = noise2D(x, y, 0.15, seed + 123);
        if (caveNoise > 0.72) {
          world[y][x] = BlockType.AIR;
        }
      }
    }
  }

  // 4. Ore Veins (Clumps)
  const generateVein = (type: BlockType, size: number, count: number, minDepth: number = groundLevel, maxDepth: number = WORLD_HEIGHT) => {
    for (let i = 0; i < count; i++) {
      let vx = Math.floor(Math.random() * WORLD_WIDTH);
      let vy = Math.floor(Math.random() * (maxDepth - minDepth)) + minDepth;
      
      for (let s = 0; s < size; s++) {
        const ox = vx + Math.floor(Math.random() * 3) - 1;
        const oy = vy + Math.floor(Math.random() * 3) - 1;
        if (oy >= 0 && oy < WORLD_HEIGHT && ox >= 0 && ox < WORLD_WIDTH) {
          if (world[oy][ox] === BlockType.STONE) {
            world[oy][ox] = type;
          }
        }
        vx = ox; vy = oy;
      }
    }
  };

  generateVein(BlockType.COAL, 8, 30);
  generateVein(BlockType.IRON, 4, 20);
  generateVein(BlockType.DIAMOND_ORE, 3, 10, WORLD_HEIGHT - 30, WORLD_HEIGHT);

  return world;
};
