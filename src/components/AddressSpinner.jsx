import React from "react";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-50">
      {/* Bouncing Dots */}
      <div className="flex gap-2">
        <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce"></div>
        <div
          className="h-4 w-4 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="h-4 w-4 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>

      {/* Loading Text */}
      <p className="mt-4 text-lg font-semibold text-gray-700">
        Loading, please wait...
      </p>
    </div>
  );
}

export default Loading;
