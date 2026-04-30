
import { GoogleLogin } from '@react-oauth/google'
import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router';
const GoogleAuth = () => {
const {sendGoogleCredential} = useAuthStore();

const navigate= useNavigate()
const handleSuccess = async (credentialResponse) => {
  const credential = credentialResponse.credential;
   await sendGoogleCredential(credential);
       navigate("/");


};
  return (
    <div>
      <GoogleLogin onSuccess={handleSuccess} />
    </div>
  )
}

export default GoogleAuth
