"use client";

import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) return null;

  return (
    <div>
      <div className="flex items-center mb-4 gap-4">
        {value.map((url) => (
          <div
            className="relative w-[200px] h-[200px]  rounded-md overflow-hidden "
            key={url}
          >
            <div className="z-10 h-6 w-6 flex items-center justify-center rounded-full bg-slate-400/25  absolute right-2 top-2">
              <Trash
                className="z-20 h-4 w-4 cursor-pointer "
                onClick={() => onRemove(url)}
                color="red"
              />
            </div>
            <Image src={url} fill objectFit="scale-down" alt={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="mqbvvgfe">
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-4 " />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
