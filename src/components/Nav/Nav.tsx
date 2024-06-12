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
    <nav className='flex justify-between items-center p-4 bg-gray-800 text-white'>
      <div className='text-xl font-bold'>Multisender</div>
      <div className='flex items-center space-x-4'>
        <div className='relative'>
          <button className='focus:outline-none' onClick={toggleDropdown}>
            Products
          </button>
          {dropdownOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg'>
              <a href='#' className='block px-4 py-2 hover:bg-gray-200'>
                Product 1
              </a>
              <a href='#' className='block px-4 py-2 hover:bg-gray-200'>
                Product 2
              </a>
              <a href='#' className='block px-4 py-2 hover:bg-gray-200'>
                Product 3
              </a>
            </div>
          )}
        </div>
        <div className='cursor-pointer'>
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
