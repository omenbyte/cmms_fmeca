'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function ReportForm({ params }: { params: { taskId: string } }) {
  const { taskId } = params;
  const [symptoms, setSymptoms] = useState('');
  const [comments, setComments] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    form.append('taskId', taskId);
    form.append('symptoms', symptoms);
    form.append('comments', comments);
    if (files) Array.from(files).forEach(f => form.append('images', f));

    await axios.post('/api/reports', form);
    router.push('/tech/tasks');
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">Fault / Anomaly Report</h1>

      <textarea
        className="w-full border p-2"
        placeholder="Observed symptoms"
        value={symptoms}
        onChange={e => setSymptoms(e.target.value)}
        required
      />

      <textarea
        className="w-full border p-2"
        placeholder="Comments"
        value={comments}
        onChange={e => setComments(e.target.value)}
      />

      <input
        type="file"
        multiple
        onChange={e => setFiles(e.target.files)}
      />

      <button className="bg-blue-600 text-white p-2 rounded w-full">
        Submit report
      </button>
    </form>
  );
}