// import React , {useState} from "react";
// import {useCart} from '../Context/CartContext.tsx'
// import {useContext} from 'react';
// import supabase from "../supabaseClient.tsx";
// type CartItem = {
//     id : number;
//     name:string;
//     price:number;
//     quantity : number;
//     description : string;
//     image_url : string;
// }

// export default function Cart(){
//     const {items, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, cartTotal} = useCart() || {};
//     if(!items || !addToCart || !removeFromCart || !increaseQuantity || !decreaseQuantity || cartTotal === undefined) {
//     throw new Error("Cart context is not properly initialized");
// }
//      console.log("Yaha pe code aya sahi bc", items);
//     if(items.length === 0){
//         return(
//             <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">Your cart is empty</div>
//         )
//     }else{
//     return(
//         <div>
//           (
//                 <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-900">
//                     {items.map((product : CartItem) => (
//             <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
//                 <div className="w-full md:w-1/2 h-96 md:h-[600px] relative bg-gray-100">
//                     <img 
//                         src={product.image_url} 
//                         alt={product.name} 
//                         className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
//                     />
//                 </div>

//                 <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
//                     <span className="text-gray-500 uppercase tracking-widest text-sm font-semibold mb-4">
//                         Urban Threads Exclusive
//                     </span>

//                     <h1 className="text-4xl md:text-6xl font-black text-black mb-6 leading-tight">
//                         {product.name}
//                     </h1>

//                     <p className="text-gray-600 text-lg leading-relaxed mb-8">
//                         {product.description}
//                     </p>

//                     <div className="flex items-center gap-6 mt-auto">
//                         <p className="text-3xl font-bold text-black">
//                             ${product.price}
//                         </p>
                        
//                         <button className="flex-1 bg-black text-white py-4 px-8 rounded-full font-bold text-lg hover:bg-neutral-800 hover:shadow-xl transition-all active:scale-95">
//                             Add to Cart
//                         </button>
//                     </div>

//                     <div className="mt-8 pt-8 border-t border-gray-100 flex gap-4 text-sm text-gray-400">
//                         <span className="text-black">🚀 Fast Shipping</span>
//                         <span>•</span>
//                         <span className="text-black">💎 Verified Authentic</span>
//                     </div>
//                 </div>
//             </div>
//           ))}
//         </div>
//             )
        
//         </div>
//     )
// }}
import React, { useContext , useState } from "react";
import { useCart } from '../Context/CartContext.tsx';
import supabase from "../supabaseClient.ts";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductDetail from "./Products/ProductDetail.tsx";
type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    description: string;
    image_url: string;
}


export default function Cart() {
    const { items, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, cartTotal , clearCart } = useCart() || {};
    const [orderProcessing ,setOrderProcessing] = useState(false);
   
   async function fetchUser(){
     const { data: { user } } = await supabase.auth.getUser();
     if(user){
        return user.email;
     }
     return null;
   }
   
    const generateId = () => {
     return Date.now().toString(36) + Math.random().toString(36).substr(2);
}   ;

   async function checkOut(e : React.MouseEvent){
        e.preventDefault();
        setOrderProcessing(true);
        const email = await fetchUser();
        if (!email) {
            console.error("User not logged in");
            setOrderProcessing(false);
            return;
        }
        const {data , error} = await supabase
        .from("Orderss")
        .insert([
            {id : generateId() ,created_at : new Date().toISOString() , amount : cartTotal , order_detail : items , email_id :email}
        ])
        if(error){
            console.log("error inserting orders")
            console.log(error);
            setOrderProcessing(false);

        }else{
            console.log("data added successfully")
            setOrderProcessing(false);
            clearCart();
            updateQuantity(items)
        }
    }
    async function updateQuantity(items : CartItem[]){
       const updatePromise = items.map(async(item) => {
         const {data : Product , error : fetchError} = await supabase
         .from("Products")
         .select("quantity")
         .eq("id",item.id)
         .single();
       
       if(fetchError || !Product){
        console.error(`Could not fetch [roduct ${item.id}`, fetchError);
        return;
       }

      const newquantity = Product.quantity - item.quantity;
      if(newquantity < 0){
        console.error(`Not enough stock to update ${item.id}`);
      }
      const {error : updateError} = await supabase
      .from("Products")
      .update({quantity : newquantity})
      .eq("id",item.id)
      if(updateError){
        console.error(`Error while updating ${item.id}`,updateError)
      }})
      await Promise.all(updatePromise);
      console.log("All products updated")
    }

    if (!items || !addToCart || !removeFromCart || !increaseQuantity || !decreaseQuantity || cartTotal === undefined) {
        throw new Error("Cart context is not properly initialized");
    }
     
    console.log("Cart Items Loaded:", items);
    const naviagte = useNavigate();
    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 text-neutral-900 p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-full shadow-xl mb-6"
                >
                    <ShoppingBag size={64} className="text-neutral-300" />
                </motion.div>
                <h2 className="text-3xl font-black mb-2 tracking-tight">Your Cart is Empty</h2>
                <p className="text-neutral-500 mb-8 text-center max-w-md">
                    Looks like you haven't added any exclusive threads yet.
                </p>
                <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl"
                onClick = {() => naviagte('/shop')}
>
                    Start Shopping
                </button>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black mb-12 tracking-tight flex items-baseline gap-4"
                >
                    Shopping Cart 
                    <span className="text-lg font-medium text-neutral-400 bg-neutral-200 px-3 py-1 rounded-full">
                        {items.length} items
                    </span>
                </motion.h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <AnimatePresence mode='popLayout'>
                            {items.map((product: CartItem) => (
                                <motion.div
                                    layout
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    className="group bg-white rounded-3xl p-4 shadow-sm border border-neutral-100 flex flex-col md:flex-row gap-6 items-center overflow-hidden"
                                >
                                   
                                    <div className="w-full md:w-32 h-32 shrink-0 bg-neutral-100 rounded-2xl overflow-hidden relative">
                                        <img 
                                            src={product.image_url} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                        />
                                    </div>

                                    
                                    <div className="flex-1 w-full flex flex-col justify-between h-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold tracking-tight text-black">{product.name}</h3>
                                                <p className="text-neutral-500 text-sm line-clamp-1 mt-1">{product.description}</p>
                                            </div>
                                            <p className="text-lg font-bold font-mono text-black">
                                                ${(product.price * product.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 md:mt-0">
                                            
                                            <div className="flex items-center gap-3 bg-neutral-50 rounded-full p-1 border border-neutral-200">
                                                
                                                <motion.button 
                                                    whileTap={{ scale: 0.8 }}
                                                    onClick={() => decreaseQuantity(product.id)}
                                                    disabled={product.quantity <= 1}
                                                    className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 transition-colors"
                                                >
                                                    <Minus size={14} strokeWidth={3} />
                                                </motion.button>
                                                
                                                <span className="w-6 text-center font-bold text-sm">{product.quantity}</span>
                                                
                                                
                                                <motion.button 
                                                    whileTap={{ scale: 0.8 }}
                                                    onClick={() => increaseQuantity(product.id)}
                                                    className="w-8 h-8 flex items-center justify-center bg-black rounded-full shadow-sm text-white hover:bg-neutral-800 transition-colors"
                                                >
                                                    <Plus size={14} strokeWidth={3} />
                                                </motion.button>
                                            </div>

                                           
                                            <motion.button 
                                                whileHover={{ scale: 1.1, color: "#ef4444", backgroundColor: "#fef2f2" }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => removeFromCart(product.id)}
                                                className="p-2 text-neutral-400 rounded-full transition-all"
                                                title="Remove Item"
                                            >
                                                <Trash2 size={20} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    
                    <motion.div 
                        layout
                        className="lg:col-span-4 lg:sticky lg:top-8"
                    >
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-neutral-200/50 border border-neutral-100">
                            <h2 className="text-2xl font-black mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-neutral-500">
                                    <span>Subtotal</span>
                                    <span className="font-mono text-neutral-900">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold text-sm uppercase">Free</span>
                                </div>
                                <div className="h-px bg-neutral-100 my-4" />
                                <div className="flex justify-between text-xl font-bold text-black">
                                    <span>Total</span>
                                    <span className="font-mono">${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled = {orderProcessing}
                                onClick = {checkOut}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-neutral-500/30 transition-all"
                            >
                                Checkout
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </motion.button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-400 font-medium uppercase tracking-widest">
                                
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}