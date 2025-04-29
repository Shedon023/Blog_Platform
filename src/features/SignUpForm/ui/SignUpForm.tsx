import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { TextField, Checkbox, FormControl, FormHelperText, FormControlLabel, Button } from "@mui/material";
import styles from "./SignUpForm.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "../model";
import { signUpSchema } from "../model/schema";
import { SignUpData } from "../model/types";

const SignUpForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
  });

  const { mutate } = useSignUp(reset);

  const onSubmit = (data: SignUpData) => {
    mutate(data);
  };

  const agreeTerms = watch("agreeTerms");

  return (
    <div className={styles.LoginPageContainer}>
      <span className={styles.formName}>Create new account</span>

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

          <FormControl fullWidth margin="normal" error={!!errors.password}>
            <TextField
              label="Password"
              {...register("password")}
              placeholder="Password"
              type="password"
              variant="outlined"
              autoComplete="new-password"
            />
            {errors.password && typeof errors.password.message === "string" && (
              <FormHelperText>{errors.password.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.repeatPassword}>
            <TextField
              label="Repeat Password"
              {...register("repeatPassword")}
              placeholder="Repeat Password"
              type="password"
              variant="outlined"
              autoComplete="repeat-password"
            />
            {errors.repeatPassword && typeof errors.repeatPassword.message === "string" && (
              <FormHelperText>{errors.repeatPassword.message}</FormHelperText>
            )}
          </FormControl>

          <FormControlLabel
            control={<Checkbox {...register("agreeTerms")} />}
            label="I agree to the processing of my personal information"
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "22px",
              color: "#595959",
              justifyContent: "center",
              alignItems: "center",
            }}
          />

          <div className={styles.footer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!agreeTerms}
              className={!agreeTerms ? styles.submitBtnDisabled : styles.submitBtn}
            >
              Create
            </Button>
            <span className={styles.signIn}>
              Already have an account? <Link to="/sign-in">Sign in.</Link>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
