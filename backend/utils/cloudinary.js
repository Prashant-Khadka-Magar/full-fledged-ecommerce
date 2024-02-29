import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: 'dyuppnk6r',
  api_key: '935631426493265',
  api_secret: 'w_2VAptp0V7P7ynBwVa-bZ_MBMs',
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Error in uploadOnCloudinary:", error);
    fs.unlinkSync(localFilePath);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

  

export {uploadOnCloudinary}