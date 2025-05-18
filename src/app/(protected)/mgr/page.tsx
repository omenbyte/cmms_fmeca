"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { band } from "@/lib/rpi";

type WO = {
  id: number;
  status: "PENDING" | "COMPLETED" | "ARCHIVED";
  assignedTo?: { id: number; email: string } | null;
  failureMode: {
    id: number;
    mode: string;
    rpi: number;
    equipment: { name: string };
  };
};

type Tech = { id: number; email: string };

export default function ManagerDashboard() {
  const qc = useQueryClient();

  const { data: wos = [] } = useQuery<WO[]>({
    queryKey: ["wos"],
    queryFn: () => fetch("/api/work-orders").then((r) => r.json()),
  });

  const { data: techs = [] } = useQuery<Tech[]>({
    queryKey: ["techs"],
    queryFn: () => fetch("/api/users?role=TECH").then((r) => r.json()),
  });

  const assign = useMutation({
    mutationFn: ({ woId, techId }: { woId: number; techId: number }) =>
      fetch(`/api/work-orders/${woId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ techId }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wos"] }),
  });

  const changeStatus = useMutation({
    mutationFn: ({ woId, status }: { woId: number; status: WO["status"] }) =>
      fetch(`/api/work-orders/${woId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wos"] }),
  });

  const columns: ColumnDef<WO>[] = [
    {
      header: "Equip.",
      accessorKey: "failureMode.equipment.name",
      cell: ({ row }) => row.original.failureMode.equipment.name,
    },
    { header: "Mode", accessorKey: "failureMode.mode" },
    {
      header: "RPI",
      accessorKey: "failureMode.rpi",
      cell: ({ row }) => {
        const value = row.original.failureMode.rpi;
        const colour =
          band(value) === "red"
            ? "bg-red-500/20 text-red-700"
            : band(value) === "orange"
            ? "bg-yellow-400/20 text-yellow-700"
            : "bg-green-500/20 text-green-700";
        return <Badge className={colour}>{value}</Badge>;
      },
    },
    {
      header: "Assigned To",
      cell: ({ row }) => (
        <Select
          value={row.original.assignedTo?.id ?? ""}
          onChange={(e) =>
            assign.mutate({
              woId: row.original.id,
              techId: Number(e.currentTarget.value),
            })
          }
        >
          <option value="">— unassigned —</option>
          {techs.map((t) => (
            <option key={t.id} value={t.id}>
              {t.email}
            </option>
          ))}
        </Select>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge
            className={
              row.original.status === "PENDING"
                ? "bg-blue-500/20 text-blue-700"
                : row.original.status === "COMPLETED"
                ? "bg-green-500/20 text-green-700"
                : "bg-gray-500/20 text-gray-700"
            }
          >
            {row.original.status}
          </Badge>
          {row.original.status === "PENDING" && (
            <Button
              size="sm"
              onClick={() =>
                changeStatus.mutate({ woId: row.original.id, status: "COMPLETED" })
              }
            >
              Mark Done
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Manager — Work Orders</h1>
      <DataTable columns={columns} data={wos} />
      <Button
        onClick={() => qc.invalidateQueries({ queryKey: ["wos"] })}
        className="mt-4"
        variant="outline"
      >
        Refresh
      </Button>
    </div>
  );
}
