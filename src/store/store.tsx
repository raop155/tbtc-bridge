/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom } from 'jotai';

export const sourceWalletAtom = atom<any | undefined>(undefined);
export const sourceTokenAtom = atom<any | undefined>(undefined);
export const targetWalletAtom = atom<any | undefined>(undefined);
export const signedVaaHexAtom = atom<any | undefined>(undefined);
