-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expenses" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMembers" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupMembers_groupId_userId_key" ON "GroupMembers"("groupId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembers" ADD CONSTRAINT "GroupMembers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembers" ADD CONSTRAINT "GroupMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
