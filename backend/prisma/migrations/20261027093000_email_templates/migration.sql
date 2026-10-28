-- Editable transactional email templates.
--
-- Purely additive: one new table, nothing existing is touched. Every template
-- has a complete default in code, so this table only ever holds overrides and
-- an environment where the migration has not run yet still sends correct mail.
CREATE TABLE "email_templates" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "customHtml" TEXT,
    "useCustomHtml" BOOLEAN NOT NULL DEFAULT false,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "email_templates_key_key" ON "email_templates"("key");
