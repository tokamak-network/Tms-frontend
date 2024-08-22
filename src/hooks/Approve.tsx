import { writeContract } from '@wagmi/core';
import { NetworkConfig } from '../config/networks';
import { ERC20_INTERFACE } from '../config/abi/ERC20';
import { ethers } from 'ethers';
import getCurrentNetwork from './getCurrentNetwork';
import contracts from '../config/constants/contracts';
// usdt = await ethers.getContractAt("ERC20", "0x79E0d92670106c85E9067b56B8F674340dCa0Bbd", owner)
// usdc = await ethers.getContractAt("ERC20", "0xFF3Ef745D9878AfE5934Ff0b130868AFDDbc58e8", owner)
// ton = await ethers.getContractAt("ERC20", "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2", owner)

export const Approve = async (
  contractAddress: `0x${string}`,
  amount: string,
  amountType: 'exact-amount' | 'max',
  decimals: any
) => {
  let approvalAmount: any;
  const chainId = (await getCurrentNetwork()).chain.id;
  const multisendAddress = contracts.multisend[chainId] as `0x${string}`;
  if (amountType === 'exact-amount') {
    approvalAmount = ethers.parseUnits(amount, decimals);
  } else {
    approvalAmount = ethers.MaxUint256.toString();
  }
  contractAddress = ethers.getAddress(contractAddress) as `0x${string}`;

  try {
    const result = await writeContract(NetworkConfig, {
      address: contractAddress,
      abi: ERC20_INTERFACE,
      functionName: 'approve',
      args: [multisendAddress, approvalAmount]
    });
    return result;
  } catch (error: any) {
    console.error(`Error approving tokens: ${error.message}`);
    return null;
  }
};
