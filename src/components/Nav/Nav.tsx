import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import getCurrentNetwork from '../../hooks/getCurrentNetwork';
import { ConnectWallet } from '../Button/ConnectWallet';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="flex flex-col">
      <div className="bg-[#2775FF] py-2">
        <div className="container mx-auto flex justify-center items-center text-white">
          <div className="flex space-x-5">
            <a href="https://www.tokamak.network/#/" className="hover">
              Tokamak Network
            </a>
            <a href="https://titan.tokamak.network/" className="hover">
              L2 Mainnet
            </a>
            <a href="https://bridge.tokamak.network/#/" className="hover">
              Bridge & Swap
            </a>
            <a href="https://simple.staking.tokamak.network/home" className="hover">
              Staking
            </a>
            <a href="https://dao.tokamak.network/#/" className="hover">
              DAO
            </a>
            <a href="https://tonstarter.tokamak.network/" className="hover">
              Launchpad
            </a>
          </div>
        </div>
      </div>
      <div className="bg-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="https://www.tokamak.network/img/tokamak-symbol.42cbe8cc.svg"
              alt=""
              className="h-8 w-8 mr-2"
            />
            <h2 className="text-xl font-bold">Tokamak Multisender</h2>
          </div>
          <div className="cursor-pointer">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
