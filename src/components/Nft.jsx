import React, { useState, useCallback } from 'react';
import { alchemy } from '../server.js'; // Ensure the alchemy instance is correctly configured
import Loading from './AddressSpinner.jsx'; // Spinner for loading indication

const Nft = () => {
  // State variables
  const [searchOption, setSearchOptions] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState();
  const [isFloorPrice, setFloorPrice] = useState(false);
  const [isMetadata, setMetadata] = useState(false);
  const [error, setError] = useState(false);
  const [imgUrl, setImageUrl] = useState("");

  // Handle the Search button click
  const handleClick = () => {
    setError(false); // Reset error before new fetch

    if (searchOption === "nftm") {
      setLoading(true);
      getMetadata(contractAddress, tokenId);
    } else if (searchOption === "fp") {
      setLoading(true);
      getFloorPrice(contractAddress);
    } else {
      setError(true);
    }
  };

  // Fetch metadata for the given contract and token ID
  const getMetadata = useCallback(async (contractAddress, tokenId) => {
    try {
      const metadata = await alchemy.nft.getNftMetadata(contractAddress, parseInt(tokenId));
      setData(metadata);
      setImageUrl(metadata.media[0]?.thumbnail || ""); // Set thumbnail URL
      setLoading(false);
      setMetadata(true);
    } catch (error) {
      console.error("Error fetching metadata:", error);
      setLoading(false);
      setError(true);
    }
  }, []);

  // Fetch floor price for the given contract address
  const getFloorPrice = useCallback(async (contractAddress) => {
    try {
      const floorPriceData = await alchemy.nft.getFloorPrice(contractAddress);
      setData(floorPriceData);
      setLoading(false);
      setFloorPrice(true);
    } catch (error) {
      console.error("Error fetching floor price:", error);
      setLoading(false);
      setError(true);
    }
  }, []);

  return (
    <>
      <div className="w-full mt-2 p-2 flex flex-col gap-2 items-center shadow-lg justify-center">
        <h1 className="text-6xl font-bold font-serif">Explore NFTs</h1>
        <h2 className="text-3xl font-bold font-sans">Check Metadata and Floor Price</h2>
      </div>

      {/* Input Section */}
      <div className="w-1/2 h-20 bg-divbg flex flex-row p-1 pl-8 mt-2 items-center gap-4 justify-start rounded-e-md">
        {/* Dropdown */}
        <select
          name="nftOptions"
          id="nftop"
          className="h-10 p-1 rounded-md bg-select text-divbg text-lg"
          value={searchOption}
          onChange={(e) => {
            const selectedOption = e.target.value;
            setSearchOptions(selectedOption);
            setFloorPrice(false);
            setMetadata(false);
            setError(false);

            if (selectedOption === 'nftm') {
              document.getElementById('tokenid').classList.remove('hidden');
              document.getElementById('tokenid').classList.add('inline');
            } else {
              document.getElementById('tokenid').classList.remove('inline');
              document.getElementById('tokenid').classList.add('hidden');
            }
          }}
        >
          <option value="" disabled>Choose Option</option>
          <option value="nftm">NFT Metadata</option>
          <option value="fp">NFT Floor Price</option>
        </select>

        {/* Contract Address Input */}
        <input
          className="w-1/3 h-10 rounded-md bg-green-50 border border-gray-900 focus:outline-none p-2"
          type="text"
          placeholder="Contract Address"
          onChange={(e) => setContractAddress(e.target.value)}
        />

        {/* Token ID Input */}
        <input
          id="tokenid"
          className="w-20 hidden h-10 rounded-md bg-green-50 border border-gray-900 focus:outline-none p-2"
          type="text"
          placeholder="Token ID"
          onChange={(e) => setTokenId(e.target.value)}
        />

        {/* Search Button */}
        <button
          className="w-24 h-8 text-lg bg-red-700 rounded-md hover:border border-amber-200 text-zinc-50"
          onClick={handleClick}
        >
          Search
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="w-full flex flex-row items-center mt-6 justify-center">
          <Loading />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="w-4/5 m-auto mt-10 flex flex-row gap-2 items-center justify-center">
          <h1 className="text-2xl font-bold text-red-500">Invalid Request. Please Try Again!</h1>
        </div>
      )}

      {/* Floor Price Display */}
      {!loading && !error && isFloorPrice && (
        <div className="w-1/2 m-auto shadow-lg mt-4 p-1 flex flex-col gap-1 items-center">
          <h1 className="text-2xl font-bold font-serif">Floor Price for</h1>
          <h2 className="text-base font-bold">{contractAddress}</h2>
          <div className="w-full flex flex-row gap-2">
            <h3 className="font-mono">MarketPlace:</h3>
            <h3 className="font-mono">Opensea</h3>
          </div>
          <div className="w-full flex flex-row gap-2">
            <h3 className="font-mono">Floor Price:</h3>
            <h3 className="font-mono">{data.openSea?.floorPrice || "N/A"}</h3>
          </div>
          <div className="w-full flex flex-row gap-2">
            <h3 className="font-mono">Collection URL:</h3>
            <a
              href={data.openSea?.collectionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-900"
            >
              {data.openSea?.collectionUrl || "N/A"}
            </a>
          </div>
        </div>
      )}

      {/* Metadata Display */}
      {!loading && !error && isMetadata && (
        <div className="w-3/5 m-auto mt-4 shadow-lg grid grid-col-1 gap-1 items-center">
          <div className="flex flex-row items-center justify-center text-3xl">
            <h1>{data.contract?.name} NFT</h1>
          </div>
          <div className="flex flex-row p-2 justify-center items-center gap-1">
            {/* NFT Image */}
            <div className="w-1/2 h-80">
              <img
                className="object-scale-down max-w-full max-h-full"
                src={imgUrl}
                alt="NFT"
              />
            </div>
            {/* Metadata Details */}
            <div className="w-1/2 h-80 flex flex-col gap-1 p-1">
              <div className="flex flex-row gap-1">
                <h3>Contract:</h3>
                <h3 className="text-blue-500">{data.contract?.address}</h3>
              </div>
              <div className="flex flex-row gap-1">
                <h3>Name:</h3>
                <h3>{data.contract?.name || "N/A"}</h3>
              </div>
              <div className="flex flex-row gap-1">
                <h3>Symbol:</h3>
                <h3>{data.contract?.symbol || "N/A"}</h3>
              </div>
              <div className="flex flex-row gap-1">
                <h3>Token ID:</h3>
                <h3>{data.tokenId || "N/A"}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Nft;
