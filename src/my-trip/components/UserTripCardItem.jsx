import React,{ useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
//import { GetPlaceDetails } from '@/service/geminiAPI'; // or wherever it's defined
//import { PHOTO_REF_URL } from '@/service/constants';   // adjust path if needed

function UserTripCardItem({trip}) {
    
      const [PhotoUrl,setPhotoUrl]=useState();
      useEffect(()=>{
        trip&&GetPlacePhoto();
      },[trip])
    
      const GetPlacePhoto=async()=>{
        const data={
          textQuery:trip?.userSelection?.location?.label
        }
        const result=await GetPlaceDetails(data).then(resp=>{
          console.log(resp.data.places[0].photos[3].name);
    
          const PhotoUrl=PHOTO_REF_URL.replace('{api}',resp.data.places[0].photos[3].name);
          setPhotoUrl(PhotoUrl);
        })
      }

  return (
    <Link to={'/view-trip/'+trip?.id}>
      <div className='hover:scale-105 transition-all'></div>
    <div>
      <img src={PhotoUrl?PhotoUrl:'/placeholder.jpg'}
       className='object-cover rounded-xl h-[220px]'></img>
       <div>
        <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.label}</h2>
        <h2 className='text-sm text-gray-500'>{trip?.userSelection.noOfDays} Days trip with {trip?.userSelection?.budget} Budget</h2>
       </div>
    </div>
    </Link>
  )
}

export default UserTripCardItem
