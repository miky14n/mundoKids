"use client";
import { useState } from "react";

export default function Alert({ message, color, link, setStatus = () => {} }) {
  const [isVisible, setIsVisible] = useState(true);

  const colorClasses = {
    success: {
      text: "text-green-600",
      border: "border-green-300",
      background: "bg-green-50",
      darkText: "dark:text-green-400",
      darkBorder: "dark:border-green-800",
    },
    danger: {
      text: "text-red-800",
      border: "border-red-300",
      background: "bg-red-50",
      darkText: "dark:text-red-400",
      darkBorder: "dark:border-red-800",
    },
  };

  if (!isVisible) return null;

  return (
    <div
      className={`flex items-center p-4 mb-4 ${colorClasses[color]?.text} border-t-4 ${colorClasses[color]?.border} ${colorClasses[color]?.background} dark:bg-gray-800 ${colorClasses[color]?.darkText} dark:${colorClasses[color]?.darkBorder}`}
      role="alert"
    >
      <svg
        className="flex-shrink-0 w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <div className="ml-3 text-sm font-medium">
        {message}{" "}
        {link && (
          <a href={link} className="font-semibold underline hover:no-underline">
            example link
          </a>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          setIsVisible(false);
          setStatus(null);
        }}
        className={`ml-auto -mx-1.5 -my-1.5 ${colorClasses[color]?.background} text-${color}-500 rounded-lg focus:ring-2 focus:ring-${color}-400 p-1.5 hover:bg-${color}-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-${color}-400 dark:hover:bg-gray-700`}
        aria-label="Close"
      >
        <span className="sr-only">Dismiss</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
}
