import { create } from "zustand";

interface State {
  dummy: boolean;
}

export const useStore = create<State>((set) => ({
  dummy: true,
}));
