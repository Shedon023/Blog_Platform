import { useForm, FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import styles from "./SignUpForm.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "../model";
import { signUpSchema } from "../model/schema";
import { SignUpData } from "../model/types";
import { TextInput } from "@/shared/ui/TextInput";
import { CheckboxInput } from "@/shared/ui/CheckboxInput";

const SignUpForm = () => {
  const methods = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const { handleSubmit, reset, watch } = methods;

  const { mutate } = useSignUp(reset);

  const onSubmit = (data: SignUpData) => {
    mutate(data);
  };

  const agreeTerms = watch("agreeTerms");

  return (
    <div className={styles.LoginPageContainer}>
      <span className={styles.formName}>Create new account</span>
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

            <TextInput name="emailAdress" label="Email adress" placeholder="Email adress" autoComplete="email" />

            <TextInput
              className={styles.input}
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
              autoComplete="new-password"
            />

            <TextInput
              className={styles.input}
              name="repeatPassword"
              label="Repeat Password"
              placeholder="Repeat Password"
              type="password"
              autoComplete="repeat-password"
            />

            <CheckboxInput
              className={styles.checkbox}
              name="agreeTerms"
              label="I agree to the processing of my personal information"
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
      </FormProvider>
    </div>
  );
};

export default SignUpForm;
