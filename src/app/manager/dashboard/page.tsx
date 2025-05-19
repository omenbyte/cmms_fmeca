'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface EquipCard { id:string; name:string; maxRpi:number; }

export default function Dashboard(){
  const { data, isLoading } = useQuery<EquipCard[]>({
    queryKey:['equip-rpi'],
    queryFn: ()=>axios.get('/api/equipment').then(r=>r.data),
    refetchInterval: 15_000   // auto‑refresh every 15 s
  });

  if(isLoading) return <p>Loading…</p>;

  function color(rpi:number){
    if(rpi < 80) return 'border-green-500';
    if(rpi < 120) return 'border-orange-500';
    return 'border-red-600';
  }

  return (
    <div className="grid gap-4 p-6 md:grid-cols-3">
      {data?.map(e=>(
        <div key={e.id} className={`p-4 border-4 rounded ${color(e.maxRpi)}`}>
          <h2 className="font-bold">{e.name}</h2>
          <p>Worst RPI: {e.maxRpi}</p>
        </div>
      ))}
    </div>
  );
}
