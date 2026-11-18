import { UploadCloud } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadItemPrimary,
    FileUploadList,
    FileUploadTrigger,
} from "@/components/ui/file-upload";

import type { CreateAuctionFormValues } from "../../schemas/create-auction-schema";

interface AuctionImagesFormProps {
    onPrimaryChange?: () => void;
}

export function AuctionImagesForm({ onPrimaryChange }: AuctionImagesFormProps) {
    const { control, setValue } = useFormContext<CreateAuctionFormValues>();

    const images =
        useWatch({
            control,
            name: "images",
        }) ?? [];

    const primaryImageIndex = useWatch({
        control,
        name: "primaryImageIndex",
    });

    const primaryImage =
        primaryImageIndex !== null && primaryImageIndex !== undefined
            ? (images[primaryImageIndex] ?? null)
            : null;

    const handleImagesChange = (nextImages: File[]) => {
        const currentPrimary = primaryImage;

        const nextPrimaryIndex = currentPrimary
            ? nextImages.indexOf(currentPrimary)
            : -1;

        const resolvedPrimaryIndex =
            nextImages.length === 0 ? null : Math.max(nextPrimaryIndex, 0);

        setValue("images", nextImages, {
            shouldDirty: true,
            shouldValidate: true,
        });

        setValue("primaryImageIndex", resolvedPrimaryIndex, {
            shouldDirty: true,
            shouldValidate: true,
        });

        // If a new image becomes the fallback primary,
        // clear any previously selected existing image.
        if (resolvedPrimaryIndex !== null) {
            onPrimaryChange?.();
        }
    };

    const handlePrimaryChange = (file: File) => {
        const index = images.indexOf(file);

        if (index !== -1) {
            setValue("primaryImageIndex", index, {
                shouldDirty: true,
                shouldValidate: true,
            });

            onPrimaryChange?.();
        }
    };

    return (
        <div className="rounded-xl border bg-card p-5">
            <div className="mb-4">
                <h3 className="text-base font-semibold">Auction Images</h3>
                <p className="text-sm text-muted-foreground">
                    Upload images of the item you're selling.
                </p>
            </div>

            <FileUpload
                value={images}
                onValueChange={handleImagesChange}
                accept="image/png,image/jpeg"
                maxFiles={5}
                maxSize={5 * 1024 * 1024}
                multiple
                primaryValue={primaryImage}
                onPrimaryChange={handlePrimaryChange}
                primaryName="auction-primary-image"
                onFileReject={(file, reason) => {
                    const messages = {
                        type: `${file.name}: Only PNG and JPEG images are allowed.`,
                        size: `${file.name}: Image must be 5 MB or smaller.`,
                        count: `${file.name}: You can upload a maximum of 5 images.`,
                    };

                    console.warn(messages[reason]);
                }}
            >
                <FileUploadDropzone className="gap-2">
                    <UploadCloud className="size-5 text-muted-foreground" />

                    <span className="text-sm text-muted-foreground">
                        Drag and drop or{" "}
                        <FileUploadTrigger
                            variant="link"
                            size="sm"
                            className="h-auto p-0 font-medium text-foreground underline underline-offset-4"
                        >
                            choose files
                        </FileUploadTrigger>{" "}
                        to upload
                    </span>
                </FileUploadDropzone>

                <FileUploadList>
                    {images.map((file) => (
                        <FileUploadItem
                            key={`${file.name}-${file.lastModified}`}
                            value={file}
                        >
                            <FileUploadItemPreview />
                            <FileUploadItemMetadata />
                            <FileUploadItemPrimary>
                                Primary
                            </FileUploadItemPrimary>
                            <FileUploadItemDelete />
                        </FileUploadItem>
                    ))}
                </FileUploadList>
            </FileUpload>

            <p className="mt-3 text-xs text-muted-foreground">
                Upload up to 5 images up to 5 MB each. Select one as the primary
                image.
            </p>
        </div>
    );
}
