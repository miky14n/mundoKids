"use client";
import { useState, useEffect } from "react";
import { Textarea } from "@heroui/react";

export default function PersonalTextarea({
  description = "Enter a concise description of your project.",
  placeholder = "Fill blank...",
  label = "Title",
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
      onChange(e);
      console.log("Input Value:", e.target.value);
    }, debounceTime);

    setTimeoutId(newTimeoutId);
  };
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  return (
    <Textarea
      isReadOnly={isReadOnly}
      className="max-w-xs"
      description={description}
      label={label}
      placeholder={placeholder}
      variant="bordered"
      value={inputValue}
      onChange={handleChange}
    />
  );
}
