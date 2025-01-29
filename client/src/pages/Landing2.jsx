import React from "react";

const Landing2 = () => {
  const useVideoBackground = true; // Set this flag to true for background video, false for image background

  return (
    <>
      <div className="h-screen relative p-3">
        {/* Background: Video or Image */}
        {useVideoBackground ? (
          <video
            className="absolute w-full h-full object-cover opacity-50 translate-y-[-3%]"
            autoPlay
            loop
            muted
            src="/My_Video/Landing_Page3.mp4" // Replace with your video URL
          ></video>
        ) : (
          <div
            className="absolute w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/Images/Background_Landing2.jpg')", // Replace with your image URL
            }}
          />
        )}

        {/* Project Overview Section */}
        <div className="absolute flex flex-col items-center justify-center text-center w-full h-full">
          {/* Problem Definition Section */}
          <div className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 p-6 rounded-2xl shadow-lg transform transition-transform hover:scale-105 cursor-pointer mb-10 w-[80%] max-w-[900px]">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
              Problem Definition
            </h2>
            <p className="text-gray-600 text-center">
              In today’s fast-paced world, it’s challenging for organizations to
              keep up with customer feedback manually. Our solution leverages UI
              Path to automate sentiment analysis, identifying positive,
              negative, or neutral sentiments, helping businesses make quicker
              and more informed decisions.
            </p>
          </div>

          {/* Features Section */}
          <div className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 p-6 rounded-2xl shadow-lg transform transition-transform hover:scale-105 cursor-pointer mb-10 w-[80%] max-w-[900px]">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
              Features
            </h2>
            <ul className="text-gray-600 text-lg list-disc pl-6 space-y-4">
              <li>
                Automated sentiment classification (positive, negative, neutral)
              </li>
              <li>Integration with UI Path for automation</li>
              <li>Real-time feedback analysis for quick decision-making</li>
              <li>Enhanced reporting tools for better insights</li>
              <li>Customizable to fit different business needs</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing2;