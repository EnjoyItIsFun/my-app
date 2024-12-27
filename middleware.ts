import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { NextRequest } from "next/server"

interface DecodedJwt {
    payload: object;
    protectedHeader: object;
}

export async function middleware(request: NextRequest) {
    const token = await request.headers.get("Authorization")?.split(" ")[1]
    
    if(!token){
        return NextResponse.json({message: "トークンがありません"})
    }

    try{
        const secretKey = new TextEncoder().encode("secret_key_MyPort@l_20241227") 
        const decodedJwt: DecodedJwt = await jwtVerify(token, secretKey)
        console.log(decodedJwt);
        return NextResponse.next()
    }catch(err){
        console.error(err);
        return NextResponse.json({message: "トークンが正しくないので、ログインしてください"})
    }
}

export const config = {
    // matcher: ["/api/item/create", "/api/item/update/:path*", "/api/item/delete/:path*"],
    matcher: ["/api/fetch-ogp/:path*"],
}
