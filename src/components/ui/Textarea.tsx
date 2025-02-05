import style from "./Textarea.module.css";

interface TextareaProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  id?: string;
  className?: string;
}

const Textarea = ({ value, required, label, placeholder, className, id, onChange }: TextareaProps) => {

  return (
    <>
      {
        label &&
        <label htmlFor={id} className={`${style.label}`}>
          {label}
          {required && <span className={style.required}>
            *
            <em className="blind">
              필수입력
            </em>
          </span>}
        </label>
      }

      <textarea
        value={value}
        onChange={onChange}
        id={id}
        placeholder={placeholder}
        className={`${style.textarea} ${className}`}
      />
    </>
  )
}

export default Textarea;
