import { Input } from "@nextui-org/react";

export default function SimpleInput({
  type = "email",
  label = "Email",
  variant = "bordered",
  value,
  onChange,
}) {
  return (
    <Input
      type={type}
      label={label}
      variant={variant}
      value={value}
      onChange={onChange}
      className="max-w-xs"
    />
  );
}
