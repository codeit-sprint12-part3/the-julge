import style from "./Input.module.css";

interface InputProps {
  placeholder?: string;
  type: "text" | "password" | "email" | "number" | "date";
  name?: string;
  min?: string;
  value?: string;
  id?: string;
  label?: string;
  className?: string;
  required?: boolean;
  error?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.ChangeEventHandler<HTMLInputElement>;
}

const Input = ({
  placeholder,
  type,
  value,
  id,
  name,
  min,
  label,
  className,
  required,
  error,
  onBlur,
  onChange,
}: InputProps) => {
  return (
    <>
      {label && (
        <label htmlFor={id} className={`${style.label}`}>
          {label}
          {required && (
            <span className={style.required}>
              *<em className="blind">필수입력</em>
            </span>
          )}
        </label>
      )}
      <input
        id={id}
        className={`${style.input} ${className} ${error ? style.errorInput : ""}`}
        placeholder={placeholder}
        type={type}
        name={name}
        min={min}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <div className={style.errorMessage}>{error}</div>}
    </>
  );
};

export default Input;
