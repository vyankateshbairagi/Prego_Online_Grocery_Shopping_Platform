import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const loadRazorpayScript = () => {
    if (globalThis.Razorpay) return Promise.resolve(true);

    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const Cart = () => {
    const {products, currency, cartItems, removeFromCart, getCartCount, updateCartItem, navigate, getCartAmount, getSubtotal, getDeliveryFee, axios, user, setCartItems, hasFreeDelivery, setShowUserLogin, t} = useAppContext()
    const [cartArray, setCartArray] = useState([])
    const [addresses, setAddresses] = useState([])
    const [showAddress, setShowAddress] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [paymentOption, setPaymentOption] = useState("COD")

    const cleanupFailedOnlineOrder = async (orderId) => {
        if (!orderId) return;

        try {
            await axios.post('/api/order/razorpay/fail', { orderId });
        } catch {
            // Avoid blocking UI for cleanup failures.
        }
    }

    const openRazorpayCheckout = async (paymentData) => {
        const scriptLoaded = await loadRazorpayScript();

        if (!scriptLoaded) {
            await cleanupFailedOnlineOrder(paymentData.orderId)
            toast.error(t("cart.razorpayLoadFail"))
            return;
        }

        let paymentHandled = false;

        const options = {
            key: paymentData.keyId,
            amount: paymentData.amount,
            currency: paymentData.currency,
            name: "Prego",
            description: "Order Payment",
            order_id: paymentData.razorpayOrderId,
            handler: async (response) => {
                try {
                    paymentHandled = true;
                    const { data } = await axios.post('/api/order/razorpay/verify', {
                        orderId: paymentData.orderId,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    })

                    if (data.success) {
                        toast.success(data.message)
                        setCartItems({})
                        navigate('/my-orders')
                    } else {
                        await cleanupFailedOnlineOrder(paymentData.orderId)
                        toast.error(data.message)
                    }
                } catch (error) {
                    await cleanupFailedOnlineOrder(paymentData.orderId)
                    toast.error(error.message)
                }
            },
            modal: {
                ondismiss: async () => {
                    if (paymentHandled) return;
                    await cleanupFailedOnlineOrder(paymentData.orderId)
                },
            },
        };

        const razorpay = new globalThis.Razorpay(options);

        razorpay.on("payment.failed", async () => {
            paymentHandled = true;
            await cleanupFailedOnlineOrder(paymentData.orderId)
            toast.error(t("cart.paymentFail"))
        });

        razorpay.open();
    }

    const getCart = ()=>{
        let tempArray = []
        for(const key in cartItems){
            const product = products.find((item)=>item._id === key)
            product.quantity = cartItems[key]
            tempArray.push(product)
        }
        setCartArray(tempArray)
    }

    const getUserAddress = async ()=>{
        try {
            const {data} = await axios.get('/api/address/get');
            if (data.success){
                setAddresses(data.addresses)
                if(data.addresses.length > 0){
                    setSelectedAddress(data.addresses[0])
                }
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    const placeOrder = async ()=>{
        try {
            if(!selectedAddress){
                return toast.error(t("cart.selectAddress"))
            }

            // Place Order with COD
            if(paymentOption === "COD"){
                const {data} = await axios.post('/api/order/cod', {
                    userId: user._id,
                    items: cartArray.map(item=> ({product: item._id, quantity: item.quantity})),
                    address: selectedAddress._id
                })

                if(data.success){
                    toast.success(data.message)
                    setCartItems({})
                    navigate('/my-orders')
                }else{
                    toast.error(data.message)
                }
            }else{
                // Place Order with Razorpay
                const {data} = await axios.post('/api/order/razorpay', {
                    userId: user._id,
                    items: cartArray.map(item=> ({product: item._id, quantity: item.quantity})),
                    address: selectedAddress._id
                })

                if(data.success){
                    await openRazorpayCheckout(data)
                }else{
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        if(products.length > 0 && cartItems){
            getCart()
        }
    },[products, cartItems])


    useEffect(()=>{
        if(user){
            if (user.address) {
                setSelectedAddress({ street: user.address });
            }
            getUserAddress()
        }
    },[user])
    
    return products.length > 0 && cartItems ? (
        <div className="flex flex-col lg:flex-row mt-16 gap-8 lg:gap-4">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    {t("cart.title")} <span className="text-sm text-primary">{t("cart.items", { count: getCartCount() })}</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">{t("cart.productDetails")}</p>
                    <p className="text-center">{t("cart.subtotal")}</p>
                    <p className="text-center">{t("common.action")}</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={()=>{
                                navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0,0)
                            }} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>{t("cart.weight")}: <span>{product.weight || t("common.na")}</span></p>
                                    <div className='flex items-center'>
                                        <p>{t("cart.qty")}:</p>
                                        <select onChange={e => updateCartItem(product._id, Number(e.target.value))}  value={cartItems[product._id]} className='outline-none'>
                                            {new Array(Math.max(cartItems[product._id], 9)).fill('').map((_, index) => (
                                                <option key={index} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">{currency}{product.offerPrice * product.quantity}</p>
                        <button onClick={()=> removeFromCart(product._id)} className="cursor-pointer mx-auto">
                            <img src={assets.remove_icon} alt="remove" className="inline-block w-6 h-6" />
                        </button>
                    </div>)
                )}

                <button onClick={()=> {navigate("/products"); scrollTo(0,0)}} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                    <img className="group-hover:-translate-x-1 transition" src={assets.arrow_right_icon_colored} alt="arrow" />
                    {t("cart.continueShopping")}
                </button>

            </div>

            <div className="w-full lg:w-[380px] bg-gray-100/40 p-5 lg:p-6 border border-gray-300/70 rounded-lg lg:sticky lg:top-20 lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto">
                <h2 className="text-xl md:text-xl font-medium">{t("cart.orderSummary")}</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">{t("cart.deliveryAddress")}</p>
                    <div className="relative flex justify-between items-start mt-2">
                        {(() => {
                            let addressText = t("cart.noAddress");
                            if (selectedAddress) {
                                if (selectedAddress.street && !selectedAddress.city) {
                                    addressText = selectedAddress.street;
                                } else {
                                    addressText = `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`;
                                }
                            }
                            return (
                                <p className="text-gray-500">
                                    {addressText}
                                </p>
                            );
                        })()}
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            {t("cart.change")}
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                               {addresses.map((address, index)=>(
                                <p onClick={() => {setSelectedAddress(address); setShowAddress(false)}} className="text-gray-500 p-2 hover:bg-gray-100">
                                    {address.street}, {address.city}, {address.state}, {address.country}
                                </p>
                            )) }
                                <p onClick={() => navigate("/add-address")} className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10">
                                    {t("cart.addAddress")}
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">{t("cart.paymentMethod")}</p>

                    <select onChange={e => setPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">{t("cart.cod")}</option>
                        <option value="Online">{t("cart.online")}</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>{t("cart.subtotal")}</span><span>{currency}{getSubtotal()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>{t("cart.shippingFee")}</span>
                        {hasFreeDelivery() ? (
                            <span className="text-green-600">{t("common.free")}</span>
                        ) : (
                            <span className="text-gray-500">{currency}{getDeliveryFee()}</span>
                        )}
                    </p>
                    <p className="flex justify-between">
                        <span>{t("cart.tax")}</span><span>{currency}{getSubtotal() * 2 / 100}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>{t("cart.totalAmount")}</span><span>
                            {currency}{getCartAmount() + getSubtotal() * 2 / 100}</span>
                    </p>
                </div>

                {user ? (
                    <button 
                        onClick={placeOrder} 
                        className="w-full py-3 mt-8 cursor-pointer bg-primary hover:bg-primary-dull text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg text-base md:text-lg"
                    >
                        {paymentOption === "COD" ? t("cart.placeOrder") : t("cart.proceedCheckout")}
                    </button>
                ) : (
                    <button 
                        onClick={() => setShowUserLogin(true)}
                        className="w-full py-3 mt-8 cursor-pointer bg-primary hover:bg-primary-dull text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg text-base md:text-lg"
                    >
                        {t("cart.proceedLogin")}
                    </button>
                )}
            </div>
        </div>
    ) : null
}

export default Cart;