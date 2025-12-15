module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/pg [external] (pg, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("pg");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/lib/db/postgres.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "closePool",
    ()=>closePool,
    "getClient",
    ()=>getClient,
    "getPool",
    ()=>getPool,
    "handleDbError",
    ()=>handleDbError,
    "query",
    ()=>query,
    "testConnection",
    ()=>testConnection,
    "transaction",
    ()=>transaction
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
// Singleton pattern para la conexión a PostgreSQL
let pool = null;
function getPool() {
    if (!pool) {
        pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__["Pool"]({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ssl: process.env.DB_SSL === 'true' ? {
                rejectUnauthorized: false
            } : false,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000
        });
        // Manejar errores del pool
        pool.on('error', (err)=>{
            console.error('Error inesperado en el pool de PostgreSQL:', err);
        });
    }
    return pool;
}
async function query(text, params) {
    const pool = getPool();
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        // Log en desarrollo
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('Consulta ejecutada:', {
                text,
                duration,
                rows: result.rowCount
            });
        }
        return result;
    } catch (error) {
        console.error('Error en consulta SQL:', error);
        throw error;
    }
}
async function getClient() {
    const pool = getPool();
    return await pool.connect();
}
async function transaction(callback) {
    const client = await getClient();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally{
        client.release();
    }
}
async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}
async function testConnection() {
    try {
        const result = await query('SELECT NOW() as current_time');
        console.log('Conexión a PostgreSQL exitosa:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('Error al conectar a PostgreSQL:', error);
        return false;
    }
}
function handleDbError(error) {
    console.error('Error de base de datos:', error);
    // Errores comunes de PostgreSQL
    if (error.code === '23505') {
        return {
            success: false,
            error: 'El registro ya existe (duplicado)'
        };
    }
    if (error.code === '23503') {
        return {
            success: false,
            error: 'Violación de clave foránea'
        };
    }
    if (error.code === '23502') {
        return {
            success: false,
            error: 'Campo obligatorio faltante'
        };
    }
    return {
        success: false,
        error: ("TURBOPACK compile-time truthy", 1) ? error.message : "TURBOPACK unreachable"
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/api/admin/stats/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db/postgres.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function GET() {
    try {
        // Estadísticas de reservas
        const reservationsStats = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
        COALESCE(SUM(precio) FILTER (WHERE status = 'confirmed'), 0) as total_revenue
      FROM mass_reservations
    `);
        // Reservas de hoy
        const todayReservations = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
      SELECT COUNT(*) as count 
      FROM mass_reservations 
      WHERE reservation_date = CURRENT_DATE
    `);
        // Reservas de esta semana
        const weekReservations = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
      SELECT COUNT(*) as count 
      FROM mass_reservations 
      WHERE reservation_date >= CURRENT_DATE - INTERVAL '7 days'
    `);
        // Mensajes no leídos
        const unreadMessages = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
      SELECT COUNT(*) as count 
      FROM contact_messages 
      WHERE status = 'unread'
    `);
        // Total mensajes
        const totalMessages = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
      SELECT COUNT(*) as count FROM contact_messages
    `);
        // Álbumes e imágenes
        const albumsCount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
      SELECT COUNT(*) as count FROM gallery_albums
    `);
        const imagesCount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
      SELECT COUNT(*) as count FROM gallery_images
    `);
        // Equipo pastoral
        const teamCount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
      SELECT COUNT(*) as count FROM team_members
    `);
        // Grupos parroquiales
        const groupsCount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
      SELECT COUNT(*) as count FROM parish_groups
    `);
        // Banners
        const bannersCount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
      SELECT COUNT(*) as count FROM banners
    `);
        // Últimas 5 reservas
        const recentReservations = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
      SELECT 
        mr.id, mr.nombre, mr.apellidos, mr.reservation_date, 
        mr.reservation_time, mr.tipo_misa, mr.status, mr.precio,
        mt.nombre as tipo_misa_nombre
      FROM mass_reservations mr
      LEFT JOIN mass_types mt ON mr.tipo_misa = mt.tipo_misa
      ORDER BY mr.created_at DESC
      LIMIT 5
    `);
        // Reservas por tipo de misa (para gráfico)
        const byMassType = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
      SELECT 
        mr.tipo_misa, 
        mt.nombre,
        COUNT(*) as count
      FROM mass_reservations mr
      LEFT JOIN mass_types mt ON mr.tipo_misa = mt.tipo_misa
      GROUP BY mr.tipo_misa, mt.nombre
      ORDER BY count DESC
    `);
        // Reservas por mes (últimos 6 meses)
        const byMonth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
      SELECT 
        TO_CHAR(reservation_date, 'YYYY-MM') as month,
        COUNT(*) as count
      FROM mass_reservations
      WHERE reservation_date >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY TO_CHAR(reservation_date, 'YYYY-MM')
      ORDER BY month ASC
    `);
        const stats = reservationsStats.rows[0];
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                reservations: {
                    total: parseInt(stats.total),
                    pending: parseInt(stats.pending),
                    confirmed: parseInt(stats.confirmed),
                    cancelled: parseInt(stats.cancelled),
                    completed: 0,
                    totalRevenue: parseFloat(stats.total_revenue),
                    today: parseInt(todayReservations.rows[0].count),
                    thisWeek: parseInt(weekReservations.rows[0].count)
                },
                messages: {
                    total: parseInt(totalMessages.rows[0].count),
                    unread: parseInt(unreadMessages.rows[0].count)
                },
                gallery: {
                    albums: parseInt(albumsCount.rows[0].count),
                    images: parseInt(imagesCount.rows[0].count)
                },
                team: parseInt(teamCount.rows[0].count),
                groups: parseInt(groupsCount.rows[0].count),
                banners: parseInt(bannersCount.rows[0].count),
                recentReservations: recentReservations.rows,
                charts: {
                    byMassType: byMassType.rows.map((r)=>({
                            type: r.tipo_misa,
                            name: r.nombre,
                            count: parseInt(r.count)
                        })),
                    byMonth: byMonth.rows.map((r)=>({
                            month: r.month,
                            count: parseInt(r.count)
                        }))
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        const errorResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleDbError"])(error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: errorResult.error
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__66f95f34._.js.map