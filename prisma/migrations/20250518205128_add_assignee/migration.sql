-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WorkOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "failureModeId" INTEGER NOT NULL,
    "assignedToId" INTEGER,
    CONSTRAINT "WorkOrder_failureModeId_fkey" FOREIGN KEY ("failureModeId") REFERENCES "FailureMode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkOrder_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_WorkOrder" ("failureModeId", "id", "status") SELECT "failureModeId", "id", "status" FROM "WorkOrder";
DROP TABLE "WorkOrder";
ALTER TABLE "new_WorkOrder" RENAME TO "WorkOrder";
CREATE UNIQUE INDEX "WorkOrder_failureModeId_status_key" ON "WorkOrder"("failureModeId", "status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
