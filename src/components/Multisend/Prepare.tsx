import React, { useState } from 'react';
import TokenDetails from '../TokenDetails/ERC20';
import { ethers } from 'ethers';
import CSVUploader from './csvUploader';
import NativeETHDetails from '../TokenDetails/NativeETH';

const PrepareComponent = ({ setTokenDetails, setCSVData }) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: any) => {
    const input = e.target.value;
    setTokenAddress(input);

    if (!input) {
      setError('');
    } else if (!ethers.isAddress(input)) {
      setError('Invalid address');
    } else {
      setError('');
    }
  };

  return (
    <div className='flex flex-col px-5 py-6 mt-5 max-w-full rounded shadow-sm bg-white-950 w-[566px] font-sans'>
      <div className='flex gap-px max-md:flex-wrap'>
        <div className='flex flex-col grow shrink-0 my-auto text-xs basis-0 text-neutral-300 w-fit max-md:max-w-full'>
          <div className='flex gap-1.5 px-3.5 py-2.5 mt-2 text-indigo-500 rounded border border-solid border-zinc-400 leading-[1%] max-md:flex-wrap box-border w-full h-full rounded-full border-1 border-solid border-gray-300'>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/4792370c216477454484b83d83d4e4aaae409419cf9974d042cb7489c6fefe2e?'
              className='shrink-0 aspect-square w-[21px]'
              alt='token'
            />
            <input
              type='text'
              placeholder='Search Token name or address'
              className='flex-auto my-auto bg-transparent text-gray-600 placeholder-gray-600 focus:outline-none
               font-poppins font-normal text-base leading-[21px] text-cap leading-trim-both '
              value={tokenAddress}
              onChange={handleInputChange}
            />
          </div>
          
          {error && <div className='mt-2 text-xs text-red-500'>{error}</div>}
          {tokenAddress && !error && (
            <>
            {tokenAddress !== '0x0000000000000000000000000000000000000000' ? (
              <TokenDetails
                tokenAddress={tokenAddress}
                setTokenDetails={setTokenDetails}
              />
            ) : (
              <NativeETHDetails 
                setEthDetails={setTokenDetails}
              />
            )}
            </>
          )}
        </div>
        <div className='flex flex-col'></div>
      </div>
      <CSVUploader setCSVData={setCSVData} />
    </div>
  );
};

export default PrepareComponent;
