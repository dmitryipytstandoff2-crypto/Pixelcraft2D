
import React from 'react';
import { MAX_HEALTH, MAX_HUNGER } from '../constants';

interface HUDProps {
  health: number;
  hunger: number;
}

const HUD: React.FC<HUDProps> = ({ health, hunger }) => {
  const hearts = Array.from({ length: MAX_HEALTH / 2 });
  const drumsticks = Array.from({ length: MAX_HUNGER / 2 });

  return (
    <div className="fixed top-20 left-6 flex flex-col gap-3 pointer-events-none">
      {/* Health Bar */}
      <div className="flex gap-1">
        {hearts.map((_, i) => {
          const val = health - i * 2;
          let fill = '#ef4444'; // Full red
          if (val <= 0) fill = '#374151'; // Empty (gray)
          else if (val === 1) fill = '#f87171'; // Half (light red)

          return (
            <svg key={i} width="20" height="20" viewBox="0 0 24 24" className="drop-shadow-lg transition-all duration-300">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill={fill}
                stroke="#000"
                strokeWidth="1.5"
              />
            </svg>
          );
        })}
      </div>
      {/* Hunger Bar */}
      <div className="flex gap-1">
        {drumsticks.map((_, i) => {
          const val = hunger - i * 2;
          let fill = '#92400e'; // Dark orange/brown
          if (val <= 0) fill = '#374151';
          else if (val === 1) fill = '#d97706';

          return (
            <svg key={i} width="20" height="20" viewBox="0 0 24 24" className="drop-shadow-lg transition-all duration-300">
              <path
                d="M18 5c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2zM6 9c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2s2-.9 2-2v-6c0-1.1-.9-2-2-2z"
                fill={fill}
                stroke="#000"
                strokeWidth="1.5"
              />
            </svg>
          );
        })}
      </div>
    </div>
  );
};

export default HUD;
