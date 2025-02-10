import { useState } from "react";
import style from "./DetailFilter.module.css";
import Title from "./Title";
import Input from "./Input";
import Button from "./Button";

// 필터 타입 정의
interface Filters {
  selectedAddresses: string[];  // 선택된 주소
  startDate: string;  // 시작일
  price: string;  // 금액
}

// 부모로 필터 값 전달하는 onApply prop 추가
interface DetailFilterProps {
  onApply?: (filters: Filters) => void;
}

export default function DetailFilter({ onApply }: DetailFilterProps) {
  const [filters, setFilters] = useState<Filters>({
    selectedAddresses: [],
    startDate: "",
    price: "",
  });

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
    onApply?.(filters);  // 부모로 필터 값 전달
  };

  // 주소 데이터 (예시)
  const addressData = [
    { id: 1, address: "서울시 송파구" },
    { id: 2, address: "서울시 강남구" },
    { id: 3, address: "서울시 서초구" },
    { id: 4, address: "서울시 마포구" },
  ];

  return (
    <div className={style.filterContainer}>
      <Title text="상세필터" />

      {/* 위치 선택 */}
      <div className={style.filterBox}>
        <span className={style.text}>위치</span>
        <div className={style.addressBox}>
          <ul className={style.addressList}>
            {addressData.map((data) => (
              <li key={data.id}>
                <button
                  className={style.selectBtn}
                  onClick={() => handleSelect(data.address)}
                >
                  {data.address}
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
                <button
                  className={style.selectDelBtn}
                  onClick={() => handleDelete(address)}
                >
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
          type="text"
          value={filters.startDate}
          placeholder="입력"
          onChange={(e) => handleChange("startDate", e.target.value)}
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
              onChange={(e) => handleChange("price", e.target.value)}
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
        <Button
          buttonText="적용하기"
          type="button"
          styleButton="primary"
          onClick={handleApply}
        />
      </div>
    </div>
  );
}
