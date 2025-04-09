import { useGoogleLogin } from '@react-oauth/google';
import React, { useState,useEffect } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import axios from 'axios';
import { fromJSON } from 'postcss';

function Header() {


  const user = JSON.parse(localStorage.getItem('user'));
  const [openDailog, setOpenDailog] = useState(false);
  useEffect(() => {
    console.log(user)
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => {
      getUserProfile(codeResp);
    },
    onError: (error) => console.log(error),
  });

  const getUserProfile = (tokenInfo) => {
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: 'application/json',
        },
      })
      .then((resp) => {
        console.log(resp);
        localStorage.setItem('user', JSON.stringify(resp.data));
        setOpenDailog(false);
        window.location.reload()
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to fetch user profile. Please try again.');
      });
  };

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
      <img src='/logo.svg'></img>
      <div>
        {user ?
          <div className='flex items-center gap-3'>
            <a href='/create-trip'>
            <Button variant='outline' 
            className='rounded-full bg-white text-white border-white hover:bg-gray-100'>+ Create Trip</Button>
            </a>
            <a href='/my-trip'>
            <Button variant='outline' 
            className='rounded-full  bg-white text-white border-white hover:bg-gray-100'>My Trip</Button>
            </a>
            <Popover>
              <PopoverTrigger className='rounded-full text-white'>Open</PopoverTrigger>
              <img src={user?.picture} className='h-[35px] w-[35px] rounded-full'></img>
              <PopoverContent>
                <h2  className='cursor-pointer'onClick={()=>{
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }}>Logout</h2>
              </PopoverContent>
            </Popover>
          </div>
          :
          <Button onClick={()=>setOpenDailog(true)}>Sing In</Button>
        }
      </div>
       <Dialog open={openDailog} onOpenChange={setOpenDailog}>
              <DialogContent>
                <DialogHeader>
                <DialogTitle>Sign In</DialogTitle>
                  <DialogDescription>
                  <div>Test Dialog Description</div>
                    <img src="/logo.svg" alt="Logo" />
                    <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
                    <p>Sign in to the App with Google authentication.</p>
                    <Button
                      onClick={login}
                      className="w-full mt-5 text-center text-white flex gap-4 items-center justify-center">
                      <FcGoogle className="h-7 w-7" />
                      Sign In With Google
                    </Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
    </div>
  )
}

export default Header
