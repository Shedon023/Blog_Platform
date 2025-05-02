import { TextField, TextFieldProps } from "@mui/material";
import { useController } from "react-hook-form";

type TextInputProps = TextFieldProps & {
  name: string;
};

export const TextInput: React.FC<TextInputProps> = ({ name, ...props }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    defaultValue: "",
  });

  return <TextField {...field} {...props} variant="outlined" error={!!error} helperText={error?.message} />;
};
