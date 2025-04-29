import styles from "./SignInForm.module.scss";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, FormControl, FormHelperText, Button } from "@mui/material";
import { signInSchema } from "../model/schema";
import { SignInData } from "../model/types";
import { useSignIn } from "../model/hooks/useSignIn";
import { useUserStore } from "@/entities/user/model/store";
import { User } from "@/entities/user/model/types";

const SignInForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
  });

  const { loginMutation } = useSignIn(setError);
  const setUser = useUserStore((state) => state.setUser);

  const onSubmit = (data: SignInData) => {
    loginMutation(data).then((response) => {
      const user: User = {
        username: response.data.user.username,
        email: response.data.user.email,
        bio: response.data.user.bio,
        image: response.data.user.image,
        token: response.data.user.token,
      };
      setUser(user);
      window.location.href = "/";
    });
  };

  return (
    <div className={styles.signInContainer}>
      <span className={styles.formName}>Sign In</span>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.forms}>
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

          <FormControl fullWidth margin="normal" error={!!errors.password}>
            <TextField
              label="Password"
              {...register("password")}
              placeholder="Password"
              type="password"
              variant="outlined"
              autoComplete="password"
            />
            {errors.password && typeof errors.password.message === "string" && (
              <FormHelperText>{errors.password.message}</FormHelperText>
            )}
          </FormControl>

          <span>{errors.root?.message}</span>

          <div className={styles.footer}>
            <Button className={styles.submitBtn} type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>

            <span className={styles.signUp}>
              Don't have an account? <Link to="/sign-up">Sign Up.</Link>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
