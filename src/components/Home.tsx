import React from "react";
import ProductListPage from "./Products/ProductListPage";

export default function Home() {
  return (
    <>
    <div className="
  min-h-screen w-full">

      <div className="p-8">
        <h1 className=" text-transparent bg-clip-text bg-linear-to-r from-neutral-700 to-neutral-300 font-montserrat font-extrabold sm:px-20 text-5xl">Welcome to Urban Thrift.</h1>
        <p className="mt-3 text-white font-mono font-bold sm:px-20 text-xl">Discover the best pieces at unbeatable prices.</p>
        <ProductListPage />
      </div>
      </div>
    </> 
  );
}
