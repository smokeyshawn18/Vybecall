// utils/uploadAvatarToImgBB.ts

export async function uploadAvatarToImgBB(file: File): Promise<string> {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("ImgBB API key not found in environment variables.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message || "Failed to upload avatar to ImgBB"
    );
  }

  return result.data.url; // ✅ This is the direct image URL
}
