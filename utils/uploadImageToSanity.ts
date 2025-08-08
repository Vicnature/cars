// utils/uploadImageToSanity.ts

import { writeClient } from "@/lib/sanity.write";

export async function uploadImageToSanity(file: File) {
  console.log('uploading image');
	const buffer = await file.arrayBuffer();
	const bytes = new Uint8Array(buffer);

	const asset = await writeClient.assets.upload("image", bytes, {
		contentType: file.type,
		filename: file.name,
	});

	return {
		_type: "image",
		asset: {
			_type: "reference",
			_ref: asset._id,
		},
	};
}
