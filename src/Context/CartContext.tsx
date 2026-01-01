import React, { createContext, useState, type ReactNode, useContext, useEffect } from 'react';

type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;     
    maxQuantity: number;  
    description: string;
    image_url: string;
}

type CartContextType = {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: number) => void;
    increaseQuantity: (id: number) => void;
    decreaseQuantity: (id: number) => void;
    cartTotal: number;
    clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {

    const [items, setItems] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem("urban-cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("urban-cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
        setItems((items) => {
            const existingItem = items.find((item) => item.id === product.id);
            if (existingItem) {
                return items.map((item) => {
                    
                    if (item.id === product.id) {
                        
                        const newQuantity = item.quantity < item.maxQuantity ? item.quantity + 1 : item.quantity;
                        
                       
                        if(item.quantity >= item.maxQuantity) alert(`Sorry, only ${item.maxQuantity} available!`);
                        
                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                })
            }
            return [...items, { ...product, quantity: 1 }]
        })
    }

    const removeFromCart = (id: number) => {
        setItems((items) => items.filter((item) => item.id !== id));
    }

    const increaseQuantity = (id: number) => {
        setItems((items) => {
            return items.map((item) => {
               
                if (item.id === id && item.quantity < item.maxQuantity) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            })
        })
    }

    const decreaseQuantity = (id: number) => {
        setItems((items) => {
            return items.map((item) => {
                if (item.id === id) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            }).filter((item) => item.quantity > 0); 
        })
    }

    const clearCart = () => {
        setItems([]);
    }

    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, cartTotal, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};