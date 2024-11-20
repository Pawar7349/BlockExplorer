import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { Utils } from 'alchemy-sdk';
import {alchemy} from "./server.js";



const MyContext = createContext();


const MyProvider = ({children}) => {

const[block, setBlock] = useState(0);
const [blockdeatils,setBlockDetails] =useState([]);
const [loading, setLoading] = useState(true);
const [latestTransaction, setLatestTransactions]=useState([]);
const [transactionDetails, setTransactionDetails]=useState([]);
const [loading2, setLoading2] = useState(true);


const getlatestBlock = useCallback(async()=>{
  const block = await alchemy.core.getBlockNumber();
  setBlock(block);
},[])

const createBlockData = useCallback(async(block)=>{
  let arr=[];
  for(let i=0; i<10; i++){
      async function getBlockDetails(blockn) {
        const data = await alchemy.core.getBlock(blockn)
        let obj ={
          blocknum:data.number,
          basgasFee:Utils.formatEther(data.baseFeePerGas),
        }
        arr.push(obj);    
      }
      await getBlockDetails(block);
      block -=1;
  }
  setBlockDetails(arr);
  setLoading(false);

},[]);

const getLatst10Transactions = useCallback(async (blocknum)=>{
  const data = await alchemy.core.getBlock(blocknum);
    return data.transactions;

},[])

const transactionData = useCallback(async(tansactions)=>{
  let arr =[];
  for(let i=0; i<tansactions.length; i++){
      const transaction = tansactions[i]
      async function getTransackDetails(transaction) {
        const data = await alchemy.core.getTransactionReceipt(transaction)
        const obj ={
          trans:data.transactionHash,
          from:data.from,
          to:data.to,
        }
        arr.push(obj);    
      }
      await getTransackDetails(transaction);
  }
  setTransactionDetails(arr);
  setLoading2(false);

},[]);

useEffect(()=>{

  if(block===0){
    getlatestBlock();
  }
  else{
    createBlockData(block);
    getLatst10Transactions(block).then((res)=>{
      let arr = res.slice(0,10)
      setLatestTransactions(arr);
   
      
    })
    
  }
  
},[block,createBlockData,getLatst10Transactions,getlatestBlock])


useEffect(()=>{

  if (latestTransaction.length>0) {
    transactionData(latestTransaction);
  }
},[latestTransaction,transactionData]);




 
  return (
    <>
        <MyContext.Provider value={{
          loading2,
          loading,
          blockdeatils,
          transactionDetails,
          setLoading2
        }}>
            {children}
        </MyContext.Provider>
    </>
  )
}
export function useMyContext(){
  return useContext(MyContext);
}

export default MyProvider