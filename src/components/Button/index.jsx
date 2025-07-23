"use client";
import { Button } from "@heroui/react";

export default function PersonalButton({
  content = "Button",
  size = "md",
  radius = "md",
  color = "primary",
  isLoading = false,
  startIcon = <></>,
  endIcon = <></>,
  classname = "",
  variant = "solid",
  action = () => {
    console.log("Im doing something!");
  },
}) {
  return (
    <Button
      size={size}
      radius={radius}
      color={color}
      isLoading={isLoading}
      startContent={startIcon}
      endContent={endIcon}
      classname={classname}
      onPress={action}
      variant={variant}
    >
      {content}
    </Button>
  );
}
