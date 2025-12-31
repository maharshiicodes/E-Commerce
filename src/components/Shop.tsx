import React from "react";
import { useState , useEffect } from "react";
import  supabase  from "../supabaseClient.ts";
import {Link} from 'react-router-dom';
import {useCart} from '../Context/CartContext.tsx'

type Product = {
    id:number;
    name:string;
    description:string;
    price:number;
    quantity:number;
    image_url : string;
}

export default function Shop(){
    const [products,setProducts] = useState<Product[]>([]);
    const [loading,setLoading] = useState(true);
    const {addToCart} = useCart();
     async function fetchProduct(sortValue : string){
        setLoading(true);
        let query = supabase.from('Products').select('*');
        if(sortValue === 'low'){
            query = query.order('price',{ascending : true});
        }else if(sortValue === 'high'){
            query = query.order('price',{ascending : false});
        }else{
            query = query.order('id',{ascending : false});
        }
        const {data , error} = await query;
        if(error){
            console.log('Error fetching productsat shop ',error);
        }else{
            setProducts(data);
        }
        setLoading(false);
     }
     const handleClick  = (e: React.MouseEvent, product: Product) => {
         e.preventDefault();
         console.log("Adding to cart:", product);
         
         if(addToCart){
             addToCart({
                 id : product.id,
                 name : product.name,
                 price : product.price,
                 description : product.description,
                 image_url : product.image_url
             });
         }
     }
     useEffect(()=> {
        fetchProduct('default');
     },[])
    return(
        <div className="min-h-screen bg-black text-white">
          <div className="flex flex-col">
            <select 
            onChange = {(e) => fetchProduct(e.target.value)}
            className="bg-white rounded-md ml-5 text-black font-sans font-bold outline-none w-60 mb-10">
                <option value="default" className="hover:bg-black">Default</option>
                <option value="low">Sort By Price: Low to High</option>
                <option value="high">Sort By Price: High to Low</option>
            </select>
          {loading ? (
            <p>Loading....</p>
          ):(
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product: Product) => (
                            <Link key={product.id} to={`/shop/${product.id}`} className="group">
                                <div className="bg-white rounded-4xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                    <div className="relative overflow-hidden aspect-[4/5]">
                                        <img 
                                            src={product.image_url} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    
                                    <div className="p-6">
                                        <h3 className="font-bold text-xl text-black mb-2 truncate group-hover:text-neutral-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        
                                        <div className="flex justify-between items-center mt-4">
                                            <p className="text-lg font-extrabold text-neutral-900">
                                                ${product.price}
                                            </p>
                                            <span className="text-xs text-black font-bold uppercase tracking-widest border-b-2 border-black opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                View
                                            </span>
                                        </div>
                                        <div>
                                            <button className="flex-1 bg-black text-white py-4 px-8 rounded-full w-full mt-5 font-bold text-lg hover:bg-neutral-800 hover:shadow-xl transition-all active:scale-95"
                                            disabled = {product.quantity === 0}
                                            onClick={(e) => handleClick(e, product)}>Add To Cart</button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
            </div>
          )}
          <div>
          </div>
        </div>
        </div>
    )
}