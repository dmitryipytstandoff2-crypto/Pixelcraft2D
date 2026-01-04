
import { Language } from '../types';

const strings = {
  en: {
    generateWorld: "GENERATE NEW WORLD",
    resumeGame: "RESUME GAME",
    settings: "SETTINGS",
    volume: "Volume",
    language: "Language",
    back: "BACK",
    inventoryTitle: "Inventory & Crafting",
    resources: "Resources",
    crafting: "Crafting",
    craftBtn: "Craft",
    controls: "WASD: Move | E: Inventory | L-Click: Mine | R-Click: Use | ESC: Menu",
    tagline: "Explore, mine, build and survive in a beautiful procedural world.",
    escHint: "ESC to return to menu",
    closeHint: "Click the cross or press 'E' to close",
    worldLoreDefault: "Welcome to your sandbox."
  },
  ru: {
    generateWorld: "СОЗДАТЬ НОВЫЙ МИР",
    resumeGame: "ПРОДОЛЖИТЬ ИГРУ",
    settings: "НАСТРОЙКИ",
    volume: "Громкость",
    language: "Язык",
    back: "НАЗАД",
    inventoryTitle: "Инвентарь и Крафт",
    resources: "Ресурсы",
    crafting: "Крафт",
    craftBtn: "Создать",
    controls: "WASD: Движение | E: Инвентарь | ЛКМ: Копать | ПКМ: Исп. | ESC: Меню",
    tagline: "Исследуйте, копайте, стройте и выживайте в прекрасном процедурном мире.",
    escHint: "ESC для выхода в меню",
    closeHint: "Нажмите крестик или 'E', чтобы закрыть",
    worldLoreDefault: "Добро пожаловать в вашу песочницу."
  }
};

export const t = (key: keyof typeof strings['en'], lang: Language) => {
  return strings[lang][key] || strings['en'][key];
};
