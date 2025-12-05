import { Feature } from "@/components/pages/home/feature";
import { Header } from "@/components/ui/header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen items-center bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <div className="relative top-0 left-0 w-full h-screen overflow-hidden">
        <Image
          src="/hero.svg"
          fill
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top"
          priority
        />
      </div>
      <div className="absolute aspect-square lg:w-4/6 w-full bg-dark-blue rounded-full top-100 flex items-center justify-center p-22" style={{
        boxShadow: '0 0 60px 10px rgba(0, 16, 197)',
      }}>
        <div className="aspect-square w-full bg-linear-to-b from-dark-blue to-light-blue rounded-full flex items-center justify-center">
          <span className="relative bottom-50 text-[300px] font-bold text-white">30</span>
        </div>
      </div>
      <div className="absolute min-h-screen w-10/12 flex flex-col lg:flex-row px-10">
        <h1 className="relative top-45 lg:w-1/2 w-full text-7xl font-bold text-white">PROTECT OUR EARTH TOGETHER</h1>
        <h1 className="relative top-50 lg:w-1/2 w-full text-7xl font-bold text-white text-right">CLEAN AIR, CLEAN FUTURE</h1>
      </div>
    
      <Feature />
    </div>
  );
}
