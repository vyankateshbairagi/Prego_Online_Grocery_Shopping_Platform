import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
import { translations } from "../i18n/translations";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{

    const currency = import.meta.env.VITE_CURRENCY;
    const FREE_DELIVERY_THRESHOLD = 99;
    const DELIVERY_FEE = 30;

    const navigate = useNavigate();
    const [language, setLanguage] = useState(() => localStorage.getItem("language") || "en");
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])

    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState({})

    const t = (key, params = {}) => {
        const selectedLanguage = translations[language] ? language : "en";
        const template = translations[selectedLanguage]?.[key] ?? translations.en?.[key] ?? key;

        if (typeof template !== "string") return key;

        return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
            return acc.replaceAll(`{{${paramKey}}}`, String(paramValue));
        }, template);
    }

    const changeLanguage = (lang) => {
        if (!translations[lang]) return;
        setLanguage(lang);
        localStorage.setItem("language", lang);
    }

    const getCategoryLabel = (category) => {
        if (!category) return "";
        const normalized = String(category).trim().toLowerCase();
        const key = `category.${normalized}`;
        const translated = t(key);
        return translated === key ? category : translated;
    }

  // Fetch Seller Status
  const fetchSeller = async ()=>{
    try {
        const {data} = await axios.get('/api/seller/is-auth');
        if(data.success){
            setIsSeller(true)
        }else{
            setIsSeller(false)
        }
    } catch (error) {
        setIsSeller(false);
        console.error("Error fetching seller status:", error);
        toast.error(error.message || "Failed to fetch seller status");
    }
  }

    // Fetch User Auth Status , User Data and Cart Items
const fetchUser = async ()=>{
    try {
        const {data} = await axios.get('/api/user/is-auth');
        if (data.success){
            setUser(data.user)
            setCartItems(data.user.cartItems)
        }
    } catch (error) {
        setUser(null)
        toast.error(error.message || "Failed to fetch user data")
    }
}



    // Fetch All Products
    const fetchProducts = async ()=>{
        try {
            const { data } = await axios.get('/api/product/list')
            if(data.success){
                setProducts(data.products)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

// Add Product to Cart
const addToCart = (itemId)=>{
    let cartData = structuredClone(cartItems);

    if(cartData[itemId]){
        cartData[itemId] += 1;
    }else{
        cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success(t("cart.added"))
}

  // Update Cart Item Quantity
  const updateCartItem = (itemId, quantity)=>{
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData)
        toast.success(t("cart.updated"))
  }

// Remove Product from Cart
const removeFromCart = (itemId)=>{
    let cartData = structuredClone(cartItems);
    if(cartData[itemId]){
        cartData[itemId] -= 1;
        if(cartData[itemId] === 0){
            delete cartData[itemId];
        }
    }
    toast.success(t("cart.removed"))
    setCartItems(cartData)
}

  // Get Cart Item Count
  const getCartCount = ()=>{
    let totalCount = 0;
    for(const item in cartItems){
        totalCount += cartItems[item];
    }
    return totalCount;
  }

// Get subtotal (without delivery fee)
const getSubtotal = () => {
    let totalAmount = 0;
    for (const items in cartItems){
        let itemInfo = products.find((product)=> product._id === items);
        if(cartItems[items] > 0 && itemInfo){
            totalAmount += itemInfo.offerPrice * cartItems[items]
        }
    }
    return Math.floor(totalAmount * 100) / 100;
}

// Get delivery fee
const getDeliveryFee = () => {
    return getSubtotal() >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

// Check if order qualifies for free delivery
const hasFreeDelivery = () => {
    return getSubtotal() >= FREE_DELIVERY_THRESHOLD;
}

// Get Cart Total Amount (including delivery fee)
const getCartAmount = () => {
    return getSubtotal() + getDeliveryFee();
}


    useEffect(()=>{
        fetchUser()
        fetchSeller()
        fetchProducts()
    },[])

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    // Update Database Cart Items
    useEffect(()=>{
        const updateCart = async ()=>{
            try {
                const { data } = await axios.post('/api/cart/update', {cartItems})
                if (!data.success){
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }

        if(user){
            updateCart()
        }
    },[cartItems])

    const value = {
        navigate, user, setUser, setIsSeller, isSeller,
        showUserLogin, setShowUserLogin, products, currency,
        addToCart, updateCartItem, removeFromCart, cartItems,
        searchQuery, setSearchQuery, getCartAmount, getCartCount,
        axios, fetchProducts, setCartItems,
        FREE_DELIVERY_THRESHOLD, DELIVERY_FEE, hasFreeDelivery,
        getDeliveryFee, getSubtotal,
        language, changeLanguage, t, getCategoryLabel
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}
