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

function formatLargeNumber(num: string | number): string {
  const suffixes = [
    { value: 1e6, name: "Million" },
    { value: 1e9, name: "Billion" },
    { value: 1e12, name: "Trillion" },
    { value: 1e15, name: "Quadrillion" },
    { value: 1e18, name: "Quintillion" },
    { value: 1e21, name: "Sextillion" },
    { value: 1e24, name: "Septillion" },
    { value: 1e27, name: "Octillion" },
    { value: 1e30, name: "Nonillion" },
    { value: 1e33, name: "Decillion" },
    { value: 1e36, name: "Undecillion" },
    { value: 1e39, name: "Duodecillion" },
    { value: 1e42, name: "Tredecillion" },
    { value: 1e45, name: "Quattuordecillion" },
    { value: 1e48, name: "Quindecillion" },
    { value: 1e51, name: "Sexdecillion" },
    { value: 1e54, name: "Septendecillion" },
    { value: 1e57, name: "Octodecillion" },
    { value: 1e60, name: "Novemdecillion" },
    { value: 1e63, name: "Vigintillion" },
    { value: 1e100, name: "Googol" }
  ];

  num = Number(num);

  if (isNaN(num) || !isFinite(num)) return num.toString();

  if (num < 100) {
    return num.toFixed(2);
  }

  const suffix = suffixes.slice().reverse().find(item => num >= item.value);

  if (suffix) {
    const scale = Math.floor(Math.log10(num / suffix.value));
    const scaled = (num / suffix.value).toFixed(scale < 3 ? 2 : 0);
    return scaled + " " + suffix.name;
  }

  return num.toFixed(2);
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
        setTimeout(() => setIsVisible(true), 50);
      } catch (error) {
        console.error('Failed to fetch token details', error);
        setIsLoading(false);
      }
    };
    fetchTokenDetails();
  }, [tokenAddress, userAddress, setTokenDetails, currentStep]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setshowTokenDetails(false), 300);
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
          <span className="font-sans text-gray-900 ml-1 sm:ml-2 ">
            {tokenDetails?.balanceOf ? formatLargeNumber(tokenDetails.balanceOf) : '0'}
          </span>
        </div>
        <div className="flex flex-row items-center mt-2 sm:mt-4">
          <span className="text-gray-700 break-words">Decimals:</span>
          <span className="font-sans text-gray-900 ml-1 sm:ml-2 ">
            {tokenDetails?.decimals}
          </span>
        </div>
        <div className="flex flex-row items-center mt-2 sm:mt-4">
          <span className="text-gray-700 break-words">TotalSupply:</span>
          <span className="font-sans text-gray-900 ml-1 sm:ml-2">
            {tokenDetails?.totalSupply ? formatLargeNumber(tokenDetails.totalSupply) : '0'}
          </span>
        </div>
        <div className="flex flex-row items-center mt-2 sm:mt-4">
          <span className="text-gray-700 break-words">Allowance:</span>
          <span className="font-sans text-gray-900 ml-2 ">
            {tokenDetails?.allowance ? formatLargeNumber(tokenDetails.allowance) : '0'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;