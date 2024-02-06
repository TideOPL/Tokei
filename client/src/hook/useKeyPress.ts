import { useEffect } from "react";

export function useKeyPress(callback: () => void, keyCodes: string[], disabled: boolean): void {
  const handler = ({ code }: KeyboardEvent) => {
    if (keyCodes.includes(code)) {
      if (disabled) {
        return;
      }
      callback();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [disabled]);
}