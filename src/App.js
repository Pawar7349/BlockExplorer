import React from 'react';
import {Routes,Route} from "react-router-dom"

import MyProvider from './MyContext.js';
import  Navbar  from './components/Navbar.jsx';
import './index.css';
import Home from './components/Home.jsx';
import Block from './components/Block.jsx';
import Address from './components/Address.jsx';
import Transaction from './components/Transaction.jsx';
import Account from './components/Account.jsx';
import Nft from './components/Nft.jsx';




function App() {



  return (
    
    <>
      <MyProvider>
        <Navbar></Navbar>
        <Routes>
         
            <Route path={'/'} element={<Home></Home>} />
            <Route path={'/block/:blocknum'} element={<Block></Block>} />
            <Route path={'/transaction/:trx'} element={<Transaction></Transaction>} />
            <Route path={'/address/:add'} element={<Address></Address>} />
            <Route path={'/account'} element={<Account></Account>} />
            <Route path={'/nft'} element={<Nft></Nft>} />
        </Routes>
      </MyProvider>
    </>
  )
}

export default App;