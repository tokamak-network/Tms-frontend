import { writeContract } from '@wagmi/core';
import { NetworkConfig } from '../config/networks';
import { ethers } from 'ethers';
import contracts from '../config/constants/contracts';
import getCurrentNetwork from './getCurrentNetwork';
import { MULTISEND_INTERFACE } from '../config/abi/Multisend';

export const useMultiSend = async (
  tokenAddress: `0x${string}`,
  addresses: any,
  amounts: any,
  totalAmount:any
) => {
  const chainId = (await getCurrentNetwork()).chain.id;
  const multisendAddress = contracts.multisend[chainId] as `0x${string}`;

  try {
    if (tokenAddress == ethers.ZeroAddress) {
      const result = await writeContract(NetworkConfig, {
        address: multisendAddress,
        abi: MULTISEND_INTERFACE,
        functionName: 'sendETH',
        args: [addresses, amounts],
        value:totalAmount
      });

      return result;
    } else {
      const result = await writeContract(NetworkConfig, {
        address: multisendAddress,
        abi: MULTISEND_INTERFACE,
        functionName: 'sendERC20',
        args: [tokenAddress, addresses, amounts],
      });
      return result;
    }
  } catch (error: any) {
    console.error(`Error approving tokens: ${error.message}`);
    return null;
  }
};
