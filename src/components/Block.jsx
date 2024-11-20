import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "./AddressSpinner.jsx";
import { alchemy } from "../server.js";

const Block = () => {
  const { blocknum } = useParams();
  const [blockData, setBlockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getData = useCallback(async (block) => {
    try {
      const data = await alchemy.core.getBlock(block);

      if (data === null) {
        setLoading(false);
        setError(true);
      } else {
        setBlockData(data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  }, []);

  useEffect(() => {
    if (!isNaN(blocknum) && blocknum.length !== 66) {
      getData(parseInt(blocknum));
    } else if (blocknum === undefined) {
      setLoading(false);
      setError(true);
    } else if (blocknum.length === 66) {
      let hash = blocknum.toString();
      getData(hash);
    } else {
      setLoading(false);
      setError(true);
    }
  }, [blocknum, getData]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-11/12 max-w-5xl bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Block Details</h1>
          <p className="text-sm text-gray-500 mt-2">
            View detailed information about the block #{blocknum}.
          </p>
        </div>

        {/* Block Content */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loading />
          </div>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">
            Unable to load block data. Please check the block number or hash and try again.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md shadow-md">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Block Number:</span>
                <span className="text-gray-800">{blockData?.number}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md shadow-md">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Block Hash:</span>
                <span className="text-gray-800">{blockData?.hash}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md shadow-md">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Parent Hash:</span>
                <span className="text-gray-800">{blockData?.parentHash}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md shadow-md">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Nonce:</span>
                <span className="text-gray-800">{blockData?.nonce}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md shadow-md">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Difficulty:</span>
                <span className="text-gray-800">{blockData?.difficulty}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md shadow-md">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Gas Limit:</span>
                <span className="text-gray-800">
                  {parseInt(blockData?.gasLimit._hex)}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md shadow-md">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Gas Used:</span>
                <span className="text-gray-800">
                  {parseInt(blockData?.gasUsed._hex)}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md shadow-md">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Miner:</span>
                <span className="text-gray-800">{blockData?.miner}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md shadow-md">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">
                  Total Transactions:
                </span>
                <span className="text-gray-800">
                  {blockData?.transactions.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Block;
