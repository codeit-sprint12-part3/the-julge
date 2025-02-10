import React, { useState } from "react";
import style from "@/components/ui/CustomFileInput.module.css"; // Custom CSS for styling

interface CustomFileInputProps {
  label: string;
  id: string;
  required?: boolean;
  text?: string;
  onFileChange?: (file: File | null) => void;  // Add the onFileChange prop type
  styleClass?: "customStyle";
}

const CustomFileInput: React.FC<CustomFileInputProps> = ({ styleClass, label, id, required, onFileChange, text }) => {
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);

        if (onFileChange) {
          onFileChange(file);
        }
      } else {
        alert("이미지 파일만 업로드 가능합니다.");
      }
    }
  };

  const handleClick = () => {
    document.getElementById(id)?.click();
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
