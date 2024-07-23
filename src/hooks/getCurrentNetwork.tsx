import { getAccount, getEnsName, getClient } from '@wagmi/core';
import { NetworkConfig } from '../config/networks';

const getCurrentNetwork = () => {
  const { chain } = getClient(NetworkConfig);
  return {
    chain
  };
};

export default getCurrentNetwork;
