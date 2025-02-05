import style from './CustomRadioInput.module.css';

interface CustomRadioInputProps {
  type: 'radio';
  name?: string;
  value?: string;
  id?: string;
  radioText?: string;
  className?: string;
}

const CustomRadioInput = ({
  type,
  value,
  id,
  name,
  radioText,
  className,
}: CustomRadioInputProps) => {
  return (
    <div className={`${style.radioBox} ${className}`}>
      <input
        id={id}
        className={`${style.radioInput} blind`}
        type={type}
        name={name}
        value={value}
      />
      <label htmlFor={id}>{radioText}</label>
    </div>
  );
};

export default CustomRadioInput;
