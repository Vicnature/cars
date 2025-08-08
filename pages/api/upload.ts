// pages/api/upload.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@sanity/client';
import { Readable } from 'stream';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN,
});

// Disable default body parsing so we can handle FormData ourselves
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to convert incoming stream into buffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Use the built-in web API to parse the FormData
    const formData = await new Promise<FormData>((resolve, reject) => {
      const busboy = require('busboy');
      const bb = busboy({ headers: req.headers });

      const form = new FormData();
      let fileBuffer: Buffer | null = null;
      let fileInfo: { filename: string; mimeType: string } | null = null;

      bb.on('file', (_name: string, file: Readable, info: any) => {
        fileInfo = {
          filename: info.filename,
          mimeType: info.mimeType,
        };

        streamToBuffer(file).then(buffer => {
          fileBuffer = buffer;
        });
      });

      bb.on('finish', async () => {
        if (!fileBuffer || !fileInfo) {
          reject(new Error('File not received properly'));
          return;
        }

        // Upload to Sanity
        const asset = await sanityClient.assets.upload('image', fileBuffer, {
          filename: fileInfo.filename,
          contentType: fileInfo.mimeType,
        });

        resolve(asset);
      });

      req.pipe(bb);
    });

    // formData is actually the uploaded asset
    return res.status(200).json({ assetId: (formData as any)._id });
  } catch (error: any) {
    console.error('[Upload Error]', error);
    return res.status(500).json({ message: 'Upload failed', error: error.message });
  }
}
