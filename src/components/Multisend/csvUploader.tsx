import React, { useState, ChangeEvent, useRef } from 'react';
import { isAddress } from '@ethersproject/address';

interface Error {
  line: number;
  message: string;
}

const CSVUploader: React.FC = ({ setCSVData, showModal, setShowModal }) => {
  const [csvContent, setCsvContent] = useState<string>('');
  const [errors, setErrors] = useState<Error[]>([]);
  const [dynamicMessage, setDynamicMessage] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      setShowModal(true);
      const reader = new FileReader();
      reader.onprogress = (e: ProgressEvent<FileReader>) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      };
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target) {
          const content = e.target.result as string;
          setCsvContent(content);
          validateCSV(content);
          setCSVData(content);
          setUploadSuccess(true);
          setUploading(false);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    setCsvContent(content);
    validateCSV(content);
    setCSVData(content);
  };

  const handleUrlUpload = async () => {
    if (!fileUrl) return;

    setUploadProgress(0);
    setUploadSuccess(false);
    setUploading(true);
    setErrorMessage('');

    try {
      const response = await fetch(fileUrl, {
        mode: 'no-cors', // Add this line
      });
      if (!response.ok) {
        console.log(response);

        throw new Error('Network response was not ok');
      }
      console.log(response);

      const content = await response.text();
      setCsvContent(content);
      validateCSV(content);
      setCSVData(content);
      simulateProgress();
    } catch (error) {
      console.error('Error fetching the CSV file:', error);
      setErrorMessage(
        'Failed to fetch the CSV file. Please check the URL and try again.'
      );
      setUploading(false);
    }
  };

  const simulateProgress = () => {
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setUploadSuccess(true);
          setUploading(false);
        }
        return newProgress;
      });
    }, 200);
  };

  const validateCSV = (content: string) => {
    const lines = content.split('\n');
    const newErrors: Error[] = [];
    const uniqueErrorLines = new Set<number>();

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine === '') {
        return;
      }
      const columns = trimmedLine.split(',');

      if (columns.length !== 2) {
        newErrors.push({
          line: index + 1,
          message: 'Too many columns within the line',
        });
      } else {
        const [address, amount] = columns;
        if (!isAddress(address.trim())) {
          newErrors.push({
            line: index + 1,
            message: 'Invalid Ethereum address',
          });
          uniqueErrorLines.add(index + 1);
        }
        if (
          isNaN(parseFloat(amount.trim())) ||
          parseFloat(amount.trim()) <= 0
        ) {
          newErrors.push({ line: index + 1, message: 'Wrong amount' });
          uniqueErrorLines.add(index + 1);
        }
        if (
          !address.trim() &&
          !isNaN(parseFloat(amount.trim())) &&
          parseFloat(amount.trim()) > 0
        ) {
          newErrors.push({
            line: index + 1,
            message: 'Both address and amount are incorrect',
          });
          uniqueErrorLines.add(index + 1);
        }
      }
    });

    setErrors(newErrors);

    const uniqueErrorLinesArray = Array.from(uniqueErrorLines);
    const dynamicMessage =
      uniqueErrorLinesArray.length > 0
        ? `Line ${uniqueErrorLinesArray.join(
            ', '
          )}: Please provide a corresponding amount for each address. Click 'Show Sample CSV' for more details.`
        : '';

    setDynamicMessage(dynamicMessage);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload({
        target: { files: [file] },
      } as ChangeEvent<HTMLInputElement>);
    }
  };
  const handleUpload = (event: React.DragEvent<HTMLDivElement>) => {
    setUploading(false);
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploading(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFileUrl('');
  };

  return (
    <div className='flex flex-col py-1 mt-1.5 text-xs border-color-red leading-4 text-sky-500 max-md:max-w-full '>
      {showModal && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center'>
          <div className='bg-white p-6 rounded shadow-md w-1/3 relative'>
            <button
              className='absolute top-2 right-2 text-gray-500 hover:text-gray-800'
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <div className='text-lg mb-4'>Upload CSV</div>
            <div
              className={`border-dashed border-2 border-gray-400 p-6 rounded mb-4 text-center ${
                uploading ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              <input
                type='file'
                accept='.csv'
                onChange={handleFileUpload}
                ref={fileInputRef}
                className='hidden'
                disabled={uploading}
              />
              {uploading ? (
                <div>
                  <div className='mb-2'>{uploadProgress}%</div>
                  <div className='w-full bg-gray-200 rounded-full h-2.5 mb-4'>
                    <div
                      className='bg-blue-600 h-2.5 rounded-full'
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div>Uploading file...</div>
                  <button
                    onClick={handleUpload}
                    className='mt-2 bg-red-500 text-white px-4 py-2 rounded'
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p>Select a CSV file to upload or drag and drop it here</p>
              )}
            </div>
            <div className='text-center mb-4'>Or upload from URL</div>
            <div className='flex mb-4'>
              <input
                type='text'
                placeholder='Add file URL'
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className='flex-grow p-2 border border-gray-400 rounded-l'
                disabled={uploading}
              />
              <button
                onClick={handleUrlUpload}
                className='bg-blue-500 text-white px-4 py-2 rounded-r'
                disabled={uploading}
              >
                Upload
              </button>
            </div>
            {errorMessage && (
              <div className='text-red-500 mb-4'>{errorMessage}</div>
            )}
            {uploadSuccess && (
              <div className='text-green-500 mb-4'>
                CSV uploaded successfully!
              </div>
            )}
          </div>
        </div>
      )}
      <div className='flex items-center justify-between mb-4 mt-2'>
        <p className=''>Address List</p>
        <span className='text-blue-500 font-medium cursor-pointer'>
          CSV Example
        </span>
      </div>

      <div className='container h-400 w-800 bg-white rounded-lg p-0 border border-gray-300'>
        <div className='flex h-full'>
          <div className='w-12 bg-[#F0F2F7] rounded-l-lg p-2'>
            <ul className='list-none m-0 p-0'>
              {[...Array(csvContent.split('\n').length).keys()].map((i) => (
                <li
                  key={i + 1}
                  className='h-6 leading-10 text-center border-gray-300 text-gray-600 text-sm'
                >
                  {i + 1}
                </li>
              ))}
            </ul>
          </div>
          <textarea
            className='w-full h-full p-4 text-base font-normal text-gray-600  bg-white rounded-r-lg focus:outline-none'
            rows={
              csvContent.split('\n').length > 6
                ? csvContent.split('\n').length
                : 6
            }
            value={csvContent}
            onChange={handleTextareaChange}
          />
        </div>
      </div>
      {errors.length > 0 && (
        <div
          className='mt-4 p-2 items-center bg-white text-red-800 rounded space-y-2'
          style={{ maxHeight: '200px', overflowY: 'auto' }}
        >
          {errors.map((error) => (
            <div key={error.line}>
              Line {error.line}: {error.message}
            </div>
          ))}
          {dynamicMessage && <div>{dynamicMessage}</div>}
        </div>
      )}
    </div>
  );
};

export default CSVUploader;
