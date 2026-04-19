import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'

const ProductList = () => {
    const {products, currency, axios, fetchProducts, t, getCategoryLabel} = useAppContext()
    const safeProducts = products || []
    const [updatingStockId, setUpdatingStockId] = useState(null)

    const toggleStock = async (id, inStock)=>{
        if (updatingStockId === id) return;

        try {
            setUpdatingStockId(id)
            const { data } = await axios.post('/api/product/stock', {id, inStock});
            if (data.success){
                await fetchProducts();
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setUpdatingStockId(null)
        }
    }

    const deleteProductHandler = async (id, productName)=>{
        if(!globalThis.confirm(t("seller.deleteConfirm", { name: productName }))){
            return;
        }
        
        try {
            const { data } = await axios.post('/api/product/delete', {id});
            if (data.success){
                fetchProducts();
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } 
    }
  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">{t("seller.allProducts")}</h2>
                <div className="md:hidden space-y-3">
                    {safeProducts.map((product) => (
                        <div key={product._id} className="rounded-md border border-gray-500/20 bg-white p-3">
                            <div className="flex gap-3">
                                <div className="border border-gray-300 rounded p-2 shrink-0">
                                    <img src={product?.image?.[0]} alt="Product" className="w-16 h-16 object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-sm truncate">{product?.name || t("seller.unnamedProduct")}</p>
                                    <p className="text-xs text-gray-500 mt-1">{product?.category ? getCategoryLabel(product.category) : "-"}</p>
                                    <p className="text-sm font-medium mt-2">{currency}{product?.offerPrice ?? 0}</p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700">{t("seller.inStock")}</span>
                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                        <span className="sr-only">{t("seller.toggleStock")}</span>
                                        <input
                                            onChange={(e)=> toggleStock(product._id, e.target.checked)}
                                            checked={Boolean(product.inStock)}
                                            disabled={updatingStockId === product._id}
                                            type="checkbox"
                                            className="sr-only peer"
                                        />
                                        <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                        <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                    </label>
                                </div>
                                <button 
                                    onClick={() => deleteProductHandler(product._id, product.name)}
                                    className="p-2 hover:bg-red-50 rounded transition-colors"
                                    title={t("seller.deleteProduct")}
                                >
                                    <img src={assets.remove_icon} alt="Delete" className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hidden md:block max-w-5xl w-full overflow-x-auto rounded-md bg-white border border-gray-500/20">
                    <table className="w-full min-w-[760px] table-auto">
                        <thead className="text-gray-900 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">{t("common.product")}</th>
                                <th className="px-4 py-3 font-semibold truncate">{t("common.category")}</th>
                                <th className="px-4 py-3 font-semibold truncate">{t("seller.sellingPrice")}</th>
                                <th className="px-4 py-3 font-semibold truncate">{t("seller.inStock")}</th>
                                <th className="px-4 py-3 font-semibold truncate">{t("common.action")}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-500">
                            {safeProducts.map((product) => (
                                <tr key={product._id} className="border-t border-gray-500/20">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                        <div className="border border-gray-300 rounded p-2">
                                            <img src={product?.image?.[0]} alt="Product" className="w-16 h-16 object-cover" />
                                        </div>
                                        <span className="truncate max-w-[260px]">{product?.name || t("seller.unnamedProduct")}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{product?.category ? getCategoryLabel(product.category) : "-"}</td>
                                    <td className="px-4 py-3">{currency}{product?.offerPrice ?? 0}</td>
                                    <td className="px-4 py-3">
                                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                            <span className="sr-only">{t("seller.toggleStock")}</span>
                                            <input
                                                onChange={(e)=> toggleStock(product._id, e.target.checked)}
                                                checked={Boolean(product.inStock)}
                                                disabled={updatingStockId === product._id}
                                                type="checkbox"
                                                className="sr-only peer"
                                            />
                                            <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                            <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                        </label>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button 
                                            onClick={() => deleteProductHandler(product._id, product.name)}
                                            className="p-2 hover:bg-red-50 rounded transition-colors"
                                            title={t("seller.deleteProduct")}
                                        >
                                            <img src={assets.remove_icon} alt="Delete" className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
  )
}

export default ProductList
