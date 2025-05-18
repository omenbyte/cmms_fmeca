-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'TECH'
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FailureMode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mode" TEXT NOT NULL,
    "severity" INTEGER NOT NULL,
    "occurrence" INTEGER NOT NULL,
    "detectability" INTEGER NOT NULL,
    "rpi" INTEGER NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    CONSTRAINT "FailureMode_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FmeaHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "failureModeId" INTEGER NOT NULL,
    "severity" INTEGER NOT NULL,
    "occurrence" INTEGER NOT NULL,
    "detectability" INTEGER NOT NULL,
    "rpi" INTEGER NOT NULL,
    CONSTRAINT "FmeaHistory_failureModeId_fkey" FOREIGN KEY ("failureModeId") REFERENCES "FailureMode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "failureModeId" INTEGER NOT NULL,
    CONSTRAINT "WorkOrder_failureModeId_fkey" FOREIGN KEY ("failureModeId") REFERENCES "FailureMode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WorkOrder_failureModeId_status_key" ON "WorkOrder"("failureModeId", "status");
