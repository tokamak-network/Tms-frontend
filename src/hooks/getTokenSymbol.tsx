import { readContracts } from '@wagmi/core';
import { NetworkConfig } from '../config/networks';
import { ERC20_INTERFACE } from '../config/abi/ERC20';

export const getTokenSymbol = async (contractAddress: `0x${string}`) => {
  let tokenSymbol;
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
          functionName: 'symbol',
          args: []
        }
      ]
    });
    tokenSymbol = result[0].result as string;
  } catch (error) {}

  return tokenSymbol;
};

export default getTokenSymbol;
