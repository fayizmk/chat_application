import { useCallback, useState } from 'react';

export function useModalState(DefaultValue = false) {
  const [isOpen, setIsOpen] = useState(DefaultValue);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}
