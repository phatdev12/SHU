"use client";
import Link from 'next/link';

export function Header() {
  return <div className="w-full fixed top-0 left-0 p-4 flex justify-center items-center z-10000 py-8">
    <div className="w-10/12 flex items-center justify-between">
      <span className="text-2xl font-bold text-white">SHU</span>
      <nav className="bg-black/30 backdrop-blur-2xl p-2 px-3 border border-gray-700 rounded-xl flex gap-7 text-xl">
        <Link className="p-1 rounded-xl hover:bg-black duration-200 px-3" href={'/'}>Home</Link>
        <Link className="p-1 rounded-xl hover:bg-black duration-200 px-3" href={'/'}>About</Link>
        <Link className="p-1 rounded-xl hover:bg-black duration-200 px-3" href={'/'}>Products</Link>
        <Link className="p-1 rounded-xl hover:bg-black duration-200 px-3" href={'/'}>Community</Link>
      </nav>
    </div>
  </div>
}