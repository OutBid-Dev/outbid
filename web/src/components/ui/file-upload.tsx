import { X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RejectReason = "type" | "size" | "count";

interface FileUploadContextValue {
    files: File[];
    inputRef: React.RefObject<HTMLInputElement | null>;
    accept?: string;
    maxFiles: number;
    maxSize: number;
    multiple: boolean;
    disabled: boolean;
    primaryValue: File | null;
    primaryName: string;
    openFileDialog: () => void;
    addFiles: (files: File[]) => void;
    removeFile: (file: File) => void;
    onPrimaryChange?: (file: File) => void;
}

const FileUploadContext = React.createContext<FileUploadContextValue | null>(
    null
);

const FileUploadItemContext = React.createContext<File | null>(null);

function useFileUpload() {
    const context = React.useContext(FileUploadContext);

    if (!context) {
        throw new Error(
            "File upload components must be used inside <FileUpload />."
        );
    }

    return context;
}

function useFileUploadItem() {
    const file = React.useContext(FileUploadItemContext);

    if (!file) {
        throw new Error(
            "File upload item components must be used inside <FileUploadItem />."
        );
    }

    return file;
}

interface FileUploadProps {
    value?: File[];
    defaultValue?: File[];
    onValueChange?: (files: File[]) => void;
    onFileReject?: (file: File, reason: RejectReason) => void;
    accept?: string;
    maxFiles?: number;
    maxSize?: number;
    multiple?: boolean;
    disabled?: boolean;
    primaryValue?: File | null;
    onPrimaryChange?: (file: File) => void;
    primaryName?: string;
    children: React.ReactNode;
    className?: string;
}

function FileUpload({
    value,
    defaultValue = [],
    onValueChange,
    onFileReject,
    accept = "image/*",
    maxFiles = 5,
    maxSize = 5 * 1024 * 1024,
    multiple = true,
    disabled = false,
    primaryValue = null,
    onPrimaryChange,
    primaryName = "primary-image",
    children,
    className,
}: FileUploadProps) {
    const [internalFiles, setInternalFiles] =
        React.useState<File[]>(defaultValue);

    const inputRef = React.useRef<HTMLInputElement>(null);

    const isControlled = value !== undefined;
    const files = isControlled ? value : internalFiles;

    const updateFiles = React.useCallback(
        (nextFiles: File[]) => {
            if (!isControlled) {
                setInternalFiles(nextFiles);
            }

            onValueChange?.(nextFiles);
        },
        [isControlled, onValueChange]
    );

    const openFileDialog = React.useCallback(() => {
        if (!disabled) {
            inputRef.current?.click();
        }
    }, [disabled]);

    const isAccepted = React.useCallback(
        (file: File) => {
            if (!accept) return true;

            const acceptedTypes = accept
                .split(",")
                .map((type) => type.trim().toLowerCase())
                .filter(Boolean);

            return acceptedTypes.some((type) => {
                if (type.startsWith(".")) {
                    return file.name.toLowerCase().endsWith(type);
                }

                if (type.endsWith("/*")) {
                    return file.type.startsWith(type.slice(0, -1));
                }

                return file.type.toLowerCase() === type;
            });
        },
        [accept]
    );

    const addFiles = React.useCallback(
        (incomingFiles: File[]) => {
            if (disabled) return;

            const nextFiles = [...files];

            for (const file of incomingFiles) {
                const duplicate = nextFiles.some(
                    (existing) =>
                        existing.name === file.name &&
                        existing.size === file.size &&
                        existing.lastModified === file.lastModified
                );

                if (duplicate) continue;

                if (!isAccepted(file)) {
                    onFileReject?.(file, "type");
                    continue;
                }

                if (file.size > maxSize) {
                    onFileReject?.(file, "size");
                    continue;
                }

                if (nextFiles.length >= maxFiles) {
                    onFileReject?.(file, "count");
                    continue;
                }

                nextFiles.push(file);

                if (!multiple) break;
            }

            if (nextFiles.length !== files.length) {
                updateFiles(nextFiles);
            }
        },
        [
            disabled,
            files,
            isAccepted,
            maxFiles,
            maxSize,
            multiple,
            onFileReject,
            updateFiles,
        ]
    );

    const removeFile = React.useCallback(
        (file: File) => {
            if (disabled) return;

            updateFiles(files.filter((item) => item !== file));
        },
        [disabled, files, updateFiles]
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        addFiles(Array.from(event.target.files ?? []));

        // Allows selecting the same file again after removing it.
        event.target.value = "";
    };

    const contextValue = React.useMemo<FileUploadContextValue>(
        () => ({
            files,
            inputRef,
            accept,
            maxFiles,
            maxSize,
            multiple,
            disabled,
            primaryValue,
            primaryName,
            openFileDialog,
            addFiles,
            removeFile,
            onPrimaryChange,
        }),
        [
            files,
            accept,
            maxFiles,
            maxSize,
            multiple,
            disabled,
            primaryValue,
            primaryName,
            openFileDialog,
            addFiles,
            removeFile,
            onPrimaryChange,
        ]
    );

    return (
        <FileUploadContext.Provider value={contextValue}>
            <div className={cn("w-full space-y-3", className)}>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    className="hidden"
                    onChange={handleInputChange}
                />

                {children}
            </div>
        </FileUploadContext.Provider>
    );
}

interface FileUploadDropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

function FileUploadDropzone({
    children,
    className,
    onDragOver,
    onDragLeave,
    onDrop,
    onClick,
    ...props
}: FileUploadDropzoneProps) {
    const { addFiles, openFileDialog, disabled } = useFileUpload();

    const [isDragging, setIsDragging] = React.useState(false);

    return (
        // biome-ignore lint/a11y/useSemanticElements: <div> is used here to allow for more flexible styling and event handling, while still maintaining accessibility through ARIA attributes and keyboard interactions.
        <div
            {...props}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            className={cn(
                "flex min-h-16 cursor-pointer items-center justify-center rounded-xl border border-dashed px-4 py-5 text-sm transition-colors",
                "border-border hover:border-foreground/40 hover:bg-muted/40",
                isDragging && "border-primary bg-primary/5",
                disabled && "pointer-events-none cursor-not-allowed opacity-50",
                className
            )}
            onClick={(event) => {
                onClick?.(event);
                if (!event.defaultPrevented) openFileDialog();
            }}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openFileDialog();
                }
            }}
            onDragOver={(event) => {
                event.preventDefault();
                if (!disabled) setIsDragging(true);
                onDragOver?.(event);
            }}
            onDragLeave={(event) => {
                setIsDragging(false);
                onDragLeave?.(event);
            }}
            onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);

                if (!disabled) {
                    addFiles(Array.from(event.dataTransfer.files));
                }

                onDrop?.(event);
            }}
        >
            {children}
        </div>
    );
}

type FileUploadTriggerProps = Omit<
    React.ComponentProps<typeof Button>,
    "onClick"
> & {
    children: React.ReactNode;
    onClick?: React.ComponentProps<typeof Button>["onClick"];
};

function FileUploadTrigger({
    children,
    className,
    onClick,
    type = "button",
    ...props
}: FileUploadTriggerProps) {
    const { openFileDialog, disabled } = useFileUpload();

    return (
        <Button
            {...props}
            type={type}
            disabled={disabled || props.disabled}
            className={className}
            onClick={(event) => {
                event.stopPropagation();
                onClick?.(event);

                if (!event.defaultPrevented) {
                    openFileDialog();
                }
            }}
        >
            {children}
        </Button>
    );
}

function FileUploadList({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { files } = useFileUpload();

    if (files.length === 0) return null;

    return (
        <div className={cn("flex flex-col gap-2", className)}>{children}</div>
    );
}

function FileUploadItem({
    value,
    children,
    className,
}: {
    value: File;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <FileUploadItemContext.Provider value={value}>
            <div
                className={cn(
                    "flex min-w-0 items-center gap-3 rounded-xl border bg-background p-3",
                    className
                )}
            >
                {children}
            </div>
        </FileUploadItemContext.Provider>
    );
}

function FileUploadItemPreview({ className }: { className?: string }) {
    const file = useFileUploadItem();

    const previewUrl = React.useMemo(() => URL.createObjectURL(file), [file]);

    React.useEffect(() => {
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    return (
        <div
            className={cn(
                "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted",
                className
            )}
        >
            <img
                src={previewUrl}
                alt={file.name}
                className="size-full object-cover"
            />
        </div>
    );
}

function FileUploadItemMetadata({ className }: { className?: string }) {
    const file = useFileUploadItem();

    const formattedSize =
        file.size < 1024 * 1024
            ? `${(file.size / 1024).toFixed(1)} KB`
            : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    return (
        <div className={cn("min-w-0 flex-1", className)}>
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formattedSize}</p>
        </div>
    );
}

function FileUploadItemPrimary({
    className,
    children = "Primary",
}: {
    className?: string;
    children?: React.ReactNode;
}) {
    const file = useFileUploadItem();
    const { primaryValue, primaryName, onPrimaryChange, disabled } =
        useFileUpload();

    return (
        <label
            className={cn(
                "flex shrink-0 cursor-pointer items-center gap-2 text-xs text-muted-foreground",
                disabled && "cursor-not-allowed opacity-50",
                className
            )}
        >
            <input
                type="radio"
                name={primaryName}
                checked={primaryValue === file}
                disabled={disabled}
                onChange={() => onPrimaryChange?.(file)}
                className="size-3.5 accent-primary"
            />
            {children}
        </label>
    );
}

function FileUploadItemDelete({
    className,
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const file = useFileUploadItem();
    const { removeFile, disabled } = useFileUpload();

    return (
        <button
            {...props}
            type="button"
            aria-label={`Remove ${file.name}`}
            disabled={disabled || props.disabled}
            className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50",
                className
            )}
            onClick={(event) => {
                props.onClick?.(event);

                if (!event.defaultPrevented) {
                    removeFile(file);
                }
            }}
        >
            {children ?? <X className="size-4" />}
        </button>
    );
}

export {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadItemPrimary,
    FileUploadList,
    FileUploadTrigger,
};
