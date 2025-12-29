import React from "react";
import { useState } from "react";
import {useNavigate} from 'react-router-dom';
import {signUpUser , signInUser} from '../lib/auth';
import {motion} from 'framer-motion';

export default function Login(){
    const[email,setEmail] = useState<string>("");
    const [password , setPassword] = useState<string>("");
    const[username , setUsername] = useState<string>("");
    const[loading,setLoading] = useState<boolean>(false);
    const[isSignUp , setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async(e : React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        let result;
        if(isSignUp){
            result = await signUpUser(email,password,username);
        }else{
            result = await signInUser(email , password);
        }
        const {data , error} = result;
        if(error){
            alert(error.message);
            console.log(error.message);
        }else{
            console.log('Success login or signup');
            if(isSignUp){
            alert('Please check your email or gmail thenn signin');
            }
            navigate('/');
        }
       setLoading(false);
    };

    return(
        <div className = "min-h-screen flex items-center justify-center bg-black text-white">
           <div className="relative w-full max-w-md overflow-hidden rounded-lg p-[1px]">
            <motion.div 
            className="absolute inset-[-50%] bg-[conic-gradient(transparent_270deg,#3b82f6_360deg)]"
            animate={{ rotate: 360 }}
                    transition={{
                        duration: 10,
                        ease: "linear",
                        repeat: Infinity,
                    }}
            />
         <div className = " relative z-10 w-full h-full max-w-md bg-black p-8 rounded-lg">
            <h2 className = 'text-3xl font-bold mb-6 text-center'>
                {isSignUp ? 'Join Urban Thrift' : 'Welcome Back'}
            </h2>
           <form onSubmit = {handleAuth} className = "space-y-4">
             <div>
                <label className = "block text-gray-400 text-sm mb-1">Email</label>
                <input 
                type = "email"
                value = {email}
                onChange = {(e) => setEmail(e.target.value)}
                className = "w-full bg-black border border-neutral-700 rounded p-3 text-white focus:border-blue-500 outline-none"
                placeholder = "you@email.com"
                required
                />
             </div>
             <div>
                <label className = "block text-gray-400 text-sm mb-1">Password</label>
                <input 
                type = "password"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
                className = "w-full bg-black border border-neutral-700 rounded p-3 text-white focus:border-blue-500 outline-none"
                placeholder = "........"
                required
                />
             </div>
             {isSignUp && 
             <div>
                <label className = "block text-gray-400 text-sm mb-1">Username</label>
                <input 
                type = "text"
                value = {username}
                onChange = {(e) => setUsername(e.target.value)}
                className = "w-full bg-black border border-neutral-700 rounded p-3 text-white focus:border-blue-500 outline-none"
                placeholder = "John Doe"
                required
                />
             </div>}
             <button 
             disabled = {loading}
             className = "w-full bg-blue-500 text-white font-bold py-3 rounded hover:bg-blue-700 transition-colors disabled:opacity-50">
                {loading ? 'Processing...' : (isSignUp ? 'SignUp' : 'SignIn')}
             </button>
           </form>
           <p className = "mt-4 text-center text-gray-500 text-sm">
             {isSignUp ? 'Already have an account?' : "Don't have an account?"}{" "}
             <button
             onClick = {() => setIsSignUp(!isSignUp)}>
               {isSignUp ? "Login" : "SignUp"}
             </button>
           </p>
           </div>
         </div>
         
        </div>
    );
}