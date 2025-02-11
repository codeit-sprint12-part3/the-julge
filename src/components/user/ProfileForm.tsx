import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";
import Button from "@/components/ui/Button";
import { useAuthUser } from "@/stores/useAuthUser";
import { updateUserInfo } from "@/lib/users";
import { SEOUL_DISTRICTS } from "@/constants/constants";
import style from "@/components/user/ProfileForm.module.css";

const profileSchema = z.object({
  name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다."),
  phone: z.string().regex(/^\d{3}-\d{3,4}-\d{4}$/, "올바른 연락처 형식이 아닙니다."),
  address: z.string().min(1, "선호 지역을 선택해주세요."),
  bio: z.string().max(200, "소개는 최대 200자까지 입력 가능합니다.").optional(),
});

type FormVal = z.infer<typeof profileSchema>;

const ProfileForm = () => {
  const { user, fetchAndSetUser } = useAuthUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormVal>({
    resolver: zodResolver(profileSchema),
    defaultValues:
      user?.name && user?.phone
        ? {
            name: user.name,
            phone: user.phone,
            address: user.address,
            bio: user.bio || "",
          }
        : undefined,
  });

  const address = watch("address");

  const onSubmit = async (formVal: FormVal) => {
    if (!user?.id) {
      toast("다시 로그인해주세요.");
      return;
    }

    try {
      await updateUserInfo(user.id, formVal);
      toast("업데이트 성공 🎉");
      await fetchAndSetUser();
      router.push("/user");
    } catch (error) {
      toast("업데이트 실패 🥹");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={style["profile-form-wrapper"]}>
      <div className={style["grid-box"]}>
        <div>
          <Input
            label="이름"
            type="text"
            {...register("name")}
            error={errors.name?.message}
            required={true}
            placeholder="입력"
          />
        </div>
        <div>
          <Input
            label="연락처"
            type="text"
            {...register("phone")}
            error={errors.phone?.message}
            required={true}
            placeholder="입력"
          />
        </div>
        <div>
          <span className={style["label-text"]}>
            선호 지역<em title="필수 입력">*</em>
          </span>
          <CustomSelect
            menuItems={SEOUL_DISTRICTS}
            type="button"
            onChange={(value) => setValue("address", value)}
            value={address}
          />
          {errors.address && <p className={style.errorText}>{errors.address.message}</p>}
        </div>
      </div>
      <div>
        <span className={style["label-text"]}>소개</span>
        <textarea {...register("bio")} placeholder="입력" className={style["form-textarea"]} />
        {errors.bio && <p className={style.errorText}>{errors.bio.message}</p>}
      </div>
      <div className={style["form-button-box"]}>
        <Button buttonText="등록하기" type="submit" size="large" styleButton="primary" />
      </div>
    </form>
  );
};

export default ProfileForm;
