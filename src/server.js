import { Alchemy, Network } from 'alchemy-sdk';

const { REACT_APP_ALCHEMY_API_KEY } = process.env;
const settings = {
  apiKey: REACT_APP_ALCHEMY_API_KEY, 
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export { alchemy }