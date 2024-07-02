import React, { useState, useEffect } from 'react';
import useERC20Contract from '../../hooks/getTokenDetails';
import { useAccount } from 'wagmi';

interface TokenDetailsProps {
  tokenAddress: string;
  setTokenDetails: React.Dispatch<React.SetStateAction<TokenDetailsState | undefined>>;
}

interface TokenDetailsState {
  name: string | undefined;
  symbol: string | undefined;
  decimals: number | undefined;
  totalSupply: string | number | undefined;
  balanceOf: string | undefined;
  allowance: string | undefined;
}

const TokenDetails: React.FC<TokenDetailsProps> = ({ tokenAddress, setTokenDetails }) => {
  const { address: userAddress } = useAccount();
  const [tokenDetails, setTokenDetailsState] = useState<TokenDetailsState | undefined>(undefined);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (!tokenAddress ||!userAddress) return;
      console.log(tokenAddress, userAddress);
      try {
        const formattedTokenAddress = tokenAddress.startsWith('0x') ? tokenAddress : `0x${tokenAddress}`;
        const { name, symbol, decimals, totalSupply, balanceOf, allowance } = await useERC20Contract(formattedTokenAddress, userAddress);
        console.log("Name:", name, symbol, decimals, totalSupply, balanceOf, allowance);
        setTokenDetails({ name, symbol, decimals, totalSupply, balanceOf, allowance });
        setTokenDetailsState({ name, symbol, decimals, totalSupply, balanceOf, allowance });
      } catch (error) {
        console.error('Failed to fetch token details', error);
      }
    };

    fetchTokenDetails();
  }, [tokenAddress, userAddress]);
  
  if (!tokenDetails) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="loader"></div>
      </div>
    );
  }
  console.log(tokenDetails);
  return (
    <div className="bg-indigo-900 rounded shadow-sm p-4">
      <div className="text-white text-sm space-y-2">
        <div>
          <span className="font-bold">Name:</span> {tokenDetails.name}
        </div>
        <div>
          <span className="font-bold">Symbol:</span> {tokenDetails.symbol}
        </div>
        <div>
          <span className="font-bold">Decimals:</span> {tokenDetails.decimals}
        </div>
        <div>
          <span className="font-bold">Total Supply:</span> {tokenDetails.totalSupply}
        </div>
        <div>
          <span className="font-bold">Balance Of:</span> {tokenDetails.balanceOf}
        </div>
        <div>
          <span className="font-bold">Allowance:</span> {tokenDetails.allowance}
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
