/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
/*src="https://external-preview.redd.it/4MddL-315mp40uH18BgGL2-5b6NIPHcDMBSWuN11ynM.jpg?width=960&crop=smart&auto=webp&s=b98d54a43b3dac555df398588a2c791e0f3076d9"*/
export default function Unauthorized() {
  return (
    <div className="bg-indigo-900 relative overflow-hidden h-screen">
      {/* Background Image */}
      <img
        src="https://www.bluehost.com/blog/wp-content/uploads/2023/06/what-is-a-401-error.png"
        alt="Unautorazed"
        width="200"
        height="200"
        className="absolute h-full w-full object-cover"
      />
      {/* Overlay */}
      <div className="inset-0 bg-black opacity-25 absolute"></div>
      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 flex items-center justify-center py-32 xl:py-40">
        <div className="w-full font-mono flex flex-col items-center relative z-10">
          <h1 className="font-extrabold text-5xl text-center text-white leading-tight mt-4">
            Tú no tienes permiso para estar en esta página. Vuelve por donde
            viniste.
          </h1>
          <p className="font-extrabold text-8xl my-16 text-white animate-bounce ml-[400px]">
            401
          </p>
        </div>
      </div>
    </div>
  );
}
