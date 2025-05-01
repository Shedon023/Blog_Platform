import styles from "./EditProfile.module.scss";
import { useForm } from "react-hook-form";
import { editProfileSchema } from "../model/schema";
import { EditProfileData } from "../model/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import { useUserStore } from "../../../entities/user/model/store";
import { useEditProfile } from "../model/hooks/useEditProfile";
import { useEffect } from "react";

const EditProfileForm = () => {
  const user = useUserStore((state) => state.user);
  const { mutateAsync } = useEditProfile();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<EditProfileData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onSubmit",
    // defaultValues: {
    //   userName: user?.username || "",
    //   emailAdress: user?.email || "",
    //   avatarImage: user?.image || "",
    // },
  });

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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.forms}>
          <FormControl fullWidth margin="normal" error={!!errors.userName}>
            <TextField
              label="Username"
              {...register("userName")}
              placeholder="Username"
              variant="outlined"
              autoComplete="username"
            />
            {errors.userName && typeof errors.userName.message === "string" && (
              <FormHelperText>{errors.userName.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.emailAdress}>
            <TextField
              label="Email adress"
              {...register("emailAdress")}
              placeholder="Email adress"
              variant="outlined"
              autoComplete="email"
            />
            {errors.emailAdress && typeof errors.emailAdress.message === "string" && (
              <FormHelperText>{errors.emailAdress.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.newPassword}>
            <TextField
              label="New Password"
              {...register("newPassword")}
              placeholder="New Password"
              type="password"
              variant="outlined"
              autoComplete="new-password"
            />
            {errors.newPassword && typeof errors.newPassword.message === "string" && (
              <FormHelperText>{errors.newPassword.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.avatarImage}>
            <TextField
              label="Avatar image (url)"
              {...register("avatarImage")}
              placeholder="Avatar image"
              variant="outlined"
              autoComplete="avatar image"
            />
            {errors.avatarImage && typeof errors.avatarImage.message === "string" && (
              <FormHelperText>{errors.avatarImage.message}</FormHelperText>
            )}
          </FormControl>

          <div className={styles.footer}>
            <Button type="submit" variant="contained" color="primary" fullWidth className={styles.saveBtn}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
