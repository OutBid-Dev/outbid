import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, UserRound } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "@/lib/api.types";
import { useUpdateProfile } from "../../hooks/use-update-profile";
import {
    type UpdateProfileFormValues,
    updateProfileSchema,
} from "../../schemas/update-profile-schema";

interface EditProfileDialogProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const defaultValues: UpdateProfileFormValues = {
    firstName: "",
    lastName: "",
    image: null,
};

export function EditProfileDialog({
    user,
    open,
    onOpenChange,
}: EditProfileDialogProps) {
    const updateProfile = useUpdateProfile();

    const form = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues,
    });

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isDirty },
    } = form;

    const selectedImage = useWatch({ control: form.control, name: "image" });

    const previewUrl = useMemo(() => {
        if (!selectedImage) return user.image ?? undefined;
        return URL.createObjectURL(selectedImage);
    }, [selectedImage, user.image]);

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    useEffect(() => {
        if (open) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                image: null,
            });
        }
    }, [open, user, reset]);

    const initials =
        `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();

    const onSubmit = (values: UpdateProfileFormValues) => {
        updateProfile.mutate(
            {
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                image: values.image,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            }
        );
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (updateProfile.isPending) return;

        if (!nextOpen) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                image: null,
            });
        }

        onOpenChange(nextOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Update your personal information and profile picture.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Avatar */}
                    <div className="flex items-center gap-4 rounded-lg border bg-muted/20 p-4">
                        <Avatar className="size-16 border">
                            <AvatarImage
                                src={previewUrl}
                                alt="Profile picture"
                            />
                            <AvatarFallback>
                                {initials || <UserRound className="size-6" />}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1 space-y-1">
                            <p className="text-sm font-medium">
                                Profile picture
                            </p>
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG or WebP. Maximum 5 MB.
                            </p>

                            <Label
                                htmlFor="profile-image"
                                className="mt-2 inline-flex h-8 cursor-pointer items-center gap-2 rounded-md border bg-background px-3 text-xs font-medium transition-colors hover:bg-muted"
                            >
                                <Camera className="size-3.5" />
                                Change photo
                            </Label>

                            <Input
                                id="profile-image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="sr-only"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (!file) return;

                                    if (file.size > 5 * 1024 * 1024) {
                                        form.setError("image", {
                                            type: "manual",
                                            message:
                                                "Image must be smaller than 5 MB.",
                                        });
                                        event.target.value = "";
                                        return;
                                    }

                                    form.clearErrors("image");
                                    setValue("image", file, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    });
                                }}
                            />

                            {errors.image && (
                                <p className="text-xs text-destructive">
                                    {errors.image.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Name fields */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input
                                id="firstName"
                                placeholder="First name"
                                autoComplete="given-name"
                                {...register("firstName")}
                                aria-invalid={!!errors.firstName}
                            />
                            {errors.firstName && (
                                <p className="text-xs text-destructive">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input
                                id="lastName"
                                placeholder="Last name"
                                autoComplete="family-name"
                                {...register("lastName")}
                                aria-invalid={!!errors.lastName}
                            />
                            {errors.lastName && (
                                <p className="text-xs text-destructive">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email - read only */}
                    <div className="space-y-2">
                        <Label htmlFor="profile-email">Email address</Label>
                        <Input
                            id="profile-email"
                            value={user.email}
                            readOnly
                            disabled
                        />
                        <p className="text-xs text-muted-foreground">
                            Email changes require a separate verification
                            process.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={updateProfile.isPending}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                updateProfile.isPending ||
                                (!isDirty && !selectedImage)
                            }
                        >
                            {updateProfile.isPending ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
