import React, { useState } from "react";
import style from "@/components/ui/CustomFileInput.module.css"; // Custom CSS for styling

interface CustomFileInputProps {
  label: string;
  id: string;
  required?: boolean;
  text?: string;
  onFileChange?: (file: File | null) => void;  // Add the onFileChange prop type
  styleClass?: "customStyle";
  currentImageUrl?: string;  // Define currentImageUrl prop type as string or undefined
}

const CustomFileInput: React.FC<CustomFileInputProps> = ({
  styleClass,
  label,
  id,
  required,
  currentImageUrl,
  onFileChange,
  text,
}) => {
  const [image, setImage] = useState<string | null>(currentImageUrl || null); // Initialize with the current image URL

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string); // Update state with new image preview
        };
        reader.readAsDataURL(file);

        if (onFileChange) {
          onFileChange(file); // Pass the selected file to the parent component
        }
      } else {
        alert("이미지 파일만 업로드 가능합니다.");
      }
    }
  };

  const handleClick = () => {
    document.getElementById(id)?.click(); // Trigger the file input click
  };

  const customClass = style[`file_${styleClass}`];

  return (
    <div className={`${style.fileInputContainer} ${customClass}`}>
      <label htmlFor={id} className={style.labelText}>
        {label}
        {required && <em title="필수입력">*</em>}
      </label>

      <div className={`${style.fileInputArea} ${customClass}`} onClick={handleClick}>
        {image ? (
          <img src={image} alt="Uploaded preview" className={style.imagePreview} />
        ) : (
          <div className={style.noImageText}>{text}</div>
        )}
        {
          currentImageUrl && !image && (
            <img src={currentImageUrl} alt="현재 이미지" className={style.currentImage} />
          )
        }
        <input
          type="file"
          id={id}
          name={id}
          className="blind"
          onChange={handleFileChange}
          required={required}
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default CustomFileInput;
