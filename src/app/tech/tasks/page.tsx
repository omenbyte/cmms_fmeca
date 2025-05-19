'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';

interface TaskDto {
  id:string;
  description:string;
  priority:number;
  fmecaRow:{ rpi:number; };
}

export default function TasksPage(){
  const { data, isLoading } = useQuery<TaskDto[]>({
    queryKey:['tasks-today'],
    queryFn: ()=>axios.get('/api/tasks?today').then(r=>r.data)
  });

  if(isLoading) return <p>Loading…</p>;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Today Tasks</h1>
      <table className="w-full border">
        <thead><tr><th>Description</th><th>Priority</th><th>RPI</th></tr></thead>
        <tbody>
          {data?.map(t=>(
            <tr key={t.id} className="border-b">
              <td>{t.description}</td>
              <td>{t.priority}</td>
              <td>{t.fmecaRow.rpi}</td>
              <td>
                <Link className="text-blue-600 underline" href={`/tech/report/${t.id}`}>
                    Report
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}