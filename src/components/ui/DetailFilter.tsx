import { useState } from "react";
import style from "./DetailFilter.module.css";
import Title from "./Title";
import Input from "./Input";
import Button from "./Button";
import { SEOUL_DISTRICTS } from "@/constants/constants";
import { Icon } from "../icon/Icon";
import { toast } from "@/pages/_app";
import { Filters } from "@/type";

// 부모로 필터 값 전달하는 onApply prop 추가
interface DetailFilterProps {
  onApply?: (filters: Filters) => void;
  onClose?: () => void;
  className?: string;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export default function DetailFilter({
  onApply,
  onClose,
  className,
  filters,
  setFilters,
}: DetailFilterProps) {
  // 주소 선택
  const handleSelect = (select: string) => {
    if (!filters.selectedAddresses.includes(select)) {
      setFilters((prev) => ({
        ...prev,
        selectedAddresses: [...prev.selectedAddresses, select],
      }));
    }
  };

  // 선택된 주소 삭제
  const handleDelete = (select: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedAddresses: prev.selectedAddresses.filter((address) => address !== select),
    }));
  };

  // 필터 값 변경
  const handleChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 금액에 콤마 추가
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 추출
    const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 콤마 추가
    setFilters((prev) => ({
      ...prev,
      price: formattedValue,
    }));
  };

  // 초기화
  const handleReset = () => {
    setFilters({
      selectedAddresses: [],
      startDate: "",
      price: "",
    });
  };

  // 필터 적용 (부모로 필터 값 전달)
  const handleApply = () => {
    onApply?.(filters); // 부모로 필터 값 전달
  };

  return (
    <div className={`${className} ${style.filterContainer}`}>
      <Title text="상세필터">
        <div className={style.close} onClick={onClose}>
          <Icon name="close" size={14} />
        </div>
      </Title>

      {/* 위치 선택 */}
      <div className={style.filterBox}>
        <span className={style.text}>위치</span>
        <div className={`${style.addressBox} scrollable`}>
          <ul className={style.addressList}>
            {SEOUL_DISTRICTS.map((data) => (
              <li key={data}>
                <button className={style.selectBtn} onClick={() => handleSelect(data)}>
                  {data}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {filters.selectedAddresses.length > 0 && (
          <ul className={style.selectAddressList}>
            {filters.selectedAddresses.map((address, index) => (
              <li key={index}>
                {address}
                <button className={style.selectDelBtn} onClick={() => handleDelete(address)}>
                  <span className="blind">선택된 주소 삭제</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 시작일 입력 */}
      <div className={style.filterBox}>
        <label htmlFor="StartDate" className={style.text}>
          시작일
        </label>
        <Input
          id="StartDate"
          type="date"
          value={filters.startDate}
          placeholder="입력"
          onChange={(e) => handleChange("startDate", e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      {/* 금액 입력 */}
      <div className={style.filterBox}>
        <label htmlFor="Price" className={style.text}>
          금액
        </label>
        <div className={style.filterInputContainer}>
          <div className={style.filterInputBox}>
            <Input
              id="Price"
              className={style.priceInput}
              type="text"
              value={filters.price}
              placeholder="입력"
              onChange={handlePriceChange} // 콤마 처리된 값으로 변경
            />
            <span className={style.priceText}>원</span>
          </div>
          <em>이상부터</em>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className={style.btnBox}>
        <Button
          buttonText="초기화"
          type="button"
          styleButton="secondary"
          className={style.resetBtn}
          onClick={handleReset}
        />
        <Button buttonText="적용하기" type="button" styleButton="primary" onClick={handleApply} />
      </div>
    </div>
  );
}
