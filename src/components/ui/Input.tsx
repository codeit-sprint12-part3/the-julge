import style from "./Input.module.css";

interface InputProps {
  placeholder?: string;
  type: "text" | "password" | "email" | "number" | "date";
  name?: string;
  value?: string;
  id?: string;
  label?: string;
  className?: string;
  required?: boolean;
  error?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.ChangeEventHandler<HTMLInputElement>;
  text?: string;
}

const Input = ({
  placeholder,
  type,
  value,
  id,
  name,
  label,
  className,
  required,
  error,
  text,
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
      <div className={style.inputBox}>
        <input
          id={id}
          className={`${style.input} ${className} ${error ? style.errorInput : ""}`}
          placeholder={placeholder}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        <span className={style.text}>
          {text}
        </span>
      </div>
      {error && <div className={style.errorMessage}>{error}</div>}
    </>
  );
};

export default Input;
