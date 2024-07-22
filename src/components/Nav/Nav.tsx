import { ConnectWallet } from '../Button/ConnectWallet';

const Navbar = () => {
  return (
    <nav className="flex flex-col font-titillium text-[15px] font-semibold leading-[1.53]">
      <div className="bg-[#2775FF] h-[45px]">
        <div className="container mx-auto flex justify-center items-center text-white">
          <div className="flex space-x-5 flex-wrap justify-center md:flex-nowrap">
            <a
              href="https://www.tokamak.network/#/"
              className="nav-item hover:bg-white hover:text-black transition duration-300 ease-in-out py-3 px-2"
            >
              Tokamak Network
            </a>
            <a
              href="https://titan.tokamak.network/"
              className="nav-item hover:bg-white hover:text-black transition duration-300 ease-in-out py-3 px-2"
            >
              L2 Mainnet
            </a>
            <a
              href="https://bridge.tokamak.network/#/"
              className="nav-item hover:bg-white hover:text-black transition duration-300 ease-in-out py-3 px-2"
            >
              Bridge & Swap
            </a>
            <a
              href="https://simple.staking.tokamak.network/home"
              className="nav-item hover:bg-white hover:text-black transition duration-300 ease-in-out py-3 px-2"
            >
              Staking
            </a>
            <a
              href="https://dao.tokamak.network/#/"
              className="nav-item hover:bg-white hover:text-black transition duration-300 ease-in-out py-3 px-2"
            >
              DAO
            </a>
            <a
              href="https://tonstarter.tokamak.network/"
              className="nav-item hover:bg-white hover:text-black transition duration-300 ease-in-out py-3 px-2"
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
          <div className="cursor-pointer md:ml-auto">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;