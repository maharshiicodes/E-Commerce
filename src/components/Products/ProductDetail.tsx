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
                    image_url : product.image_url,
                    maxQuantity : product.quantity
                });
            }
        }
        return(
        <>
        <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-900">
            <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
                <div className="w-full md:w-1/2 h-96 md:h-[600px] relative bg-gray-100">
                {product.quantity === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="bg-neutral-900 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-full shadow-md">
                Sold Out
            </span>
        </div>
    )}
                    <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className={`w-full h-full object-cover transition-transform duration-700 ease-in-out 
                                ${product.quantity === 0 ? 'opacity-60 grayscale' : 'group-hover:scale-110'}`
                                }
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
                        
                        <button className="flex-1 bg-black text-white py-4 px-8 rounded-full font-bold text-lg hover:bg-neutral-800 hover:shadow-xl transition-all active:scale-95
                        disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed disabled:hover:bg-neutral-300 disabled:hover:shadow-none disabled:active:scale-100"
                        disabled = {product.quantity === 0}
                        onClick = {(e) => handleClick(e, product)}>
                           {product.quantity === 0 ? 'Out of Stock' : 'Add to cart'}
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