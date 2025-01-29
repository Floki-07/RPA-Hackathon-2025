import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Landing1 = () => {
  const useVideoBackground = true; // Set to true to use video, false for image background
const navigate=useNavigate()
  return (
    <div className="h-screen w-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center">
      {/* Background: Video or Image */}
      {useVideoBackground ? (
        <video
          autoPlay
          loop
          muted
          className="absolute w-full h-full object-cover"
          src="public/My_Video/Landing_Page3.mp4" // Replace with your video URL
        ></video>
      ) : (
        <div
          className="absolute w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/Images/Background_Landing2.jpg')" }} // Replace with your image URL
        />
      )}

      {/* Centered Text */}
      <div className="relative text-center text-white h-[400px] flex flex-col justify-center items-center">
        {/* FeedBot Title */}
        <h1 className=" text-l translate-y-[-10%] text-[9.5vw] font-extrabold bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 bg-clip-text text-transparent drop-shadow-lg">
          FeedBot
        </h1>
        {/* Tagline */}
        <h5 className="text-xl font-bold text-black ">
        "Transforming feedback into actionable insights with AI-powered sentiment analysis."
        </h5>
      </div>

      {/* Buttons */}
      <div className="relative flex space-x-4 mt-8">
        <button onClick={()=>navigate('/login')} 
         className="bg-zinc-400 hover:bg-zinc-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg">
          Login
        </button>
        <button  onClick={()=>navigate('/signup')}
         className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Landing1;