/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from 'ethers';

export const convertToNumber = (hex: any, decimals = 18) => {
  if (!hex) return 0;
  console.log(`Converting to number ${hex} with ${decimals} decimals`);
  return ethers.utils.formatUnits(hex, decimals);
};
