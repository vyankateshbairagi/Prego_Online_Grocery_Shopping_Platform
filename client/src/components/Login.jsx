import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const {setShowUserLogin, setUser, axios, navigate, t} = useAppContext()

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [address, setAddress] = React.useState("");

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();

            const {data} = await axios.post(`/api/user/${state}`,{
                name, email, password, address
            });
            if (data.success){
                navigate('/')
                setUser(data.user)
                setShowUserLogin(false)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
        
       
        
    }

  return (
    <div onClick={()=> setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>

      <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">{t("login.user")}</span> {state === "login" ? t("login.login") : t("login.signUp")}
            </p>
            {state === "register" && (
                <>
                    <div className="w-full">
                        <p>{t("login.name")}</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder={t("login.typeHere")} className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                    </div>
                    <div className="w-full">
                        <p>{t("login.deliveryAddress")}</p>
                        <input 
                            onChange={(e) => setAddress(e.target.value)} 
                            value={address} 
                            placeholder={t("login.enterFullAddress")} 
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                            type="text" 
                            required 
                        />
                    </div>
                </>
            )}
            <div className="w-full ">
                <p>{t("login.email")}</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder={t("login.typeHere")} className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>
            <div className="w-full ">
                <p>{t("login.password")}</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder={t("login.typeHere")} className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>
            {state === "register" ? (
                <p>
                    {t("login.alreadyHaveAccount")} <span onClick={() => setState("login")} className="text-primary cursor-pointer">{t("login.clickHere")}</span>
                </p>
            ) : (
                <p>
                    {t("login.createAccountPrompt")} <span onClick={() => setState("register")} className="text-primary cursor-pointer">{t("login.clickHere")}</span>
                </p>
            )}
            <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? t("login.createAccount") : t("login.login")}
            </button>
        </form>
    </div>
  )
}

export default Login
