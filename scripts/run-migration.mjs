import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log('🔄 Ejecutando migración de tablas de contacto...');
    
    const migrationSQL = readFileSync(
      join(__dirname, '../database/migrations/create_contact_tables.sql'),
      'utf-8'
    );

    // Ejecutar cada CREATE TABLE por separado
    const createNewsletterTable = `
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subscribed BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE INDEX newsletter_subscribers_email_unique (email),
        INDEX newsletter_subscribers_email_index (email),
        INDEX newsletter_subscribers_subscribed_index (subscribed)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    const createContactTable = `
      CREATE TABLE IF NOT EXISTS contact_messages (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NULL,
        service VARCHAR(255) NULL,
        message TEXT NOT NULL,
        \`read\` BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX contact_messages_email_index (email),
        INDEX contact_messages_read_index (\`read\`),
        INDEX contact_messages_created_at_index (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await prisma.$executeRawUnsafe(createNewsletterTable);
    console.log('✅ Tabla newsletter_subscribers creada');

    await prisma.$executeRawUnsafe(createContactTable);
    console.log('✅ Tabla contact_messages creada');

    console.log('🎉 Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
