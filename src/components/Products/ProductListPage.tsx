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

    useEffect(() => {
        getProducts();
    } ,[])

    async function getProducts(){
        console.log("Fetching products...");
        const {data : productData , error} = await supabase.from("Products").select("*");

        console.log("Products fetched:", productData, error);

    if(error){
        console.error("Error fetching products", error.message);
    }
    if(productData){
        setProducts(productData as Product[]);
    }
    }
    return(
       <div className="flex items-center justify-center flex-wrap gap-4">
            {products.map((product : Product) => (
              <div key={product.id} className="bg-white mt-10 p-4 rounded-lg shadow-md w-80 h-70">
                <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded-md" />
                <h3 className="font-bold font-montserrat ">{product.name}</h3>
                <p>{product.price}</p>
              </div>
            ))}

       </div>
    )
}

export default ProductListPage;