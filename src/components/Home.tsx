import React from "react";
import ProductListPage from "./Products/ProductListPage";

export default function Home() {
  return (
    <>
    <div className="min-h-screen w-full bg-neutral-950 selection:bg-white selection:text-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-neutral-800/30 via-transparent to-transparent blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12 md:pt-32 md:pb-20 flex flex-col items-center text-center">
            <h1 className="font-montserrat font-black text-6xl md:text-8xl lg:text-9xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-600 mb-6 animate-fade-in-up">
                Urban Thrift.
            </h1>
            
            <p className="font-mono text-neutral-400 text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
                Discover the best pieces at unbeatable prices. 
                <span className="block mt-2 text-neutral-600 text-sm">EST. 2025 • VERIFIED AUTHENTIC</span>
            </p>
        </div>

        <div className="relative z-10 max-w-8xl mx-auto pb-24">
            <ProductListPage />
        </div>
    </div>
    </> 
  );
}
