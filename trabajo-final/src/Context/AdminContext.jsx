import { createContext, useMemo, useState } from 'react';
import { Stack } from '../DataStructures/Stack';
import { UNDO_LIMIT } from '../Helpers/constants';

export const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  const value = useMemo(() => {
    const stack = Stack.fromArray(history, UNDO_LIMIT);

    return {
      lastAction: stack.peek() ?? null,
      pendingUndos: stack.size(),
      pushAction: (action) =>
        setHistory((current) => Stack.fromArray(current, UNDO_LIMIT).push(action).toArray()),
      popAction: () =>
        setHistory((current) => {
          const next = Stack.fromArray(current, UNDO_LIMIT);
          next.pop();
          return next.toArray();
        }),
      clearHistory: () => setHistory([]),
    };
  }, [history]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
