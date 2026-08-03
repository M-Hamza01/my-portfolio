/**
 * Uploads a file to Cloudinary using an unsigned upload preset — no
 * server-side signing needed, safe to call directly from the browser
 * since this only ever runs inside the owner-only edit forms.
 *
 * Setup (one-time, in the Cloudinary dashboard):
 * 1. Settings → Upload → Upload presets → Add upload preset
 * 2. Set "Signing Mode" to "Unsigned"
 * 3. (Optional but recommended) Set a folder, e.g. "hamzas-lab"
 * 4. Copy the preset name and your Cloud Name into .env.local:
 *      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
 *      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset-name
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary isn't configured — add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? "Upload failed");
  }

  const data = await res.json();
  return data.secure_url as string;
}
