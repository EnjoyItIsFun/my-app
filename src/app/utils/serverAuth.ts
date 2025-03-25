// 'use client'
// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { jwtVerify } from "jose"
// interface AuthState {
//     loginUserEmail: string | null;
//     isLoading: boolean;
//   }
// const useAuthUser = () : AuthState => {
//     // const getAuthUser = ()  => {
//     // const [loginUserEmail, setLoginUserEmail] = useState("")
//     const [loginUserEmail, setLoginUserEmail] = useState<string | null>(null) // null を初期値として使用

//     const router = useRouter() 

//     useEffect(() => {  
//         const checkToken = async() => { 
//             const token = localStorage.getItem("token")

//             if(!token){
//                 router.push("/user/login")
//             }

//             try{
//                 const secretKey = new TextEncoder().encode("secret_key_MyPort@l_20241227")
//                 if (token) {
//                     const decodedJwt = await jwtVerify(token, secretKey)
//                     setLoginUserEmail((decodedJwt.payload as { email: string }).email)
//                 } else {
//                     router.push("/user/login")
//                 }
//             }catch{
//                 router.push("/user/login")
//             }
//         }   
//         checkToken() 
//     }, [router]) 

//     // return loginUserEmail
//     return {
//         loginUserEmail,
//         isLoading: loginUserEmail === null
//     }
// }

// export default useAuthUser
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function getServerAuthUser(req: NextRequest): Promise<string | null> {
  try {
    // Authorizationヘッダーからトークンを取得
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '') || req.cookies.get('token')?.value;

    if (!token) {
      return null;
    }

    // joseを使ってJWTを検証（useAuthUserと同じ秘密鍵を使用）
    const secretKey = new TextEncoder().encode("secret_key_MyPort@l_20241227");
    const decodedJwt = await jwtVerify(token, secretKey);
    
    // ペイロードからメールアドレスを取得
    const email = (decodedJwt.payload as { email: string }).email;
    return email;
  } catch (error) {
    console.error('サーバー側認証エラー:', error);
    return null;
  }
}