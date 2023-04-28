import { atom } from 'jotai';

export const balanceAtom = atom<number | undefined>(undefined);
export const isWalletConnectedAtom = atom<boolean>(false);
