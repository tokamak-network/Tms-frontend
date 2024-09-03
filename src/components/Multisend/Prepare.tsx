import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import TokenDetails from '../TokenDetails/ERC20';
import contracts from '../../config/constants/contracts';
import getCurrentNetwork from '../../hooks/getCurrentNetwork';
import CSVUploader from './csvUploader';
import TONIcon from '../../../images/icons/TON.svg';
import TOSIcon from '../../../images/icons/TOS.svg';
import WETHIcon from '../../../images/icons/WETH.svg';
import ETHIcon from '../../../images/icons/ETH.svg';
import USDTIcon from '../../../images/icons/USDT.svg';
import USDCIcon from '../../../images/icons/USDC.svg';
import getTokenBalance from '../../hooks/getTokenBalance';
import getTokenSymbol from '../../hooks/getTokenSymbol';

interface TokenBalances {
  [key: string]: string;
}

interface Token {
  symbol: string;
  name: string;
  address: string;
  icon: { src: string };
}

interface TokenDetailsState {
  name: string | undefined;
  symbol: string | undefined;
  decimals: number | undefined;
  totalSupply: string | number | undefined;
  balanceOf: string | undefined;
  allowance: string | undefined;
}

interface PrepareComponentProps {
  setTokenDetails: React.Dispatch<React.SetStateAction<TokenDetailsState | undefined>>;
  setCSVData: React.Dispatch<React.SetStateAction<string | undefined>>;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setCsvContent: React.Dispatch<React.SetStateAction<string | undefined>>;
  csvContent: string | undefined;
  searchQuery: string | undefined;
  setSearchQuery: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const PrepareComponent: React.FC<PrepareComponentProps> = ({
  setTokenDetails,
  setCSVData,
  setToken,
  csvContent,
  setCsvContent,

  searchQuery,
  setSearchQuery
}) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showTokenDetails, setShowTokenDetails] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tokenBalances, setTokenBalances] = useState<TokenBalances>({});

  const account = useAccount().address;
  const chainId = getCurrentNetwork()?.chain.id;

  const tokens: Token[] = [
    { symbol: 'TON', name: 'Tokamak Network', address: contracts.ton[chainId], icon: TONIcon },
    { symbol: 'TOS', name: ' TONStarter', address: contracts.tos[chainId], icon: TOSIcon },
    { symbol: 'USDC', name: 'USD Coin', address: contracts.usdc[chainId], icon: USDCIcon },
    { symbol: 'USDT', name: 'Tether USD', address: contracts.usdt[chainId], icon: USDTIcon },
    { symbol: 'WETH', name: 'Wrapped Ether', address: contracts.weth[chainId], icon: WETHIcon },
    { symbol: 'ETH', name: 'Ethereum', address: ethers.ZeroAddress, icon: ETHIcon }
  ];

  useEffect(() => {
    const fetchBalances = async () => {
      const balances: TokenBalances = {};
      for (const token of tokens) {
        if (account && token.address) {
          const balance = await getTokenBalance(token.address as `0x${string}`, account);
          if (balance !== undefined) {
            balances[token.symbol] = balance;
          } else {
            balances[token.symbol] = '0';
          }
        }
      }
      setTokenBalances(balances);
    };

    if (account && chainId) {
      fetchBalances();
    }
  }, [account, chainId]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchQuery(input);

    let address;
    let text = input.toLowerCase() as keyof typeof contracts;

    if (contracts[text] && contracts[text][chainId]) {
      address = contracts[text][chainId];
    } else {
      try {
        let tokenName = await getTokenSymbol(input as `0x${string}`);
        setSearchQuery(tokenName);
      } catch (error) {}
      address = input;
    }
    setTokenAddress(address as string);
    setToken(address as string);

    if (!address) {
      setError('');
      setShowTokenDetails(false);
    } else if (!ethers.isAddress(address)) {
      setError('Invalid address');
      setShowTokenDetails(false);
    } else {
      setError('');
      setShowTokenDetails(true);
    }
  };

  const handleTokenSelect = (token: Token) => {
    setTokenAddress(token.address);
    setToken(token.address);
    setSearchQuery(token.symbol);
    setIsDropdownOpen(false);
    setShowTokenDetails(true);
    setError('');
  };

  return (
    <div className="flex flex-col mt-10 max-w-full rounded shadow-sm bg-white w-full md:w-[650px] font-sans px-4 md:px-0">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 font-sans-serif">
          <div className="relative w-full md:w-[440px]">
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 border border-solid border-zinc-400 h-10 rounded-full">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/4792370c216477454484b83d83d4e4aaae409419cf9974d042cb7489c6fefe2e?"
                className="shrink-0 aspect-square w-6"
                alt="token"
              />
              <input
                type="text"
                placeholder="Search token name or address"
                className="flex-grow bg-transparent text-gray-600 placeholder-gray-600 focus:outline-none font-normal text-base leading-[21px] pl-2"
                value={searchQuery}
                onChange={handleInputChange}
              />
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="ml-2 focus:outline-none"
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {tokens.map((token, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleTokenSelect(token)}
                  >
                    <div className="flex items-center">
                      <img src={token.icon.src} alt={token.symbol} className="w-6 h-6 mr-2" />
                      <span className="font-medium">{token.symbol}</span>
                      <span className="text-gray-500 ml-2 text-sm">{token.name}</span>
                    </div>
                    <span className="text-gray-700">
                      {Number(
                        Math.floor(Number(tokenBalances[token.symbol] || 0) * 100) / 100
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setShowModal(true);
              setIsDropdownOpen(false);
            }}
            className="bg-gray-200 text-center text-black rounded-full py-2 px-6 hover:bg-gray-300 transition duration-300 w-full md:w-auto"
          >
            Upload CSV
          </button>
        </div>

        {error && <div className="mt-2 text-xs text-red-500">{error}</div>}
        {showTokenDetails && account && (
          <div className="modal relative ">
            <div className="modal-content ">
              {tokenAddress !== '0x0000000000000000000000000000000000000000' ? (
                <TokenDetails
                  tokenAddress={tokenAddress}
                  setTokenDetails={setTokenDetails}
                  setshowTokenDetails={setShowTokenDetails}
                />
              ) : (
                ''
              )}
            </div>
          </div>
        )}
      </div>

      <CSVUploader
        setCSVData={setCSVData}
        showModal={showModal}
        setShowModal={setShowModal}
        setIsDropdownOpen={setIsDropdownOpen}
        csvContent={csvContent || ''}
        setCsvContent={setCsvContent}
      />
    </div>
  );
};

export default PrepareComponent;
