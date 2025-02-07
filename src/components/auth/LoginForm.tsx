import { useState } from "react";
import { useAuthUser } from "@/stores/useAuthUser";
import { login } from "@/lib/auth";
import { useRouter } from "next/router";
import Input from "@/components/ui/Input";
import { validateEmail, validatePassword } from "@/utils/validation";
import { toast } from "react-toastify";
import style from "@/pages/auth/auth.module.css";

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
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="이메일"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="이메일을 입력하세요"
        />
        <Input
          label="비밀번호"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="비밀번호를 입력하세요"
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default LoginForm;
