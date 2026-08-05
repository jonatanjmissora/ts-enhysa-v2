ALTER TABLE "tecnicos" ADD COLUMN "dni" integer;

ALTER TABLE "tecnicos" ADD CONSTRAINT tecnicos_dni_check CHECK ("dni" IS NULL OR ("dni" >= 1000000 AND "dni" <= 99999999));