import React from 'react';
import { RotateCw } from 'lucide-react';

const LoadingPage = () => {

  return (
    
    <div>
        <div className='min-h-screen items-center justify-center flex'>
            <RotateCw className='h-5 w-5 animate-spin mr-3'/> Loading...
        </div>
    </div>
  );
}

export default LoadingPage;