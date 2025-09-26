import React from 'react';

const UpdateProblemTest = () => {
  console.log("UpdateProblemTest component loaded successfully!");
  
  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">Update Problem - Test Page</h1>
      <div className="text-center">
        <p className="text-lg mb-4">This is a test page to verify the route is working.</p>
        <p className="text-sm text-gray-600">Check the console for debug messages.</p>
      </div>
    </div>
  );
};

export default UpdateProblemTest;