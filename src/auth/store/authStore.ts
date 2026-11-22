import { create } from 'zustand';
import type { ConfirmationResult } from '@react-native-firebase/auth';

type AuthStore = {
  confirmation: ConfirmationResult | null;
  pendingIdToken: string | null;
  verificationReady: boolean;
  setConfirmation: (confirmation: ConfirmationResult) => void;
  setPendingIdToken: (idToken: string) => void;
  clearVerification: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  confirmation: null,
  pendingIdToken: null,
  verificationReady: false,
  setConfirmation: (confirmation) =>
    set({ confirmation, pendingIdToken: null, verificationReady: true }),
  setPendingIdToken: (pendingIdToken) => set({ pendingIdToken }),
  clearVerification: () =>
    set({ confirmation: null, pendingIdToken: null, verificationReady: false }),
}));
