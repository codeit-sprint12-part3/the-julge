import { useState } from "react";
import { useAuthUser } from "@/stores/useAuthUser";
import { login } from "@/lib/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Input from "@/components/ui/Input";
import { validateEmail, validatePassword } from "@/utils/validation";
import { toast } from "react-toastify";
import style from "@/components/auth/Auth.module.css";
import Button from "@/components/ui/Button";

function LoginForm() {
  const { login: loginUser } = useAuthUser();
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

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

      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let formErrors: { email?: string; password?: string } = {};

    if (!validateEmail(formData.email)) {
      formErrors.email = "유효한 이메일을 입력하세요.";
    }
    if (!validatePassword(formData.password)) {
      formErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const token = await login(formData.email, formData.password);
      await loginUser(token);
      toast.success("로그인 성공 🎉");
      router.push("/");
    } catch (error) {
      // 로그인 실패 / 이메일 또는 비밀번호가 올바르지 않음
      toast.error("로그인 실패 🥹");
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
            onChange={handleChange}
            error={errors.email}
            placeholder="이메일을 입력하세요"
          />
        </div>
        <div>
          <Input
            label="비밀번호"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        <Button
          buttonText="로그인 하기"
          type="submit"
          size="large"
          styleButton="primary"
          className={style["auth-submit-button"]}
        />
      </form>
      <div className={style["guide-box"]}>
        회원이 아니신가요?
        <Link href={"/auth/signup"}>회원가입하기</Link>
      </div>
    </div>
  );
}

export default LoginForm;
