import { useState } from 'react';
import { ConnectWallet } from '../Button/ConnectWallet';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { href: 'https://www.tokamak.network/#/', text: 'Tokamak Network' },
    { href: 'https://titan.tokamak.network/', text: 'L2 Mainnet' },
    { href: 'https://bridge.tokamak.network/#/', text: 'Bridge & Swap' },
    { href: 'https://simple.staking.tokamak.network/home', text: 'Staking' },
    { href: 'https://dao.tokamak.network/#/', text: 'DAO' },
    { href: 'https://tonstarter.tokamak.network/', text: 'Launchpad' }
  ];

  return (
    <nav className="font-titillium text-[15px] font-semibold leading-[1.53]">
      {/* Top blue bar - hidden on mobile */}
      <div className="bg-[#2775FF] h-[45px] hidden md:block">
        <div className="container mx-auto flex justify-center items-center text-white">
          <div className="flex space-x-5 flex-wrap justify-center md:flex-nowrap">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="nav-item hover:bg-white hover:text-black transition duration-300 ease-in-out py-3 px-2"
              >
                {item.text}
              </a>
            ))}
          </div>
        </div>
      </div>


      <div className="bg-white lg:py-2 mt-4 mb-4">
        <div className="container mx-4 md:mx-4 lg:mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="https://www.tokamak.network/img/tokamak-symbol.42cbe8cc.svg"
              alt=""
              className="h-8 w-8 mr-2"
            />
            <h2 className="text-xl font-bold">Tokamak Multisender</h2>
          </div>
          <div className="cursor-pointer md:ml-auto hidden md:block">
            <ConnectWallet />
          </div>
        
          <div className="md:hidden">
            <button onClick={toggleSidebar} className="p-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50 md:hidden`}
      >
        <div className="p-4">
          <button onClick={toggleSidebar} className="mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex flex-col space-y-4">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="nav-item hover:bg-gray-100 transition duration-300 ease-in-out py-2 px-4"
              >
                {item.text}
              </a>
            ))}
            <div className="mt-4">
              <ConnectWallet />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
