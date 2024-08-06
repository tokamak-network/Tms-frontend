import React, { useState, useEffect } from 'react';
import getCurrentNetwork from '../../hooks/getCurrentNetwork';

interface Props {
  txnHash: string;
}

const SuccessCard: React.FC<Props> = ({ txnHash }) => {
  const [explorerUrl, setExplorerUrl] = useState('');

  useEffect(() => {
    async function fetchCurrentNetwork() {
      const currentNetwork = await getCurrentNetwork();
      const explorerUrl = currentNetwork.chain.blockExplorers.default.url;

      setExplorerUrl(explorerUrl);
    }
    fetchCurrentNetwork();
  }, [txnHash]);

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

  return (
    <div className="flex flex-col mt-10 max-w-full sm:max-w-65 rounded w-full px-4 sm:px-0">
      <div className="h-full w-full rounded-md mx-auto my-10 p-5 text-center">
        <h1 className="text-xl font-poppins font-bold p-3 flex justify-center">SUCCESS!</h1>
        <p className="text-base mb-4">
          View transaction on{' '}
          <a 
            className="text-blue-600 hover:underline"
            href={`${explorerUrl}/tx/${txnHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Titan Explorer
          </a>
        </p>
        <p className="text-base mb-4 break-words">
        <a 
            className="text-blue-600 hover:underline"
            href={`${explorerUrl}/tx/${txnHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="hidden sm:inline">{txnHash}</span>
            <span className="inline sm:hidden">{truncateHash(txnHash)}</span>
          </a>
        </p>
      </div>
    </div>
  );
};

export default SuccessCard;