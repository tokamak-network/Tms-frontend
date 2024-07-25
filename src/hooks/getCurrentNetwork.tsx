import { getClient } from '@wagmi/core';
import { NetworkConfig } from '../config/networks';
import { sepolia_titan } from '../chains/tokamak';// Adjust this import path as needed

const getCurrentNetwork = () => {
  try {
    const client = getClient(NetworkConfig);
    if (!client) {
      return { chain: sepolia_titan };
    }
    
    const { chain } = client;
    if (!chain) {
      return { chain: sepolia_titan };
    }
    return { chain };
  } catch (error) {
    return { chain: sepolia_titan };
  }
};

export default getCurrentNetwork;