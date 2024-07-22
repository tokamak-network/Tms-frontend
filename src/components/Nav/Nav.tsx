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
      <div className="bg-[#2775FF]">
        <div className="container mx-auto flex justify-center items-center text-white font-semibold">
          <div className="flex space-x-5 text-bold">
            <a
              href="https://www.tokamak.network/#/"
              className="nav-item hover:bg-white hover:text-black transition duration-300 ease-in-out py-2 px-1"
            >
              Tokamak Network
            </a>
            <a
              href="https://titan.tokamak.network/"
              className="nav-item hover:bg-white hover:text-black transition duration-300 ease-in-out py-2 px-1"
            >
              L2 Mainnet
            </a>
            <a
              href="https://bridge.tokamak.network/#/"
              className="nav-item hover:bg-white hover:text-black transition duration-300 ease-in-out py-2 px-1"
            >
              Bridge & Swap
            </a>
            <a
              href="https://simple.staking.tokamak.network/home"
              className="nav-item hover:bg-white hover:text-black transition duration-300 ease-in-out py-2 px-1"
            >
              Staking
            </a>
            <a
              href="https://dao.tokamak.network/#/"
              className="nav-item hover:bg-white hover:text-black transition duration-300 ease-in-out py-2 px-1"
            >
              DAO
            </a>
            <a
              href="https://tonstarter.tokamak.network/"
              className="nav-item hover:bg-white hover:text-black transition duration-300 ease-in-out py-2 px-1"
            >
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
