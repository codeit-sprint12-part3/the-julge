import { useState, useEffect, useRef } from "react";
import style from "./CustomSelect.module.css";

interface CustomSelectProps {
  menuItems: string[];
  type?: "button" | "submit";
  onChange: (selectedValue: string) => void;
  value?: string;
  error?: string;
  onBlur?: (e: React.FocusEvent<HTMLButtonElement>) => void;
}

const CustomSelect = ({
  type = "button",
  menuItems,
  onChange,
  value,
  error,
  onBlur,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectData] = useState(value || "선택");
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectData(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectData = (data: string) => {
    setSelectData(data);
    onChange(data); // 부모 컴포넌트로 값 전달
    setIsOpen(false);
  };

  return (
    <div className={style.selectBox} ref={selectRef}>
      <button
        type={type}
        className={`${isOpen ? `${style.active}` : ""} ${style.selectBtn}  ${error ? style.errorSelect : ""}`}
        onClick={toggleDropdown}
        onBlur={onBlur} // onBlur 이벤트 추가
      >
        {selectedData || "선택"}
      </button>
      {error && <div className={style.errorMessage}>{error}</div>} {/* 에러 메시지 표시 */}
      {isOpen && (
        <div className={`${style.viewBox} ${isOpen ? style.active : ""}`}>
          {menuItems.length > 0 ? (
            menuItems.map((data, index) => (
              <div className={style.listBox} key={index}>
                <button
                  type={type}
                  className={style.viewBtn}
                  onClick={() => handleSelectData(data)}
                >
                  {data}
                </button>
              </div>
            ))
          ) : (
            <p className={style.intoText}>선택할 항목이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
