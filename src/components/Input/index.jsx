import { Input } from "@heroui/react";

export default function SimpleInput({
  type = "text",
  label = "",
  variant = "bordered",
  onChange,
  value,
  typeInput = "onchnge",
  inputRef,
  readonly = false,
  readOnly = false,
  className = "w-full",
}) {
  const isReadOnly = readOnly || readonly;
  if (typeInput === "onchnge") {
    return (
      <Input
        type={type}
        label={label}
        variant={variant}
        value={value}
        onChange={onChange}
        className={className}
        isReadOnly={isReadOnly}
        labelPlacement="outside"
        placeholder=" "
      />
    );
  }
  return (
    <Input
      type={type}
      label={label}
      variant={variant}
      onChange={onChange}
      ref={inputRef}
      className={className}
      labelPlacement="outside"
      placeholder=" "
    />
  );
}
