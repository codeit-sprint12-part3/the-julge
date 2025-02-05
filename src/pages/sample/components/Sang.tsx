import Input from "@/components/ui/Input";
import style from "./Sang.module.css";
import CustomSelect from "../../../components/ui/CustomSelect";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

const Sang = () => {

  const [menuItems, setMenuItems] = useState<string[]>([]);

  useEffect(() => {

    const fetchedData = ["한식", "중식", "일식", "양식", "분식"];
    setMenuItems(fetchedData);

  }, [])

  return <div className={style.wrapper}>
    <div className={style.box}>
      <h1 className={style.title}>
        1.Input
      </h1>
      <h2 className={style.title}>
        props
      </h2>

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
              <td>
                placeholder 적용
              </td>
              <td>
                type 적용
              </td>
              <td>
                value 적용
              </td>
              <td>
                id 적용
              </td>
              <td>
                name 적용
              </td>
              <td>
                label 적용
              </td>
              <td>
                className 적용
              </td>
              <td>
                required 적용
              </td>
              <td>
                error 적용
              </td>
              <td>
                onChange 적용
              </td>
            </tr>
            <tr className={style.description}>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td className={style.textLeft}>
                id 적용 시
                label 있으면 label htmlFor 연결
              </td>
              <td>-</td>
              <td className={style.textLeft}>
                label 적용하면 예시 Input 과 같은 구조로 label이 만들어지므로 <br />다른 구조로 작업시 페이지에서 커스텀 필요 <br />
                예를 들어 label props 적용안하고 공용 컴포넌트 Input 상단이나  <br />하단에 lable 태그 만들어서 부모 박스 만들어서 모듈 css로 작업
              </td>
              <td className={style.textLeft}>
                페이지 작업 시 공통 컴포넌트 css 커스텀이 필요할 경우
                className 지정해서 제어
              </td>
              <td className={style.textLeft}>
                label에 필수 표시가 필요할 경우
              </td>
              <td className={style.textLeft}>
                error 표시, 문구가 있을 경우
              </td>
              <td>
                -
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Input
        type="text"
        placeholder="Input"
        label="이메일"
        id="email"
        required={true}
      />
    </div>
    <div className={style.box}>
      <h1 className={style.title}>
        2.CustomSelect
      </h1>
      <h2 className={style.title}>
        props
      </h2>
      <p className={style.description}>
        menuItems 명으로 props 적용하면 CustomSelect 에서 데이터 적용
      </p>
      <CustomSelect
        menuItems={menuItems}
      />
    </div>

    <div className={style.box}>
      <h1 className={style.title}>
        3.Button
      </h1>
      <Button
        buttonText="로그인하기"
        type="button"
        size="large"
        styleButton="primary"
      /> <br />
      <Button
        buttonText="로그인하기"
        type="button"
        size="large"
        styleButton="secondary"
      /> <br />
      <Button
        buttonText="신청불가"
        type="button"
        size="large"
        disabled={true}
      />
      <br /><br />
      <Button
        buttonText="로그인하기"
        type="button"
        size="medium"
        styleButton="primary"
      /> <br />
      <Button
        buttonText="로그인하기"
        type="button"
        size="medium"
        styleButton="secondary"
      /> <br />
      <Button
        buttonText="신청불가"
        type="button"
        size="medium"
        disabled={true}
      />
      <br /><br />
      <Button
        buttonText="로그인하기"
        type="button"
        size="small"
        styleButton="primary"
      /> <br />
      <Button
        buttonText="로그인하기"
        type="button"
        size="small"
        styleButton="secondary"
      /> <br />
      <Button
        buttonText="신청불가"
        type="button"
        size="small"
        disabled={true}
      />
    </div>
  </div>;
};

export default Sang;
