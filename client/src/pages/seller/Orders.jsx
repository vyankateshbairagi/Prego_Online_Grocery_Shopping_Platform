import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets, dummyOrders } from '../../assets/assets'
import toast from 'react-hot-toast'

const Orders = () => {
    const {currency, axios, t} = useAppContext()
    const [orders, setOrders] = useState([])

    const fetchOrders = async () =>{
        try {
            const { data } = await axios.get('/api/order/seller');
            if(data.success){
                setOrders(data.orders)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };


    useEffect(()=>{
        fetchOrders();
    },[])


  return (
    <div className='no-scrollbar flex-1 overflow-y-scroll'>
    <div className="w-full md:p-10 p-4 space-y-3 md:space-y-4">
            <h2 className="text-lg md:text-2xl font-semibold text-gray-900">{t("seller.ordersList")}</h2>
            {orders.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                    <p className="text-gray-500 text-center">{t("seller.noOrders")}</p>
                </div>
            ) : (
                orders.map((order, index) => (
                    <div key={order?._id || index} className="flex flex-col gap-3 md:gap-4 p-3 md:p-5 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition">

                        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                            <div className="flex gap-3 flex-1 min-w-0">
                                <img className="w-10 h-10 md:w-12 md:h-12 object-cover flex-shrink-0" src={assets.box_icon} alt="boxIcon" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs md:text-sm font-medium text-gray-900 mb-1">{t("seller.items")}</p>
                                    {(order?.items || []).map((item, index) => (
                                        <div key={index} className="text-xs md:text-sm text-gray-700">
                                            <p className="truncate">
                                                {item?.product?.name || t("seller.productUnavailable")}{" "}
                                                <span className="text-primary font-semibold">x{item?.quantity ?? 0}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-xs md:text-sm font-medium text-gray-900 mb-1">{t("seller.deliveryTo")}</p>
                                <p className='text-xs md:text-sm text-black font-semibold'>
                                    {order?.address?.firstName || ""} {order?.address?.lastName || ""}</p>
                                <p className="text-xs md:text-sm text-gray-600 truncate">{order?.address?.street || "-"}, {order?.address?.city || "-"}</p>
                                <p className="text-xs md:text-sm text-gray-600"> {order?.address?.state || "-"}, {order?.address?.zipcode || "-"}</p>
                                <p className="text-xs md:text-sm text-gray-600">{order?.address?.phone || "-"}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">{t("common.amount")}</p>
                                <p className="font-bold text-primary text-sm md:text-base">{currency}{order?.amount ?? 0}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">{t("common.payment")}</p>
                                <p className="text-xs md:text-sm font-medium text-gray-900">{order?.paymentType || "-"}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">{t("common.date")}</p>
                                <p className="text-xs md:text-sm font-medium text-gray-900">{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">{t("common.status")}</p>
                                <p className={`text-xs md:text-sm font-semibold px-2 py-1 rounded w-fit ${order?.isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                    {order?.isPaid ? t("seller.paid") : t("seller.pending")}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
        </div>
  )
}

export default Orders
