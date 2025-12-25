import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-10">
      <div className="text-center">
        <h1 className="text-4xl font-black mb-4">MINIMAL APP MODE</h1>
        <p>If you see this, App.tsx is mounting correctly.</p>
      </div>
    </div>
  );
};

export default App;
