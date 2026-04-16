"use client";
import { useState, useEffect } from "react";
import { Textarea } from "@heroui/react";

export default function PersonalTextarea({
  description = "",
  placeholder = "Escribe aquí...",
  label = "",
  value,
  onChange,
  debounceTime = 1000,
  isReadOnly = false,
}) {
  const [inputValue, setInputValue] = useState(value || "");
  const [timeoutId, setTimeoutId] = useState(null);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      onChange && onChange(e);
    }, debounceTime);
    setTimeoutId(newTimeoutId);
  };

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  return (
    <Textarea
      isReadOnly={isReadOnly}
      className="w-full"
      description={description}
      label={label}
      labelPlacement="outside"
      placeholder={placeholder}
      variant="bordered"
      value={inputValue}
      onChange={handleChange}
      minRows={3}
    />
  );
}
