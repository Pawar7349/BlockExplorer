import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { alchemy } from '../server.js';
import Loading from './AddressSpinner.jsx';
import { Utils } from 'alchemy-sdk';

const Address = () => {
  const { add } = useParams();
  const address = add;

  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [error, setError] = useState(false);

  // Fetch transactions for the given address
  const getTransactions = useCallback(async (addr) => {
    try {
      const data = await alchemy.core.getAssetTransfers({
        fromBlock: '0x0',
        fromAddress: addr,
        excludeZeroValue: true,
        category: ['external', 'internal', 'erc20', 'erc721', 'erc1155', 'specialnft'],
        maxCount: Utils.hexlify(100),
      });
      setTransactions(data);
      setLoadingTransactions(false);
    } catch (err) {
      setLoadingTransactions(false);
      setError(true);
    }
  }, []);

  // Fetch balance for the given address
  const getBalance = useCallback(async (addr) => {
    try {
      const balance = await alchemy.core.getBalance(addr);
      setBalance(balance);
      setLoadingBalance(false);
    } catch (err) {
      setLoadingBalance(false);
      setError(true);
    }
  }, []);

  // Fetch balance and transactions on component mount or when `add` changes
  useEffect(() => {
    getBalance(add);
    getTransactions(add);
  }, [add, getTransactions, getBalance]);

  return (
    <>
      {/* Address Information Header */}
      <div className="w-4/5 h-20 flex flex-row items-center gap-2 bg-slate-100 shadow-l rounded-md m-4 p-4">
        <h1 className="font-medium font-serif text-xl">Account Details For</h1>
        <h1 className="font-serif text-xl text-gray-600">{address}</h1>
      </div>

      {/* Balance Card */}
      <div className="w-52 h-40 bg-slate-50 shadow-xl rounded-md flex flex-col items-start gap-2 p-6 m-4">
        <h1>Current Account Balance</h1>
        {loadingBalance ? (
          <Loading />
        ) : error ? (
          <h1>Invalid Address</h1>
        ) : (
          <h1>{(parseInt(balance._hex, 16) / 10 ** 18).toFixed(4)} ETH</h1>
        )}
      </div>

      {/* Transactions Header */}
      <div className="flex flex-row items-center justify-center">
        <h1 className="font-bold text-2xl">Last 100 Transactions History</h1>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-50 shadow-xl rounded-md m-4 flex flex-col gap-2 p-1 items-center">
        {/* Table Header */}
        <div className="w-11/12 flex flex-row p-1 items-center justify-between">
          {['Txn Hash', 'Category', 'Block', 'From', 'To', 'Value', 'Asset'].map((header) => (
            <h1 key={header} className="font-mono font-bold w-20">
              {header}
            </h1>
          ))}
        </div>

        {/* Transactions Data */}
        {loadingTransactions ? (
          <Loading />
        ) : error ? (
          <h1>Invalid Address</h1>
        ) : (
          transactions.transfers?.map((tx) => (
            <div key={tx.hash} className="w-11/12 flex flex-row p-1 items-center justify-between">
              <Link to={`/transaction/${tx.hash}`} className="font-mono text-blue-400 hover:text-blue-700 font-bold w-20 truncate">
                {tx.hash}
              </Link>
              <h1 className="font-mono font-bold w-20">{tx.category ?? 'N/A'}</h1>
              <Link to={`/block/${tx.blockNum}`} className="font-mono text-blue-400 hover:text-blue-700 font-bold w-20">
                {parseInt(tx.blockNum)}
              </Link>
              <Link to={`/address/${tx.from}`} className="font-mono text-blue-400 hover:text-blue-700 font-bold w-20 truncate">
                {tx.from}
              </Link>
              <Link to={`/address/${tx.to}`} className="font-mono text-blue-400 hover:text-blue-700 font-bold w-20 truncate">
                {tx.to}
              </Link>
              <h1 className="font-mono font-bold w-20 truncate">{tx.value}</h1>
              <h1 className="font-mono font-bold w-20">{tx.asset ?? 'N/A'}</h1>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Address;
