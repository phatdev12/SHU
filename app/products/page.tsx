"use client"
import { Header } from "@/components/ui/header";
import { Card, Spinner } from "@heroui/react";
import { useRouter } from 'next/navigation';
import { $api } from '@/lib/client';

export default function ProductsPage() {
  const { data, isLoading, isError } = $api.useQuery('get', '/api/shop/products');
  const router = useRouter();

  return (
    <div className="relative flex flex-col min-h-screen items-center bg-black font-sans dark:bg-black pt-32 pb-16">
      <Header />
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
      <div className="w-10/12 flex-1 flex flex-col items-center justify-center">
        {isLoading && <Spinner size="lg" className="text-white" />}
        {isError && (
          <Card className="bg-red-50 border border-red-200">
            <Card.Header>
              <Card.Title className="text-red-700">Error</Card.Title>
              <Card.Description className="text-red-700">Failed to load products.</Card.Description>
            </Card.Header>
          </Card>
        )}
        {data && (
          <div className="flex flex-wrap gap-8 justify-center items-center">
            {data.items.map((product) => (
              <Card key={product.id} className="bg-zinc-950 border-2 border-zinc-400 shadow-md max-w-lg hover:scale-110 duration-300" variant="transparent" onClick={() => {
                router.push( `/products/${product.id}`)
              }}>
                <img
                  alt=""
                  className="w-full aspect-video rounded-xl object-cover select-none"
                  loading="lazy"
                  src={product.imageUrl}
                />
                <Card.Header className="mt-4 text-white">
                  <Card.Title className="text-white text-3xl font-bold">{product.name}</Card.Title>
                  <Card.Description className="text-gray-400 mt-2 text-xl">{product.price.toFixed(2)} VND</Card.Description>
                </Card.Header>
                <Card.Content>
                  <p className="text-gray-700">{product.description.replace(/\n/g, ' ')}</p>
                </Card.Content>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}