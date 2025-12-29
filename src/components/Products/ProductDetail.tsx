import React ,{useEffect , useState} from "react";
import{useParams }from "react-router-dom";
import supabase from "../../supabaseClient";
import {useCart} from '../../Context/CartContext.tsx'

type Product = {
    id:number;
    name:string;
    description:string;
    price:number;
    quantity:number;
    image_url : string;
}

export default function ProductDetail(){
    const {addToCart} = useCart();
        const { id } = useParams();
        const[product,setProduct] = useState<Product>();
        useEffect(() => {
            async function fetchProduct(){
                const { data , error} = await supabase
                .from("Products")
                .select("*")
                .eq("id", id)
                .single();

                if (error) {
                    console.error("Error fetching product:", error);
                } else {
                    setProduct(data);
                }
            }
            fetchProduct();
        } , [id])
        if(!product){
            return <div className="mt-10 ml-40 text-3xl text-white">Loading............</div>;   
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
        return(
        <>
        <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-900">
            <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
                <div className="w-full md:w-1/2 h-96 md:h-[600px] relative bg-gray-100">
                    <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                    <span className="text-gray-500 uppercase tracking-widest text-sm font-semibold mb-4">
                        Urban Threads Exclusive
                    </span>

                    <h1 className="text-4xl md:text-6xl font-black text-black mb-6 leading-tight">
                        {product.name}
                    </h1>

                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {product.description}
                    </p>

                    <div className="flex items-center gap-6 mt-auto">
                        <p className="text-3xl font-bold text-black">
                            ${product.price}
                        </p>
                        
                        <button className="flex-1 bg-black text-white py-4 px-8 rounded-full font-bold text-lg hover:bg-neutral-800 hover:shadow-xl transition-all active:scale-95"
                        onClick = {(e) => handleClick(e, product)}>
                            Add to Cart
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 flex gap-4 text-sm text-gray-400">
                        <span className="text-black">🚀 Fast Shipping</span>
                        <span>•</span>
                        <span className="text-black">💎 Verified Authentic</span>
                    </div>
                </div>
            </div>
        </div>
    );
        </>
    )
}