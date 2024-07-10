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

export function Multisend() {
  const [TokenDetails, setTokenDetails] = useState('');
  const [csvData, setCSVData] = useState(null);
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [amountType, setAmountType] = useState<'exact' | 'ax'>('exact');
  const [tokenAddress, setTokenAddress] = useState('');
  const [txnHash, setTxnHash] = useState(null);
  const [currentStep, setCurrentStep] = React.useState(1);
  const account = useAccount().address;

  const handleNextClick = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };
  useEffect(() => {
    console.log(account, 'uhgugug');
    // Any other side effects or cleanup logic
    return () => {
      // Cleanup logic if needed
    };
  }, [account]);

  let buttonText;
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
  const handleApprove = async () => {
    try {
      const result = await useApprove(
        tokenAddress,
        totalAmount,
        amountType,
        TokenDetails ? TokenDetails.decimals : 18
      );
      if (result) {
        setCurrentStep((prevStep) => prevStep + 1);
        console.log('Approval successful!');
        // Add your logic here to handle the approve action
      } else {
        console.log('Approval failed');
      }
    } catch (error) {
      console.error(`Error handling approval: ${error.message}`);
    }
  };
  const handleMultiSend = async () => {
    
    const addresses = [];
    const amounts = [];

    const lines = csvData.split('\n');
    lines.forEach((line) => {
      const [address, amount] = line.split(',');
      addresses.push(address);
      amounts.push(parseUnits(amount, TokenDetails.decimals));
    });

    try {
      const result = await useMultiSend(
        tokenAddress,
        addresses,
        amounts,
        TokenDetails.decimals
      );
      if (result) {
        console.log('txnhash', result);

        setTxnHash(result);
        setCurrentStep((prevStep) => prevStep + 1);
      } else {
        console.log('MultiSend failed');
      }
    } catch (error) {
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
          tokenDetails={TokenDetails}
          recipients={csvData}
          setAmountType={setAmountType}
          setTotalAmount={setTotalAmount}
        />
      )}
      {currentStep === 4 && <SuccessCard txnHash={txnHash} />}

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
                  ? handleApprove()
                  : currentStep === 3
                  ? handleMultiSend()
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
