import { useState, useEffect } from "react";
import style from "./CustomSelect.module.css";

interface CustomSelectProps {
  menuItems: string[];
  type?: "button" | "submit";
  onChange: (selectedValue: string) => void;  // Receive onChange function from parent
  value?: string; // Add value prop
}

const CustomSelect = ({ type = "button", menuItems, onChange, value }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectData] = useState(value || "선택"); // Initialize with value or default "선택"

  useEffect(() => {
    if (value) {
      setSelectData(value); // Sync selectedData with value prop if it changes
    }
  }, [value]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectData = (data: string) => {
    console.log("선택된 값: ", data);  // 선택된 값 출력
    setSelectData(data);
    onChange(data);  // 부모 컴포넌트로 값 전달
    setIsOpen(false);
  };

  return (
    <div className={style.selectBox}>
      <button
        type={type}
        className={`${isOpen ? `${style.active}` : ""} ${style.selectBtn}`}
        onClick={toggleDropdown}
      >
        {selectedData || "선택"}
      </button>
      <div className={`${isOpen ? `${style.active}` : ""} ${style.viewBox}`}>
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
    </div>
  );
};

export default CustomSelect;
