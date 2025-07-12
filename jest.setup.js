// Use CommonJS require instead of ES6 import
require('@testing-library/jest-dom');

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Polyfill for structuredClone if needed
if (typeof global.structuredClone !== 'function') {
  global.structuredClone = function structuredClone(value) {
    if (value === null || value === undefined) {
      return value;
    }
    
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      console.warn('structuredClone polyfill failed:', error);
      return Array.isArray(value) ? [...value] : { ...value };
    }
  };
}