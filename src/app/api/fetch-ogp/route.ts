import { NextRequest, NextResponse } from 'next/server';
import { load } from 'cheerio';// import { load } from 'cheerio'; // 名前付きインポートに変更
import { generateTextImage } from '../../utils/imageGenerator';


// async function isImageAccessible(url: string): Promise<boolean> {
//   try {
//     const response = await fetch(url, {
//       method: 'HEAD',  // ヘッダーのみを取得
//       headers: {
//         'User-Agent': 'Mozilla/5.0'  // User-Agentを設定
//       }
//     });
//     return response.ok;
//   } catch {
//     return false;
//   }
// }
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);// 名前付きインポートの関数を使用

    // OGPタグから情報を取得し、なければ代替のメタタグや要素から取得
    const ogTitle = $('meta[property="og:title"]').attr('content') ||
                  $('meta[name="twitter:title"]').attr('content') ||
                  $('title').text() ||
                  '';

    const ogDescription = $('meta[property="og:description"]').attr('content') ||
                        $('meta[name="twitter:description"]').attr('content') ||
                        $('meta[name="description"]').attr('content') ||
                        $('p').first().text().slice(0, 200) ||
                        '';

    const ogImage = $('meta[property="og:image"]').attr('content') ||
                  $('meta[name="twitter:image"]').attr('content') ||
                  $('img').first().attr('src');
                  console.log('Original image URL:', ogImage);

    const ogUrl = $('meta[property="og:url"]').attr('content') ||
                url;

  let finalImageUrl = '';
  // 相対URLを絶対URLに変換
  const baseUrl = new URL(url).origin;
  // const absoluteImage = ogImage.startsWith('http') ? ogImage : new URL(ogImage, baseUrl).toString();
  if (ogImage) {
    finalImageUrl = ogImage.startsWith('http') ? ogImage : new URL(ogImage, baseUrl).toString();
    
  } else {
    // 画像が見つからない場合、タイトルベースの画像を生成
    finalImageUrl = generateTextImage(ogTitle);
  }
  console.log('Final image URL:', finalImageUrl);
  // データの存在確認とトリミング
  const responseData = {
    title: ogTitle.trim(),
    description: ogDescription.trim(),
    // image: absoluteImage,
    image: finalImageUrl,
    url: ogUrl,
  };

    // 必須データの確認
    // if (!responseData.title || !responseData.image) {
        // タイトルのチェックのみ行う（画像は必ず存在するようになった）
    if (!responseData.title) {
      return NextResponse.json({ error: 'Required OGP data not found' }, { status: 404 });
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching OGP data:', error);
    return NextResponse.json({ error: 'Failed to fetch OGP data' }, { status: 500 });
  }

  
}
