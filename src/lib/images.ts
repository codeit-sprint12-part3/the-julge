import { client } from "@/lib/axiosClient";
import { getCookie } from "@/lib/cookies";

// 1. Presigned URL 생성
export const createPresignedUrl = async (name: string) => {
  try {
    const response = await client.post(
      "/images",
      { name },
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")?.value}`,
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
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(url, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      return await response.json();
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
