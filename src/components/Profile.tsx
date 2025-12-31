// import React from "react";
// import {useState , useEffect} from "react";
// import supabase from "../supabaseClient";
// export default function Profile() {

//     const[username,setUserName] = useState<string>("");
//     const[orders , setOrders] = useState([]);
//     useEffect(() => {
//       async function fetchUser(){
//         const {data : {user}}  = await supabase.auth.getUser();
//         if(user){
//             setUserName(user.user_metadata.first_name);
//             console.log("User set");
//         }
//       }
//       fetchUser();
//     }, []);
//     return(
//         <div className = "min-h-screen bg-white  flex  justify-start">
//           <div className = "h-150 border-black  rounded-2xl w-full max-w-xl flex flex-col items-start gap-5 mt-10 ml-10">
//           <p className = "text-black font-bold tracking-tight text-5xl mt-5 ml-5">Hello, {username}</p>
//           <div className = " flex flex-col items-start bg-transparent rounded-xl border border-black w-full max-w-xl min-h-full">
//             <h1 className = "text-center text-black text-4xl mt-10 ml-15 font-bold">Your Orders</h1>
//             </div>
//              {orders.length >0 && 
//              <div className = "">
                
                
//                 </div>}
//           </div>
//         </div>
//     )}
import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import { ShoppingBag, Package, ChevronRight } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

type Order = {
  id : number,
  image_url : string,
  name : string,
  description : string,
  quantity : number,
  price : number,
  date?: string
}
export default function Profile() {
  const [username, setUserName] = useState<string>("");
  const[email , setEmail] = useState<string>("");
  const [orders, setOrders] = useState<Order []>([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        
        setUserName(user.user_metadata.first_name || "User");
        setEmail(user.email || "User");
      }
      setLoading(false);
    }
    fetchUser();
  }, []);
  useEffect (() => {
    if(email){
      fetchOrders()
    }
  } , [email])
  async function fetchOrders(){
    const {data , error} = await supabase
    .from("Orderss")
    .select("order_detail,created_at")
    .eq("email_id",email);
    if(error){
      console.log(error);
    }
    if(data){
      const allItems = data.flatMap((orderBox : any) => {
          const order = orderBox.order_detail || [];
          return order.map((single : any) => ({
            ...single,
            date : orderBox.created_at
          }));
      });
      setOrders(allItems);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
       
        <div className="flex flex-col gap-2">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            My Account
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Hello, {loading ? "..." : username}
          </h1>
          <p className="text-gray-600">
            Welcome back to your dashboard. Here is what's happening.
          </p>
        </div>

        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px] flex flex-col">
          
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="w-6 h-6 text-blue-600" />
              Your Orders
            </h2>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
              {orders.length} Total
            </span>
          </div>

          <div className="flex-1 p-8">
            {orders.length > 0 ? (
              <div className="space-y-4 flex flex-col gap-2">
                
                
                {orders.map((order, index) => (
                  <div 
                    key={index} 
                    className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      <img 
                        className="w-20 h-20 rounded-lg object-cover border border-gray-100 bg-gray-50" 
                        src={order.image_url} 
                        alt={order.name}
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900 truncate pr-4 text-lg">
                            {order.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {order.description}
                          </p>
                        </div>
                        <p className="font-bold text-gray-900 whitespace-nowrap">
                          ${order.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-3 text-xs sm:text-sm">
                        <div className="px-2 py-1 bg-green-50 text-green-700 rounded-md font-medium border border-green-100">
                          Delivered
                        </div>
                        <span className="text-gray-400">•</span>
                        <p className="text-gray-500">
                          {order.date 
                            ? new Date(order.date).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric'
                              }) 
                            : "Recent"}
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center justify-center pl-2">
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                ))}
                
              </div>
            ) : (
              // Empty State
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400 py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-gray-300" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium text-lg">No orders yet</p>
                  <p className="text-sm max-w-xs mx-auto mt-1">
                    When you purchase items, they will appear here nicely organized.
                  </p>
                </div>
                <button 
                  className="mt-4 px-6 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  onClick={() => navigate('/shop')}
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}