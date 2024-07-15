import React, { useState, useEffect, useCallback } from 'react';
import getERC20ContractDetails from '../../hooks/getTokenDetails';
import { useAccount } from 'wagmi';

interface TokenDetailsProps {
  tokenAddress: string;
  setTokenDetails: React.Dispatch<
    React.SetStateAction<TokenDetailsState | undefined>
  >;
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
  setshowTokenDetails,
}) => {
  const { address: userAddress } = useAccount();
  const [tokenDetails, setTokenDetailsState] = useState<
    TokenDetailsState | undefined
  >(undefined);

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
        allowance,
      });
      setTokenDetailsState({
        name,
        symbol,
        decimals,
        totalSupply,
        balanceOf,
        allowance,
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
      <div className='flex justify-center items-center h-32'>
        <div className='loader'></div>
      </div>
    );
  }

  return (
    <div className='relative flex flex-col gap-1.5 border border-solid leading-[1%] max-md:flex-wrap box-border w-[440px] border-1 p-4 rounded-lg border-gray-200 bg-white shadow-sm'>
      <button
        className='absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl'
        onClick={handleClose}
      >
        &times;
      </button>
      <div className='text-center mb-2'>
        <h3 className='text-lg font-sans text-gray-900'>
          {tokenDetails.name} ({tokenDetails.symbol})
        </h3>
      </div>
      <div className='grid grid-cols-2 gap-4 '>
        <div className='flex flex-row items-center mt-4'>
          <span className='text-gray-700'>Balance :</span>
          <span className='font-sans text-gray-900 ml-2'>
            {tokenDetails.balanceOf}
          </span>
        </div>
        <div className='flex flex-row items-center mt-4'>
          <span className='text-gray-700'>Decimals :</span>
          <span className='font-sans text-gray-900 ml-2'>
            {tokenDetails.decimals}
          </span>
        </div>
        <div className='flex flex-row items-center mt-4'>
          <span className='text-gray-700'>Supply :</span>
          <span className='font-sans text-gray-900 ml-2'>
            {tokenDetails.totalSupply}
          </span>
        </div>
        <div className='flex flex-row items-center mt-4 mb-2'>
          <span className='text-gray-700'>Allowance :</span>
          <span className='font-sans text-gray-900 ml-2'>
            {tokenDetails.allowance
              ? Number(tokenDetails.allowance).toExponential(2)
              : '0'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
