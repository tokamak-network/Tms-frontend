import React, { useState, ChangeEvent, useRef } from 'react';
import { isAddress } from '@ethersproject/address';
import axios from 'axios';
import ExampleCSV from '../cards/exampleCSV';
import UploadIcon from '../../../images/upload_icon.png';
import { useAccount } from 'wagmi';

interface Error {
  line: number;
  message: string;
}

interface CSVData {
  [key: string]: string;
}
interface CSVDataProps {
  setCSVData: React.Dispatch<React.SetStateAction<string | undefined>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  csvContent: string;
  setCsvContent: React.Dispatch<React.SetStateAction<string | undefined>>;
}
interface DynamicMessage {
  [key: string]: string;
}

const CSVUploader: React.FC<CSVDataProps> = ({
  setCSVData,
  showModal,
  setShowModal,
  setIsDropdownOpen,
  csvContent,
  setCsvContent
}) => {
  const [errors, setErrors] = useState<Error[]>([]);
  const [dynamicMessage, setDynamicMessage] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isExampleCSVOpen, setIsExampleCSVOpen] = useState(false);
  const account = useAccount().address;

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
          const csvData: CSVData = {};
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            const [address, amount] = line.split(',');
            if (address && amount) {
              csvData[address.trim()] = amount.trim();
            } else {
              console.error(`Error parsing line ${index + 1}: ${line}`);
            }
          });
          setCsvContent(content);
          if (validateCSV(content)) {
            setCSVData(JSON.stringify(csvData));
          } else {
            setCSVData('');
          }
          setUploadSuccess(true);
          setUploading(false);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;

    const csvData: CSVData = {};
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      const parts = line.split(',');
      if (parts.length === 2) {
        const [address, amount] = parts;
        csvData[address.trim()] = amount.trim();
      } else {
        console.error(`Invalid line at index ${index}: ${line}`);
      }
    });
    setCsvContent(content);
    if (validateCSV(content)) {
      setCSVData(JSON.stringify(csvData));
    } else {
      setCSVData('');
    }
  };
  const openExampleCSV = () => {
    setIsExampleCSVOpen(!isExampleCSVOpen);
  };

  const handleUrlUpload = async () => {
    if (!fileUrl) return;

    setUploadProgress(0);
    setUploadSuccess(false);
    setUploading(true);
    setErrorMessage('');

    try {
      const response = await axios.get(fileUrl);

      if (response.status !== 200) {
        throw new Error('Failed to fetch the CSV file. Network response was not ok');
      }

      const content = response.data; // Get response data directly

      setCsvContent(content);
      if (validateCSV(content)) {
        setCSVData(content);
        simulateProgress();
        setUploadSuccess(true);
      } else {
        setCSVData('');
      }
    } catch (error) {
      console.error('Error fetching the CSV file:', error);
      setErrorMessage('Failed to fetch the CSV file. Please check the URL and try again.');
    } finally {
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
    if (!content.trim()) {
      setErrors([]);
      setDynamicMessage('');
      return false;
    }
    const lines = content.split('\n');
    const newErrors: Error[] = [];
    const uniqueErrorLines = new Set<number>();
    const addressCountMap: Record<string, number> = {};

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine === '') {
        return;
      }
      const columns = trimmedLine.split(',');

      if (columns.length > 2) {
        newErrors.push({
          line: index + 1,
          message: 'Too many columns'
        });
        uniqueErrorLines.add(index + 1);
      } else if (columns.length < 2) {
        if (!columns[0].trim()) {
          newErrors.push({
            line: index + 1,
            message: 'No address provided'
          });
        } else {
          newErrors.push({
            line: index + 1,
            message: 'No amount given. Add amount with a comma after the address'
          });
        }
        uniqueErrorLines.add(index + 1);
      } else {
        const [address, amount] = columns;
        const trimmedAddress = address.trim();
        const trimmedAmount = amount.trim();

        if (!trimmedAddress) {
          newErrors.push({
            line: index + 1,
            message: 'No address given. Add address with a comma before the amount'
          });
          uniqueErrorLines.add(index + 1);
        } else {
          if (trimmedAddress === account) {
            newErrors.push({
              line: index + 1,
              message: 'Cannot use your own account address'
            });
            uniqueErrorLines.add(index + 1);
          }

          if (
            !isAddress(trimmedAddress) ||
            trimmedAddress === '0x0000000000000000000000000000000000000000'
          ) {
            let errorMessage = 'Invalid address format';
            if (trimmedAddress === '0x0000000000000000000000000000000000000000') {
              errorMessage = 'Dead or zero address is not allowed';
            }
            newErrors.push({
              line: index + 1,
              message: errorMessage
            });
            uniqueErrorLines.add(index + 1);
          } else {
            addressCountMap[trimmedAddress] = (addressCountMap[trimmedAddress] || 0) + 1;
          }
        }

        if (!trimmedAmount) {
          newErrors.push({
            line: index + 1,
            message: 'No amount given. Add amount with a comma after the address'
          });
          uniqueErrorLines.add(index + 1);
        } else {
          const parsedAmount = parseFloat(trimmedAmount);
          if (isNaN(parsedAmount) || parsedAmount <= 0 || !/^\d*\.?\d+$/.test(trimmedAmount)) {
            newErrors.push({
              line: index + 1,
              message: 'Invalid amount. Must be a positive number'
            });
            uniqueErrorLines.add(index + 1);
          }
        }
      }
    });

    Object.keys(addressCountMap).forEach((address) => {
      if (addressCountMap[address] > 1) {
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const columns = line.split(',');
          if (columns[0].trim() === address) {
            newErrors.push({
              line: i + 1,
              message: `Duplicate address: ${address}. Use unique addresses`
            });
            uniqueErrorLines.add(i + 1);
          }
        }
      }
    });

    setErrors(newErrors);

    const uniqueErrorLinesArray = Array.from(uniqueErrorLines);
    const dynamicMessage =
      uniqueErrorLinesArray.length > 0 ? "(Click 'CSV Example' for more details.)" : '';

    setDynamicMessage(dynamicMessage);
    return newErrors.length === 0;
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      // Create a synthetic event
      const syntheticEvent = {
        target: { files: [file] }
      } as unknown as ChangeEvent<HTMLInputElement>;
      handleFileUpload(syntheticEvent);
    }
  };

  const handleUpload = () => {
    setUploading(false);
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploading(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUploadSuccess(false);
    setFileUrl('');
  };
  return (
    <div className="flex flex-col py-1 mt-1.5 font-quicksand text-xs border-color-red leading-4 max-w-full">
      {isExampleCSVOpen && <ExampleCSV setIsExampleCSVOpen={setIsExampleCSVOpen} />}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <div className="text-lg mb-4">Upload CSV</div>
            <div
              className={`border-dashed border-2 border-gray-400 p-6 rounded mb-4 text-center ${
                uploading ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <div>
                  <div className="mb-2">{uploadProgress}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div>Uploading file...</div>
                  <button
                    onClick={handleUpload}
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="text-center font-quicksand my-2">
                  <img
                    loading="lazy"
                    src={UploadIcon.src}
                    className="w-10 mx-auto"
                    alt="upload_icon"
                  />
                  <p className="font-bold my-2 text-base">Click to Upload CSV</p>
                  <p className="text-sm">or drag and drop it here</p>
                </div>
              )}
            </div>
            {/* <div className="text-center mb-4 text-base">Or upload from URL</div> */}
            {/* <div className="flex mb-4">
              <input
                type="text"
                placeholder="Add file URL"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="flex-grow p-2 border border-gray-400 rounded-l text-sm"
                disabled={uploading}
              />
              <button
                onClick={handleUrlUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded-r text-sm"
                disabled={uploading}
              >
                Upload
              </button>
            </div> */}
            {errorMessage && <div className="text-red-500 mb-4 text-sm">{errorMessage}</div>}
            {uploadSuccess && (
              <div className="text-green-500 mb-4 text-sm">CSV uploaded successfully!</div>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-4 mt-2 font-quicksand text-grey-300 text-sm">
        <p>Address List, Amount (comma seperated)</p>
        <span
          onClick={() => {
            setIsDropdownOpen(false);
            openExampleCSV();
            // Close the dropdown when opening the modal
          }}
          className="text-blue-500 font-medium cursor-pointer"
        >
          CSV Example
        </span>
      </div>
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
            onChange={handleTextareaChange}
          />
        </div>
      </div>
      {errors.length > 0 && (
      <div
        className="mt-4 p-2 items-center bg-white text-red-800 rounded space-y-2 text-sm"
        style={{ maxHeight: '150px', overflowY: 'auto' }}
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
