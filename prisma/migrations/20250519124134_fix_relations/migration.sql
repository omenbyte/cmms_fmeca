-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "area" TEXT,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "FmecaRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "equipmentId" TEXT NOT NULL,
    "failureMode" TEXT NOT NULL,
    "effect" TEXT NOT NULL,
    "severity" INTEGER NOT NULL,
    "occurrence" INTEGER NOT NULL,
    "detection" INTEGER NOT NULL,
    "rpi" INTEGER NOT NULL,
    CONSTRAINT "FmecaRow_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledAt" DATETIME,
    "equipmentId" TEXT,
    CONSTRAINT "WorkOrder_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "woId" TEXT,
    "fmecaRowId" TEXT,
    "description" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "assignedTo" TEXT,
    CONSTRAINT "Task_woId_fkey" FOREIGN KEY ("woId") REFERENCES "WorkOrder" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_fmecaRowId_fkey" FOREIGN KEY ("fmecaRowId") REFERENCES "FmecaRow" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "timeSpentMinutes" INTEGER NOT NULL,
    "imagesJson" TEXT NOT NULL DEFAULT '{}',
    CONSTRAINT "Report_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
