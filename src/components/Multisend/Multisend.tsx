import * as React from 'react';
import { useState, useEffect } from 'react';
import PrepareComponent from './Prepare';
import ApproveComponent from './Approve';
import { useApprove } from '../../hooks/useApprove';
import { useMultiSend } from '../../hooks/useMultisend';
import SuccessCard from '../cards/successCard';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

interface TokenDetailsState {
  name: string | any;
  symbol: string | any;
  decimals: number | any;
  totalSupply: string | number | any;
  balanceOf: string | any;
  allowance: string | any;
}

export function Multisend() {
  const [tokenDetails, setTokenDetails] = useState<TokenDetailsState | undefined>(undefined);
  const [csvData, setCSVData] = useState<string | undefined>('');
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [amountType, setAmountType] = useState<number | string>('');
  const [tokenAddress, setTokenAddress] = useState<string>(ethers.ZeroAddress);
  const [txnHash, setTxnHash] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = React.useState(1);
  const account = useAccount().address;

  const handleNextClick = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };
  const showHome = () => {
    setCurrentStep(1);
    setCSVData('');
    setTotalAmount('');
    setTokenAddress(ethers.ZeroAddress);
    setTxnHash(null);
    setAmountType('');
  };
  useEffect(() => {}, [account, csvData, tokenAddress]);

  let buttonText: string;
  if (currentStep === 1) {
    if (!account) {
      buttonText = 'Connect Wallet';
    } else {
      buttonText = 'Continue';
    }
  } else if (currentStep === 2) {
    if (tokenAddress === ethers.ZeroAddress) {
      handleNextClick();
    }
    if(tokenDetails?.allowance>totalAmount){
      handleNextClick();
    }
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
        amountType === 'exact-amount' ? 'exact-amount' : 'max',
        tokenDetails ? tokenDetails.decimals : 18
      );
      if (result) {
        setCurrentStep((prevStep) => prevStep + 1);
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
    const amounts = Object.values(data).map((amount) =>
      ethers.parseUnits(amount as string, tokenDetails ? tokenDetails.decimals : 'ether')
    );
    const totalAmount = amounts.reduce((acc, current) => acc + current, BigInt(0));
    try {
      const result = await useMultiSend(
        tokenAddress as `0x${string}`,
        addresses,
        amounts,
        totalAmount
      );
      if (result) {
        setTxnHash(result);
        setCurrentStep((prevStep) => prevStep + 1);
      } else {
        console.log('MultiSend failed');
      }
    } catch (error: any) {
      console.error(`Error handling MultiSend: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center pt-8">
      <div className="flex items-center gap-2 text-l text-grey-400 w-[650px] justify-between">
        <div className="flex items-center gap-1.5 relative">
          <span
            className={`flex justify-center items-center ${
              currentStep === 1 ? 'bg-[#007AFF] text-white' : 'bg-[#F0F2F7] text-[#007AFF]'
            }  w-6 h-6 rounded-full text-sm`}
          >
            1
          </span>
          <div className="text-grey-500">Prepare</div>
        </div>
        <div className={`flex-grow h-px  ${currentStep === 1 ? 'bg-gray-300' : 'bg-black'} `}></div>
        <div className="flex items-center gap-1.5 relative">
          <span
            className={`flex justify-center items-center ${
              currentStep === 2 ? 'bg-[#007AFF] text-white' : 'bg-[#F0F2F7] text-[#007AFF]'
            }  w-6 h-6 border-2 rounded-full text-sm`}
          >
            2
          </span>
          <div className="text-grey-500">Approve</div>
        </div>
        <div
          className={`flex-grow h-px  ${currentStep === 3 || currentStep === 4 ? 'bg-black' : 'bg-gray-300'} `}
        ></div>
        <div className="flex items-center gap-1.5 relative">
          <span
            className={`flex justify-center items-center ${
              currentStep === 3 || currentStep === 4
                ? 'bg-[#007AFF] text-white'
                : 'bg-[#F0F2F7] text-[#007AFF]'
            } w-6 h-6 rounded-full text-sm`}
          >
            3
          </span>
          <div className="text-500">Multisend</div>
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
          tokenAddress={tokenAddress ? tokenAddress : ethers.ZeroAddress}
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
                    : buttonText == 'Approve'
                      ? HandleApprove()
                      : buttonText == 'MultiSend'
                        ? HandleMultiSend()
                        : showHome();
              }}
              disabled={buttonText == 'Continue' && csvData == ''}
              className={`font-ans-serif font-semibold text-s w-[500px] text-center px-16 py-4 mt-5 leading-4 text-white ${
                buttonText == 'Continue' && csvData == '' ? 'bg-[#80b4ee] ' : 'bg-[#007AFF]'
              } rounded-3xl`}
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
