import React, { useState } from "react"

export const Token = (props:any) => {

const [selected, setSelected] = useState(false);
const [toggleSelected, setToggleSelected] = useState(false);
const handleSelect = (event: React.MouseEvent<HTMLElement>) => {
     
    if(!toggleSelected){
        setToggleSelected(true) 
        setSelected(true)
        props.setStakedTokens((prev:any) => [...prev, {'id': props.id, 'name': props.token.name, 'token': props.token.token}]);
    }else{
        setToggleSelected(false)  
        setSelected(false) 
        props.setStakedTokens((prev:any) => [...prev].filter(f => f.id != props.id));
    }
}
    return(
    <div className="text-center col-span-4 sm:col-span-3 xl:col-span-3 relative cursor-pointer">
        <div onClick={handleSelect} className={` ${selected ? 'stakeToken stakeTokenActive': ''}`}>
            <img
                src={props.token.token}
                alt="tokenImage"
                className="w-32 rounded-lg"
            />
            <div className='absolute -top-2 -right-2 text-center rounded-full '><div className={`div ${selected ? 'active' : ''}`}><span className={`checked ${selected ? 'active' : ''}`}></span></div></div>
        </div>
        <p className="text-gray-200 text-sm mt-2">{props.token.name}</p>
    </div>
    )
}
