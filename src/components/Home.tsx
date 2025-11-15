import React from "react";
import ProductListPage from "./Products/ProductListPage";

export default function Home() {
  return (
    <>
    <div className="bg-white
  min-h-screen w-full">

      <div className="p-8">
        <h1 className=" text-black font-montserrat font-extrabold sm:px-20 text-3xl">Welcome to <span className="text-blue-500 text-4xl">Urban Threads.</span></h1>
        <p className="mt-3 text-black font-montserrat font-bold sm:px-20 text-xl">Discover the best products at unbeatable prices.</p>
        <ProductListPage />
      </div>
      </div>
    </> 
  );
}
