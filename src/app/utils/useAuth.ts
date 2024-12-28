import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { jwtVerify } from "jose"
interface AuthState {
    loginUserEmail: string | null;
    isLoading: boolean;
  }
const useAuth = () : AuthState => {
    // const useAuth = ()  => {
    // const [loginUserEmail, setLoginUserEmail] = useState("")
    const [loginUserEmail, setLoginUserEmail] = useState<string | null>(null) // null を初期値として使用

    const router = useRouter() 

    useEffect(() => {  
        const checkToken = async() => { 
            const token = localStorage.getItem("token")

            if(!token){
                router.push("/user/login")
            }

            try{
                const secretKey = new TextEncoder().encode("secret_key_MyPort@l_20241227")
                if (token) {
                    const decodedJwt = await jwtVerify(token, secretKey)
                    setLoginUserEmail((decodedJwt.payload as { email: string }).email)
                } else {
                    router.push("/user/login")
                }
            }catch{
                router.push("/user/login")
            }
        }   
        checkToken() 
    }, [router]) 

    // return loginUserEmail
    return {
        loginUserEmail,
        isLoading: loginUserEmail === null
    }
}

export default useAuth