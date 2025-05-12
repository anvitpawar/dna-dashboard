import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';

export async function GET(request: Request) {
  try {
    // Read the visualization guide markdown
    const guidePath = path.join(process.cwd(), 'src', 'docs', 'visualization-guide.md');
    const markdownContent = fs.readFileSync(guidePath, 'utf-8');
    
    // Convert markdown to HTML using remark
    const htmlContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkHtml)
      .process(markdownContent)
      .then((file) => String(file));
    
    // Add styling
    const styledHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 2rem;
              color: #333;
              background-color: white;
            }
            h1 { color: #2563eb; margin-bottom: 2rem; }
            h2 { color: #1e40af; margin-top: 2rem; }
            h3 { color: #1e3a8a; }
            code {
              background: #f1f5f9;
              padding: 0.2em 0.4em;
              border-radius: 3px;
              font-size: 0.9em;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            }
            pre code {
              display: block;
              padding: 1em;
              overflow-x: auto;
              line-height: 1.4;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 1rem 0;
            }
            th, td {
              border: 1px solid #e2e8f0;
              padding: 0.5rem;
              text-align: left;
            }
            th { 
              background: #f8fafc;
              font-weight: 600;
            }
            ul, ol {
              padding-left: 1.5rem;
              margin: 1rem 0;
            }
            li {
              margin: 0.5rem 0;
            }
            p {
              margin: 1rem 0;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 0.5rem;
              margin: 1rem 0;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            }
            hr {
              border: none;
              border-top: 1px solid #e2e8f0;
              margin: 2rem 0;
            }
            blockquote {
              border-left: 4px solid #e2e8f0;
              margin: 1rem 0;
              padding-left: 1rem;
              color: #4a5568;
            }
            @media print {
              body {
                padding: 1rem;
                max-width: none;
              }
              pre code {
                white-space: pre-wrap;
              }
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    return new NextResponse(styledHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error generating HTML:', error);
    return new NextResponse('Error generating HTML', { status: 500 });
  }
}
