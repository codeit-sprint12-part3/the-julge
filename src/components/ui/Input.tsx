import style from "./Input.module.css";

interface InputProps {
  placeholder?: string,
  type: "text" | "password" | "email" | "number";
  name?: string,
  value?: string,
  id?: string,
  label?: string,
  className?: string,
  required?: boolean,
  error?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
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
  onChange }: InputProps) => {

  return (
    <>
      {
        label &&
        <label htmlFor={id} className={`${style.label} ${className}`}>
          {label}
          {required && <span className={style.required}>
            *
            <em className="blind">
              필수입력
            </em>
          </span>}
        </label>
      }
      <input
        id={id}
        className={`${style.input} ${className} ${error ? style.errorInput : ""}`}
        placeholder={placeholder}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
      {
        error && <div className={style.errorMessage}>
          {error}
        </div>
      }
    </>
  );
};

export default Input;
