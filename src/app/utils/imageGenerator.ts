export function generateTextImage(text: string): string {
    // テキストを適切な長さに調整
    const truncatedText = text.length > 50 ? text.substring(0, 47) + '...' : text;
    
    // SVGの作成
    const svg = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
      >
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text
          x="50%"
          y="50%"
          font-family="Arial, sans-serif"
          font-size="48"
          font-weight="bold"
          fill="#333333"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          ${truncatedText}
        </text>
      </svg>
    `;
  
    // SVGをBase64エンコード
    const encodedSvg = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${encodedSvg}`;
  }