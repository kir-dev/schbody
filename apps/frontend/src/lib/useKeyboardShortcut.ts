import { useEffect } from 'react';

type Key = 'ctrl' | 'shift' | 'alt' | 'esc' | string;
const keysThatWorkFromInput = ['escape', 'enter', 'arrowup', 'arrowdown'];

export const useKeyboardShortcut = (keys: Key[], callback: (idxOfKey?: number) => void) => {
  useEffect(() => {
    if (!Array.isArray(keys)) {
      console.error('Expected "keys" to be an array, but received:', keys);
      return;
    }

    const handleKeyDown = (event: WindowEventMap['keydown']) => {
      const targetTagName = (event.target as HTMLElement)?.tagName?.toLowerCase();

      // Prevent default browser shortcuts if ctrl/alt/meta keys are pressed
      if (event.ctrlKey || event.altKey || event.metaKey) {
        event.preventDefault();
      }

      const index = keys.findIndex((key) => {
        switch (key) {
          case 'ctrl':
            return event.ctrlKey;
          case 'shift':
            return event.shiftKey;
          case 'alt':
            return event.altKey;
          case 'esc':
            return event.key === 'Escape';
          default:
            return event.key.toLowerCase() === key;
        }
      });

      if (
        index !== -1 &&
        !keysThatWorkFromInput.includes(keys[index]) &&
        (targetTagName === 'input' || targetTagName === 'textarea')
      ) {
        return;
      }

      if (index !== -1) {
        callback(index);
        event.preventDefault(); // Prevent default browser behavior
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keys, callback]);
};
