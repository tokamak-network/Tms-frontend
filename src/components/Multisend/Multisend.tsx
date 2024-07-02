import * as React from 'react';
import { useState } from 'react';
import PrepareComponent from './Prepare';
import ApproveComponent from './Approve'; // Import the Approve component

export function Multisend() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [TokenDetails, setTokenDetails] = useState('');
  const [csvData, setCSVData] = useState(null);

  const handleNextClick = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  let buttonText;
  if (currentStep === 1) {
    buttonText = 'Continue';
  } else if (currentStep === 2) {
    buttonText = 'Approve';
  } else {
    buttonText = 'Next';
  }
  

  return (
    <div className='flex flex-col items-center px-20 pb-6 shadow-sm bg-white-950 max-md:px-5'>
      <div className='flex flex-col items-center w-full max-w-[900px] max-md:max-w-full'>
        <div className='flex items-center gap-5 max-w-full text-xs text-blue-400 whitespace-nowrap'>
          <div className='flex items-center gap-1.5 relative'>
            <span
              className={`flex justify-center items-center ${
                currentStep === 1 ? 'bg-green-500' : 'bg-indigo-900'
              } text-white w-6 h-6 rounded-full`}
            >
              1
            </span>
            <div className='text-sky-500'>Prepare</div>
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='w-full h-0.5 bg-gray-300 left-6 -z-10'></div>
            </div>
          </div>
          <div className='flex items-center gap-1.5 relative'>
            <span
              className={`flex justify-center items-center ${
                currentStep === 2 ? 'bg-green-500' : 'bg-indigo-900'
              } text-white w-6 h-6 border-2 border-green-500 rounded-full`}
            >
              2
            </span>
            <div className='text-sky-500'>Approve</div>
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='w-full h-0.5 bg-gray-300 left-6 -z-10'></div>
            </div>
          </div>
          <div className='flex items-center gap-1.5 relative'>
            <span
              className={`flex justify-center items-center ${
                currentStep === 3 ? 'bg-green-500' : 'bg-indigo-900'
              } text-white w-6 h-6 rounded-full`}
            >
              3
            </span>
            <div className='text-sky-500'>Multisend</div>
          </div>
        </div>

        {currentStep === 1 && (
          <PrepareComponent
            setTokenDetails={setTokenDetails}
            setCSVData={setCSVData}
          />
        )}
        {currentStep === 2 && (
          <ApproveComponent tokenDetails={TokenDetails} recipients={csvData} />
        )}
        {/* Add the component for step 3 when needed */}

        {currentStep < 3 && (
          <button
            onClick={handleNextClick}
            className='flex justify-center items-center px-16 py-4 mt-5 text-xs leading-4 text-white bg-sky-500 rounded max-md:px-5 max-md:max-w-full'
          >
            {buttonText}
          </button>
        )}
        <img
          loading='lazy'
          src='https://cdn.builder.io/api/v1/image/assets/TEMP/eb95dff023c303fc8a3dde54ed6e34ac9e9b8bac2e1dccbada16db2f9a671d5e?'
          className='self-end mt-20 aspect-square w-[38px] max-md:mt-10'
        />
      </div>
      <div className='flex gap-5 items-center mt-10 w-full text-xs leading-5 max-w-[1086px] max-md:flex-wrap max-md:mt-10 max-md:max-w-full'>
        <div className='flex-auto self-stretch my-auto text-blue-400'>
          MultiSender Addresses
        </div>
        <div className='self-stretch my-auto text-blue-400'>
          Version: badc437
        </div>
        <div className='flex gap-5 justify-between self-stretch text-base leading-7 whitespace-nowrap'>
          <div className='flex gap-5 items-start text-blue-400'>
            <div className='self-stretch'>M</div>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/b32beb228da098ef0eca80aaf9649fc30f55a34d7b0bdfb6f32bf4b6b5af8994?'
              className='shrink-0 w-4 aspect-square'
            />
            <img
              loading='lazy'
              srcSet='...'
              className='shrink-0 aspect-[1.19] w-[19px]'
            />
          </div>
          <div className='text-pink-400'>K</div>
        </div>
      </div>
    </div>
  );
}

export default Multisend;
