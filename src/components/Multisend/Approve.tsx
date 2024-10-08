import React, { useEffect, useState } from 'react';
import { useBalance, useAccount } from 'wagmi';
import { ethers } from 'ethers';
import TONIcon from '../../../images/icons/TON.svg';
import TOSIcon from '../../../images/icons/TOS.svg';
import WETHIcon from '../../../images/icons/WETH.svg';
import USDTIcon from '../../../images/icons/USDT.svg';
import USDCIcon from '../../../images/icons/USDC.svg';
import ETHIcon from '../../../images/icons/ETH.svg';
import getERC20ContractDetails from '../../hooks/getTokenDetails';

interface Props {
  title: string;
  value: number | any;
  icon: any;
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
  buttonText: string;
}
const getTokenIcon = (symbol: string): string | null => {
  const iconMap: { [key: string]: string } = {
    TON: TONIcon.src,
    TOS: TOSIcon.src,
    WETH: WETHIcon.src,
    USDT: USDTIcon.src,
    USDC: USDCIcon.src,
    ETH: ETHIcon.src
  };

  return iconMap[symbol] || null;
};

const StatCard: React.FC<Props> = ({ title, value, icon = '' }) => (
  <div className="h-10 rounded-md flex flex-col items-start justify-center">
    <div className="flex items-center">
      {icon && (
        <img
          src={icon}
          alt=""
          className="mr-2 w-4 h-4"
          onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
        />
      )}
      <h1 className="text-xs text-gray-400">{title}</h1>
    </div>
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
  buttonText
}) => {
  const [currentAllowance, setAllowance] = useState<any | undefined>('');
  const account = useAccount().address;
  let totalTokensToSend = 0;
  const ethBalance = useBalance({ address: account }).data?.value;

  const ethBalanceFormatted = ethBalance
    ? Number(
        Math.floor(Number(parseFloat(ethers.formatEther(BigInt(ethBalance)))) * 1000) / 1000
      ).toFixed(3)
    : '0';

  const symbol = tokenDetails ? tokenDetails.symbol : null;
  const allowance = tokenDetails ? parseInt(tokenDetails.allowance) : null;

  useEffect(() => {
    if (account && tokenAddress) {
      updateAllowance();
    }
  }, [account, tokenAddress]);

  const updateAllowance = async () => {
    if (tokenAddress !== ethers.ZeroAddress) {
      const data = await getERC20ContractDetails(
        tokenAddress as `0x${string}`,
        account as `0x${string}`
      );
      setAllowance(data.allowance);
    }
  };

  const parsedRecipients = recipients
    ? Object.entries(JSON.parse(recipients)).map(([address, amount]) => ({
        address,
        amount: parseFloat(amount as string)
      }))
    : [];

  if (parsedRecipients.length > 0) {
    totalTokensToSend = parsedRecipients.reduce((acc, current) => acc + current.amount, 0);
  }

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
  };

  const trimAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="lg:w-[650px] xl:[650px] md:w-3/4 w-[85%] flex flex-col mt-12 mb-10 rounded font-sans-serif">
      <div className="flex justify-between w-full">
        {tokenDetails && (
          <StatCard
            title={`${symbol ? symbol : 'ETH'} Balance`}
            value={
              tokenBalance ? Number(Math.floor(Number(tokenBalance) * 100) / 100).toFixed(2) : 0
            }
            icon={symbol ? getTokenIcon(symbol) : ''}
          />
        )}
        <StatCard
          title="Send Amount"
          value={Number(Math.floor(Number(totalTokensToSend) * 1000) / 1000).toFixed(3)}
          icon={null}
        />
        <StatCard title="ETH balance" value={ethBalanceFormatted} icon={ETHIcon.src} />
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
                  {`${symbol ? (symbol === 'ETH' || symbol === 'WETH' ? Number(Math.floor(Number(recipient.amount) * 1000) / 1000).toFixed(3) : Number(Math.floor(Number(recipient.amount) * 100) / 100).toFixed(2)) : Number(Math.floor(Number(recipient.amount) * 1000) / 1000).toFixed(3)} `}
                  {symbol ? symbol : 'ETH'}
                </p>
              </div>
            ))
          ) : (
            <p>No recipients found</p>
          )}
        </div>
      </div>
      {tokenAddress !== ethers.ZeroAddress &&
        currentAllowance < totalTokensToSend &&
        buttonText === 'Approve' && (
          <div className="mt-10">
            <div className="flex flex-row gap-4 mt-5 ml-4 text-sans-serif">
              <input
                type="radio"
                id="exact-amount"
                name="amount-type"
                onChange={handleRadioChange}
              />
              <label htmlFor="exact-amount" className="text-gray-400">
                Approve Exact Amount
              </label>
              <input
                type="radio"
                id="unlimited-amount"
                name="amount-type"
                onChange={handleRadioChange}
              />
              <label htmlFor="unlimited-amount" className="text-gray-400">
                Approve Max Amount
              </label>
            </div>
          </div>
        )}
    </div>
  );
};

export default ApproveComponent;
