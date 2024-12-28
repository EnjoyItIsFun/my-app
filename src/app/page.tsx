// 'use client';

// import React, { useState } from 'react';
// import Image from 'next/image';
// import FloatingActionButton from "./components/FloatingActionButton";
// import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
// import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
// import TurnedInIcon from '@mui/icons-material/TurnedIn';
// // import useAuth from './utils/useAuth';


// type LinkData = {
//   url: string;
//   image: string;
//   title: string;
//   description: string;
// };

// const fetchOGPData = async (url: string) => {
//   try {
//     const response = await fetch(`/api/fetch-ogp/create/v1?url=${encodeURIComponent(url)}`);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching OGP data:', error);
//     throw error;
//   }
// };
// export default function Home() {

//   const [state, setState] = useState<{
//     links: LinkData[];
//     openMenuIndex: number | null;
//     likes: number[];
//     likedStatus: boolean[];
//     savedStatus: boolean[];
//   }>({
//     links: [],
//     openMenuIndex: null,
//     likes: [],
//     likedStatus: [],
//     savedStatus: []
//   });

//   const handleAddUrl = async (url: string) => {
//     try {
//       const ogpData = await fetchOGPData(url);
//       setState(prevState => ({
//         ...prevState,
//         links: [...prevState.links, ogpData],
//         likes: [...prevState.likes, 0],
//         likedStatus: [...prevState.likedStatus, false],
//         savedStatus: [...prevState.savedStatus, false]
//       }));
//     } catch (error) {
//       console.error('Error adding URL:', error);
//     }
//   };

//   const toggleMenu = (index: number) => {
//     setState(prevState => ({
//       ...prevState,
//       openMenuIndex: prevState.openMenuIndex === index ? null : index
//     }));
//   };

//   const handleDeleteLink = (indexToRemove: number) => {
//     setState(prevState => ({
//       links: prevState.links.filter((_, index) => index !== indexToRemove),
//       openMenuIndex: null,
//       likes: prevState.likes.filter((_, index) => index !== indexToRemove),
//       likedStatus: prevState.likedStatus.filter((_, index) => index !== indexToRemove),
//       savedStatus: prevState.savedStatus.filter((_, index) => index !== indexToRemove)
//     }));
//   };

//   const handleLikeToggle = (index: number) => {
//     setState(prevState => {
//       const newLikedStatus = [...prevState.likedStatus];
//       const newLikes = [...prevState.likes];

//       newLikedStatus[index] = !newLikedStatus[index];
//       newLikes[index] += newLikedStatus[index] ? 1 : -1;

//       return {
//         ...prevState,
//         likedStatus: newLikedStatus,
//         likes: newLikes
//       };
//     });
//   };

//   const handleSaveForLater = (index: number): void => {
//     setState(prevState => {
//       const newSavedStatus = [...prevState.savedStatus];
//       newSavedStatus[index] = !newSavedStatus[index];
  
//       return {
//         ...prevState,
//         savedStatus: newSavedStatus
//       };
//     });
//   };

//   // const { loginUserEmail, isLoading } = useAuth()

//   // if (isLoading) {
//   //   return <div>Loading...</div> // またはローディングスピナーなどを表示
//   // }
//   // // const loginUserEmail  = useAuth();

//   // if(!loginUserEmail){// loginUserEmailの監視があることで、ログインしていない場合はログインページにリダイレクトのはずが、リダイレクトされない
//   //   return null; //
//   // }
//     return (
//       <div>
//         <FloatingActionButton onAddUrl={handleAddUrl} />
//         <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 justify-items-center">
//           {state.links.map((link, index) => (
//             <div 
//               key={index} 
//               className="mb-3 p-3 border rounded-lg w-96 relative 
//                 bg-white dark:bg-neutral-900 
//                 border-gray-200 dark:border-neutral-700 w-full flex flex-col"
//             >
//               <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-grow">
//                 <div className="relative w-full h-40 mb-2">
//                   <Image
//                     src={link.image}
//                     alt={link.title}
//                     fill
//                     className="object-cover rounded-lg"
//                     sizes="(max-width: 768px) 100vw, 384px"
//                     unoptimized  // 画像の最適化をスキップすることで、OGP画像のサイズを保持
//                   />
//                 </div>
//                 <h2 className="text-lg font-semibold dark:text-neutral-200">{link.title}</h2>
//                 <p className="text-gray-700 dark:text-neutral-400 mb-4">
//                   {link.description?.trim() || 'No description available'}
//                 </p>
//               </a>
  
//               {/* いいねと後で見るボタン - カードの一番下に配置 */}
//               <div className="mt-auto flex items-center justify-between border-t pt-2 relative">
//                 <div className="flex items-center">
//                   <button 
//                     onClick={(e) => {
//                       e.preventDefault();
//                       handleLikeToggle(index);
//                     }}
//                     className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full"
//                   >
//                     {state.likedStatus[index] ? (
//                       <ThumbUpAltIcon className="text-blue-500" />
//                     ) : (
//                       <ThumbUpOffAltIcon className="text-gray-500" />
//                     )}
//                   </button>
//                   <span className="ml-1 text-sm text-gray-600 dark:text-neutral-400">
//                     {state.likes[index]}
//                   </span>
                
//                   <div className="relative group">
//                     <button 
//                       onClick={(e) => {
//                         e.preventDefault();
//                         handleSaveForLater(index);
//                       }}
//                       className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full"
//                     >
//                       {state.savedStatus[index] ? (
//                         <TurnedInIcon className="text-blue-500" />
//                       ) : (
//                         <TurnedInNotIcon className="text-gray-500" />
//                       )}
//                     </button>
//                     {/* ツールチップ */}
//                     <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
//                       {state.savedStatus[index] ? 'あとで読む　から除外' : 'あとで読む'}
//                     </div>
//                   </div>
//                 </div>
                
  
//                 {/* メニューボタン */}
//                 <div className="relative">
//                   <button 
//                     onClick={(e) => {
//                       e.preventDefault();
//                       toggleMenu(index);
//                     }}
//                     className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full"
//                   >
//                     <MoreVertIcon className="text-gray-500" />
//                   </button>
  
//                   {/* メニュー */}
//                   {state.openMenuIndex === index && (
//                     <div className="absolute bottom-full right-0 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded shadow-lg z-20 w-32">
//                       <button 
//                         onClick={(e) => {
//                           e.preventDefault();
//                           handleDeleteLink(index);
//                         }}
//                         className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 text-red-600 dark:text-red-400"
//                       >
//                         削除
//                       </button>
//                       <button 
//                         onClick={(e) => {
//                           e.preventDefault();
//                           toggleMenu(index);
//                         }}
//                         className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700"
//                       >
//                         閉じる
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
// }
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "ログインに失敗しました")
            }

            // ログイン成功時の処理
            router.push("/main") // mainページへリダイレクト
            
        } catch (error) {
            setError(error instanceof Error ? error.message : "エラーが発生しました")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">ログイン</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            メールアドレス
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            パスワード
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-700"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? "ログイン中..." : "ログイン"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    アカウントをお持ちでない方は{" "}
                    <Link href="/user/register" className="text-blue-600 hover:text-blue-500">
                        こちらから登録
                    </Link>
            </p>
            </div>
        </div>
    )
}