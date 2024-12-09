// import { NextRequest, NextResponse } from 'next/server';
// import { load } from 'cheerio'; // 名前付きインポートに変更

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const url = searchParams.get('url');

//   if (!url) {
//     return NextResponse.json({ error: 'URL is required' }, { status: 400 });
//   }

//   try {
//     const response = await fetch(url);
//     const html = await response.text();

//     const $ = load(html); // 名前付きインポートの関数を使用

//     const ogTitle = $('meta[property="og:title"]').attr('content') || '';
//     const ogDescription = $('meta[property="og:description"]').attr('content') || '';
//     const ogImage = $('meta[property="og:image"]').attr('content') || '';
//     const ogUrl = $('meta[property="og:url"]').attr('content') || url;

//     return NextResponse.json({
//       title: ogTitle,
//       description: ogDescription,
//       image: ogImage,
//       url: ogUrl,
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Failed to fetch OGP data' }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import { load } from 'cheerio';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = load(html);

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
                  // $('meta[name="twitter:image"]').attr('content') ||
                  // $('img').first().attr('src') ||
                  '';

    const ogUrl = $('meta[property="og:url"]').attr('content') ||
                url;

    // 相対URLを絶対URLに変換
    const baseUrl = new URL(url).origin;
    const absoluteImage = ogImage.startsWith('http') ? ogImage : new URL(ogImage, baseUrl).toString();

    // データの存在確認とトリミング
    const responseData = {
      title: ogTitle.trim(),
      description: ogDescription.trim(),
      image: absoluteImage,
      url: ogUrl,
    };

    // 必須データの確認
    if (!responseData.title || !responseData.image) {
      return NextResponse.json({ error: 'Required OGP data not found' }, { status: 404 });
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching OGP data:', error);
    return NextResponse.json({ error: 'Failed to fetch OGP data' }, { status: 500 });
  }
}