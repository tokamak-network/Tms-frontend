import React, { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';

interface NativeETHDetailsProps {
  setEthDetails: React.Dispatch<React.SetStateAction<EthDetailsState | undefined>>;
}

interface EthDetailsState {
  balance: string | undefined;
}

const NativeETHDetails: React.FC<NativeETHDetailsProps> = ({ setEthDetails }) => {
  const { address: userAddress } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: userAddress
  });

  useEffect(() => {
    if (data) {
      const balance = data.formatted;
      setEthDetails({ balance });
    }
  }, [data, setEthDetails]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="loader"></div>
      </div>
    );
  }

  if (isError || !data) {
    return <div>Error fetching balance.</div>;
  }

  return (
    <div className="bg-indigo-900 rounded shadow-sm p-4">
      <div className="text-white text-sm space-y-2">
        <div>
          <span className="font-bold">ETH Balance:</span> {data.formatted}
        </div>
      </div>
    </div>
  );
};

export default NativeETHDetails;
