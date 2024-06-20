import React, { useState, ChangeEvent } from 'react';
import { isAddress } from '@ethersproject/address';

interface Error {
  line: number;
  message: string;
}

const CSVUploader: React.FC = ({setCSVData}) => {
  const [csvContent, setCsvContent] = useState<string>('');
  const [errors, setErrors] = useState<Error[]>([]);
  const [dynamicMessage, setDynamicMessage] = useState<string>('');

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target) {
          const content = e.target.result as string;
          setCsvContent(content);
          validateCSV(content);
          setCSVData(content);
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

  const validateCSV = (content: string) => {
    const lines = content.split('\n');
    const newErrors: Error[] = [];
    const uniqueErrorLines = new Set<number>(); // Use a Set to track unique error line numbers

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
          uniqueErrorLines.add(index + 1); // Add line number to set
        }

        if (
          isNaN(parseFloat(amount.trim())) ||
          parseFloat(amount.trim()) <= 0
        ) {
          newErrors.push({ line: index + 1, message: 'Wrong amount' });
          uniqueErrorLines.add(index + 1); // Add line number to set
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
          uniqueErrorLines.add(index + 1); // Add line number to set
        }
      }
    });

    // Update errors state
    setErrors(newErrors);

    // Generate dynamic message without repetition
    const uniqueErrorLinesArray = Array.from(uniqueErrorLines); // Convert set to array for joining
    const dynamicMessage =
      uniqueErrorLinesArray.length > 0
        ? `Line ${uniqueErrorLinesArray.join(
            ', '
          )}: Please provide a corresponding amount for each address. Click 'Show Sample CSV' for more details.`
        : '';

    // Set dynamic message state
    setDynamicMessage(dynamicMessage);
  };

  const errorMessages = errors
    .map((error) => `Line ${error.line}: ${error.message}`)
    .join(', ');

  return (
    <div className='flex flex-col py-1 mt-1.5 text-xs leading-4 text-sky-500 rounded shadow-sm bg-indigo-950 max-md:max-w-full p-4'>
      <label htmlFor='csvUpload' className='flex gap-1 self-end px-1'>
        <div className='justify-center px-3.5 py-2 rounded bg-blue-950 cursor-pointer'>
          Upload CSV
        </div>
        <input
          id='csvUpload'
          type='file'
          accept='.csv'
          className='hidden'
          onChange={handleFileUpload}
        />
      </label>
      <textarea
        className='mt-4 p-2 rounded bg-indigo-900 text-white w-full'
        rows={10}
        placeholder='Or paste your CSV content here'
        value={csvContent}
        onChange={handleTextareaChange}
      />
      <div className='mt-6 text-xs leading-5 text-sky-500'>Show Sample CSV</div>
      {errors.length > 0 && (
        <div
          className='mt-4 p-2 bg-red-200 text-red-800 rounded space-y-2'
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
