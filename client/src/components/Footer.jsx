import { assets, footerLinks } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Footer = () => {
    const { t, language } = useAppContext();

    const footerLabelMap = {
        "Quick Links": {
            hi: "क्विक लिंक्स",
            mr: "क्विक लिंक्स",
        },
        "Need help?": {
            hi: "मदद चाहिए?",
            mr: "मदत हवी आहे?",
        },
        "Follow Us": {
            hi: "हमें फॉलो करें",
            mr: "आम्हाला फॉलो करा",
        },
        "Best Sellers": {
            hi: "बेस्ट सेलर्स",
            mr: "बेस्ट सेलर्स",
        },
        "Offers & Deals": {
            hi: "ऑफर और डील्स",
            mr: "ऑफर्स आणि डील्स",
        },
        "Contact Us": {
            hi: "संपर्क करें",
            mr: "संपर्क करा",
        },
        FAQs: {
            hi: "सामान्य प्रश्न",
            mr: "सामान्य प्रश्न",
        },
        "Delivery Information": {
            hi: "डिलीवरी जानकारी",
            mr: "डिलिव्हरी माहिती",
        },
        "Return & Refund Policy": {
            hi: "रिटर्न और रिफंड नीति",
            mr: "रिटर्न आणि रिफंड धोरण",
        },
        "Payment Methods": {
            hi: "पेमेंट तरीके",
            mr: "पेमेंट पद्धती",
        },
        "Track your Order": {
            hi: "अपना ऑर्डर ट्रैक करें",
            mr: "तुमचे ऑर्डर ट्रॅक करा",
        },
    };

    const localizeFooterLabel = (label) => {
        if (language === "en") return label;
        return footerLabelMap[label]?.[language] || label;
    };

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-primary/10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    <img className="w-34 md:w-32" src={assets.logo} alt="logo" />
                    <p className="max-w-[410px] mt-6">
                        {t("footer.about")}</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{localizeFooterLabel(section.title)}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href={link.url} className="hover:underline transition">{localizeFooterLabel(link.text)}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                {t("footer.copyright", { year: new Date().getFullYear() })}
            </p>
        </div>
    );
};

export default Footer