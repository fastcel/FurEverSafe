/**
 * Unsigned upload to Cloudinary (same preset as abuse reports).
 * Ensure this preset allows your image MIME types in the Cloudinary console.
 */
export async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "animal_report");

  const res = await fetch("https://api.cloudinary.com/v1_1/de7l3dvdl/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Image upload failed");
  }
  return data.secure_url;
}
