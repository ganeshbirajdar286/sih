import React from 'react';

const DOSHA_IMAGES = {
  header: "/ayur.png", 
  vata: "/vata.png",
  pitta: "/pitta.png",
  kapha: "/kapha.png"
};

const WeightTrend = () => {
  return (
    <div className="max-w-6xl mx-auto p-8 bg-white">
      <div className="mb-12 flex justify-center">
        <img 
          src={DOSHA_IMAGES.header} 
          alt="Ayurvedic Doshas Characteristics" 
          className="w-full max-w-4xl h-auto shadow-sm rounded-lg"
        />
      </div>
      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="flex flex-col items-center text-center">
          <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-purple-100 mb-4 shadow-md">
            <img src={DOSHA_IMAGES.vata} alt="Vata" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-2xl font-serif text-purple-700 uppercase tracking-widest">Vata</h3>
          <p className="text-gray-500 italic">Air & Ether</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-orange-100 mb-4 shadow-md">
            <img src={DOSHA_IMAGES.pitta} alt="Pitta" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-2xl font-serif text-orange-700 uppercase tracking-widest">Pitta</h3>
          <p className="text-gray-500 italic">Fire & Water</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-teal-100 mb-4 shadow-md">
            <img src={DOSHA_IMAGES.kapha} alt="Kapha" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-2xl font-serif text-teal-700 uppercase tracking-widest">Kapha</h3>
          <p className="text-gray-500 italic">Earth & Water</p>
        </div>

      </div>
    </div>
  );
};

export default WeightTrend;