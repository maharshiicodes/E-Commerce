import React from "react";
import {useState, useEffect} from "react";
import  supabase  from "../../supabaseClient.tsx";

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

    useEffect(() => {
        getProducts();
    } ,[])

    async function getProducts(){
        console.log("Fetching products...");
        const {data : productData , error} = await supabase.from("Products").select("*");
        setIsLoading(false);
        console.log("Products fetched:", productData, error);

    if(error){
        console.error("Error fetching products", error.message);
    }
    if(productData){
        setProducts(productData as Product[]);
    }
    }
    return(
        <div>
        {Loading ? (
             <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
        </div>
        ) :(

        
       <div className="flex items-center justify-center flex-wrap gap-10">
            {products.map((product : Product) => (
              <div key={product.id} className="mt-10 p-4 rounded-lg border border-gray-200 w-80 h-70 hover:shadow-lg transition-shadow">
                <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded-md transition-transform duration-300 ease-in-out aspect-square hover:scale-105" />
                <h3 className="font-bold font-montserrat mt-5">{product.name}</h3>
                <p className="font-extrabold">{product.price - 11}/-</p>
              </div>
            ))}
       </div>
        )}
    </div>
    )
}

export default ProductListPage;