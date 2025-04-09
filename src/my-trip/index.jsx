import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { db } from '@/service/firebase.js';
import { collection, getDocs, query, where} from 'firebase/firestore'
import UserTripCardItem from './components/UserTripCardItem';

function myTrips() {

  const navigation=useNavigate();
  const [UserTrips,setUserTrips]=useState([]);

  useEffect(()=>{
    GetUserTrips();
  },[])

  const GetUserTrips=async()=>{
    const user=JSON.parse(localStorage.getItem('user'));
    console.log(user)
    if(!user){
      navigation('/');
      return;
    }
    setUserTrips([]);
    const q=query(collection(db,'AITrips'),where('userEmail','==',user?.email))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setUserTrips(prevVal=>[...prevVal,doc.data()])
    });
  }

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>My Trips</h2>

      <div className='grid grid-cols-2 mt-10 md:grid-cols-3 gap-5'>
        {UserTrips?.length>0?UserTrips.map((trip,index)=>(
          <UserTripCardItem trip={trip} key={index}/>
        ))
        :[1,2,3,4,5,6].map((item,index)=>(
          <div key={index} className='h-[220px] w-full bg-slate-200 animate-pluse rounded-xl'>
            </div>
        ))
      }
      </div>
    </div>
  )
}

export default myTrips
