import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import getERC20ContractDetails from '../../hooks/getTokenDetails';

interface TokenDetailsProps {
  tokenAddress: string;
  setTokenDetails: React.Dispatch<React.SetStateAction<TokenDetailsState | undefined>>;
  setshowTokenDetails: React.Dispatch<React.SetStateAction<boolean>>;
  currentStep: any;
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
  setshowTokenDetails,
  currentStep
}) => {
  const { address: userAddress } = useAccount();
  const [tokenDetails, setTokenDetailsState] = useState<TokenDetailsState | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (!tokenAddress || !userAddress) return;
      setIsLoading(true);
      try {
        const formattedTokenAddress = tokenAddress.startsWith('0x')
          ? tokenAddress
          : `0x${tokenAddress}`;
        const { name, symbol, decimals, totalSupply, balanceOf, allowance } =
          await getERC20ContractDetails(formattedTokenAddress as `0x${string}`, userAddress);

        const details = {
          name,
          symbol,
          decimals,
          totalSupply,
          balanceOf,
          allowance
        };
        setTokenDetails(details);
        setTokenDetailsState(details);
        setIsLoading(false);
        setTimeout(() => setIsVisible(true), 50); // Delay to trigger animation
      } catch (error) {
        console.error('Failed to fetch token details', error);
        setIsLoading(false);
      }
    };
    fetchTokenDetails();
  }, [tokenAddress, userAddress, setTokenDetails, currentStep]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setshowTokenDetails(false), 300); // Delay to allow fade-out animation
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col w-full max-w-md p-2 sm:p-4 border border-gray-200 rounded-lg bg-white shadow-sm relative transition-all duration-300 ease-in-out text-sm sm:text-base ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
    >
      <button
        className="absolute top-1 right-1 sm:top-4 sm:right-2 text-gray-500 hover:text-gray-800 text-xl sm:text-2xl transition-colors duration-200"
        onClick={handleClose}
      >
        &times;
      </button>
      <div className="text-center mb-1 sm:mb-2">
        <h3 className="text-l lg:text-lg md:text-lg  font-sans text-gray-900">
          {tokenDetails?.name} ({tokenDetails?.symbol})
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div className="flex flex-row items-center mt-2 sm:mt-4">
          <span className="text-gray-700 break-words">Balance:</span>
          <span className="font-sans text-gray-900 ml-1 sm:ml-2 break-all">
            {tokenDetails?.balanceOf
              ? Number(tokenDetails.balanceOf) > 100000
                ? `${Number(tokenDetails.balanceOf).toExponential(2)}`
                : `${Number(Math.floor(Number(tokenDetails.balanceOf) * 100) / 100).toFixed(2)}`
              : '0'}
          </span>
        </div>
        <div className="flex flex-row items-center mt-2 sm:mt-4">
          <span className="text-gray-700 break-words">Decimals:</span>
          <span className="font-sans text-gray-900 ml-1 sm:ml-2 break-all">
            {tokenDetails?.decimals}
          </span>
        </div>
        <div className="flex flex-row items-center mt-2 sm:mt-4">
          <span className="text-gray-700 break-words">Supply:</span>
          <span className="font-sans text-gray-900 ml-1 sm:ml-2 break-all">
            {tokenDetails?.totalSupply
              ? Number(tokenDetails.totalSupply) > 1000000
                ? `${Number(tokenDetails.totalSupply).toExponential(2)}`
                : `${Number(tokenDetails.totalSupply)}`
              : '0'}
          </span>
        </div>
        <div className="flex flex-row items-center mt-2 sm:mt-4">
          <span className="text-gray-700 break-words">Allowance:</span>
          <span className="font-sans text-gray-900 ml-2 break-all">
            {tokenDetails?.allowance
              ? Number(tokenDetails.allowance) > 1000000
                ? `${Number(tokenDetails.allowance).toExponential(2)}`
                : `${Number(Math.floor(Number(tokenDetails.allowance) * 100) / 100).toFixed(2)}`
              : '0'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
