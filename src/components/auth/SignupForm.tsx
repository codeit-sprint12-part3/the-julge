import { useState } from "react";
import Input from "@/components/ui/Input";
import CustomRadioInput from "@/components/ui/CustomRadioInput";
import { validateEmail, validatePassword, validateConfirmPassword } from "@/utils/validation";
import { registerUser } from "@/lib/users";
import { useRouter } from "next/router";
import { login } from "@/lib/auth";
import { useAuthUser } from "@/stores/useAuthUser";

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
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      const token = await login(formData.email, formData.password);

      if (token) {
        await loginUser(token); // Zustand에서 로그인 처리
        router.push("/");
      } else {
        alert("회원가입 후 자동 로그인에 실패했습니다. 로그인 페이지로 이동합니다.");
        router.push("/auth/login");
      }
    } catch (error) {
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      // console.error("회원가입 실패:", error);
    }
  };

  return (
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
      <Input
        label="비밀번호 확인"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        error={errors.confirmPassword}
        onChange={handleChange}
        placeholder="비밀번호를 다시 입력하세요"
      />

      <div>
        <p>회원 유형</p>
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

      <button type="submit">회원가입</button>
    </form>
  );
};

export default SignupForm;
