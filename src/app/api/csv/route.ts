import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'dna_dataset.csv');
    const csvData = fs.readFileSync(filePath, 'utf-8');
    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
      },
    });
  } catch (error) {
    return new NextResponse('Error reading CSV file', { status: 500 });
  }
}
