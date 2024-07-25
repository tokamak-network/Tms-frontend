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
  <div className="h-10 rounded-md flex flex-col items-start justify-center">
    <h1 className="text-xs  text-gray-400 ">
      {title}
    </h1>
    <h1 className="text-sm sm:text-base md:text-xl lg:text-xl xl:text-2xl font-semibold md:font-bold lg:font-bold xl:font-bold">
      {value ? value : 0}
    </h1>
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
  let totalTokensToSend = 0;
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

  if (parsedRecipients.length > 0) {
    totalTokensToSend = parsedRecipients.reduce((acc, current) => acc + current.amount, 0);
  }

  useEffect(() => {
    setTotalAmount(totalTokensToSend.toFixed(3).toString());
  }, [totalTokensToSend, setTotalAmount]);

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

  const trimAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="lg:w-[650px] xl:[650px] md:w-3/4 w-[85%] flex flex-col mt-12 mb-10 rounded font-sans-serif">
      <div className="flex justify-between w-full">
        {tokenDetails && (
          <StatCard title={`${symbol ? symbol : 'ETH'} Balance`} value={tokenBalance} />
        )}
        <StatCard title="Send Amount" value={totalTokensToSend.toFixed(3)} />
        <StatCard title="ETH balance" value={ethBalanceFormatted} />
      </div>
      <div className="mt-5 text-sans-serif">
        <p className="flex justify-between text-gray-400 mb-2">Address List</p>
        <div className="scrollable lg:max-h-96 xl:max-h-96 md:max-h-80 max-h-64 overflow-y-auto">
          {parsedRecipients.length > 0 ? (
            parsedRecipients.map((recipient: Recipient, index: number) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <p className="text-[#007AFF] text-xs sm:text-sm md:text-base lg:text-base xl:text-base overflow-hidden overflow-ellipsis">
                  <span className="hidden sm:inline">{recipient.address}</span>
                  <span className="inline sm:hidden">{trimAddress(recipient.address)}</span>
                </p>
                <p className="text-xs sm:text-sm md:text-base lg:text-base xl:text-base ml-2">
                  {recipient.amount} {symbol ? symbol : 'ETH'}
                </p>
              </div>
            ))
          ) : (
            <p>No recipients found</p>
          )}
        </div>
      </div>
      {tokenAddress !== ethers.ZeroAddress && tokenDetails?.allowance < totalTokensToSend && (
        <div className="mt-10">
          <div className="flex flex-row gap-4 mt-5 ml-4 text-sans-serif">
            <input type="radio" id="exact-amount" name="amount-type" onChange={handleRadioChange} />
            <label htmlFor="exact-amount" className="text-gray-400">
              Exact Amount
            </label>
            <input
              type="radio"
              id="unlimited-amount"
              name="amount-type"
              onChange={handleRadioChange}
            />
            <label htmlFor="unlimited-amount" className="text-gray-400">
              Unlimited Amount
            </label>
          </div>
          {tokenDetails?.allowance < totalTokensToSend && (
            <button
              className="bg-[#007AFF] hover:bg-[#0067ce] text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => console.log('Approve button clicked')}
            >
              Approve
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ApproveComponent;
