"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/ui/table";
import { band } from "@/lib/rpi";

type FM = {
  id: number;
  mode: string;
  severity: number;
  occurrence: number;
  detectability: number;
  rpi: number;
  equipment: { name: string };
};

export default function TechDashboard() {
  const qc = useQueryClient();

  const { data: fmeca = [] } = useQuery<FM[]>({
    queryKey: ["fmeca"],
    queryFn: () => fetch("/api/failure-modes").then((r) => r.json()),
  });

  const recalc = useMutation({
    mutationFn: (payload: {
      fmId: number;
      severity: number;
      occurrence: number;
      detectability: number;
    }) =>
      fetch("/api/fmeca/recalc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fmeca"] }),
  });

  const columns: ColumnDef<FM>[] = [
    {
      header: "Equip.",
      accessorKey: "equipment.name",
      cell: ({ row }) => row.original.equipment.name,
    },
    { header: "Mode", accessorKey: "mode" },
    ...(["severity", "occurrence", "detectability"] as const).map((field) => ({
      header: field[0].toUpperCase(),
      accessorKey: field,
      cell: ({ row }: { row: { original: FM } }) => (
        <Input
          type="number"
          defaultValue={row.original[field]}
          min={1}
          max={10}
          className="h-8 w-16"
          onBlur={(e) =>
            recalc.mutate({
              fmId: row.original.id,
              severity:
                field === "severity"
                  ? +e.target.value
                  : row.original.severity,
              occurrence:
                field === "occurrence"
                  ? +e.target.value
                  : row.original.occurrence,
              detectability:
                field === "detectability"
                  ? +e.target.value
                  : row.original.detectability,
            })
          }
        />
      ),
    })),
    {
      header: "RPI",
      accessorKey: "rpi",
      cell: ({ row }) => {
        const value = row.original.rpi;
        const color =
          band(value) === "red"
            ? "bg-red-500/20 text-red-700"
            : band(value) === "orange"
            ? "bg-yellow-400/20 text-yellow-600"
            : "bg-green-500/20 text-green-700";
        return <Badge className={color}>{value}</Badge>;
      },
    },
  ];

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Technician — Daily Plan</h1>
      <DataTable columns={columns} data={fmeca} />
      <Button
        onClick={() => qc.invalidateQueries({ queryKey: ["fmeca"] })}
        className="mt-4"
        variant="outline"
      >
        Refresh
      </Button>
    </div>
  );
}
