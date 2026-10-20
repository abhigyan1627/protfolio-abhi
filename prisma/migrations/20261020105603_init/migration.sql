-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('INCOME_TAX', 'GST', 'BUSINESS_COMPANY', 'ACCOUNTING_FINANCE', 'AUDIT_OTHER');

-- CreateEnum
CREATE TYPE "Audience" AS ENUM ('INDIVIDUAL', 'BUSINESS', 'STARTUP');

-- CreateEnum
CREATE TYPE "BillingFrequency" AS ENUM ('ONE_TIME', 'PER_FILING', 'MONTHLY', 'ANNUAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('PHONE', 'WHATSAPP', 'EMAIL');

-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "FaqScope" AS ENUM ('GENERAL', 'HOME', 'SERVICES', 'PRICING');

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "ServiceCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "iconKey" TEXT NOT NULL DEFAULT 'file-text',
    "details" JSONB NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "audience" "Audience" NOT NULL,
    "serviceCategory" "ServiceCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "priceInPaise" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "billingFrequency" "BillingFrequency" NOT NULL DEFAULT 'CUSTOM',
    "additionalCharges" TEXT,
    "targetCustomer" TEXT NOT NULL,
    "inclusions" JSONB NOT NULL,
    "exclusions" JSONB NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "referenceCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "contactMethod" "ContactMethod" NOT NULL,
    "serviceId" TEXT,
    "planId" TEXT,
    "message" TEXT,
    "consentedAt" TIMESTAMP(3) NOT NULL,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "internalNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'EDITOR',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "csrfToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "businessName" TEXT NOT NULL,
    "profession" TEXT NOT NULL DEFAULT 'Chartered Accountant',
    "hindiName" TEXT,
    "hindiNameApproved" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "plusCode" TEXT,
    "businessHours" TEXT,
    "websiteUrl" TEXT,
    "googleBusinessUrl" TEXT,
    "googleMapsUrl" TEXT,
    "mapEmbedUrl" TEXT,
    "googleRating" DOUBLE PRECISION,
    "googleReviewCount" INTEGER,
    "showGoogleRating" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqEntry" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "scope" "FaqScope" NOT NULL DEFAULT 'GENERAL',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FaqEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_category_enabled_published_idx" ON "Service"("category", "enabled", "published");

-- CreateIndex
CREATE INDEX "Service_displayOrder_idx" ON "Service"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_slug_key" ON "Plan"("slug");

-- CreateIndex
CREATE INDEX "Plan_audience_published_displayOrder_idx" ON "Plan"("audience", "published", "displayOrder");

-- CreateIndex
CREATE INDEX "Plan_serviceCategory_idx" ON "Plan"("serviceCategory");

-- CreateIndex
CREATE UNIQUE INDEX "Enquiry_referenceCode_key" ON "Enquiry"("referenceCode");

-- CreateIndex
CREATE INDEX "Enquiry_status_createdAt_idx" ON "Enquiry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Enquiry_serviceId_idx" ON "Enquiry"("serviceId");

-- CreateIndex
CREATE INDEX "Enquiry_planId_idx" ON "Enquiry"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "AdminSession_adminUserId_idx" ON "AdminSession"("adminUserId");

-- CreateIndex
CREATE INDEX "AdminSession_expiresAt_idx" ON "AdminSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_slug_key" ON "Resource"("slug");

-- CreateIndex
CREATE INDEX "Resource_published_publishedAt_idx" ON "Resource"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "FaqEntry_scope_published_displayOrder_idx" ON "FaqEntry"("scope", "published", "displayOrder");

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
