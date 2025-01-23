'use client';

import { type ReactNode, createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import { createStore } from 'zustand/vanilla';
import type { TCopyOutput } from '~/server/api/routers/file/file.schema';

type RecentTaskState = {
  task: TCopyOutput[];
  _hasHydrated: boolean;
};

type RecentTaskAction = {
  setTask: (data: TCopyOutput) => void;
  setHasHydrated: (data: boolean) => void;
  reset: () => void;
};

type RecentTaskStore = RecentTaskState & RecentTaskAction;

const defaultInitState: RecentTaskState = {
  task: [],
  _hasHydrated: false,
};

const createRecentTaskStore = (
  initState: RecentTaskState = defaultInitState
) => {
  return createStore<RecentTaskStore>()(
    persist(
      (set, get) => ({
        ...initState,
        setTask: (data) => set({ task: [...get().task, data] }),
        setHasHydrated: (state) => set({ _hasHydrated: state }),
        reset: () => set({ task: [] }),
      }),
      {
        name: 'task',
        onRehydrateStorage: (state) => {
          return () => state.setHasHydrated(true);
        },
      }
    )
  );
};

type RecentTaskStoreApi = ReturnType<typeof createRecentTaskStore>;

const RecentTaskStoreContext = createContext<RecentTaskStoreApi | undefined>(
  undefined
);

interface RecentTaskStoreProviderProps {
  children: ReactNode;
}

export const RecentTaskStoreProvider = ({
  children,
}: RecentTaskStoreProviderProps) => {
  const storeRef = useRef<RecentTaskStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createRecentTaskStore();
  }

  return (
    <RecentTaskStoreContext.Provider value={storeRef.current}>
      {children}
    </RecentTaskStoreContext.Provider>
  );
};

export const useRecentTaskStore = <T,>(
  selector: (store: RecentTaskStore) => T
): T => {
  const recentTaskStoreContext = useContext(RecentTaskStoreContext);

  if (!recentTaskStoreContext) {
    throw new Error(
      'useRecentTaskStore must be used within RecentTaskStoreProvider'
    );
  }

  return useStore(recentTaskStoreContext, useShallow(selector));
};
