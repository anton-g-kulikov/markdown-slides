import React from "react";
import { useRouter } from "next/router";

interface TitleBarProps {
  title: string;
}

const TitleBar: React.FC<TitleBarProps> = ({ title }) => {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  return (
    <div
      className="slide-title fixed top-0 left-0 right-0 p-4 bg-gray-800 text-white text-center shadow-lg z-10 flex items-center"
      data-cy="slide-title-bar"
      data-testid="slide-title-bar"
    >
      <button
        onClick={goHome}
        className="absolute left-4 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
        data-cy="home-btn"
        data-testid="home-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </button>
      <h5 className="text-xl font-bold w-full" data-cy="slide-title">
        {title}
      </h5>
    </div>
  );
};

export default TitleBar;
