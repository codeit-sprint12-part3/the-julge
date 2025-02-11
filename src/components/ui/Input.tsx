import React, { forwardRef } from "react";
import style from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { placeholder, type, id, name, label, className, required, error, onBlur, onChange, ...rest },
    ref
  ) => {
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
          ref={ref}
          id={id}
          className={`${style.input} ${className} ${error ? style.errorInput : ""}`}
          placeholder={placeholder}
          type={type}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          {...rest}
        />
        {error && <div className={style.errorMessage}>{error}</div>}
      </>
    );
  }
);

Input.displayName = "Input"; // React DevTools에서 표시될 이름

export default Input;
