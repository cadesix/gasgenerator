-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "targetAudience" TEXT NOT NULL DEFAULT '',
    "tone" TEXT NOT NULL DEFAULT '',
    "examples" TEXT NOT NULL DEFAULT '[]',
    "metadata" TEXT DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "ScriptFormat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "structure" TEXT NOT NULL DEFAULT '',
    "visualDescription" TEXT NOT NULL DEFAULT '',
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT,
    "examples" TEXT NOT NULL DEFAULT '[]',
    "metadata" TEXT DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "ScriptFormat_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedScript" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT 'Untitled Script',
    "hook" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "shareId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "formatId" TEXT,
    "metadata" TEXT DEFAULT '{}',
    "savedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "SavedScript_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavedScript_formatId_fkey" FOREIGN KEY ("formatId") REFERENCES "ScriptFormat" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Brief" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scriptId" TEXT NOT NULL,
    "editorName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "footageLinks" TEXT NOT NULL DEFAULT '[]',
    "referenceVideos" TEXT NOT NULL DEFAULT '[]',
    "notes" TEXT,
    "shareId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Brief_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "SavedScript" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'ad_concept',
    "projectId" TEXT,
    "convertedToScriptId" TEXT,
    "metadata" TEXT DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Idea_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ScriptFormat_projectId_idx" ON "ScriptFormat"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedScript_shareId_key" ON "SavedScript"("shareId");

-- CreateIndex
CREATE INDEX "SavedScript_projectId_idx" ON "SavedScript"("projectId");

-- CreateIndex
CREATE INDEX "SavedScript_formatId_idx" ON "SavedScript"("formatId");

-- CreateIndex
CREATE INDEX "SavedScript_shareId_idx" ON "SavedScript"("shareId");

-- CreateIndex
CREATE UNIQUE INDEX "Brief_scriptId_key" ON "Brief"("scriptId");

-- CreateIndex
CREATE UNIQUE INDEX "Brief_shareId_key" ON "Brief"("shareId");

-- CreateIndex
CREATE INDEX "Brief_scriptId_idx" ON "Brief"("scriptId");

-- CreateIndex
CREATE INDEX "Brief_shareId_idx" ON "Brief"("shareId");

-- CreateIndex
CREATE INDEX "Brief_status_idx" ON "Brief"("status");

-- CreateIndex
CREATE INDEX "Brief_editorName_idx" ON "Brief"("editorName");

-- CreateIndex
CREATE INDEX "Idea_projectId_idx" ON "Idea"("projectId");

-- CreateIndex
CREATE INDEX "Idea_type_idx" ON "Idea"("type");
