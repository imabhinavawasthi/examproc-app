import React from 'react';
import { useHistory } from 'react-router-dom'
import { RotateCw } from 'lucide-react';

const Callback = () => {

  const history = useHistory();
  history.push("/");
  
  return (
    
    <div>
        <div className='min-h-screen items-center justify-denter flex'>
            <RotateCw className='animate-spin'/>
        </div>
    </div>
  );
}

export default Callback;