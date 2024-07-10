import React from 'react';
import { useBalance, useAccount } from 'wagmi';
import { ethers } from 'ethers';

const StatCard = ({ title, value }) => (
  <div
    className={`h-10 rounded-md flex flex-col items-start justify-center`}
  >
    <h1 className='text-xs text-gray-400'>{title}</h1>
    <h1 className={`font-bold text-2xl`}>{value ? value : 0}</h1>
  </div>
);

const ApproveComponent = ({
  tokenBalance,
  tokenDetails,
  recipients,
  setAmountType,
  setTotalAmount,
}) => {
  const account = useAccount().address;
  const ethBalance = useBalance({ address: account }).data?.value;
  const ethBalanceFormatted = ethBalance
    ? parseFloat(ethers.formatEther(BigInt(ethBalance))).toFixed(3)
    : '0';

  const symbol = tokenDetails.symbol;
  const allowance = parseInt(tokenDetails.allowance);
  tokenBalance = tokenDetails.balanceOf;
  const parsedRecipients = recipients
    ? recipients
        .split('\n')
        .map((row) => {
          const [address, amount] = row.split(',');
          if (address && amount) {
            return { address, amount: parseFloat(amount) };
          }
          return null;
        })
        .filter((recipient) => recipient !== null)
    : [];
  const totalTokensToSend = parsedRecipients.reduce(
    (acc, current) => acc + current.amount,
    0
  );
  const handleRadioChange = (e) => {
    const amountType = e.target.id;
    const totalAmount = totalTokensToSend.toFixed(3);
    setAmountType(amountType);
    setTotalAmount(totalAmount);
  };
  return (
    <div className='flex flex-col mt-12 mb-10 w-[650px]  rounded   font-ans-serif'>
      <div className='flex justify-between w-full'>
      {tokenDetails && (
          <StatCard
            title={`${symbol ? symbol : 'TON'} Balance`}
            value={tokenBalance}
          />
        )}
        <StatCard title='Send Amount' value={totalTokensToSend.toFixed(3)} />
        <StatCard title='ETH balance' value={ethBalanceFormatted} />
      </div>
      <div className='mt-5 text-ans-serif'>
        <p className='flex justify-between text-gray-400'>Address List</p>
        <div className="scrollable">
        {parsedRecipients.length > 0 ? (
          parsedRecipients.map((recipient, index) => (
            <div key={index} className='flex justify-between'>
              <p className='text-[#007AFF] text-m'>{recipient.address}</p>
              <p className='text-blue text-bold'>
                {recipient.amount} {symbol ? symbol : 'TON'}
              </p>
            </div>
          ))
        ) : (
          <p>No recipients found</p>
        )}
        </div>
      </div>
      <div className='mt-10'>
        <div className='flex flex-row gap-4 mt-5 ml-4 text-ans-serif'>
          <input
            type='radio'
            id='exact-amount'
            name='amount-type'
            onChange={handleRadioChange}
          />
          <label htmlFor='exact-amount' className='text-gray-400  mr-8'>
            Approve Exact Amount
          </label>
          <input
            type='radio'
            id='unlimited-amount'
            name='amount-type'
            onChange={handleRadioChange}
          />
          <label htmlFor='unlimited-amount' className='text-gray-400'>
            Approve Unlimited Amount
          </label>
        </div>
      </div>
    </div>
  );
};

export default ApproveComponent;
