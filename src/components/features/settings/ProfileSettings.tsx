"use client";

import { useState, useEffect, useActionState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import LabeledInput from "@/components/ui/LabeledInput";
import ImageDropzone from "@/components/ui/ImageDropzone";
import { updateProfile } from "@/lib/actions/profile";
import { FormState, User } from "@/lib/types";

const initialState: FormState = { success: false, message: "" };

interface ProfileSettingsProps {
  user: User;
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialState
  );

  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [newImagePreviewUrl, setNewImagePreviewUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (state.success) {
      setIsEditingPhoto(false);
      setNewImagePreviewUrl(null);
    }
  }, [state.success]);

  const handleFileChange = (file: File | null) => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setNewImagePreviewUrl(objectUrl);
    } else {
      setNewImagePreviewUrl(null);
    }
  };

  const displayImage = newImagePreviewUrl || user?.profile_picture;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 animate-in fade-in duration-300"
    >
      {state?.message && (
        <div
          className={`p-3 text-sm rounded-md border ${
            state.success
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {state.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-2">
        <div className="relative">
          {isEditingPhoto ? (
            <div className="w-32 h-32 sm:w-48 sm:h-60">
              <ImageDropzone
                name="profile_picture"
                previewUrl={displayImage || "/placeholder.svg"}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 border border-gray-100 flex items-center justify-center shrink-0 relative shadow-sm">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt="Profile Picture"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-gray-500">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-medium text-gray-900">Profile Picture</h3>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="text-xs"
              onClick={() => {
                setIsEditingPhoto(!isEditingPhoto);
                if (isEditingPhoto) setNewImagePreviewUrl(null);
              }}
            >
              {isEditingPhoto ? "Cancel" : "Change Photo"}
            </Button>
          </div>
          <p className="text-[10px] text-gray-500">
            JPG, GIF or PNG. Max size of 2MB.
          </p>
        </div>
      </div>

      <LabeledInput
        label="Full Name"
        id="full_name"
        name="full_name"
        placeholder="Your Name"
        defaultValue={user?.name || ""}
      />
      <LabeledInput
        label="Email Address"
        id="email"
        name="email"
        disabled
        value={user?.email}
        className="bg-gray-100 cursor-not-allowed text-gray-500"
      />

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
