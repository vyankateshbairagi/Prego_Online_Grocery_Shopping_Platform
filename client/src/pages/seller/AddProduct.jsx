import React, { useState } from 'react'
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {

    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');

    const {axios, t, getCategoryLabel} = useAppContext()

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();

            const productData = {
                name,
                description: description.split('\n'),
                category,
                price,
                offerPrice
            }

            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i])
            }

            const {data} = await axios.post('/api/product/add', formData)

            if (data.success){
                toast.success(data.message);
                setName('');
                setDescription('')
                setCategory('')
                setPrice('')
                setOfferPrice('')
                setFiles([])
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
        
      }

  return (
    <div className="no-scrollbar flex-1 overflow-y-scroll flex flex-col justify-between">
            <form onSubmit={onSubmitHandler} className="w-full md:p-10 p-4 space-y-4 md:space-y-5 max-w-4xl mx-auto">
                <div>
                    <p className="text-sm md:text-base font-medium text-gray-800">{t("seller.productImages")}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mt-3">
                        {new Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`} className="cursor-pointer">

                                <input onChange={(e)=>{
                                    const updatedFiles = [...files];
                                    updatedFiles[index] = e.target.files[0]
                                    setFiles(updatedFiles)
                                }}
                                type="file" id={`image${index}`} hidden />

                                <img className="w-full aspect-square object-cover rounded-lg border-2 border-dashed border-gray-300 hover:border-primary transition" src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area} alt="uploadArea" />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-1 w-full md:max-w-md">
                    <label className="text-sm md:text-base font-medium text-gray-800" htmlFor="product-name">{t("seller.productName")}</label>
                    <input onChange={(e)=> setName(e.target.value)} value={name}
                     id="product-name" type="text" placeholder={t("seller.enterProductName")} className="w-full outline-none md:py-2.5 py-2 px-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition text-sm md:text-base" required />
                </div>
                <div className="flex flex-col gap-1 w-full md:max-w-md">
                    <label className="text-sm md:text-base font-medium text-gray-800" htmlFor="product-description">{t("seller.productDescription")}</label>
                    <textarea onChange={(e)=> setDescription(e.target.value)} value={description}
                     id="product-description" rows={4} className="w-full outline-none md:py-2.5 py-2 px-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition resize-none text-sm md:text-base" placeholder={t("seller.enterProductDescription")}></textarea>
                </div>
                <div className="w-full flex flex-col gap-1 md:max-w-md">
                    <label className="text-sm md:text-base font-medium text-gray-800" htmlFor="category">{t("common.category")}</label>
                    {(() => {
                        // Health Picks categories
                        const healthPicksCategories = [
                            { text: "Healthy Food", path: "healthy-food" },
                            { text: "High Protein", path: "high-protein" },
                            { text: "Weight Loss", path: "weight-loss" },
                            { text: "Immunity Boost", path: "immunity" },
                        ];
                        // Default categories: filter out health picks from categories array
                        const defaultCategories = categories.filter(
                            (cat) => !healthPicksCategories.some(hp => hp.path === cat.path)
                        );
                        return (
                            <select
                                onChange={(e) => setCategory(e.target.value)}
                                value={category}
                                id="category"
                                className="w-full outline-none md:py-2.5 py-2 px-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition text-sm md:text-base"
                                required
                            >
                                <option value="">{t("seller.selectCategory")}</option>
                                <optgroup label={t("seller.healthPickCategories")}>
                                    {healthPicksCategories.map((item, index) => (
                                        <option key={"hp-"+index} value={item.path}>{getCategoryLabel(item.path)}</option>
                                    ))}
                                </optgroup>
                                <optgroup label={t("seller.defaultCategories")}>
                                    {defaultCategories.map((item, index) => (
                                        <option key={"def-"+index} value={item.path}>{getCategoryLabel(item.path)}</option>
                                    ))}
                                </optgroup>
                            </select>
                        );
                    })()}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm md:text-base font-medium text-gray-800" htmlFor="product-price">{t("seller.productPrice")}</label>
                        <input onChange={(e)=> setPrice(e.target.value)} value={price}
                         id="product-price" type="number" placeholder="0" className="w-full outline-none md:py-2.5 py-2 px-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition text-sm md:text-base" required />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm md:text-base font-medium text-gray-800" htmlFor="offer-price">{t("seller.offerPrice")}</label>
                        <input onChange={(e)=> setOfferPrice(e.target.value)} value={offerPrice} 
                        id="offer-price" type="number" placeholder="0" className="w-full outline-none md:py-2.5 py-2 px-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition text-sm md:text-base" required />
                    </div>
                </div>
                <button type="submit" className="w-full md:w-auto px-8 py-2.5 md:py-3 bg-primary hover:bg-primary-dull text-white font-medium rounded-lg cursor-pointer transition text-sm md:text-base">{t("seller.addProductButton")}</button>
            </form>
        </div>
  )
}

export default AddProduct
