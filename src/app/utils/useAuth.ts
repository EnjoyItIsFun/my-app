import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { jwtVerify } from "jose"

const useAuth = () => {
    const [loginUserEmail, setLoginUserEmail] = useState("")

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

    return loginUserEmail
}

export default useAuth