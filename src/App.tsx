import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home.tsx'
import Shop from './components/Shop.tsx'
import Cart from './components/Cart.tsx'
import Profile from './components/Profile.tsx'
import NavBar from './components/NavBar.tsx'
import ProductDetail from './components/Products/ProductDetail.tsx'
import Login from './components/Login.tsx'
import { CartProvider } from './Context/CartContext.tsx';
import  supabase  from './supabaseClient.ts';
import type { Session } from '@supabase/supabase-js';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [])

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <BrowserRouter>
        <CartProvider>
          {session && <NavBar />}
          <Routes>
            <Route 
              path="/login" 
              element={!session ? <Login /> : <Navigate to="/" />} 
            />
            <Route path="/" element={session ? <Home /> : <Navigate to="/login" />} />
            <Route path="/shop" element={session ? <Shop /> : <Navigate to="/login" />} />
            <Route path="/cart" element={session ? <Cart /> : <Navigate to="/login" />} />
            <Route path="/profile" element={session ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/shop/:id" element={session ? <ProductDetail /> : <Navigate to="/login" />} />
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </div>
  )
}