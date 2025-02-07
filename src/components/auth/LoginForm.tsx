import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Input from "@/components/ui/Input";
import style from "@/pages/auth/auth.module.css";

function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleSubmit = async (e: React.FormEvent) => {};

  return (
    <div className={style["auth-wrapper"]}>
      <Image src="/logo.svg" alt="더줄게 로고" width={248} height={45} />
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="이메일"
          type="email"
          name="email"
          value={formData.email}
          error={errors.email}
          onChange={handleChange}
          placeholder="이메일을 입력하세요"
        />
        <Input
          label="비밀번호"
          type="password"
          name="password"
          value={formData.password}
          error={errors.password}
          onChange={handleChange}
          placeholder="비밀번호를 입력하세요"
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default LoginForm;
