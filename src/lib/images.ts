import { client } from "@/lib/axiosClient";
import { getToken } from "@/lib/storage";

// 1. Presigned URL 생성
export const createPresignedUrl = async (name: string) => {
  try {
    const token = getToken();
    const response = await client.post(
      "/images",
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2. S3로 이미지 업로드
export const uploadImageToS3 = async (url: string, file: File) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (response.ok) {
      return await response.text();
    } else {
      throw new Error("Failed to upload image");
    }
  } catch (error) {
    throw error;
  }
};

// 3. Presigned URL 조회
export const getPresignedUrl = async (url: string) => {
  try {
    const response = await client.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
