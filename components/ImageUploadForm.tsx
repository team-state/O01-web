'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import Image from 'next/image';
import { uploadImage } from '@libs/client';

const ImageUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    const url = await uploadImage(file);
    setImageId(url);
  };

  return (
    <>
      <input type="file" onChange={handleFileChange} />
      <button
        className="border-white bg-gray-600"
        type="button"
        onClick={handleUpload}
      >
        이미지 업로드
      </button>
      {imageId && (
        <>
          <p>Image Id: {imageId}</p>
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_SERVE_URL}/${imageId}/public`}
            alt="image"
            width={500}
            height={500}
          />
        </>
      )}
    </>
  );
};

export default ImageUploadForm;
