import React, { useState, useEffect } from 'react';
import useERC20Contract from '../../hooks/getTokenDetails';
import { useAccount } from 'wagmi';

interface TokenDetailsProps {
  tokenAddress: string;
  setTokenDetails: React.Dispatch<
    React.SetStateAction<TokenDetailsState | undefined>
  >;
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
}) => {
  const { address: userAddress } = useAccount();
  const [tokenDetails, setTokenDetailsState] = useState<
    TokenDetailsState | undefined
  >(undefined);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (!tokenAddress || !userAddress) return;
      try {
        const formattedTokenAddress = tokenAddress.startsWith('0x')
          ? tokenAddress
          : `0x${tokenAddress}`;
        const { name, symbol, decimals, totalSupply, balanceOf, allowance } =
          await useERC20Contract(formattedTokenAddress, userAddress);
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
    };

    fetchTokenDetails();
  }, [tokenAddress, userAddress]);

  if (!tokenDetails) {
    return (
      <div className='flex justify-center items-center h-32'>
        <div className='loader'></div>
      </div>
    );
  }

  return (
    <div className='p-4 rounded-lg border  border-gray-200 bg-white shadow-sm'>
      <div className='text-center mb-4'>
        <h3 className='text-lg font-sans text-gray-900'>
          {tokenDetails.name} ({tokenDetails.symbol})
        </h3>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-row items-center '>
          <span className='text-gray-700'>Balance :</span>
          <span className='font-sans text-gray-900 ml-2'>
            {tokenDetails.balanceOf}
          </span>
        </div>
        <div className='flex flex-row items-center '>
          <span className='text-gray-700'>Decimals :</span>
          <span className='font-sans text-gray-900 ml-2'>
            {tokenDetails.decimals}
          </span>
        </div>
        <div className='flex flex-row items-center '>
          <span className='text-gray-700'>Supply :</span>
          <span className='font-sans text-gray-900 ml-2'>
            {tokenDetails.totalSupply}
          </span>
        </div>
        <div className='flex flex-row items-center '>
          <span className='text-gray-700'>Allowance :</span>
          <span className='font-sans text-gray-900 ml-2'>
            {tokenDetails.allowance}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
