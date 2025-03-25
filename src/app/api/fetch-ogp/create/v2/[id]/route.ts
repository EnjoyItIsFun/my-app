import { NextRequest, NextResponse } from 'next/server';
import { load } from 'cheerio';
import { generateTextImage } from '@/app/utils/imageGenerator';
import connectDB from "@/app/utils/database";
import { CardModel } from "@/app/utils/schemaModels";
import  useAuthUser  from "@/app/utils/useAuth";

export async function GET(req: NextRequest) {
  const loginUserEmail = useAuthUser()
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // MongoDBに接続
    await connectDB();

    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);

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

    const ogUrl = $('meta[property="og:url"]').attr('content') || url;

    let finalImageUrl = '';
    const baseUrl = new URL(url).origin;
    
    if (ogImage) {
      finalImageUrl = ogImage.startsWith('http') ? ogImage : new URL(ogImage, baseUrl).toString();
    } else {
      finalImageUrl = generateTextImage(ogTitle);
    }

    const cardData = {
      title: ogTitle.trim(),
      description: ogDescription.trim(),
      image: finalImageUrl,
      url: ogUrl,
      email: loginUserEmail
    };

    if (!cardData.title) {
      return NextResponse.json({ error: 'Required OGP data not found' }, { status: 404 });
    }

    // MongoDBにデータを保存
    const newCard = new CardModel(cardData);
    await newCard.save();

    return NextResponse.json({
      ...cardData,
      _id: newCard._id // MongoDBのドキュメントIDも返す
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}