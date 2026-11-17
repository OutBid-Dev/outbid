const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

interface CloudinaryUploadResponse {
    secure_url: string;
    public_id: string;
    resource_type: string;
    format: string;
    bytes: number;
}

export interface UploadedImage {
    url: string;
    publicId: string;
    format: string;
    bytes: number;
}

interface CloudinaryErrorResponse {
    error?: {
        message?: string;
    };
}

function getCloudinaryUploadUrl() {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        throw new Error(
            "Cloudinary configuration is missing. Check your VITE_CLOUDINARY environment variables."
        );
    }

    return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
}

export async function uploadImage(file: File): Promise<UploadedImage> {
    const uploadUrl = getCloudinaryUploadUrl();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = (await response
            .json()
            .catch(() => null)) as CloudinaryErrorResponse | null;

        throw new Error(
            errorData?.error?.message ?? `Failed to upload image: ${file.name}`
        );
    }

    const data = (await response.json()) as CloudinaryUploadResponse;

    return {
        url: data.secure_url,
        publicId: data.public_id,
        format: data.format,
        bytes: data.bytes,
    };
}

export async function uploadImages(files: File[]): Promise<UploadedImage[]> {
    return Promise.all(files.map((file) => uploadImage(file)));
}
