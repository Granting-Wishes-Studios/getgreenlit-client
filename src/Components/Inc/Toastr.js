import toast from 'react-hot-toast';

export const notify = (message, flag = "default", duration = 4000) => {
      if(flag === "success"){
          toast.success(message, {
            position: "top-right",
            duration: duration,
            style: {
              border: '1px solid #16a085',
              borderRadius: '30px',
              padding: '4px 8px',
              fontSize: '14px',
              color: '#fff',
              background: '#27ae60',
            }
        });     
      }
      else if(flag === "error"){
        toast.error(message, {
          position: "top-right",
          duration: duration,
          style: {
            border: '1px solid #c0392b',
            borderRadius: '30px',
            padding: '4px 8px',
            fontSize: '14px',
            color: '#fff',
            background: '#e74c3c',
          }
      }); 
      }  
      else{
        toast(message, {
          position: "top-right",
          duration: duration,
          style: {
            borderRadius: '30px',
            padding: '4px 8px',
            fontSize: '14px',
          }
      }); 
      }    
}