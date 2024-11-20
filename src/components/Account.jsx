import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "./AddressSpinner.jsx";
import { alchemy } from "../server.js";

const Account = () => {
  const [errors, setErrors] = useState(false);
  const [fromTransactions, setFromTransactions] = useState([]);
  const [toTransactions, setToTransactions] = useState([]);
  const [balance, setBalance] = useState([]);
  const [input, setInput] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const handleSearch = () => {
    setLoading1(true);
    setLoading2(true);
    setLoading3(true);
    getBalance(input);
    getFromTransaction(input);
    getToTransaction(input);
  };

  const getBalance = useCallback(async (inp) => {
    try {
      const balance = await alchemy.core.getBalance(inp);
      setBalance(balance);
      setLoading1(false);
    } catch (error) {
      setErrors(true);
      setLoading1(false);
    }
  }, []);

  const getFromTransaction = useCallback(async (addr) => {
    try {
      const data = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: addr,
        excludeZeroValue: true,
        category: [
          "external",
          "internal",
          "erc20",
          "erc721",
          "erc1155",
          "specialnft",
        ],
      });
      setFromTransactions(data);
      setLoading2(false);
    } catch (error) {
      setErrors(true);
      setLoading2(false);
    }
  }, []);

  const getToTransaction = useCallback(async (addr) => {
    try {
      const data = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toAddress: addr,
        excludeZeroValue: true,
        category: [
          "external",
          "internal",
          "erc20",
          "erc721",
          "erc1155",
          "specialnft",
        ],
      });
      setToTransactions(data);
      setLoading3(false);
    } catch (error) {
      setErrors(true);
      setLoading3(false);
    }
  }, []);

  const renderTransaction = (txn) => (
    <div
      key={txn.hash}
      className="border-b border-gray-200 py-4 flex items-center justify-between"
    >
      <div>
        <Link
          to={`/transaction/${txn.hash}`}
          className="text-blue-500 hover:underline text-sm"
        >
          {txn.hash.slice(0, 12)}...{txn.hash.slice(-8)}
        </Link>
      </div>
      <div className="flex gap-6">
        <div>
          <span className="text-gray-500 text-sm">From:</span>
          <Link
            to={`/address/${txn.from}`}
            className="text-purple-600 hover:underline text-sm block"
          >
            {txn.from.slice(0, 6)}...{txn.from.slice(-4)}
          </Link>
        </div>
        <div>
          <span className="text-gray-500 text-sm">To:</span>
          <Link
            to={`/address/${txn.to}`}
            className="text-green-600 hover:underline text-sm block"
          >
            {txn.to.slice(0, 6)}...{txn.to.slice(-4)}
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="w-4/5 bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <p className="text-2xl text-purple-600 font-semibold">
          Search for an Address
        </p>
        <input
          className="flex-grow border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          placeholder="Enter a valid address (20 bytes hash)..."
          value={input}
          type="text"
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="w-4/5 bg-white shadow-lg rounded-lg mt-6 p-4">
        <h1 className="text-lg font-bold text-gray-700">Account Details for:</h1>
        <p className="text-gray-500">{input || "N/A"}</p>
      </div>

      <div className="w-4/5 bg-white shadow-lg rounded-lg mt-6 p-6">
        <h2 className="text-lg font-bold text-gray-700">Current Balance</h2>
        {loading1 ? (
          <Loading />
        ) : (
          <p className="text-purple-600 text-2xl font-semibold">
            {((parseInt(balance?._hex ?? 0)) / 10 ** 18).toFixed(4)} ETH
          </p>
        )}
      </div>

      {errors ? (
        <div className="text-red-500 text-xl mt-6">
          Invalid Address. Please try again.
        </div>
      ) : (
        <div className="w-4/5 mt-8">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">
            Transaction History
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Outgoing Transactions
              </h2>
              {loading2 ? <Loading /> : fromTransactions.transfers?.map(renderTransaction)}
            </div>

            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Incoming Transactions
              </h2>
              {loading3 ? <Loading /> : toTransactions.transfers?.map(renderTransaction)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
