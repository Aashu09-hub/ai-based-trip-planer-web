import {Button} from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { FaShareAlt } from "react-icons/fa";
import { GetPlaceDetails } from '../../../service/GlobalApi';

const PHOTO_REF_URL='https://maps.googleapis.com/maps/{api}/place/photo?maxHeightPx=1000&maxWidthPx=1000&key'+import.meta.env.VITE_GOOGLE_PLACE_API_KEY
const InfoSection = (trip) => {

  const [PhotoUrl,setPhotoUrl]=useState();
  useEffect(()=>{
    trip&&GetPlacePhoto();
  },[trip])

  const GetPlacePhoto=async()=>{
    const data={
      textQuery:trip?.userSelection?.location?.label
    }
    const result=await GetPlaceDetails().then(resp=>{
      console.log(resp.data.places[0].photos[3].name);

      const PhotoUrl=PHOTO_REF_URL.replace('{api}',resp.data.places[0].photos[3].name);
      setPhotoUrl(PhotoUrl);
    })
  }
  return (
    <div>
      <img src={PhotoUrl?PhotoUrl:'/placeholder.jpg'} className='hp-[340px] w-full object-cover rounded-xl'></img>

      <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-2xl'>{trip?.userSelection?.location?.label}</h2>
          <div className='flex gap-5'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>📅{trip.userSelection?.noOfDays} Day</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>💰{trip.userSelection?.budget} Budget</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>🥂No. Of Traveler: {trip.userSelection?.traveler} Day</h2>
          </div>
        </div>
        <Button><FaShareAlt/></Button>
      </div>
    </div>
  )
}

export default InfoSection
