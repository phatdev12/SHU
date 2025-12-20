import Image from "next/image";

export function Feature() {
  return (
    <div className="relative w-full min-h-screen bg-zinc-50 font-sans dark:bg-black/90 border-t border-t-gray-800 backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden gap-4">
      <div className="relative w-full h-30 z-10 flex flex-col justify-center items-center mb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#000_0px,#000_40px,#facc15_40px,#facc15_90px)]"></div>
        <div className="relative z-10">

        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="tunnelGradient">
              <stop offset="0%" stopColor="#6b7280" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>
          </defs>
          <circle cx="960" cy="540" r="150" fill="none" stroke="#6b7280" strokeWidth="60" opacity="0.8" />
          <circle cx="960" cy="540" r="280" fill="none" stroke="#52525b" strokeWidth="70" opacity="0.6" />
          <circle cx="960" cy="540" r="450" fill="none" stroke="#3f3f46" strokeWidth="80" opacity="0.5" />
          <circle cx="960" cy="540" r="650" fill="none" stroke="#27272a" strokeWidth="90" opacity="0.4" />
          <circle cx="960" cy="540" r="900" fill="none" stroke="#18181b" strokeWidth="100" opacity="0.3" />
          <circle cx="960" cy="540" r="1200" fill="none" stroke="#09090b" strokeWidth="110" opacity="0.2" />
        </svg>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:max-w-9/12 w-full relative z-10 ">
        <div className="row-span-2 p-2 rounded-3xl bg-gradient-to-br from-light-blue/60 via-black to-light-blue shadow-2xl shadow-light-blue/20 hover:shadow-light-blue hover:shadow-[0_0_100px_rgba(56,189,248,0.9),0_0_200px_rgba(56,189,248,0.5)] transition-all duration-300">
          <div className="rounded-3xl bg-black p-8 text-center h-full">
            <div className="relative">
              <Image
                src="/sensor.svg"
                alt="Features Image"
                width={600}
                height={400}
                className="rounded-2xl mx-auto"
              />
            </div>
            <h2 className="text-6xl font-bold text-white mb-4 text-start">Our Features</h2>
            <p className="text-white mb-6 text-start">
              Discover the innovative features that make our platform unique and effective in promoting environmental sustainability.
            </p>
          </div>
        </div>

        <div className="col-span-1 p-2 rounded-3xl bg-gradient-to-br from-light-blue via-black to-light-blue shadow-2xl shadow-light-blue/20 hover:shadow-light-blue hover:shadow-[0_0_100px_rgba(56,189,248,0.9),0_0_200px_rgba(56,189,248,0.5)] transition-all duration-300 z-9">
          <div className="rounded-3xl bg-black p-8 h-full flex flex-col items-start">
            <div className="relative w-full flex-1 mb-6">
              <Image
                src="/chip.svg"
                alt="Features Image"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-6xl font-bold text-white mb-4 text-start">Our Features</h2>
              <p className="text-white mb-6 text-start">
                Discover the innovative features that make our platform unique and effective in promoting environmental sustainability.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-1 p-2 rounded-3xl bg-gradient-to-br from-black via-light-blue/80 to-transparent shadow-2xl shadow-light-blue/20 hover:shadow-light-blue hover:shadow-[0_0_100px_rgba(56,189,248,0.9),0_0_200px_rgba(56,189,248,0.5)] transition-all duration-300 z-9">
          <div className="rounded-3xl bg-black p-8 h-full">
            <h2 className="text-4xl font-bold text-white mb-4 text-start">Our Features</h2>
            <p className="text-white mb-6 text-start">
              Discover the innovative features that make our platform unique and effective in promoting environmental sustainability.
            </p>
          </div>
        </div>
      </div>
      <div className="relative w-full h-30 z-10 flex flex-col justify-center items-center mt-15 overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#000_0px,#000_40px,#facc15_40px,#facc15_90px)]"></div>
        <div className="relative z-10">

        </div>
      </div>
    </div>
  );
}