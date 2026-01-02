import React from "react";
import supabase from "../../supabaseClient";
import {useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
export default function AdminRoute(){
    const navigate = useNavigate();
    const[isAdmin , setIsAdmin]  = useState<boolean | null>(null);
    useEffect(() => {
        async function authorize(){
            const {data : {user}} = await supabase.auth.getUser();
            const role = user?.user_metadata?.role;
           setIsAdmin(role === 'admin');
        }
        authorize();
    } , [])
   if(isAdmin === null) return <p>Loading....</p>
   if(!isAdmin){
     navigate('/login');
   }
}