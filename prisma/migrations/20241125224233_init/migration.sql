-- CreateTable
CREATE TABLE "TbAccountInfo" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenKey" TEXT,
    "accUserKey" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "loginIP" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "device" TEXT,
    "colpic" TEXT,
    "sports" INTEGER[],
    "name" TEXT,
    "dayOfBirth" TIMESTAMP(3),
    "periodicitySport" TEXT[],
    "gender" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstLogin" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TbAccountInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sport" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TbAccountInfo_email_key" ON "TbAccountInfo"("email");
