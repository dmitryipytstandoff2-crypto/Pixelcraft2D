
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BlockType, Player, Entity, EntityType, GameMode, Language, InventorySlot, BiomeType, FurnaceState } from './types';
import { 
  WORLD_WIDTH, 
  WORLD_HEIGHT, 
  TILE_SIZE, 
  GRAVITY, 
  JUMP_FORCE, 
  MOVE_SPEED, 
  FRICTION,
  BLOCK_DATA,
  MAX_HEALTH,
  MAX_HUNGER,
  HUNGER_DECAY_RATE,
  CRAFTING_RECIPES,
  INVENTORY_SIZE,
  MAX_STACK,
  HOTBAR_SIZE,
  REGEN_COOLDOWN,
  REGEN_INTERVAL,
  SMELT_TIME,
  FUEL_TIME_COAL,
  FUEL_TIME_WOOD
} from './constants';
import { generateWorld, getBiomeAt } from './utils/worldGen';
import InventoryUI from './components/InventoryUI';
import HUD from './components/HUD';
import InventoryOverlay from './components/InventoryOverlay';
import SettingsOverlay from './components/SettingsOverlay';
import FurnaceOverlay from './components/FurnaceOverlay';
import { generateWorldLore } from './services/geminiService';
import { t } from './utils/translations';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicIntervalRef = useRef<number | null>(null);
  const ambientIntervalRef = useRef<number | null>(null);
  
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.MENU);
  const [world, setWorld] = useState<number[][]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [worldSeed, setWorldSeed] = useState<number>(0);
  
  const [furnaces, setFurnaces] = useState<Record<string, FurnaceState>>({});
  const [activeFurnacePos, setActiveFurnacePos] = useState<string | null>(null);

  const [volume, setVolume] = useState(0.5);
  const [language, setLanguage] = useState<Language>('en');
  const [isMuted, setIsMuted] = useState(false);
  const [gameTime, setGameTime] = useState(6000);

  // Check if running in Electron
  const isElectron = navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;

  const createEmptyInventory = () => Array.from({ length: INVENTORY_SIZE }, (): InventorySlot => ({ type: BlockType.AIR, count: 0 }));

  const [player, setPlayer] = useState<Player>({
    x: WORLD_WIDTH * TILE_SIZE / 2,
    y: 20 * TILE_SIZE,
    vx: 0,
    vy: 0,
    width: 20,
    height: 32,
    isGrounded: false,
    inventory: createEmptyInventory(),
    toolDurability: {},
    selectedSlot: 0,
    health: MAX_HEALTH,
    hunger: MAX_HUNGER,
    lastHungerTick: Date.now(),
    lastDamageTime: 0
  });
  
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const [worldInfo, setWorldInfo] = useState({ name: 'PixelCraft', lore: '' });
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const playNote = (freq: number, startTime: number, duration: number, type: OscillatorType = 'square', noteVolume: number = 0.05) => {
    if (!audioCtxRef.current || isMuted || volume <= 0) return;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    const effectiveVolume = noteVolume * volume;
    gain.gain.setValueAtTime(effectiveVolume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const startProceduralAudio = useCallback((mode: 'menu' | 'gameplay') => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    if (musicIntervalRef.current) clearInterval(musicIntervalRef.current);
    if (ambientIntervalRef.current) clearInterval(ambientIntervalRef.current);

    let step = 0;
    musicIntervalRef.current = window.setInterval(() => {
      if (isMuted || volume <= 0) return;
      const now = audioCtxRef.current!.currentTime;
      if (mode === 'menu') {
        const melody = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63]; 
        if (step % 4 === 0) playNote(130.81, now, 0.4, 'triangle', 0.06);
        playNote(melody[step % melody.length], now, 0.2, 'square', 0.04);
      } else {
        const isDay = gameTime > 0 && gameTime < 13000;
        if (step % (isDay ? 1 : 1.5) === 0) {
            const scale = isDay ? [261.63, 293.66, 329.63, 392.00, 440.00, 523.25] : [220.00, 261.63, 293.66, 329.63];
            if (Math.random() > 0.4) {
                const note = scale[Math.floor(Math.random() * scale.length)];
                playNote(note, now, isDay ? 0.3 : 0.6, isDay ? 'square' : 'triangle', 0.03);
            }
        }
      }
      step++;
    }, 250);
  }, [isMuted, volume, gameTime]);

  const addItemToInventory = (inventory: InventorySlot[], type: BlockType, amount: number): InventorySlot[] => {
    const newInventory = [...inventory.map(s => ({ ...s }))];
    const info = BLOCK_DATA[type];
    const stackLimit = info.stackSize || MAX_STACK;
    for (let i = 0; i < newInventory.length; i++) {
      if (newInventory[i].type === type && newInventory[i].count < stackLimit) {
        const canAdd = Math.min(amount, stackLimit - newInventory[i].count);
        newInventory[i].count += canAdd;
        amount -= canAdd;
        if (amount <= 0) return newInventory;
      }
    }
    for (let i = 0; i < newInventory.length; i++) {
      if (newInventory[i].type === BlockType.AIR) {
        newInventory[i].type = type;
        newInventory[i].count = Math.min(amount, stackLimit);
        amount -= newInventory[i].count;
        if (amount <= 0) return newInventory;
      }
    }
    return newInventory;
  };

  const consumeItemsFromInventory = (inventory: InventorySlot[], type: BlockType, amount: number): InventorySlot[] => {
    const newInventory = [...inventory.map(s => ({ ...s }))];
    for (let i = newInventory.length - 1; i >= 0; i--) {
      if (newInventory[i].type === type) {
        const canTake = Math.min(amount, newInventory[i].count);
        newInventory[i].count -= canTake;
        amount -= canTake;
        if (newInventory[i].count <= 0) {
          newInventory[i].type = BlockType.AIR;
          newInventory[i].count = 0;
        }
        if (amount <= 0) break;
      }
    }
    return newInventory;
  };

  const handleCraft = (result: BlockType) => {
    const recipe = CRAFTING_RECIPES.find(r => r.result === result);
    if (!recipe) return;
    const canCraft = recipe.ingredients.every(ing => {
      const total = player.inventory.reduce((acc, slot) => slot.type === ing.type ? acc + slot.count : acc, 0);
      return total >= ing.count;
    });
    if (!canCraft) return;
    setPlayer(p => {
      let newInv = p.inventory.map(s => ({ ...s }));
      recipe.ingredients.forEach(ing => { newInv = consumeItemsFromInventory(newInv, ing.type, ing.count); });
      newInv = addItemToInventory(newInv, recipe.result, recipe.amount);
      const newDurability = { ...p.toolDurability };
      const info = BLOCK_DATA[recipe.result];
      if (info.maxDurability) { newDurability[recipe.result] = info.maxDurability; }
      return { ...p, inventory: newInv, toolDurability: newDurability };
    });
    if (audioCtxRef.current) {
        const now = audioCtxRef.current.currentTime;
        playNote(523.25, now, 0.1, 'square', 0.05);
    }
  };

  const startNewGame = async () => {
    const seed = Math.random() * 1000;
    setWorldSeed(seed);
    const initialWorld = generateWorld(seed);
    setWorld(initialWorld);
    const spawnX = Math.floor(WORLD_WIDTH / 2);
    let spawnY = 0;
    for (let y = 0; y < WORLD_HEIGHT; y++) {
      if (initialWorld[y] && initialWorld[y][spawnX] !== BlockType.AIR) {
        spawnY = (y - 2) * TILE_SIZE;
        break;
      }
    }
    let startInv = createEmptyInventory();
    startInv = addItemToInventory(startInv, BlockType.PICKAXE_WOOD, 1);
    startInv = addItemToInventory(startInv, BlockType.AXE_WOOD, 1);
    startInv = addItemToInventory(startInv, BlockType.DIRT, 10);
    setPlayer(prev => ({ 
      ...prev, 
      x: spawnX * TILE_SIZE, 
      y: spawnY,
      health: MAX_HEALTH,
      hunger: MAX_HUNGER,
      inventory: startInv,
      toolDurability: {
        [BlockType.PICKAXE_WOOD]: BLOCK_DATA[BlockType.PICKAXE_WOOD].maxDurability!,
        [BlockType.AXE_WOOD]: BLOCK_DATA[BlockType.AXE_WOOD].maxDurability!
      }
    }));
    setGameMode(GameMode.PLAYING);
    setWorldInfo(await generateWorldLore());
  };

  const handleQuit = () => {
    if (isElectron) {
      const { remote } = window.require('electron');
      remote.app.quit();
    } else {
      window.location.href = "about:blank";
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKeys(k => ({ ...k, [e.code]: true }));
    const handleKeyUp = (e: KeyboardEvent) => setKeys(k => ({ ...k, [e.code]: false }));
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const update = useCallback(() => {
    if (gameMode === GameMode.MENU || !world.length) return;
    setGameTime(prev => (prev + 1) % 24000);
    if (gameMode !== GameMode.PLAYING) return;
    setPlayer(prev => {
      let vx = prev.vx, vy = prev.vy + GRAVITY;
      if (keys['KeyA'] || keys['ArrowLeft']) vx -= 0.5;
      if (keys['KeyD'] || keys['ArrowRight']) vx += 0.5;
      vx *= FRICTION;
      if (Math.abs(vx) < 0.1) vx = 0;
      vx = Math.max(-MOVE_SPEED, Math.min(MOVE_SPEED, vx));
      if ((keys['Space'] || keys['KeyW'] || keys['ArrowUp']) && prev.isGrounded) vy = JUMP_FORCE;
      let nextX = prev.x + vx, nextY = prev.y + vy, isGrounded = false;
      const l = Math.floor(prev.x / TILE_SIZE), r = Math.floor((prev.x + prev.width - 0.1) / TILE_SIZE);
      const t = Math.floor(nextY / TILE_SIZE), b = Math.floor((nextY + prev.height - 0.1) / TILE_SIZE);
      for (let row = t; row <= b; row++) {
        for (let col = l; col <= r; col++) {
          if (row >= 0 && row < WORLD_HEIGHT && col >= 0 && col < WORLD_WIDTH) {
            if (BLOCK_DATA[world[row][col]]?.isSolid) {
              if (vy > 0) { nextY = row * TILE_SIZE - prev.height; isGrounded = true; }
              else nextY = (row + 1) * TILE_SIZE;
              vy = 0; break;
            }
          }
        }
      }
      return { ...prev, x: nextX, y: nextY, vx, vy, isGrounded };
    });
  }, [gameMode, keys, world]);

  useEffect(() => {
    let frameId: number;
    const loop = () => { update(); frameId = requestAnimationFrame(loop); };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [update]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    if (gameMode === GameMode.MENU || !world.length) {
      ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, canvas.width, canvas.height); return;
    }
    setCamera(p => ({ x: p.x + (player.x - canvas.width / 2 - p.x) * 0.1, y: p.y + (player.y - canvas.height / 2 - p.y) * 0.1 }));
    ctx.fillStyle = gameTime < 13000 ? '#7dd3fc' : '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-Math.floor(camera.x), -Math.floor(camera.y));
    const startX = Math.max(0, Math.floor(camera.x / TILE_SIZE));
    const endX = Math.min(WORLD_WIDTH, Math.ceil((camera.x + canvas.width) / TILE_SIZE));
    const startY = Math.max(0, Math.floor(camera.y / TILE_SIZE));
    const endY = Math.min(WORLD_HEIGHT, Math.ceil((camera.y + canvas.height) / TILE_SIZE));
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const type = world[y][x];
        if (type !== BlockType.AIR) {
          ctx.fillStyle = BLOCK_DATA[type].color;
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }
    ctx.fillStyle = '#fef08a'; ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.restore();
  }, [world, player, camera, gameTime, gameMode]);

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden select-none font-sans">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {gameMode === GameMode.MENU && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-slate-800 p-10 rounded-3xl border-8 border-slate-700 shadow-2xl flex flex-col items-center max-w-md w-full gap-8 relative">
            <div className="absolute -top-6 right-4 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-bold pixel-font shadow-lg animate-pulse">
               DESKTOP EDITION
            </div>
            <div className="flex flex-col items-center">
                <h1 className="text-5xl font-black text-white pixel-font tracking-tighter drop-shadow-[0_5px_0_rgba(0,0,0,0.5)]">PIXELCRAFT</h1>
                <div className="h-1 w-full bg-blue-500 mt-1 shadow-glow" />
            </div>
            <p className="text-slate-400 text-xs text-center uppercase tracking-[0.2em] leading-relaxed">
              {t('tagline', language)}
            </p>
            <div className="flex flex-col w-full gap-4">
              <button onClick={startNewGame} className="w-full py-5 bg-green-600 hover:bg-green-500 text-white font-black rounded-xl border-b-8 border-green-800 transition-all hover:-translate-y-1 active:translate-y-1 active:border-b-0 uppercase tracking-wider">{t('generateWorld', language)}</button>
              {world.length > 0 && <button onClick={() => setGameMode(GameMode.PLAYING)} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl border-b-8 border-blue-800 transition-all hover:-translate-y-1 active:translate-y-1 active:border-b-0 uppercase tracking-wider">{t('resumeGame', language)}</button>}
              <button onClick={() => setGameMode(GameMode.SETTINGS)} className="w-full py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-xl border-b-6 border-slate-700 transition-all uppercase text-sm">{t('settings', language)}</button>
              <button onClick={handleQuit} className="w-full py-3 bg-red-900/40 hover:bg-red-900/60 text-red-400 font-bold rounded-xl border-2 border-red-900/50 transition-all uppercase text-sm">EXIT GAME</button>
            </div>
          </div>
        </div>
      )}

      {gameMode === GameMode.SETTINGS && (
        <SettingsOverlay 
          volume={volume} 
          language={language} 
          onVolumeChange={setVolume} 
          onLanguageChange={setLanguage} 
          onClose={() => setGameMode(world.length > 0 ? GameMode.PLAYING : GameMode.MENU)} 
        />
      )}
      
      {gameMode === GameMode.INVENTORY && <InventoryOverlay inventory={player.inventory} toolDurability={player.toolDurability} language={language} onCraft={handleCraft} onMoveItem={(f,t) => {}} onClose={() => setGameMode(GameMode.PLAYING)} />}

      {world.length > 0 && gameMode !== GameMode.MENU && (
        <>
          <div className="absolute top-8 left-8 max-w-xs pointer-events-none drop-shadow-lg">
            <h1 className="text-white text-3xl font-black pixel-font uppercase tracking-tighter">{worldInfo.name}</h1>
            <p className="text-white/70 text-sm italic mt-2 leading-tight">{worldInfo.lore}</p>
          </div>
          <HUD health={player.health} hunger={player.hunger} />
          <InventoryUI inventory={player.inventory} toolDurability={player.toolDurability} selectedSlot={player.selectedSlot} onSelect={s => setPlayer(p => ({ ...p, selectedSlot: s }))} />
        </>
      )}
    </div>
  );
};

export default App;
