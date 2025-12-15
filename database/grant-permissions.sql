-- ============================================
-- OTORGAR PERMISOS AL USUARIO corazon2_root
-- ============================================
-- Ejecuta este script en phpPgAdmin (cPanel)

-- Otorgar permisos de LECTURA (SELECT) en todas las tablas
GRANT SELECT ON ALL TABLES IN SCHEMA public TO corazon2_root;

-- Otorgar permisos de ESCRITURA (INSERT, UPDATE, DELETE) en todas las tablas
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO corazon2_root;

-- Otorgar permisos de USAGE en las secuencias (para SERIAL/AUTO_INCREMENT)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO corazon2_root;

-- Otorgar permisos para tablas futuras (opcional pero recomendado)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO corazon2_root;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO corazon2_root;

-- Verificación: Ver permisos actuales
SELECT 
    grantee, 
    table_schema, 
    table_name, 
    privilege_type
FROM information_schema.table_privileges
WHERE grantee = 'corazon2_root'
ORDER BY table_name, privilege_type;
