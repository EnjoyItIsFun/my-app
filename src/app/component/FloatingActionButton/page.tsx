'use client';
import React, { useState, useRef, useEffect } from 'react';

interface FloatingActionButtonProps {
  // onAddUrl: (url: string) => Promise<void>;

  onAddUrl?: (url: string) => Promise<void>;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onAddUrl }) => {
  const [url, setUrl] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // await onAddUrl(url);
    if (onAddUrl) {
      await onAddUrl(url); // `onAddUrl`が存在する場合のみ呼び出し
    } 


    
    setUrl('');
    toggleModal();

  };

  // モーダルが開いたときに自動的にフォーカスを設定
  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);

  return (
    <>
      <button
        className="fixed bottom-5 right-5 bg-[#ba75a7] dark:bg-blue-500 text-white w-16 h-16 rounded-full shadow-lg text-3xl font-bold flex items-center justify-center hover:bg-[#a05590] dark:hover:bg-blue-600 focus:outline-none z-50"
        onClick={toggleModal}
      >
        +
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={toggleModal}></div>
          <div className="relative bg-white dark:bg-gray-800 dark:text-gray-200 p-8 rounded-lg shadow-lg z-10 w-96">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={toggleModal}>
              ✖
            </button>
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-white dark:bg-gray-700 text-black dark:text-gray-200"
                placeholder="URLを入力してください"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <div className="flex justify-end">
                <button type="submit" className="bg-[#ba75a7] dark:bg-blue-500 text-white px-4 py-2 rounded hover:bg-[#a05590] dark:hover:bg-blue-600">
                  追加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingActionButton;
