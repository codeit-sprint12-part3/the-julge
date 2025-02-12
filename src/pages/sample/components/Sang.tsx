import Input from "@/components/ui/Input";
import style from "./Sang.module.css";
import CustomSelect from "../../../components/ui/CustomSelect";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import CustomRadioInput from "@/components/ui/CustomRadioInput";
import DetailFilter from "@/components/ui/DetailFilter";
import { Filters } from "@/type";

const Sang = () => {
  //CustomSelect 테스트
  const [menuItems, setMenuItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const fetchedData = ["한식", "중식", "일식", "양식", "분식"];
    setMenuItems(fetchedData);
  }, []);

  //TextArea 테스트
  const [value, setValue] = useState("");

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  // Handle Select change
  const handleSelectChange = (selectedValue: string) => {
    setSelectedCategory(selectedValue);
    console.log("선택된 카테고리:", selectedValue); // To see the selected category
  };

  // CsutomRadioInput 테스트
  const options = [
    { id: "radio01", radioText: "알바님" },
    { id: "radio02", radioText: "사장님" },
  ];

  const [filter, setFilter] = useState<Filters>({
    selectedAddresses: [],
    startDate: "",
    price: "",
  });

  return (
    <div className={style.wrapper}>
      <div className={style.box}>
        <h1 className={style.title}>1.Input</h1>
        <h2 className={style.title}>props</h2>

        <div className={style.tableBox}>
          <table className={style.table}>
            <thead>
              <tr>
                <th>placeholder</th>
                <th>type</th>
                <th>value</th>
                <th>id</th>
                <th>name</th>
                <th>label</th>
                <th>className</th>
                <th>required</th>
                <th>error</th>
                <th>onChange</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>placeholder 적용</td>
                <td>type 적용</td>
                <td>value 적용</td>
                <td>id 적용</td>
                <td>name 적용</td>
                <td>label 적용</td>
                <td>className 적용</td>
                <td>required 적용</td>
                <td>error 적용</td>
                <td>onChange 적용</td>
              </tr>
              <tr className={style.description}>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td className={style.textLeft}>id 적용 시 label 있으면 label htmlFor 연결</td>
                <td>-</td>
                <td className={style.textLeft}>
                  label 적용하면 예시 Input 과 같은 구조로 label이 만들어지므로 <br />
                  다른 구조로 작업시 페이지에서 커스텀 필요 <br />
                  예를 들어 label props 적용안하고 공용 컴포넌트 Input 상단이나 <br />
                  하단에 lable 태그 만들어서 부모 박스 만들어서 모듈 css로 작업
                </td>
                <td className={style.textLeft}>
                  페이지 작업 시 공통 컴포넌트 css 커스텀이 필요할 경우 className 지정해서 제어
                </td>
                <td className={style.textLeft}>label에 필수 표시가 필요할 경우</td>
                <td className={style.textLeft}>error 표시, 문구가 있을 경우</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Input type="text" placeholder="Input" label="이메일" id="email" required={true} />
      </div>
      <div className={style.box}>
        <h1 className={style.title}>2.CustomRadioInput</h1>

        <div className={style.radioWrap}>
          {options.map((option) => (
            <CustomRadioInput
              key={option.id}
              id={option.id}
              name="role"
              type="radio"
              radioText={option.radioText}
              className={style.radioInput}
            />
          ))}
        </div>
      </div>

      <div className={style.box}>
        <h1 className={style.title}>3.CustomSelect</h1>
        <h2 className={style.title}>props</h2>
        <p className={style.description}>
          menuItems 명으로 props 적용하면 CustomSelect 에서 데이터 적용
        </p>
        <CustomSelect
          menuItems={menuItems}
          onChange={handleSelectChange} // Pass the onChange handler
          value={selectedCategory} // Pass the selected value
        />
      </div>

      <div className={style.box}>
        <h1 className={style.title}>4.Button</h1>
        <Button buttonText="로그인하기" type="button" size="large" styleButton="primary" /> <br />
        <Button buttonText="로그인하기" type="button" size="large" styleButton="secondary" /> <br />
        <Button buttonText="신청불가" type="button" size="large" disabled={true} />
        <br />
        <br />
        <Button buttonText="로그인하기" type="button" size="medium" styleButton="primary" /> <br />
        <Button buttonText="로그인하기" type="button" size="medium" styleButton="secondary" />{" "}
        <br />
        <Button buttonText="신청불가" type="button" size="medium" disabled={true} />
        <br />
        <br />
        <Button buttonText="로그인하기" type="button" size="small" styleButton="primary" /> <br />
        <Button buttonText="로그인하기" type="button" size="small" styleButton="secondary" /> <br />
        <Button buttonText="신청불가" type="button" size="small" disabled={true} />
      </div>
      <div className={style.box}>
        <h1 className={style.title}>5.Textarea</h1>
        <Textarea
          id="textArea"
          value={value}
          label="가게 설명"
          placeholder="입력"
          required={true}
          onChange={handleTextareaChange}
          className={style.customTextarea}
        />
      </div>

      <div className={style.box}>
        <h1 className={style.title}>6.DetailFilter</h1>
        <h2 className={style.title}>props</h2>
        <p className={style.description}>
          전체 코드 흐름 요약 <br />
          부모 컴포넌트: <br />
          1.필터 상태(filters)를 관리. <br />
          2.DetailFilter 컴포넌트에 onApply prop 전달. <br />
          3.자식 컴포넌트 DetailFilter: <br /> <br />
          자식 컴포넌트 DetailFilter <br />
          1.필터 값 변경, 추가, 삭제 처리. <br />
          2.적용하기 버튼 클릭 시, onApply를 통해 부모로 필터 값 전달. <br />
          3.초기화 버튼 클릭 시, 필터 값 초기화. <br />
          <br />
          핵심 흐름: <br />
          1.부모는 필터 값(filters)을 관리하고, 이를 **자식 컴포넌트 DetailFilter**로 전달. <br />
          2.자식은 필터 값 관리 및 변경, 삭제 후, 적용하기 버튼 클릭 시 부모에게 변경된 필터 값
          전달. <br />
          3.초기화 버튼을 클릭하면 필터 값이 리셋됨.
        </p>
        <DetailFilter filters={filter} setFilters={setFilter} />
      </div>
    </div>
  );
};

export default Sang;
