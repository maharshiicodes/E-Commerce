import React from "react";
import {useState, useEffect} from "react";
import  supabase  from "../../supabaseClient.ts";
import {Link} from "react-router-dom";
import {useCart} from '../../Context/CartContext.tsx'
import {useContext} from 'react';

type Product = {
    id:number;
    name:string;
    description:string;
    price:number;
    quantity:number;
    image_url : string;
}


const ProductListPage : React.FC = () => {
    const[products,setProducts] = useState<Product[]>([]);
    const[Loading,setIsLoading] = useState<boolean>(true);
    const {addToCart} = useCart();

    useEffect(() => {
        getProducts();
    } ,[])

    async function getProducts(){
        console.log("Fetching products...");
        const {data : productData , error} = await supabase.from("Products").select("*").limit(8);
        setIsLoading(false);
        console.log("Products fetched:", productData, error);

    if(error){
        console.error("Error fetching products", error.message);
    }
    if(productData){
        setProducts(productData as Product[]);
    }
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
   return (
        <div className="min-h-screen bg-neutral-900 px-6 py-12">
            <div className="max-w-7xl mx-auto">
                {Loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="bg-neutral-800 rounded-3xl p-4 animate-pulse">
                                <div className="aspect-[4/5] bg-neutral-700 rounded-2xl mb-4"></div>
                                <div className="h-6 bg-neutral-700 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-neutral-700 rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product: Product) => (
                            <Link key={product.id} to={`/shop/${product.id}`} className="group">
                                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
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
                                            onClick={(e) => handleClick(e, product)}>Add To Cart</button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
    
}

export default ProductListPage;