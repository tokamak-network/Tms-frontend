import React, { useEffect } from 'react';
import { useBalance, useAccount } from 'wagmi';
import { ethers } from 'ethers';

interface Props {
  title: string;
  value: number | any;
}

interface ITokenDetails {
  symbol: string;
  allowance: string;
  balanceOf: number;
  decimals: any;
}

interface Recipient {
  address: string | any;
  amount: number;
}

interface ApproveComponentProps {
  tokenAddress: any;
  tokenBalance: any;
  tokenDetails: ITokenDetails | any;
  recipients: any;
  setAmountType: (amountType: string) => void;
  setTotalAmount: (totalAmount: string) => void;
}

const StatCard: React.FC<Props> = ({ title, value }) => (
  <div className={`h-10 rounded-md flex flex-col items-start justify-center`}>
    <h1 className="text-xs text-gray-400">{title}</h1>
    <h1 className={`font-bold text-2xl`}>{value ? value : 0}</h1>
  </div>
);

const ApproveComponent: React.FC<ApproveComponentProps> = ({
  tokenAddress,
  tokenBalance,
  tokenDetails,
  recipients,
  setAmountType,
  setTotalAmount
}) => {
  const account = useAccount().address;
  const ethBalance = useBalance({ address: account }).data?.value;
  const ethBalanceFormatted = ethBalance
    ? parseFloat(ethers.formatEther(BigInt(ethBalance))).toFixed(3)
    : '0';

  const symbol = tokenDetails ? tokenDetails.symbol : null;
  const allowance = tokenDetails ? parseInt(tokenDetails.allowance) : null;

  const parsedRecipients = recipients
    ? Object.entries(JSON.parse(recipients)).map(([address, amount]) => ({
        address,
        amount: parseFloat(amount as string)
      }))
    : [];

  const totalTokensToSend = parsedRecipients.reduce(
    (acc: any, current: any) => acc + current.amount,
    0
  );
  useEffect(() => {
    setTotalAmount(totalTokensToSend.toFixed(3));
  }, [totalTokensToSend]);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let amountType: 'exact-amount' | 'max';
    switch (e.target.id) {
      case 'exact-amount':
        amountType = 'exact-amount';
        break;
      case 'unlimited-amount':
        amountType = 'max';
        break;
      default:
        throw new Error(`Invalid amount type: ${e.target.id}`);
    }
    const totalAmount = totalTokensToSend.toFixed(3);
    setAmountType(amountType);
    setTotalAmount(totalAmount);
  };
  return (
    <div className="flex flex-col mt-12 mb-10 w-[650px]  rounded   font-ans-serif">
      <div className="flex justify-between w-full">
        {tokenDetails && (
          <StatCard title={`${symbol ? symbol : 'ETH'} Balance`} value={tokenBalance} />
        )}
        <StatCard title="Send Amount" value={totalTokensToSend.toFixed(3)} />
        <StatCard title="ETH balance" value={ethBalanceFormatted} />
      </div>
      <div className="mt-5 text-ans-serif">
        <p className="flex justify-between text-gray-400 mb-2">Address List</p>
        <div className="scrollable">
          {parsedRecipients.length > 0 ? (
            parsedRecipients.map((recipient: any, index: any) => {
              if (recipient) {
                return (
                  <div key={index} className="flex justify-between">
                    <p className="text-[#007AFF] text-m">{recipient.address}</p>
                    <p className="font-medium">
                      {recipient.amount} {symbol ? symbol : 'ETH'}
                    </p>
                  </div>
                );
              } else {
                return null;
              }
            })
          ) : (
            <p>No recipients found</p>
          )}
        </div>
      </div>
      {tokenAddress !== ethers.ZeroAddress && tokenDetails?.allowance < totalTokensToSend && (
        <div className="mt-10">
          <div className="flex flex-row gap-4 mt-5 ml-4 text-ans-serif">
            <input type="radio" id="exact-amount" name="amount-type" onChange={handleRadioChange} />
            <label htmlFor="exact-amount" className="text-gray-400  mr-8">
              Approve Exact Amount
            </label>
            <input
              type="radio"
              id="unlimited-amount"
              name="amount-type"
              onChange={handleRadioChange}
            />
            <label htmlFor="unlimited-amount" className="text-gray-400">
              Approve Unlimited Amount
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveComponent;
