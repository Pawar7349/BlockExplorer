import React, { useState } from 'react';
import block from './Images/blockchain.png';
import invoices from './Images/invoices.png';
import LoadingAnimation from './LoadingAnimation';
import { useMyContext } from '../MyContext';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const { loading, loading2, blockdeatils, transactionDetails } = useMyContext();
  const [error, setError] = useState(false);
  const [searcOption, setSearchOption] = useState('');
  const [input, setInput] = useState();
  const navigate = useNavigate();

  const handleClick = () => {
    if (
      (searcOption === 'block' && input !== '' && input.length !== 66) ||
      (searcOption === 'blockhash' && input.length === 66) ||
      (searcOption === 'address' && input.length === 42) ||
      (searcOption === 'trx' && input.length === 66)
    ) {
      if (searcOption === 'block' || searcOption === 'blockhash') {
        navigate(`/block/${input}`);
      } else if (searcOption === 'address') {
        navigate(`/address/${input}`);
      } else if (searcOption === 'trx') {
        navigate(`/transaction/${input}`);
      }
    } else {
      setError(true);
    }
  };

  return (
    <>
      {error ? (
        <div className="w-full max-w-lg mx-auto mt-10 p-4 bg-red-100 rounded-md flex justify-center items-center">
          <h1 className="text-xl font-semibold text-red-500">Invalid Request...</h1>
          <button
            onClick={() => setError(false)}
            className="ml-4 text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Search Bar Section */}
          <div className="w-full flex flex-col sm:flex-row gap-4 justify-between items-center p-4 bg-neutral-800 rounded-lg shadow-md mx-auto mb-6">
            <select
              onChange={(e) => setSearchOption(e.target.value)}
              className="p-2 rounded-md bg-gray-700 text-white w-full sm:w-1/4 focus:outline-none"
            >
              <option disabled selected>
                Choose A Search Option
              </option>
              <option value="block">Block Number</option>
              <option value="blockhash">Blockhash</option>
              <option value="address">Address</option>
              <option value="trx">Transaction</option>
            </select>

            <input
              className="w-full sm:w-2/3 h-12 p-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:outline-none"
              placeholder="Search by Block Number/Blockhash/Transaction Hash/Address..."
              type="text"
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              onClick={handleClick}
              className="mt-2 sm:mt-0 text-white bg-amber-500 rounded-md px-4 py-2 hover:bg-amber-600"
            >
              Search
            </button>
          </div>

     {/* Blocks and Transactions Overview */}
<div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
  {/* Block Overview */}
  <div className="bg-neutral-900 text-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold text-center border-b border-gray-700 pb-3 mb-4">
      Last 10 Mined Blocks
    </h2>

    {loading ? (
      <div className="flex justify-center">
        <LoadingAnimation />
      </div>
    ) : (
      blockdeatils.map((el, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 border-b border-gray-800 last:border-none"
        >
          <div className="w-14 h-14 bg-gray-800 flex items-center justify-center rounded-full">
            <img src={block} alt="Blockchain Icon" className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-400">Block No:</p>
            <Link
              to={`/block/${el?.blocknum}`}
              className="text-lg font-medium text-amber-400 hover:text-amber-500"
            >
              {el?.blocknum}
            </Link>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Gas Fee:</p>
            <p className="text-lg font-medium text-green-400">{el?.basgasFee} ETH</p>
          </div>
        </div>
      ))
    )}
  </div>

{/* Transaction Overview */}
<div className="bg-neutral-900 text-white rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-bold text-center border-b border-gray-700 pb-3 mb-4">
    Recent 10 Transactions
  </h2>

  {loading2 ? (
    <div className="flex justify-center">
      <LoadingAnimation />
    </div>
  ) : (
    transactionDetails.map((el, i) => (
      <div
        key={i}
        className="flex items-center justify-between p-4 border-b border-gray-800 last:border-none"
      >
        {/* Transaction Icon */}
        <div className="w-14 h-14 bg-gray-800 flex items-center justify-center rounded-full">
          <img src={invoices} alt="Transaction Icon" className="w-8 h-8" />
        </div>

        {/* Transaction Hash */}
        <div className="flex-1 mx-4">
          <p className="text-sm text-gray-400">Transaction Hash:</p>
          <Link
            to={`/transaction/${el?.trans}`}
            className="text-lg font-medium text-amber-400 hover:text-amber-500 truncate"
            style={{
              display: 'inline-block',
              maxWidth: '250px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
            title={el?.trans}
          >
            {el?.trans}
          </Link>
        </div>

        {/* From and To Addresses */}
        <div className="flex flex-col text-right">
          <Link
            to={`/address/${el?.from}`}
            className="truncate"
            style={{
              color: '#4da8da', // Lighter blue
              display: 'inline-block',
              maxWidth: '200px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
            title={el?.from}
          >
            From: {el?.from}
          </Link>
          <Link
            to={`/address/${el?.to}`}
            className="truncate"
            style={{
              color: '#4caf50', // Soft green
              display: 'inline-block',
              maxWidth: '200px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
            title={el?.to}
          >
            To: {el?.to}
          </Link>
        </div>
      </div>
    ))
  )}
</div>



</div>

        </>
      )}
    </>
  );
};

export default Home;

