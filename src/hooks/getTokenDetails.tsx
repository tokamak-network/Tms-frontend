import { readContracts } from '@wagmi/core';
import { NetworkConfig } from '../config/networks';
import { ERC20_INTERFACE } from '../config/abi/ERC20';
import { ethers } from 'ethers';

export const getERC20ContractDetails = async (
  contractAddress: `0x${string}`,
  userAddress: string
) => {
  let name, symbol, decimals, totalSupply, balanceOf, allowance;
  const erc20contract = {
    address: contractAddress,
    abi: ERC20_INTERFACE,
  };
  try {
    const result = await readContracts(NetworkConfig, {
      allowFailure: true,
      contracts: [
        {
          ...erc20contract,
          functionName: 'name',
          args: [],
        },
        {
          ...erc20contract,
          functionName: 'symbol',
          args: [],
        },
        {
          ...erc20contract,
          functionName: 'decimals',
          args: [],
        },
        {
          ...erc20contract,
          functionName: 'totalSupply',
          args: [],
        },
        {
          ...erc20contract,
          functionName: 'balanceOf',
          args: [userAddress as `0x${string}`],
        },
        {
          ...erc20contract,
          functionName: 'allowance',
          args: [userAddress as `0x${string}`, contractAddress],
        },
      ],
    });
  
    (name = result[0].result as string),
      (symbol = result[1].result as string),
      (decimals = result[2].result as number),
      (totalSupply =
        result[3].result !== undefined
          ? parseInt(ethers.formatUnits(result[3].result.toString(), decimals))
          : '');

    balanceOf =
      result[4].result !== undefined
        ? ethers.formatUnits(result[4].result.toString(), decimals)
        : '';
    allowance =
      result[5].result !== undefined
        ? ethers.formatUnits(result[5].result.toString(), decimals)
        : '';

  } catch (error) {}

  return { name, symbol, decimals, totalSupply, balanceOf, allowance };
};

export default getERC20ContractDetails;
