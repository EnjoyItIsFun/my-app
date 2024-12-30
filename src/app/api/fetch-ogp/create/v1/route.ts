import { NextRequest, NextResponse } from 'next/server';
import { load } from 'cheerio';
import { generateTextImage } from '@/app/utils/imageGenerator';
import connectDB from "@/app/utils/database";
import { CardModel } from "@/app/utils/schemaModels";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const userId = searchParams.get('userId');

    // 入力値の検証を強化
    if (!url) {
      return NextResponse.json({ error: 'URLが必要です' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 400 });
    }

    // データベース接続を確認
    try {
      await connectDB();
      console.log('データベースに接続しました');
    } catch (dbError) {
      console.error('データベース接続エラー:', dbError);
      return NextResponse.json({ error: 'データベース接続エラー' }, { status: 500 });
    }

    // URLからのデータ取得を試行
    // const response = await fetch(url);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });


    if (!response.ok) {
      console.error('URL取得エラー:', response.status, response.statusText);
      return NextResponse.json({ error: 'URLからのデータ取得に失敗しました' }, { status: 400 });
    }

    const html = await response.text();
    const $ = load(html);

    // OGPデータの取得と検証
    const cardData = {
      title: ($('meta[property="og:title"]').attr('content') ||
              $('meta[name="twitter:title"]').attr('content') ||
              $('title').text() ||
              '').trim(),
      description: ($('meta[property="og:description"]').attr('content') ||
                    $('meta[name="twitter:description"]').attr('content') ||
                    $('meta[name="description"]').attr('content') ||
                    $('p').first().text().slice(0, 200) ||
                    '').trim(),
      image: $('meta[property="og:image"]').attr('content') ||
              $('meta[name="twitter:image"]').attr('content') ||
              $('img').first().attr('src'),
      url: $('meta[property="og:url"]').attr('content') || url,
      userId: userId
    };

    // 画像URLの処理
    if (cardData.image) {
      const baseUrl = new URL(url).origin;
      cardData.image = cardData.image.startsWith('http') 
        ? cardData.image 
        : new URL(cardData.image, baseUrl).toString();
    } else {
      cardData.image = generateTextImage(cardData.title);
    }

    // データの検証
    if (!cardData.title || !cardData.image || !cardData.url) {
      console.error('必要なデータが不足しています:', cardData);
      return NextResponse.json({ error: 'OGPデータが不完全です' }, { status: 400 });
    }

    // MongoDBへの保存を試行
    try {
      const newCard = new CardModel(cardData);
      const savedCard = await newCard.save();
      console.log('カードを保存しました:', savedCard._id);

      return NextResponse.json({
        // ...cardData,
        // _id: savedCard._id
        ...savedCard.toObject(),
        message: 'カードを保存しました'
      });
    } catch (saveError) {
      console.error('カード保存エラー:', saveError);
      return NextResponse.json({ error: 'カードの保存に失敗しました' }, { status: 500 });
    }

  } catch (error) {
    // 詳細なエラーログ
    console.error('リクエスト処理エラー:', error);
    return NextResponse.json({ 
      error: '処理に失敗しました',
      details: error instanceof Error ? error.message : '不明なエラー'
    }, { status: 500 });
  }
}