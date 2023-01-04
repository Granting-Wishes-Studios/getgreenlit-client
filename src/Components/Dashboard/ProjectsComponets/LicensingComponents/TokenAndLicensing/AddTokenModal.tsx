import React, {useState,useContext} from 'react'
import { BasicModal } from '../../../../SubComponents/Modal'
import { addToken, FormTokenRequest } from '../../../../../networking/license'
import { notify } from './../../../../Inc/Toastr';
import { Loader } from '../../../../SubComponents/Loader';
import { AppContext } from './../../../../../context/AppContext'
import axios from 'axios'

import './AddTokenModal.css'
export const AddTokenModal = (props: any) => {

  const [loading, setLoading] = useState(false);
  const { navHeadData} = useContext(AppContext);
  const pathArray = window.location.pathname.split('/');
  const spaceId = pathArray[3];


  type FormValues = {
    tokenName: string,
    network: string,
    contractAddress: string,
    description: string,
  }

  const [values, setValues] = useState<FormValues>({
    tokenName: '',
    network: 'Ethereum Mainnet',
    contractAddress: '',
    description: ''
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const  value = target.value
    
    setValues({ ...values, [target.name]: value })
  }

  const handlePasteChange = (event:any) => {
    const target = event.target
    const  value = target.value
    
    setValues({ ...values, [target.name]: value })
   
    /*
const options = {
  method: 'GET',
  url: 'https://api.opensea.io/api/v1/assets',
  params: {owner: value, order_direction: 'desc', limit: '20', include_orders: 'false'},
  headers: {accept: 'application/json'}
};
    axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
  */

  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const target = event.target
    const  value = target.value
   setValues({ ...values, [target.name]: value })
 }

  function makeName(length:number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true);
    const request: FormTokenRequest = {
      //tokenName: makeName(12),
      tokenName: 'Hidden Ones (HIDDENONES)',
      network: values.network,
      contractAddress: values.contractAddress,
      description: values.description,
    }

    try{

       await addToken(request, spaceId).then((data:any )=> {
           props.setIsSaved(false)
        if(data.data.status){
          notify("Token added!", "success", 6000);
          setLoading(false)
          props.setIsSaved(true)
          props.setShowTokenModal(false);
        }else{
          setLoading(false)
          notify('Something went wrong!', "error", 6000);
        }  
     })

    }catch(err:any){
      setLoading(false)
      notify(err.message, "error", 8000);
    }

  }



  return (
    <BasicModal setShowModal={props.setShowTokenModal} showModal={props.showTokenModal}>
      <div className="tokenModalMain w-full h-full overflow-hidden rounded-2xl mb-10 ">
        <div className="tokenModalHeader flex items-end justify-between pt-5 px-5 sm:px-8 pb-4">
          <div>
            <p className="text-sm text-white font-semibold">
              {navHeadData.title}
            </p>
            <h1 className="text-white w-1/2 sm:w-auto sm:text-lg font-bold mt-2">
              Add a token
            </h1>
          </div>
          <button
            onClick={() => {
              props.setShowTokenModal(false)
              setLoading(false)
            }}
            className="text-white text-xs sm:text-sm font-bold"
          >
            Cancel
          </button>
        </div>
        <div className="tokenModalContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col gap-y-10">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            <h1 className="text-white text-md font-semibold">Network</h1>
            
            <select onChange={handleSelect}
                name='network'
                className=" mt-2 py-3 px-4 w-full text-xs text-white border border-zinc-700 stakingModalInput outline-0 shadow-none select rounded-md">
                 <option selected={true}  value={'Ethereum Mainnet'} className="option">Ethereum Mainnet</option>
              </select>
           
          </div>
          <div>
            <h1 className="text-white text-md font-semibold">
              Token Contract Address
            </h1>
            <input
              onChange={handlePasteChange}
              type="text"
              name='contractAddress'
              placeholder="Paste contract address..."
              className=" mt-2 py-3 px-0 w-full text-xs text-white border-b border-0 border-zinc-700 tokenModalInput outline-0 shadow-none bg-transparent"
            />
          </div>
          <div>
            <h1 className="text-white text-md font-semibold">
              Token description (optional)
            </h1>
            <input
              onChange={handleChange}
              type="text"
              name='description'
              placeholder="Enter description..."
              className=" mt-2 py-3 px-0 w-full text-xs text-white border-b border-0 border-zinc-700 tokenModalInput outline-0 shadow-none bg-transparent"
            />
            <p className="text-zinc-500 text-xs text-right mt-1 font-semibold">
              0/180
            </p>
          </div>
        <div>
        <p className='text-gray-200 text-xs'>
            Adding a token to your IP creates a staking smart contract for it,
            which is in your custody under your<br className='hidden sm:block' /> connected wallet. Each new smart
            contract requires a 0.2 ETH fee, plus gas.
          </p>
          <div className='flex items-center gap-x-5 mt-5'>
          <button type='submit' className='text-white text-xs font-semibold py-2 px-4 rounded-full addTokenModalBtn'>
            Add a Token 
          { loading && 
          (
            <Loader />
          )}
          </button>
          <button type='button'
            onClick={() => {
            props.setShowTokenModal(false)
          }}
           className='text-white text-xs font-semibold'>Cancel</button>
          </div>
        </div>
        </form>
        </div>
      </div>
    </BasicModal>
  )
}
