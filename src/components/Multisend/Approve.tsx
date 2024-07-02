import React from 'react';
import { useBalance, useAccount } from 'wagmi';
import { ethers } from 'ethers';

const StatCard = ({ title, value, bgColor = '', textColor = 'text-black' }) => (
  <div
    className={`h-20 w-80 border border-gray-500 ${bgColor} rounded-md flex flex-col items-center justify-center`}
  >
    <h1 className={`font-bold text-3xl ${textColor}`}>{value}</h1>
    <h1 className='text-base'>{title}</h1>
  </div>
);

const ApproveComponent = ({ tokenBalance, tokenDetails, recipients }) => {
  const account = useAccount().address;
  const ethBalance = useBalance({ address: account }).data?.value;
  const ethBalanceFormatted = parseFloat(
    ethers.formatEther(BigInt(ethBalance))
  ).toFixed(3);

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

  return (
    <div className='flex flex-col px-5 py-6 mt-5 max-w-65 rounded shadow-sm  w-full '>
      <div className='h-full w-full  border border-grey-950 rounded-md '>
        <div className='h-full w-full border border-gray-500  rounded-md mx-auto my-10 p-5'>
          <div className='flex justify-center gap-5 mt-5'>
            <StatCard
              title='Total number of tokens to send'
              value={totalTokensToSend.toFixed(3)}
            />
            {tokenDetails && (
              <StatCard title='Your token balance' value={tokenBalance} />
            )}
            <StatCard title='Your ETH balance' value={ethBalanceFormatted} />
          </div>
          <div className=' mt-5 ml-2'>
            <h1 className='text-black text-xl font-bold p-3 flex justify-between'>
              Addresses List
              <span className='text-blue text-xl'>Amounts</span>
            </h1>
            {parsedRecipients.length > 0 ? (
              parsedRecipients.map((recipient, index) => (
                <div key={index} className='flex justify-between p-3'>
                  <h1 className='text-blue-800 text-xl'>{recipient.address}</h1>
                  <h1 className='text-blue text-xl'>
                    {recipient.amount} {symbol ? symbol : 'TON'}
                  </h1>
                </div>
              ))
            ) : (
              <p>No recipients found</p>
            )}
          </div>
          <div className='mt-10'>
            <h1 className='text-xl font-bold text-white ml-3'>
              Amount to approve
            </h1>
            <div className='flex flex-row gap-4 mt-5 ml-4'>
              <input type='radio' id='exact-amount' name='amount-type' />
              <label htmlFor='exact-amount' className='text-grey text-xl mr-8'>
                Approve Exact Amount
              </label>
              <input type='radio' id='unlimited-amount' name='amount-type' />
              <label htmlFor='unlimited-amount' className='text-grey text-xl'>
                Approve Unlimited Amount
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveComponent;
