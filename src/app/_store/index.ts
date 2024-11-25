import { create, StateCreator } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id?: number;
  name?: string;
  joinedAt?: Date;
}

type UserSlice = {
  currentUser: User;
  setCurrentUser: (currentUser: User) => void;
};

type State = UserSlice;

const createUserSlice: StateCreator<
  State,
  [["zustand/devtools", never]],
  [],
  UserSlice
> = (set) => ({
  currentUser: {},
  setCurrentUser: (currentUser) => set(() => ({ currentUser })),
});

export const useStore = create<State>()(
  devtools(
    persist(
      (...args) => ({
        ...createUserSlice(...args),
      }),
      {
        name: "currentUser",
        storage: createJSONStorage(() => sessionStorage),

        merge: (persistedState, currentState) => ({
          ...currentState,
          ...(persistedState as UserSlice),
        }),
      }
    )
  )
);
