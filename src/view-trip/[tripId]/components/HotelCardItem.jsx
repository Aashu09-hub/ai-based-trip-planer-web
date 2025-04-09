import React from 'react'
import { Link } from 'react-router-dom'

function HotelCardItem({hotel}) {

    const [PhotoUrl, setPhotoUrl] = useState();
    useEffect(() => {
        hotel && GetPlacePhoto();
    }, [hotel])

    const GetPlacePhoto = async () => {
        const data = {
            textQuery:hotel.hotelName
        }
        const result = await GetPlaceDetails(data).then(resp => {
            console.log(resp.data.places[0].photos[3].name);

            const PhotoUrl = PHOTO_REF_URL.replace('{api}', resp.data.places[0].photos[3].name)
        })
    }

    return (
        <Link to={'https://www.google.com/maps/search/?api=1&query=' + hotel.hotelName + "," + hotel?.hotelAddress} target='_blank'>
            <div className='hover:scale-105 transition-all cursor-pointer'>
                <img src={PhotoUrl?PhotoUrl:'/placeholder.jpg'}className='rounded-xl h-[180px] w-full object-cover'></img>
                <div className='my-2'>
                    <h2 className='font-medium'>{hotel.hotelName}</h2>
                    <h2 className='text-xs text-gray-500'>📍{hotel.hotelAddress}</h2>
                    <h2 className='text-sm'>💰{hotel?.price}</h2>
                    <h2 className='text-sm'>⭐{hotel?.rating}</h2>
                </div>
            </div>
        </Link>
    )
}

export default HotelCardItem
