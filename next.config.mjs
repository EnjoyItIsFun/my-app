// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    // images: {
    //     domains: ['res.cloudinary.com', 'qiita-user-contents.imgix.net'],
    //     // domains: ['*'],  // すべてのドメインを許可
    // },
    images: {
        remotePatterns: [
          {
            protocol: 'https', // プロトコル
            hostname: 'res.cloudinary.com', // ホスト名
          },
          {
            protocol: 'https',
            hostname: 'qiita-user-contents.imgix.net',
          },
          {
            protocol: 'https',
            hostname: 'storage.googleapis.com',
          },
          {
            protocol: 'https',
            hostname: 'zenn.dev', // zenn.dev ドメインを追加
          },
          {
            protocol: 'https',
            hostname: '*', // すべてのドメインを許可
          },
        ],
      },
};

export default nextConfig;
