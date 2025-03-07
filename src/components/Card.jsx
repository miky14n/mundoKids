import Image from "next/image";
import Link from "next/link";

export default function Card(params) {
  return (
    <Link href={params.path} className="block">
      <div className="max-w-sm h-full bg-white border-4 border-customPurple rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700 p-5 cursor-pointer flex flex-col justify-between">
        {/* Imagen centrada */}
        <div className="flex justify-center">
          <Image
            className="rounded-t-lg"
            src={params.img}
            alt="img-card"
            width="200"
            height="200"
          />
        </div>
        <div className="p-5 flex flex-col flex-grow">
          {/* Título */}
          <h5 className="mb-4 text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-white">
            {params.title}
          </h5>
          {/* Descripción */}
          <p className="mb-6 font-normal text-center text-gray-700 dark:text-gray-400 flex-grow">
            {params.description}
          </p>
          {/* Botón centrado */}
          <div className="flex justify-center mt-auto">
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors">
              {params.titleButton}
              <svg
                className="w-3.5 h-3.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
