import React from 'react';
import { useHistory } from 'react-router-dom'
import auth from './Auth';
import swal from 'sweetalert';



import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode'


const LoginPage = () => {



  const history = useHistory();
  // new: 1083360668967-7j7gdoq6knbs8s02bcarb1varpbt15nb.apps.googleusercontent.com
  // old: 798346410668-6483fv6ngvjs4vaqhq71hnpsjbj13ljn.apps.googleusercontent.com

  // internal : 1086914672765-r7g7mco9lddg7ab3u86q1tuhgt0ci67m.apps.googleusercontent.com

  return (
    
    <div>
    <GoogleOAuthProvider clientId="1086914672765-r7g7mco9lddg7ab3u86q1tuhgt0ci67m.apps.googleusercontent.com">
    <header className="App-header">
        <h1>Login with Google Account to give Exam</h1>
        
        <GoogleLogin
        onSuccess={credentialResponse => {
          const details = jwt_decode(credentialResponse.credential); 
          console.log(details);
          var checkname = details.name;
          sessionStorage.setItem("checkname", checkname);
          var checkemail = details.email;
          sessionStorage.setItem("checkemail", checkemail);
          auth.login(() => {
            history.push("/systemcheck")
            swal('Login Successful');
          });


      }}
      onError={() => {
      swal('Login Failed');
      }}
      />

        
      </header>
    </GoogleOAuthProvider>;
      
    </div>
  );
}

export default LoginPage;