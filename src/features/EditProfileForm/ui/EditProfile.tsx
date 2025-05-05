import styles from "./EditProfile.module.scss";
import { FormProvider, useForm } from "react-hook-form";
import { editProfileSchema } from "../model/schema";
import { EditProfileData } from "../model/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import { useUserStore } from "../../../entities/user/model/store";
import { useEditProfile } from "../model/hooks/useEditProfile";
import { useEffect } from "react";
import { TextInput } from "@/shared/ui/TextInput";

const EditProfileForm = () => {
  const user = useUserStore((state) => state.user);
  const { mutateAsync } = useEditProfile();

  const defaultValues = editProfileSchema.parse({});

  const methods = useForm<EditProfileData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onBlur",
    defaultValues: defaultValues,
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (user) {
      reset({
        userName: user.username ?? "",
        emailAdress: user.email ?? "",
        avatarImage: user.image ?? "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data: EditProfileData) => {
    mutateAsync(data)
      .then(() => {
        console.log("Профиль изменен");
      })
      .catch((err: unknown) => {
        console.error("Ошибка", err);
      });
  };

  return (
    <div className={styles.editProfileContainer}>
      <span className={styles.formName}>Edit Profile</span>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.forms}>
            <TextInput
              className={styles.input}
              name="userName"
              label="Username"
              placeholder="Username"
              autoComplete="username"
            />

            <TextInput
              className={styles.input}
              name="emailAdress"
              label="Email adress"
              placeholder="Email adress"
              autoComplete="email"
            />

            <TextInput
              className={styles.input}
              name="newPassword"
              label="New Password"
              placeholder="New Password"
              type="password"
              autoComplete="new-password"
            />

            <TextInput
              className={styles.input}
              name="avatarImage"
              label="Avatar image (url)"
              placeholder="Avatar image"
              autoComplete="avatar image"
            />

            <div className={styles.footer}>
              <Button type="submit" variant="contained" color="primary" fullWidth className={styles.saveBtn}>
                Save
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditProfileForm;
