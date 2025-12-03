'use client'

import React from 'react'

export const BackgroundDecoration: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Desktop Layout - meer afbeeldingen */}
      <div className="hidden md:block">
        {/* Kroon posities */}
        <img 
          src="/kroon.png" 
          alt="" 
          className="absolute top-[10%] left-[5%] w-10 h-10 opacity-[0.75]" 
        />
        <img 
          src="/kroon.png" 
          alt="" 
          className="absolute top-[45%] left-[25%] w-10 h-10 opacity-[0.75]" 
        />
        <img 
          src="/kroon.png" 
          alt="" 
          className="absolute top-[30%] left-[15%] w-10 h-10 opacity-[0.75]" 
        />

        {/* Pootje posities */}
        <img 
          src="/pootje.png" 
          alt="" 
          className="absolute top-[15%] right-[15%] w-8 h-8 opacity-[0.75]" 
        />
        <img 
          src="/pootje.png" 
          alt="" 
          className="absolute top-[55%] right-[25%] w-8 h-8 opacity-[0.75]" 
        />
        <img 
          src="/pootje.png" 
          alt="" 
          className="absolute top-[60%] right-[15%] w-8 h-8 opacity-[0.75]" 
        />

        {/* Kipje posities */}
        <img 
          src="/kipje.png" 
          alt="" 
          className="absolute bottom-[20%]/ left-[10%] w-9 h-9 opacity-[0.75]" 
        />
        <img 
          src="/kipje.png" 
          alt="" 
          className="absolute top-[20%] left-[45%] w-9 h-9 opacity-[0.75]" 
        />

        {/* Been posities */}
        <img 
          src="/been.png" 
          alt="" 
          className="absolute bottom-[25%] right-[10%] w-6 h-6 opacity-[0.75]" 
        />
        <img 
          src="/been.png" 
          alt="" 
          className="absolute bottom-[30%] left-[55%] w-6 h-6 opacity-[0.75]" 
        />
        <img 
          src="/been.png" 
          alt="" 
          className="absolute top-[25%] right-[30%] w-6 h-6 opacity-[0.75]" 
        />
      </div>

      {/* Mobile Layout - minder afbeeldingen */}
      <div className="block md:hidden">
        {/* Kroon */}
        <img 
          src="/kroon.png" 
          alt="" 
          className="absolute top-[10%] left-[8%] w-6 h-6 opacity-[0.65]" 
        />
        <img 
          src="/kroon.png" 
          alt="" 
          className="absolute top-[50%] left-[20%] w-6 h-6 opacity-[0.65]" 
        />

        {/* Pootje */}
        <img 
          src="/pootje.png" 
          alt="" 
          className="absolute top-[20%] right-[12%] w-5 h-5 opacity-[0.65]" 
        />
        <img 
          src="/pootje.png" 
          alt="" 
          className="absolute bottom-[60%] right-[20%] w-5 h-5 opacity-[0.65]" 
        />

        {/* Kipje */}
        <img 
          src="/kipje.png" 
          alt="" 
          className="absolute top-[15%] left-[40%] w-6 h-6 opacity-[0.65]" 
        />
        <img 
          src="/kipje.png" 
          alt="" 
          className="absolute bottom-[15%] left-[8%] w-6 h-6 opacity-[0.65]" 
        />

        {/* Been */}
        <img 
          src="/been.png" 
          alt="" 
          className="absolute bottom-[20%] right-[15%] w-4 h-4 opacity-[0.65]" 
        />
        <img 
          src="/been.png" 
          alt="" 
          className="absolute top-[30%] right-[35%] w-4 h-4 opacity-[0.65]" 
        />
      </div>
    </div>
  )
}