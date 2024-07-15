import * as React from 'react';
import { useState, useEffect } from 'react';
import PrepareComponent from './Prepare';
import ApproveComponent from './Approve'; // Import the Approve component
import { useApprove } from '../../hooks/useApprove';
import { useMultiSend } from '../../hooks/useMultisend';
import { parseUnits } from 'viem';
import SuccessCard from '../cards/successCard';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

interface TokenDetailsState {
  name: string | any;
  symbol: string | any;
  decimals: number | any;
  totalSupply: string | number | any;
  balanceOf: string | any;
  allowance: string | any;
}

export function Multisend() {
  const [tokenDetails, setTokenDetails] = useState<
    TokenDetailsState | undefined
  >(undefined);
  const [csvData, setCSVData] = useState<string | undefined>('');
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [amountType, setAmountType] = useState<number | string>('');
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [txnHash, setTxnHash] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = React.useState(1);
  const account = useAccount().address;

  const handleNextClick = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };
  useEffect(() => {
    console.log(account, 'uhgugug');
    // Any other side effects or cleanup logic
    return () => {};
  }, [account]);

  let buttonText: string;
  if (currentStep === 1) {
    if (!account) {
      buttonText = 'Connect Wallet';
    } else {
      buttonText = 'Continue';
    }
  } else if (currentStep === 2) {
    buttonText = 'Approve';
  } else if (currentStep === 3) {
    buttonText = 'MultiSend';
  } else if (currentStep === 4) {
    buttonText = 'Prepare New MultiSend';
  }
  const HandleApprove = async () => {
    try {
      const result = await useApprove(
        tokenAddress as `0x${string}`,
        totalAmount,
        amountType === 'exact' ? 'exact-amount' : 'max',
        tokenDetails ? tokenDetails.decimals : 18
      );
      if (result) {
        setCurrentStep((prevStep) => prevStep + 1);
        console.log('Approval successful!');
        // Add your logic here to handle the approve action
      } else {
        console.log('Approval failed');
      }
    } catch (error: any) {
      console.error(`Error handling approval: ${error.message}`);
    }
  };
  const HandleMultiSend = async () => {
    const data = JSON.parse(csvData as string);

    const addresses = Object.keys(data);
    const amounts = Object.values(data).map(amount => parseUnits(amount as string, tokenDetails ? tokenDetails.decimals : 6));
    
    try {
      const result = await useMultiSend(
        tokenAddress as `0x${string}`,
        addresses,
        amounts
      );
      if (result) {
        console.log('txnhash', result);

        setTxnHash(result);
        setCurrentStep((prevStep) => prevStep + 1);
      } else {
        console.log('MultiSend failed');
      }
    } catch (error: any) {
      console.error(`Error handling approval: ${error.message}`);
    }
  };

  return (
    <div className='flex flex-col items-center pt-8'>
      <div className='flex items-center gap-40 text-l text-grey-400'>
        <div className='flex items-center gap-1.5 relative'>
          <span
            className={`flex justify-center items-center ${
              currentStep === 1
                ? 'bg-[#007AFF] text-white'
                : 'bg-[#F0F2F7] text-[#007AFF]'
            }  w-6 h-6 rounded-full text-sm`}
          >
            1
          </span>
          <div className='text-grey-500'>Prepare</div>
          <div className='flex-1 h-0.5 bg-gray-300 ml-6'></div>
        </div>

        <div className='flex items-center gap-1.5 relative'>
          <span
            className={`flex justify-center items-center ${
              currentStep === 2
                ? 'bg-[#007AFF] text-white'
                : 'bg-[#F0F2F7] text-[#007AFF]'
            }  w-6 h-6 border-2 rounded-full text-sm`}
          >
            2
          </span>
          <div className='text-grey-500'>Approve</div>
          <div className='flex-1 h-0.5 bg-gray-300 ml-6'></div>
        </div>
        <div className='flex items-center gap-1.5 relative'>
          <span
            className={`flex justify-center items-center ${
              currentStep === 4
                ? 'bg-[#007AFF] text-white'
                : 'bg-[#F0F2F7] text-[#007AFF]'
            } w-6 h-6 rounded-full text-sm`}
          >
            3
          </span>
          <div className='text-500'>Multisend</div>
        </div>
      </div>

      {currentStep === 1 && (
        <PrepareComponent
          setTokenDetails={setTokenDetails}
          setCSVData={setCSVData}
          setToken={setTokenAddress}
        />
      )}
      {(currentStep === 2 || currentStep === 3) && (
        <ApproveComponent
          tokenBalance={tokenDetails?.balanceOf.toString()}
          tokenDetails={tokenDetails}
          recipients={csvData}
          setAmountType={setAmountType}
          setTotalAmount={setTotalAmount}
        />
      )}
      {currentStep === 4 && <SuccessCard txnHash={txnHash as string} />}

      {currentStep && (
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <button
              onClick={() => {
                currentStep == 1 && !account
                  ? openConnectModal()
                  : currentStep == 1 && account
                  ? handleNextClick()
                  : currentStep == 2
                  ? HandleApprove()
                  : currentStep === 3
                  ? HandleMultiSend()
                  : setCurrentStep(1);
              }}
              className='  font-ans-serif font-semibold text-s w-[500px] text-center px-16 py-4 mt-5  leading-4 text-white bg-[#007AFF] rounded-3xl'
            >
              {buttonText}
            </button>
          )}
        </ConnectButton.Custom>
      )}
    </div>
  );
}

export default Multisend;
