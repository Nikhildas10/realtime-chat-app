import { BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { credentials } from 'src/config/credentials';
cloudinary.config({
  cloud_name: credentials.cloudinaryCloudName,
  api_key: credentials.cloudinaryApiKey,
  api_secret: credentials.cloudinaryApiSecret,
  secure: true,
});

export const uploadImage = async (base64Image: string, folder: string) => {
  try {
    const uploadOptions = {
      folder: folder || 'avatar',
      resource_type: 'auto' as const,
      quality: 'auto:good',
      fetch_format: 'auto',
      width: 1500,
      crop: 'limit',
      flags: 'progressive',
    };

    const result = await cloudinary.uploader.upload(base64Image, uploadOptions);

    return result?.secure_url;
  } catch (error) {
   throw new BadRequestException('Image upload failed', error.message);
  }
};

export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result?.result === 'ok'
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

