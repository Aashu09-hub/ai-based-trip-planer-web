import React from 'react'
import {Button} from '@/components/ui/button'
import { FaMapLocationDot } from "react-icons/fa6";

function PlaceCardltem ({place})  {

  const [PhotoUrl,setPhotoUrl]=useState();
    useEffect(()=>{
      place&&GetPlacePhoto();
    },[place])
  
    const GetPlacePhoto=async()=>{
      const data={
        textQuery:place.placeName
      }
      const result=await GetPlaceDetails().then(resp=>{
        const PhotoUrl=PHOTO_REF_URL.replace('{api}',resp.data.places[0].photos[3].name)
        setPhotoUrl(PhotoUrl);
      })
    }
  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query='+place.placeName} target='_blank'>
    <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
        <img src={PhotoUrl?PhotoUrl:'/placeholder.jpg'}
        className='w-[130px] h-[130px] rounded-xl object-cover'
        ></img>
        <div>
          <h2 className='font-bold text-lg'>{place.placeName}</h2>
          <p className='text-sm text-gray-400'>{place.placeData}</p>
          <h2 className='mt-2'>🕙{place.timeToTravel}</h2>
          <Button size="sm"><FaMapLocationDot /></Button>
        </div>
    </div>
    </Link>
  )
}

export default PlaceCardltem
