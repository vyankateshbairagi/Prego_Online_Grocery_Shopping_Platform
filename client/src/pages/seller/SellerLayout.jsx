import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLayout = () => {

    const { axios, navigate, t } = useAppContext();


    const sidebarLinks = [
        { name: t("seller.addProduct"), path: "/seller", icon: assets.add_icon },
        { name: t("seller.productList"), path: "/seller/product-list", icon: assets.product_list_icon },
        { name: t("seller.orders"), path: "/seller/orders", icon: assets.order_icon },
    ];

    const logout = async ()=>{
        try {
            const { data } = await axios.get('/api/seller/logout');
            if(data.success){
                toast.success(data.message)
                navigate('/')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            <div className="flex items-center justify-between px-3 md:px-8 border-b border-gray-300 py-3 bg-white shadow-sm">
                <Link to='/'>
                    <img src={assets.logo} alt="log" className="cursor-pointer h-8 md:h-10" />
                </Link>
                <div className="flex items-center gap-2 md:gap-5 text-gray-500 text-xs md:text-base">
                    <p className="hidden sm:block">{t("seller.hiAdmin")}</p>
                    <button onClick={logout} className='border border-gray-300 hover:border-primary hover:text-primary rounded-full text-xs md:text-sm px-3 md:px-4 py-1.5 transition'>{t("nav.logout")}</button>
                </div>
            </div>
            <div className="flex h-[calc(100vh-60px)] md:h-[95vh]">
               <div className="w-14 md:w-64 border-r border-gray-300 pt-2 md:pt-4 flex flex-col overflow-y-auto">
                {sidebarLinks.map((item) => (
                    <NavLink to={item.path} key={item.name} end={item.path === "/seller"}
                        className={({isActive})=>`flex items-center justify-center md:justify-start py-3 px-2 md:px-4 gap-2 md:gap-3 transition 
                            ${isActive ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                : "text-gray-600 hover:bg-gray-100 border-transparent"
                            }`
                        }
                    >
                        <img src={item.icon} alt={item.name} className="w-6 h-6 md:w-7 md:h-7" />
                        <p className="hidden md:block text-sm md:text-base font-medium">{item.name}</p>
                    </NavLink>
                ))}
            </div> 
                <div className="flex-1 overflow-y-auto">
                    <Outlet/>
                </div>
            </div>
             
        </>
    );
};

export default SellerLayout;