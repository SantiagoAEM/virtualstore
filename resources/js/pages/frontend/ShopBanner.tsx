import React from 'react'
import './hero.css';

export default function ShopBanner() {
  return (
    <div>ShopBanner

        <div className="hero bg-gray-100 min-h-screen flex items-center justify-center px-4">
  <div className="flex flex-col lg:flex-row items-center gap-8 max-w-4xl mx-auto">
    <img
      src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
      className="max-w-sm rounded-lg shadow-2xl"
    />
    <div>
      <h1 className="text-5xl font-bold mb-4">Box Office News!</h1>
      <p className="mb-6 text-gray-700">
        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
        quasi. In deleniti eaque aut repudiandae et a id nisi.
      </p>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">Get Started</button>
    </div>
  </div>
</div>
    </div>



  )
}
