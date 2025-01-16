import React from 'react';

const Landing3 = () => {
  return (
    <div className="h-screen w-screen relative px-4 py-3 bg-gradient-to-b">
      {/* Full screen container with video background */}
      <div className="h-full w-full flex flex-col justify-between">
        
        {/* Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          className="h-full w-full object-cover opacity-50 translate-y-[-3%]" 
          src="/My_Video/Landing_Page3.mp4"
          type="video/mp4"
        ></video>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          {/* Main Title */}
          <h1 className="font-extrabold text-[5vw] bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            Empowering Education Through Feedback.
          </h1>
          {/* Subtitle */}
          <p className="text-lg mt-4 text-black italic">
            Explore the possibilities, unleash the insights.
          </p>
        </div>

        {/* Footer */}
        <div className="absolute bottom-5 w-full text-center text-gray-400 text-sm">
          <p>&copy; 2025 FeedBot. All Rights Reserved.</p>
          <p>Made with ❤ for a better learning experience.</p>
        </div>
      </div>
    </div>
  );
}

export default Landing3;