import React, { useState } from 'react';
import TokenDetails from '../TokenDetails/ERC20';
import { ethers } from 'ethers';
import CSVUploader from './csvUploader';
import NativeETHDetails from '../TokenDetails/NativeETH';

const PrepareComponent = ({ setTokenDetails, setCSVData, setToken }) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const handleInputChange = (e: any) => {
    const input = e.target.value;
    setTokenAddress(input);
    setToken(input);

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
      <div>
        <div className='flex items-end gap-6 font-ans-serif'>
          <div className='flex gap-1.5 px-3.5 py-2.5 mt-2 text-indigo-500 border border-solid border-zinc-400 leading-[1%] max-md:flex-wrap box-border w-[370px] h-10 rounded-full border-1'>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/4792370c216477454484b83d83d4e4aaae409419cf9974d042cb7489c6fefe2e?'
              className='shrink-0 aspect-square w-6'
              alt='token'
            />
            <input
              type='text'
              placeholder='Search Token name or address'
              className='flex-auto my-auto bg-transparent text-gray-600 placeholder-gray-600 focus:outline-none  font-normal text-base leading-[21px] text-cap leading-trim-both'
              value={tokenAddress}
              onChange={handleInputChange}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className='bg-gray-200 text-black rounded-full py-2 px-6 hover:bg-gray-300 transition duration-300 '
          >
            Upload CSV
          </button>
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
              <NativeETHDetails setEthDetails={setTokenDetails} />
            )}
          </>
        )}
      </div>

      <CSVUploader
        setCSVData={setCSVData}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
};

export default PrepareComponent;
