import { describe, it, expect } from 'vitest';
import { renderCube3D } from '../renderer';
import { createSolvedState } from '../state';
import type { CubeState } from '@/src/types/cube';

describe('3D Renderer', () => {
  describe('renderCube3D', () => {
    it('should render solved cube in default (front) view', () => {
      const state = createSolvedState();
      const svg = renderCube3D(state);
      
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('<polygon');
      expect(svg).toContain('#FFFFFF'); // White
      expect(svg).toContain('#009B48'); // Green
      expect(svg).toContain('#B71234'); // Red
    });

    it('should render cube in front view', () => {
      const state = createSolvedState();
      const svg = renderCube3D(state, { view: 'front' });
      
      expect(svg).toContain('<svg');
      expect(svg).toContain('<polygon');
    });

    it('should render cube in back view', () => {
      const state = createSolvedState();
      const svg = renderCube3D(state, { view: 'back' });
      
      expect(svg).toContain('<svg');
      expect(svg).toContain('<polygon');
    });

    it('should render cube in right view', () => {
      const state = createSolvedState();
      const svg = renderCube3D(state, { view: 'right' });
      
      expect(svg).toContain('<svg');
      expect(svg).toContain('<polygon');
    });

    it('should render cube in left view', () => {
      const state = createSolvedState();
      const svg = renderCube3D(state, { view: 'left' });
      
      expect(svg).toContain('<svg');
      expect(svg).toContain('<polygon');
    });

    it('should render cube in top view', () => {
      const state = createSolvedState();
      const svg = renderCube3D(state, { view: 'top' });
      
      expect(svg).toContain('<svg');
      expect(svg).toContain('<polygon');
    });

    it('should render cube in bottom view', () => {
      const state = createSolvedState();
      const svg = renderCube3D(state, { view: 'bottom' });
      
      expect(svg).toContain('<svg');
      expect(svg).toContain('<polygon');
    });

    it('should respect custom sticker size', () => {
      const state = createSolvedState();
      const svg = renderCube3D(state, { stickerSize: 50 });
      
      expect(svg).toContain('<svg');
      // With larger sticker size, viewBox should be larger
      expect(svg).toMatch(/viewBox="0 0 \d{3,}/); // At least 3 digits
    });

    it('should render scrambled cube correctly', () => {
      const state = createSolvedState();
      // Scramble by swapping some stickers
      const scrambled: CubeState = {
        ...state,
        U: ['yellow', 'white', 'yellow', 'white', 'white', 'white', 'yellow', 'white', 'yellow'],
        F: ['green', 'white', 'green', 'green', 'green', 'green', 'green', 'white', 'green'],
      };
      
      const svg = renderCube3D(scrambled);
      
      expect(svg).toContain('<svg');
      expect(svg).toContain('#FFD500'); // Yellow on top
    });

    it('should use custom background color', () => {
      const state = createSolvedState();
      const svg = renderCube3D(state, { backgroundColor: '#FF0000' });
      
      expect(svg).toContain('fill="#FF0000"');
    });

    it('should render with custom border styling', () => {
      const state = createSolvedState();
      const svg = renderCube3D(state, {
        borderWidth: 3,
        borderColor: '#FF0000',
      });
      
      expect(svg).toContain('stroke="#FF0000"');
      expect(svg).toContain('stroke-width="3"');
    });
  });
});
