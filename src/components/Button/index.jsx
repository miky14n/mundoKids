"use client";
//NextUI
import { Button } from "@nextui-org/react";

//React
import react from "react";

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
  const [isPressed, setIsPressed] = react.useState(false);

  const handlerAction = () => {
    setIsPressed(true);
    /*Something Happens*/
    console.log("It has been pressed!");
  };

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
      isPressed={isPressed}
      variant={variant}
      onPressChange={handlerAction}
    >
      {content}
    </Button>
  );
}
