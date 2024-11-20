import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Loading from './AddressSpinner.jsx';
import {alchemy} from "../server.js";



const Transaction = () => {
  const{trx} =useParams();
  const[transactionData,setTransactionData] = useState(null);
  const[loading,setLoading] = useState(true);
  const [error,setError] = useState(false);


  useEffect(()=>{
    const getTrxData = async(trhash)=>{
      try {
        const data = await alchemy.core.getTransactionReceipt(trhash)
       setTransactionData(data);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(true)
      }
    }

    if(transactionData===null){
      getTrxData(trx);
    }

  },[transactionData,trx])


  return (
    <>
      <div className=" w-2/3 h-20 flex flex-row items-center justify-start gap-2
 bg-slate-100 shadow-l rounded-md m-4 p-4 ">
        <div>
          <h1 className="font-medium font-serif text-xl">Transaction Details For</h1>
        </div>
        <div>
          <h1 className="font-serif text-xl text-gray-600" >{transactionData?.transactionHash}</h1>
        </div>
      </div>
      <div className="w-4/5 h-1/4 bg-slate-50 shadow-xl rounded-md m-4 flex flex-row gap-40 p-4 items-center">
        <div class="flex flex-col gap-8 ">
          <div class="font-mono text-l tracking-tighter text-gray-900">
            <h1>to</h1>
          </div>

          <div class="font-mono text-l tracking-tighter text-gray-900">
            <h1>from</h1>
          </div>



          <div class="font-mono text-l tracking-tighter text-gray-900">
            <h1>transactionIndex</h1>
          </div>


          <div class="font-mono text-l tracking-tighter text-gray-900">
            <h1>gasUsed</h1>
          </div>

          <div class="font-mono text-l tracking-tighter text-gray-900">
            <h1>transactionHash</h1>
          </div>
          <div class="font-mono text-l tracking-tighter text-gray-900">
            <h1>blockNumber</h1>
          </div>

          <div class="font-mono text-l tracking-tighter text-gray-900">
            <h1>status</h1>
          </div>

        </div>
        <div className="flex flex-col gap-8 ">
        {
          loading?(
            <Loading></Loading>
            ): error?(
              <>
                  <div>
                    <h1>Invalid Trasaction Hash</h1>
                  </div>
              </>
            ):(
              <>
                  <Link to={`/address/${transactionData?.to}`}>
                    <div className="font-mono text-l tracking-tighter text-blue-900 hover:text-blue-300">
                      <h1>{transactionData?.to}</h1>
                    </div>
                  </Link>

                  <Link to={`/address/${transactionData?.from}`}>
                    <div className="font-mono text-l tracking-tighter text-blue-900 hover:text-blue-300">
                      <h1>{transactionData?.from}</h1>
                    </div>
                  </Link>


                  <div className="font-mono text-l tracking-tighter text-gray-900">
                    <h1>{transactionData?.transactionIndex}</h1>
                  </div>


                  <div className="font-mono text-l tracking-tighter text-gray-900">
                    <h1>{parseInt(transactionData?.gasUsed._hex)}</h1>
                  </div>

                  <div className="font-mono text-l tracking-tighter text-gray-900">
                    <h1>{transactionData?.transactionHash}</h1>
                  </div>
                  <div className="font-mono text-l tracking-tighter text-gray-900">
                    <h1>{transactionData?.blockNumber}</h1>
                  </div>

                  <div className="font-mono text-l tracking-tighter text-gray-900">
                    <h1>{transactionData?.status}</h1>
                  </div>

                </>
            )
        }
        </div>
      </div>
    </>
  )
}

export default Transaction