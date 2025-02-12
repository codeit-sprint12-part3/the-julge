import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Input from "@/components/ui/Input";
import CustomRadioInput from "@/components/ui/CustomRadioInput";
import { validateEmail, validatePassword, validateConfirmPassword } from "@/utils/validation";
import { registerUser } from "@/lib/users";
import { useRouter } from "next/router";
import { login } from "@/lib/auth";
import { useAuthUser } from "@/stores/useAuthUser";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import style from "@/components/auth/Auth.module.css";

const SignupForm = () => {
  const { login: loginUser } = useAuthUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    type: "employee",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (name === "email") {
        newErrors.email = validateEmail(value) ? undefined : "유효한 이메일을 입력하세요.";
      }

      if (name === "password") {
        newErrors.password = validatePassword(value)
          ? undefined
          : "비밀번호는 8자 이상이어야 합니다.";
      }

      if (name === "confirmPassword") {
        newErrors.confirmPassword = validateConfirmPassword(formData.password, value)
          ? undefined
          : "비밀번호가 일치하지 않습니다.";
      }

      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let formErrors: { email?: string; password?: string; confirmPassword?: string } = {};

    if (!validateEmail(formData.email)) {
      formErrors.email = "유효한 이메일을 입력하세요.";
    }
    if (!validatePassword(formData.password)) {
      formErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    }
    if (!validateConfirmPassword(formData.password, formData.confirmPassword)) {
      formErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await registerUser({
        email: formData.email,
        password: formData.password,
        type: formData.type as "employee" | "employer",
      });

      if (!response?.item?.id) {
        toast("회원가입 실패 🥹");
        return;
      }

      const token = await login(formData.email, formData.password);

      if (token) {
        await loginUser(token); // Zustand에서 로그인 처리
        toast("환영합니다 🫶🏻");
        router.push("/");
      } else {
        // 회원가입 후 자동 로그인에 실패 / 로그인 페이지로 이동
        toast("가입 성공 🎉 자동 로그인 실패 🥹");
        router.push("/auth/login");
      }
    } catch (error) {
      toast("회원가입 실패 🥹");
    }
  };

  return (
    <div className={style["auth-wrapper"]}>
      <Link href={"/"} className={style["auth-logo"]}>
        <Image
          src="/logo.svg"
          alt="더줄게 로고"
          width={248}
          height={45}
          className={style["auth-logo-img"]}
        />
      </Link>
      <form onSubmit={handleSubmit} noValidate className={style["auth-form"]}>
        <div>
          <Input
            label="이메일"
            type="email"
            name="email"
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
          />
        </div>
        <div>
          <Input
            label="비밀번호"
            type="password"
            name="password"
            value={formData.password}
            error={errors.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        <div>
          <Input
            label="비밀번호 확인"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            error={errors.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>
        <div className={style["auth-radio-box"]}>
          <p>회원 유형</p>
          <div>
            {[
              { id: "employee", value: "employee", label: "알바님" },
              { id: "employer", value: "employer", label: "사장님" },
            ].map((option) => (
              <CustomRadioInput
                key={option.id}
                type="radio"
                name="type"
                id={option.id}
                value={option.value}
                radioText={option.label}
                className={formData.type === option.value ? "selected" : ""}
                onChange={handleChange}
                checked={formData.type === option.value}
              />
            ))}
          </div>
        </div>

        <Button
          buttonText="가입하기"
          type="submit"
          size="large"
          styleButton="primary"
          className={style["auth-submit-button"]}
        />
      </form>
      <div className={style["guide-box"]}>
        이미 가입하셨나요?
        <Link href={"/auth/login"}>로그인하기</Link>
      </div>
    </div>
  );
};

export default SignupForm;
