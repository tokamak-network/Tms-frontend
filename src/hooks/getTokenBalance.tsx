import { readContracts } from '@wagmi/core';
import { NetworkConfig } from '../config/networks';
import { ERC20_INTERFACE } from '../config/abi/ERC20';
import { ethers } from 'ethers';

export const getTokenBalance = async (contractAddress: `0x${string}`, userAddress: string) => {
  let balanceOf, decimals;
  const erc20contract = {
    address: contractAddress,
    abi: ERC20_INTERFACE
  };
  try {
    const result = await readContracts(NetworkConfig, {
      allowFailure: true,
      contracts: [
        {
          ...erc20contract,
          functionName: 'decimals',
          args: []
        },
        {
          ...erc20contract,
          functionName: 'balanceOf',
          args: [userAddress as `0x${string}`]
        }
      ]
    });
    (decimals = result[0].result as number),
      (balanceOf =
        result[1].result !== undefined
          ? ethers.formatUnits(result[1].result.toString(), decimals)
          : '');
  } catch (error) {}

  return balanceOf;
};

export default getTokenBalance;
