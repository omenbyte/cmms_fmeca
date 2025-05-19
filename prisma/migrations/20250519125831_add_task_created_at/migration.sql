-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "woId" TEXT,
    "fmecaRowId" TEXT,
    "description" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedTo" TEXT,
    CONSTRAINT "Task_woId_fkey" FOREIGN KEY ("woId") REFERENCES "WorkOrder" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_fmecaRowId_fkey" FOREIGN KEY ("fmecaRowId") REFERENCES "FmecaRow" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("assignedTo", "description", "fmecaRowId", "id", "priority", "woId") SELECT "assignedTo", "description", "fmecaRowId", "id", "priority", "woId" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
