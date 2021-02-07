import React, { useState, useEffect } from "react";
import DAIStorerContract from "./contracts/DaiStore.json";
import YakaDAIContract from "./contracts/yakaDAI.json";
import DAIContract from "./contracts/DAI.json"
import getWeb3 from "./getWeb3";
import "./App.css";

// useless tragic there shoe screen picture wreck milk own journey east funny

function App() {
  const [web3, setWeb3 ] = useState(null);
  const [account, setAccount ] = useState(null);
  const [contractYakaDAI, setContractYakaDAI] = useState(null);
  const [contractDAIStorer, setContractDAIStorer] = useState(null);
  const [contractDAI, setContractDAI] = useState(null);

  const [amountDAI, setAmountDAI] = useState(0);
  const [amountYakaDAI, setAmountYakaDAI] = useState(0);
  const [userDAIBalance, setuserDAIBalance] = useState(0);
  const [userYakaDAIBalance, setuserYakaDAIBalance] = useState(0);

  //const [userDAIAproved, setuserDAIAproved] = useState(0);
  //const [userYakaDAIAproved, setuserYakaDAIAproved] = useState(0);

  const initialize = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      setWeb3(web3);

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts(); 
      setAccount(accounts[0]); 
      // Get the contract DAIStore instance.
      //web3.eth.net.getId().then(console.log);
      const networkId = await web3.eth.net.getId();
      const deployedNetworkDAIStore = DAIStorerContract.networks[networkId];  
      const instanceDAIStore = new web3.eth.Contract(
        DAIStorerContract.abi,
        deployedNetworkDAIStore && deployedNetworkDAIStore.address,
      );
      console.log("DAIStore address: ", deployedNetworkDAIStore.address);
      setContractDAIStorer(instanceDAIStore);
      instanceDAIStore.events.DAIDeposited().on('data', async event => {
        console.log("Amount DAI deposited: ", event.returnValues._amount);
      });
      instanceDAIStore.events.YakaDAIDeposited().on('data', async event => {
        console.log("Amount YakaDAI deposited: ", event.returnValues._amount);
      });

      // Get DAI smart contract
      const deployedNetworkDAI = DAIContract.networks[networkId];
      const instanceDAI = new web3.eth.Contract(
        DAIContract.abi,
        deployedNetworkDAI && deployedNetworkDAI.address,
      );
      console.log("DAI address: ", deployedNetworkDAI.address);
      setContractDAI(instanceDAI);
      instanceDAI.events.Transfer().on('data', async event => {
        console.log(`Transfer of ${event.returnValues.value} copleted from ${event.returnValues.from} to ${event.returnValues.to}`);
      });
      instanceDAI.events.Approval().on('data', async event => {
        console.log(`Approval of ${event.returnValues.value} copleted from ${event.returnValues.spender} to ${event.returnValues.owner}`);
      });

      // Get YakaDAI amount from user Account
      const deployedNetworkYakaDAI = YakaDAIContract.networks[networkId];
      const instanceYakaDAI = new web3.eth.Contract(
        YakaDAIContract.abi,
        deployedNetworkYakaDAI && deployedNetworkYakaDAI.address,
      );
      console.log("YakaDAI address: ", deployedNetworkYakaDAI.address);
      setContractYakaDAI(instanceYakaDAI);
      instanceYakaDAI.events.Transfer().on('data', async event => {
        console.log(`Transfer of ${event.returnValues.value} copleted from ${event.returnValues.from} to ${event.returnValues.to}`);
      });
      instanceYakaDAI.events.Approval().on('data', async event => {
        console.log(`Approval of ${event.returnValues.value} copleted from ${event.returnValues.spender} to ${event.returnValues.owner}`);
      });

      // YakaDAI and DAI balance from owner
      //console.log(accounts[0]);
      const userDAI = await instanceDAI.methods.balanceOf(accounts[0]).call();
      const userYakaDAI = await instanceYakaDAI.methods.balanceOf(accounts[0]).call();
      setuserDAIBalance(userDAI/(10**18), userDAI%(10**18));
      setuserYakaDAIBalance(userYakaDAI/(10**18), userYakaDAI%(10**18));
     } catch (error) {
       // Catch any errors for any of the above operations.
       alert("Failed to load web3, accounts, or contract. Check console for details");
       console.error(error);
     }      
    }; 

  useEffect( () => { initialize(); },[account]); 

  const handleDepositDAI = async (event) => {
     event.preventDefault();
     try{
      console.log("DAIStorer contract: ", contractDAIStorer);
      console.log("YakaDAI contract: ", contractYakaDAI);
      console.log("DAI contract", contractDAI);
      const networkId = await web3.eth.net.getId();
      const deployedNetworkDAIStore = DAIStorerContract.networks[networkId];
      const addressDAIStorer = deployedNetworkDAIStore && deployedNetworkDAIStore.address;
      console.log("Address DAIStorer", addressDAIStorer);
      await contractDAI.methods.approve(addressDAIStorer, amountDAI).send({ from: account });
      await contractDAIStorer.methods.depositDAI().send({ from: account });
      recomputeUserAmounts();      
     }catch(e){
      // manage errors 
     }
   }

   const handleDepositYakaDAI = async (event) => {
    event.preventDefault();
    try{
     console.log("DAIStorer contract: ", contractDAIStorer);
     console.log("YakaDAI contract: ", contractYakaDAI);
     console.log("DAI contract", contractDAI);
     const networkId = await web3.eth.net.getId();
     const deployedNetworkDAIStore = DAIStorerContract.networks[networkId];
     const addressDAIStorer = deployedNetworkDAIStore && deployedNetworkDAIStore.address;
     /*console.log(amountYakaDAI);
     console.log(typeof amountYakaDAI);
     const aux1 = parseInt(amountYakaDAI, 10)*(10**18);
     const aux2 = '' + aux1;
     console.log(aux1);
     console.log(typeof aux1);
     console.log(aux2);
     console.log(typeof aux2);*/
     //console.log(userYakaDAIAproved);
     await contractYakaDAI.methods.approve(addressDAIStorer, amountYakaDAI).send({ from: account });
     await contractDAIStorer.methods.depositYakaDAI().send({ from: account });
     recomputeUserAmounts();
    }catch(e){
     // manage errors 
    }
  }

  async function recomputeUserAmounts() {
    const userDAI = await contractDAI.methods.balanceOf(account).call();
    const userYakaDAI = await contractYakaDAI.methods.balanceOf(account).call();
    const auxDAI = userDAI/(10**18) + ',' + userDAI%(10**18);
    const auxYakaDAI = userYakaDAI/(10**18) + ',' + userYakaDAI%(10**18);
    setuserDAIBalance(auxDAI);
    setuserYakaDAIBalance(auxYakaDAI);
  }

  const onDepositDAIChange = event => {
    setAmountDAI(event.target.value);
    //setuserDAIAproved(event.target.value*(10**18))
  }
  
  const onDepositYakaDAIChange = event => {
    setAmountYakaDAI(event.target.value);
    //setuserYakaDAIAproved(event.target.value*(10**18))
  }
    if (!web3) {
      return <div>Loading Web3, account and contract...</div>;
    }
     return (
      <div className="App">
      <h1>Yaka DAI Deposit!</h1>
      <br></br>  
      <div>Your account is: {account}</div>
      <br></br>  
      <div>Minimum amount to deposit is 1 DAI or 1 YakaDAI</div>
      <br></br>  
      <form onSubmit={handleDepositDAI}>
          <label> Deposit DAIs:
            <input type="text" value={amountDAI} onChange={onDepositDAIChange}></input>
            <input type="submit"></input>
          </label>
      </form>    
      <form onSubmit={handleDepositYakaDAI}>
          <label> Withdraw DAIs:
            <input type="text" value={amountYakaDAI} onChange={onDepositYakaDAIChange}></input>
            <input type="submit"></input>
          </label>
      </form>    
      <br></br>   
      <div>You have DAIs {userDAIBalance} and {userYakaDAIBalance} YakaDAIs in your wallet!</div>
      </div>
    );
}

export default App;
