import { Input } from "@nextui-org/react";

export default function SimpleInput({
  type = "text ",
  label = "Put some text here",
  variant = "bordered",
  onChange,
  value,
  typeInput = "onchnge",
  inputRef,
  readonly = false,
}) {
  return (
    <>
      {typeInput === "onchnge" ? (
        <Input
          type={type}
          label={label}
          variant={variant}
          value={value}
          onChange={onChange}
          className="max-w-xs"
          isReadOnly={readonly}
        />
      ) : (
        <Input
          type={type}
          label={label}
          variant={variant}
          onChange={onChange}
          ref={inputRef}
          className="max-w-xs"
        />
      )}
    </>
  );
}
