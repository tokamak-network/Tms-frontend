import React, { useState } from 'react';

interface Props {
  setIsExampleCSVOpen: (isOpen: boolean) => void;
}

const ExampleCSV: React.FC<Props> = ({ setIsExampleCSVOpen }) => {
  const [showPopup, setShowPopup] = useState(true);
  const csvContent = `0xBC5A1E5833daC6Ce165c26f44c8b51284DF53391,1
0xDa9B006a2D6c39F69E447924994018C08e268f7a,13.45
0xfC8071D3BA8f18C8661fD068745389A9cF2D027F,1.04
0x867E273da32d3d213bb0779764d2CB621B0524d6,1 `;

  const handleClose = () => {
    setShowPopup(false);
    setIsExampleCSVOpen(false);
  };

  return (
    <div>
      {showPopup && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center"
          style={{ width: '100%' }}
        >
          <div className="bg-white p-6 rounded shadow-md w-[90%] lg:w-1/3 md:w-1/2 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={handleClose}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">Example CSV</h2>
            <div
              className={`container bg-white rounded-lg p-0 border border-gray-300 ${
                csvContent.split('\n').length > 7 ? 'always-scrollable' : ''
              }`}
            >
              <div className="flex">
                <div className="w-12 bg-[#F0F2F7] rounded-l-lg p-2">
                  <ul className="list-none m-0 p-0">
                    {[...Array(csvContent.split('\n').length).keys()].map((i) => (
                      <li
                        key={i + 1}
                        className="h-6 leading-10 text-center border-gray-300 text-gray-600 text-sm"
                      >
                        {i + 1}
                      </li>
                    ))}
                  </ul>
                </div>
                <textarea
                  className="w-full h-full p-4 text-sm lg:text-base font-normal text-gray-600 bg-white rounded-r-lg focus:outline-none text-nowrap "
                  style={{ lineHeight: '1.5rem' }}
                  rows={csvContent.split('\n').length > 6 ? csvContent.split('\n').length : 6}
                  value={csvContent}
                  readOnly
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
