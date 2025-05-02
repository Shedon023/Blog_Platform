import { Checkbox, CheckboxProps, FormControlLabel, FormHelperText } from "@mui/material";
import { useController } from "react-hook-form";

type CheckboxInputProps = CheckboxProps & {
  name: string;
  label: string;
};

export const CheckboxInput: React.FC<CheckboxInputProps> = ({ name, label, ...props }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
  });

  return (
    <>
      <FormControlLabel
        control={<Checkbox {...field} checked={!!field.value} {...props} />}
        label={label}
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
      {error && <FormHelperText error>{error.message}</FormHelperText>}
    </>
  );
};
