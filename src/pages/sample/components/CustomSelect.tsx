import { useState, useEffect } from "react";
import style from "./CustomSelect.module.css";

interface CustomSelectProps {
  menuItems: string[];
}

const CustomSelect = ({ menuItems }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectData] = useState("");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectData = (data: string) => {
    setSelectData(data);
    setIsOpen(false);
  };

  return (
    <div className={style.selectBox}>
      <button
        className={`${isOpen ? `${style.active}` : ""} ${style.selectBtn}`}
        onClick={toggleDropdown}
      >
        {selectedData || "선택"}
      </button>
      <div className={`${isOpen ? `${style.active}` : ""} ${style.viewBox}`}>
        {
          (menuItems && menuItems.length > 0) ? (
            menuItems.map((data, index) => (
              <div className={style.listBox} key={index}>
                <button
                  className={style.viewBtn}
                  onClick={() => handleSelectData(data)}
                >
                  {data}
                </button>
              </div>
            ))
          ) : (
            <p className={style.intoText}>선택할 항목이 없습니다.</p>
          )
        }
      </div>
    </div>
  );
};

export default CustomSelect;
