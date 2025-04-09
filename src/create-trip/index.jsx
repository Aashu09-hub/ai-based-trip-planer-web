import React, { useState, useEffect } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from '../constant/options';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
//import { SelectTravelesList } from '../constant/options';
import axios from 'axios';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import { doc, setDoc } from 'firebase/firestore'; 
import { db } from '../service/firebase'; 
import { useNavigate } from 'react-router-dom';
import { Navigation } from 'lucide-react';
//import { ChatSession } from '../utils/chatSession'; // Assuming you have a chatSession utility

function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [openDailog, setOpenDailog] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => {
      getUserProfile(codeResp);
    },
    onError: (error) => console.log(error),
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem('user');

    if (!user) {
      setOpenDailog(true);
      return;
    }

    if (formData?.noOfDays > 5 && ( !formData?.budget || !formData?.traveler)) {
      toast.error("Please fill all the required fields");
      return;
    }


    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT.replace('{location}', formData?.location?.label || 'Anywhere')
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveler}', formData?.traveler)
      .replace('{budget}', formData?.budget);

      console.log("Final Prompt:", FINAL_PROMPT);

    try {
      const result = await ChatSession.sendMessage(FINAL_PROMPT);
      setLoading(false);
      console.log('--', result?.response?.text());
      SaveAiTrip(result?.response?.text());
    } catch (error) {
      setLoading(false);
      console.error('Error generating trip:', error);
      toast.error('Failed to generate trip. Please try again.');
    }
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();

    console.log("Trip Data Recieved:",TripData)

    try {

      const parsedData = JSON.parse(TripData);
    console.log("Parsed Trip Data: ", parsedData);
      await setDoc(doc(db, 'AITrips', docId), {
        userSelection: formData,
        tripData: JSON.parse(TripData),
        userEmail: user?.email,
        id: docId,
      });
      setLoading(false);
      toast.success('Trip saved successfully!');
    } catch (error) {
      setLoading(false);
      console.error('Error saving trip:', error);
      toast.error('Failed to save trip. Please try again.');
    }
    setLoading(false);
    navigate('/view-trip/'+docId);
  };

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
        OnGenerateTrip();
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to fetch user profile. Please try again.');
      });
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences 🏕️🌴</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">What is your destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange('location', v);
              },
              placeholder: "Select Destination(Optional)"
            }}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">How many days are planning your trip</h2>
          <input
            placeholder="Ex. 3"
            type="number"
            className="border p-2 rounded-lg"
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">What is your Budget?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData?.budget === item.title && 'shadow-lg border-black'
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">Who do you plan on travel?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectTravelesList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData?.traveler === item.people && 'shadow-lg border-black'
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="my-10 justify-end flex text-white">
        <button disabled={loading} onClick={OnGenerateTrip}>
          {loading ? <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" /> : 'Generate Trip'}
        </button>
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
                className="w-full mt-5 text-center text-white flex gap-4 items-center justify-center"
              >
                <FcGoogle className="h-7 w-7" />
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
