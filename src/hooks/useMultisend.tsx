import { writeContract } from '@wagmi/core';
import { NetworkConfig } from '../config/networks';
import { ethers } from 'ethers';
import contracts from '../config/constants/contracts';
import getCurrentNetwork from './getCurrentNetwork';
import { MULTISEND_INTERFACE } from '../config/abi/Multisend';
// usdt = await ethers.getContractAt("ERC20", "0x79E0d92670106c85E9067b56B8F674340dCa0Bbd", owner)
// usdc = await ethers.getContractAt("ERC20", "0xFF3Ef745D9878AfE5934Ff0b130868AFDDbc58e8", owner)
// ton = await ethers.getContractAt("ERC20", "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2", owner)

export const useMultiSend = async (
  tokenAddress: `0x${string}`,
  addresses: any,
  amounts: any
) => {
  tokenAddress = '0xFF3Ef745D9878AfE5934Ff0b130868AFDDbc58e8';
  const chainId = (await getCurrentNetwork()).chain.id;
  const multisendAddress = contracts.multisend[chainId] as `0x${string}`;
  try {
    if (tokenAddress == ethers.ZeroAddress) {
      const result = await writeContract(NetworkConfig, {
        address: multisendAddress,
        abi: MULTISEND_INTERFACE,
        functionName: 'sendETH',
        args: [addresses, amounts],
      });

      return result;
    } else {
      const result = await writeContract(NetworkConfig, {
        address: multisendAddress,
        abi: MULTISEND_INTERFACE,
        functionName: 'sendERC20',
        args: [tokenAddress, addresses, amounts],
      });
      console.log(result, 'result');

      return result;
    }
  } catch (error: any) {
    console.error(`Error approving tokens: ${error.message}`);
    return null;
  }
};
