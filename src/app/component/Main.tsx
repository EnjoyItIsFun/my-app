'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import FloatingActionButton from './FloatingActionButton';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import TurnedInIcon from '@mui/icons-material/TurnedIn';

type LinkData = {
  url: string;
  image: string;
  title: string;
  description: string;
};

const fetchOGPData = async (url: string) => {
  try {
    const response = await fetch(`/api/fetch-ogp?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching OGP data:', error);
    throw error;
  }
};

const Main = () => {
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

  const handleAddUrl = async (url: string) => {
    try {
      const ogpData = await fetchOGPData(url);
      setState(prevState => ({
        ...prevState,
        links: [...prevState.links, ogpData],
        likes: [...prevState.likes, 0],
        likedStatus: [...prevState.likedStatus, false],
        savedStatus: [...prevState.savedStatus, false]
      }));
    } catch (error) {
      console.error('Error adding URL:', error);
    }
  };

  const toggleMenu = (index: number) => {
    setState(prevState => ({
      ...prevState,
      openMenuIndex: prevState.openMenuIndex === index ? null : index
    }));
  };

  const handleDeleteLink = (indexToRemove: number) => {
    setState(prevState => ({
      links: prevState.links.filter((_, index) => index !== indexToRemove),
      openMenuIndex: null,
      likes: prevState.likes.filter((_, index) => index !== indexToRemove),
      likedStatus: prevState.likedStatus.filter((_, index) => index !== indexToRemove),
      savedStatus: prevState.savedStatus.filter((_, index) => index !== indexToRemove)
    }));
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

  const handleSaveForLater = (index: number) => {
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
      <FloatingActionButton onAddUrl={handleAddUrl} />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 justify-items-center">
        {state.links.map((link, index) => (
          <div 
            key={index} 
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
};

export default Main;