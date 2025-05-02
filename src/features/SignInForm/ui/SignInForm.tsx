import styles from "./SignInForm.module.scss";
import { useForm, FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, CircularProgress } from "@mui/material";
import { signInSchema } from "../model/schema";
import { SignInData } from "../model/types";
import { useSignIn } from "../model/hooks/useSignIn";
import { useUserStore } from "@/entities/user/model/store";
import { User } from "@/entities/user/model/types";
import { TextInput } from "@/shared/ui/TextInput";

const SignInForm = () => {
  const methods = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    defaultValues: {
      emailAdress: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;

  const { loginMutation, isLoading } = useSignIn(setError);
  const setUser = useUserStore((state) => state.setUser);

  const onSubmit = async (data: SignInData) => {
    try {
      const response = await loginMutation(data);
      const user: User = {
        username: response.data.user.username,
        email: response.data.user.email,
        bio: response.data.user.bio,
        image: response.data.user.image,
        token: response.data.user.token,
      };
      setUser(user);
      window.location.href = "/";
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className={styles.signInContainer}>
      <span className={styles.formName}>Sign In</span>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.forms}>
            <TextInput
              className={styles.input}
              name="emailAdress"
              label="Email"
              placeholder="Email"
              autoComplete="email"
            />

            <TextInput
              className={styles.input}
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
              autoComplete="current-password"
            />

            {errors.root && <div className={styles.rootError}>{errors.root.message}</div>}

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
      </FormProvider>
    </div>
  );
};

export default SignInForm;
