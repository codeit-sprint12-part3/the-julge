import style from "./CustomRadioInput.module.css";

interface CustomRadioInputProps {
  type: "radio";
  name?: string;
  value?: string;
  id?: string;
  radioText?: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  checked?: boolean;
}

const CustomRadioInput = ({
  type,
  value,
  id,
  name,
  radioText,
  className,
  onChange,
  checked,
}: CustomRadioInputProps) => {
  return (
    <div className={`${style.radioBox} ${className}`}>
      <input
        id={id}
        className={`${style.radioInput} blind`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        checked={checked}
      />
      <label htmlFor={id}>{radioText}</label>
    </div>
  );
};

export default CustomRadioInput;
