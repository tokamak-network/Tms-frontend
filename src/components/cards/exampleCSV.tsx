import React, { useState } from 'react';

const ExampleCSV = ({setIsExampleCSVOpen}) => {
  const [showPopup, setShowPopup] = useState(true);
  const csvContent = `0x48a38c840DF7761D8b42BA233a3548b0daC3926E,1
pavlik.eth,12
0xC8c30Fa803833dD1Fd6DBCDd91Ed0b301EFf87cF,13.45
0x7D52422D3A5fE9bC92D3aE8167097eE09F1b347d,1.049
0x64c9525A3c3a65Ea88b06f184F074C2499578A7E,1 `;

  const handleClose = () => {
    setShowPopup(false);
    setIsExampleCSVOpen(false)
  };

  return (
    <div>
      {showPopup && (
        <div
          className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center'
          style={{ width: '100%' }}
        >
          <div className='bg-white p-6 rounded shadow-md w-1/3 relative'>
            <button
              className='absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl'
              onClick={handleClose}
            >
              &times;
            </button>
            <h2 className='text-lg font-bold mb-4'>Example CSV</h2>
            <div className='container h-400 w-800 bg-white rounded-lg p-0 border border-gray-300 '>
              <div className='flex h-full'>
                <div className='w-12 bg-[#F0F2F7] rounded-l-lg p-2'>
                  <ul className='list-none m-0 p-0'>
                    {[...Array(csvContent.split('\n').length).keys()].map(
                      (i) => (
                        <li
                          key={i + 1}
                          className='h-6 leading-10 text-center border-gray-300 text-gray-600 text-sm'
                        >
                          {i + 1}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <textarea
                  className='w-full h-full p-4 scroll-none text-base font-normal text-gray-600  bg-white rounded-r-lg focus:outline-none'
                  rows={
                    csvContent.split('\n').length > 6
                      ? csvContent.split('\n').length
                      : 6
                  }
                  defaultValue={csvContent}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExampleCSV;
