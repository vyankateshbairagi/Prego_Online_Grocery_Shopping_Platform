import React from 'react'
import { assets, features } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const BottomBanner = () => {
  const { t, language } = useAppContext();

  const featureMap = {
    "Fastest Delivery": {
      hi: "सबसे तेज डिलीवरी",
      mr: "सर्वात जलद डिलिव्हरी",
    },
    "Groceries delivered in under 30 minutes.": {
      hi: "30 मिनट से कम में ग्रोसरी डिलीवर।",
      mr: "30 मिनिटांपेक्षा कमी वेळेत ग्रोसरी डिलिव्हरी.",
    },
    "Freshness Guaranteed": {
      hi: "ताजगी की गारंटी",
      mr: "ताजेपणाची हमी",
    },
    "Fresh produce straight from the source.": {
      hi: "ताज़ा उत्पाद सीधे स्रोत से।",
      mr: "ताजी उत्पादने थेट स्रोताकडून.",
    },
    "Affordable Prices": {
      hi: "किफायती कीमतें",
      mr: "परवडणाऱ्या किंमती",
    },
    "Quality groceries at unbeatable prices.": {
      hi: "बेहतर कीमतों पर क्वालिटी ग्रोसरी।",
      mr: "उत्तम किंमतींमध्ये दर्जेदार ग्रोसरी.",
    },
    "Trusted by Thousands": {
      hi: "हजारों का भरोसा",
      mr: "हजारोंचा विश्वास",
    },
    "Loved by 10,000+ happy customers.": {
      hi: "10,000+ खुश ग्राहकों का पसंदीदा।",
      mr: "10,000+ समाधानी ग्राहकांची पसंती.",
    },
  };

  const localizeFeature = (text) => {
    if (language === "en") return text;
    return featureMap[text]?.[language] || text;
  };
  return (
    <div className='relative mt-24'>
      <img src={assets.bottom_banner_image} alt="banner" className='w-full hidden md:block'/>
      <img src={assets.bottom_banner_image_sm} alt="banner" className='w-full md:hidden'/>

      <div className='absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24'>
        <div>
            <h1 className='text-2xl md:text-3xl font-semibold text-primary mb-6'>{t("bottomBanner.title")}</h1>
            {features.map((feature, index)=>(
                <div key={index} className='flex items-center gap-4 mt-2'>
                    <img src={feature.icon} alt={feature.title} className='md:w-11 w-9' />
                    <div>
                       <h3 className='text-lg md:text-xl font-semibold'>{localizeFeature(feature.title)}</h3>
                      <p className='text-gray-500/70 text-xs md:text-sm'>{localizeFeature(feature.description)}</p> 
                    </div>
                    
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default BottomBanner
