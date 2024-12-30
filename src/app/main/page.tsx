'use client';

import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import FloatingActionButton from "../components/FloatingActionButton";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
// import useAuth from './utils/useAuth';
import Header from '../components/Header';
// import connectDB from '@/app/utils/database';

type LinkData = {
    _id: string;      // MongoDBのIDを追加
    url: string;
    image: string;
    title: string;
    description: string;
    };

export default function Main() {
    // ユーザーIDを取得する共通関数
    const getUserId = () => {
        const userId = localStorage.getItem('userId');
        console.log('取得したユーザーID:', userId);
        if (!userId) {
            console.error('ユーザーIDが見つかりません。再度ログインしてください。');
            // ここでログインページへのリダイレクトを実装することもできます
            return null;
        }
        return userId;
    };

    // カード情報を取得する関数
    const fetchUserCards = async (userId: string) => {
        try {
            if (!userId) {
                throw new Error('ユーザーIDが指定されていません');
            }
            console.log('Fetching cards for userId:', userId);

            const response = await fetch(`/api/fetch-ogp/readall/${userId}`, {
                cache: "no-store",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        
            const data = await response.json();
            console.log('APIレスポンス:', data);

            if (!response.ok) {
                // エラーメッセージをより詳細に
                throw new Error(
                    `カードの取得に失敗しました。ステータス: ${response.status}, メッセージ: ${data.message}, エラー: ${data.error}`
                );
            }
            

    if (!data.cards) {
        throw new Error('レスポンスにカードデータが含まれていません');
    }

    // 状態を更新
    setState(prevState => ({
        ...prevState,
        links: data.cards,
        likes: data.cards.map(() => 0),
        likedStatus: data.cards.map(() => false),
        savedStatus: data.cards.map(() => false)
    }));

    console.log('カードデータの読み込みが完了しました');

} catch (error) {
    console.error('カードの取得に失敗しました:', error);
    if (error instanceof Error) {
        alert(`カードの取得に失敗しました: ${error.message}`);
    } else {
        alert('カードの取得に失敗しました: 不明なエラー');
    }
}
};

    // 初期データの読み込み
    useEffect(() => {
        const userId = getUserId();
        if (userId) {
            console.log('Initializing with userId:', userId);
            fetchUserCards(userId);
        }else {
            console.error('UserId not found in localStorage');
            // ユーザーIDがない場合の処理を追加
            // 例: ログインページへのリダイレクト
        }
    }, []);

    // 状態管理
    const [state, setState] = useState<{
        links: LinkData[];
        openMenuIndex: number | null;
        likes: number[];
        likedStatus: boolean[];
        savedStatus: boolean[];
    }>({
        links: [],
        openMenuIndex: null,
        likes: [],
        likedStatus: [],
        savedStatus: []
    });

    // URLの追加処理
    const handleAddUrl = async (url: string) => {
        try {
            const userId = getUserId();
            if (!userId) {
                alert("ログインが必要です")
                return ;
            }

            if (!url.startsWith('http')) {
                alert('有効なURLを入力してください');
                return;
            }

            const response = await fetch(
                `/api/fetch-ogp/create/v1?url=${encodeURIComponent(url)}&userId=${userId}`,
                { 
                    cache: "no-store",
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'カードの保存に失敗しました');
            }
            console.log('カードを保存しました:', data);
            setState(prevState => ({
                ...prevState,
                links: [...prevState.links, data],
                likes: [...prevState.likes, 0],
                likedStatus: [...prevState.likedStatus, false],
                savedStatus: [...prevState.savedStatus, false]
            }));
        } catch (error) {
            console.error('URLの追加に失敗しました:', error);
            alert(error instanceof Error ? error.message : 'URLの追加に失敗しました');
        }
    };
  const toggleMenu = (index: number) => {
    setState(prevState => ({
      ...prevState,
      openMenuIndex: prevState.openMenuIndex === index ? null : index
    }));
  };

//   const handleDeleteLink = (indexToRemove: number) => {
//     setState(prevState => ({
//       links: prevState.links.filter((_, index) => index !== indexToRemove),
//       openMenuIndex: null,
//       likes: prevState.likes.filter((_, index) => index !== indexToRemove),
//       likedStatus: prevState.likedStatus.filter((_, index) => index !== indexToRemove),
//       savedStatus: prevState.savedStatus.filter((_, index) => index !== indexToRemove)
//     }));
//   };
    const handleDeleteLink = async (indexToRemove: number) => {
        try {
            // ローカルストレージからユーザーIDを取得
            const userId = getUserId();
            if (!userId) {
                alert("ログインが必要です");
                return;
            }

            // 削除対象のカードのIDを取得
            const cardId = state.links[indexToRemove]._id;
            
            // 削除の確認
            if (!confirm("このカードを削除してもよろしいですか？")) {
                return;
            }

            // APIを呼び出してDBから削除
            const response = await fetch(`/api/fetch-ogp/delete/${cardId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId  // MongoDBのユーザーIDを送信
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message);
            }

            // 削除成功時のみ、UIを更新
            setState(prevState => ({
                ...prevState,
                links: prevState.links.filter((_, index) => index !== indexToRemove),
                openMenuIndex: null,
                likes: prevState.likes.filter((_, index) => index !== indexToRemove),
                likedStatus: prevState.likedStatus.filter((_, index) => index !== indexToRemove),
                savedStatus: prevState.savedStatus.filter((_, index) => index !== indexToRemove)
            }));

        } catch (error) {
            console.error('削除処理でエラーが発生:', error);
            alert(error instanceof Error ? error.message : '削除処理に失敗しました');
        }
    };

  const handleLikeToggle = (index: number) => {
    setState(prevState => {
      const newLikedStatus = [...prevState.likedStatus];
      const newLikes = [...prevState.likes];

      newLikedStatus[index] = !newLikedStatus[index];
      newLikes[index] += newLikedStatus[index] ? 1 : -1;

      return {
        ...prevState,
        likedStatus: newLikedStatus,
        likes: newLikes
      };
    });
  };

  const handleSaveForLater = (index: number): void => {
    setState(prevState => {
      const newSavedStatus = [...prevState.savedStatus];
      newSavedStatus[index] = !newSavedStatus[index];
  
      return {
        ...prevState,
        savedStatus: newSavedStatus
      };
    });
  };
    return (
      <div>
        <Header />
        <FloatingActionButton onAddUrl={handleAddUrl} />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 justify-items-center">
          {state.links.map((link, index) => (
            <div 
              key={link._id} 
              className="mb-3 p-3 border rounded-lg w-96 relative 
                bg-white dark:bg-neutral-900 
                border-gray-200 dark:border-neutral-700 w-full flex flex-col"
            >
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-grow">
                <div className="relative w-full h-40 mb-2">
                  <Image
                    src={link.image}
                    alt={link.title}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, 384px"
                    unoptimized  // 画像の最適化をスキップすることで、OGP画像のサイズを保持
                  />
                </div>
                <h2 className="text-lg font-semibold dark:text-neutral-200">{link.title}</h2>
                <p className="text-gray-700 dark:text-neutral-400 mb-4">
                  {link.description?.trim() || 'No description available'}
                </p>
              </a>
  
              {/* いいねと後で見るボタン - カードの一番下に配置 */}
              <div className="mt-auto flex items-center justify-between border-t pt-2 relative">
                <div className="flex items-center">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleLikeToggle(index);
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full"
                  >
                    {state.likedStatus[index] ? (
                      <ThumbUpAltIcon className="text-blue-500" />
                    ) : (
                      <ThumbUpOffAltIcon className="text-gray-500" />
                    )}
                  </button>
                  <span className="ml-1 text-sm text-gray-600 dark:text-neutral-400">
                    {state.likes[index]}
                  </span>
                
                  <div className="relative group">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleSaveForLater(index);
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full"
                    >
                      {state.savedStatus[index] ? (
                        <TurnedInIcon className="text-blue-500" />
                      ) : (
                        <TurnedInNotIcon className="text-gray-500" />
                      )}
                    </button>
                    {/* ツールチップ */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      {state.savedStatus[index] ? 'あとで読む　から除外' : 'あとで読む'}
                    </div>
                  </div>
                </div>
                
  
                {/* メニューボタン */}
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu(index);
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full"
                  >
                    <MoreVertIcon className="text-gray-500" />
                  </button>
  
                  {/* メニュー */}
                  {state.openMenuIndex === index && (
                    <div className="absolute bottom-full right-0 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded shadow-lg z-20 w-32">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteLink(index);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 text-red-600 dark:text-red-400"
                      >
                        削除
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleMenu(index);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700"
                      >
                        閉じる
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}