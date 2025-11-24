import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './components/Home.tsx'
import Shop from './components/Shop.tsx'
import Cart from './components/Cart.tsx'
import Profile from './components/Profile.tsx'
import NavBar from './components/NavBar.tsx'
export default function App() {
  
  return (
    <div className="min-h-screen">
    <BrowserRouter>
    <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
    </div>
    

  )

}
