import React, { useState, useEffect, useCallback } from 'react';
import getERC20ContractDetails from '../../hooks/getTokenDetails';
import { useAccount } from 'wagmi';

interface TokenDetailsProps {
  tokenAddress: string;
  setTokenDetails: React.Dispatch<React.SetStateAction<TokenDetailsState | undefined>>;
  setshowTokenDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

interface TokenDetailsState {
  name: string | undefined;
  symbol: string | undefined;
  decimals: number | undefined;
  totalSupply: string | number | undefined;
  balanceOf: string | undefined;
  allowance: string | undefined;
}

const TokenDetails: React.FC<TokenDetailsProps> = ({
  tokenAddress,
  setTokenDetails,
  setshowTokenDetails
}) => {
  const { address: userAddress } = useAccount();
  const [tokenDetails, setTokenDetailsState] = useState<TokenDetailsState | undefined>(undefined);

  const fetchTokenDetails = useCallback(async () => {
    if (!tokenAddress || !userAddress) return;
    try {
      const formattedTokenAddress = tokenAddress.startsWith('0x')
        ? tokenAddress
        : `0x${tokenAddress}`;
      const { name, symbol, decimals, totalSupply, balanceOf, allowance } =
        await getERC20ContractDetails(formattedTokenAddress as `0x${string}`, userAddress);
      setTokenDetails({
        name,
        symbol,
        decimals,
        totalSupply,
        balanceOf,
        allowance
      });
      setTokenDetailsState({
        name,
        symbol,
        decimals,
        totalSupply,
        balanceOf,
        allowance
      });
    } catch (error) {
      console.error('Failed to fetch token details', error);
    }
  }, [tokenAddress, userAddress, setTokenDetails]);

  useEffect(() => {
    fetchTokenDetails();
  }, [fetchTokenDetails]);

  const handleClose = () => {
    setshowTokenDetails(false);
  };

  if (!tokenDetails) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-md p-4 border border-gray-200 rounded-lg bg-white shadow-sm relative left-0 ">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl sm:text-2xl"
        onClick={handleClose}
      >
        &times;
      </button>
      <div className="text-center mb-2">
        <h3 className="text-lg sm:text-xl font-sans text-gray-900">
          {tokenDetails.name} ({tokenDetails.symbol})
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-row items-center mt-2 sm:mt-4">
          <span className="text-gray-700 break-words">Balance:</span>
          <span className="font-sans text-gray-900 ml-2 break-all">
            {tokenDetails.balanceOf
              ? Number(tokenDetails.balanceOf) > 100000
                ? `${Number(tokenDetails.balanceOf).toExponential(2)}`
                : `${Number(tokenDetails.balanceOf).toFixed(2)}`
              : '0'}
          </span>
        </div>
        <div className="flex flex-row items-center mt-2 sm:mt-4">
          <span className="text-gray-700 break-words">Decimals:</span>
          <span className="font-sans text-gray-900 ml-2 break-all">{tokenDetails.decimals}</span>
        </div>
        <div className="flex flex-row items-center mt-2 sm:mt-4">
          <span className="text-gray-700 break-words">Supply:</span>
          <span className="font-sans text-gray-900 ml-2 break-all">
            {tokenDetails.totalSupply
              ? Number(tokenDetails.totalSupply) > 1000000
                ? `${Number(tokenDetails.totalSupply).toExponential(2)}`
                : `${Number(tokenDetails.totalSupply)}`
              : '0'}
          </span>
        </div>
        <div className="flex flex-row items-center mt-2 sm:mt-4">
          <span className="text-gray-700 break-words">Allowance:</span>
          <span className="font-sans text-gray-900 ml-2 break-all">
            {tokenDetails.allowance
              ? Number(tokenDetails.allowance) > 1000000
                ? `${Number(tokenDetails.allowance).toExponential(2)}`
                : `${Number(tokenDetails.allowance)}`
              : '0'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
