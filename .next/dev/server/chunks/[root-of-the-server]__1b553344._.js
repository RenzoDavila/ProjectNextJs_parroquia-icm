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
"[project]/src/app/api/reservations/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db/postgres.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
/**
 * Genera un código de confirmación único
 */ function generateConfirmationCode() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ICM-${timestamp}-${random}`;
}
/**
 * Obtiene la IP del cliente desde los headers
 */ function getClientIp(request) {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return realIp || null;
}
async function POST(request) {
    try {
        const body = await request.json();
        // Validar campos obligatorios
        const requiredFields = [
            'date',
            'time',
            'nombre',
            'apellidos',
            'dni',
            'telefono',
            'email',
            'tipoMisa',
            'intencion',
            'metodoPago'
        ];
        for (const field of requiredFields){
            if (!body[field]) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: `El campo "${field}" es obligatorio`
                }, {
                    status: 400
                });
            }
        }
        // Validar formato de fecha
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(body.date)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Formato de fecha inválido'
            }, {
                status: 400
            });
        }
        // Validar que la fecha no sea en el pasado
        const reservationDate = new Date(body.date + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (reservationDate < today) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'No se pueden hacer reservas para fechas pasadas'
            }, {
                status: 400
            });
        }
        // Validar DNI (8 dígitos)
        if (!/^\d{8}$/.test(body.dni)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'El DNI debe tener exactamente 8 dígitos'
            }, {
                status: 400
            });
        }
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'El formato del correo electrónico no es válido'
            }, {
                status: 400
            });
        }
        // Obtener información del cliente
        const clientIp = getClientIp(request);
        const userAgent = request.headers.get('user-agent');
        // Ejecutar la inserción dentro de una transacción
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (client)=>{
            // Verificar que el horario siga disponible
            const availabilityCheck = await client.query(`SELECT 
          mat.max_reservations,
          COUNT(mr.id) as current_reservations
        FROM mass_available_times mat
        LEFT JOIN mass_reservations mr ON 
          mr.reservation_time = mat.time AND 
          mr.reservation_date = $1 AND
          mr.status NOT IN ('cancelled')
        WHERE mat.time = $2 AND mat.is_active = true
        GROUP BY mat.max_reservations`, [
                body.date,
                body.time
            ]);
            if (availabilityCheck.rows.length === 0) {
                throw new Error('El horario seleccionado no está disponible');
            }
            const { max_reservations, current_reservations } = availabilityCheck.rows[0];
            if (parseInt(current_reservations) >= max_reservations) {
                throw new Error('El horario seleccionado ya no está disponible');
            }
            // Obtener el precio del tipo de misa
            const priceResult = await client.query(`SELECT precio FROM mass_types WHERE tipo_misa = $1 AND is_active = true`, [
                body.tipoMisa
            ]);
            if (priceResult.rows.length === 0) {
                throw new Error('Tipo de misa no válido');
            }
            const precio = parseFloat(priceResult.rows[0].precio.toString());
            // Generar código de confirmación
            const confirmationCode = generateConfirmationCode();
            // Determinar estado inicial según método de pago
            const status = body.metodoPago === 'transferencia' ? 'payment_pending' : 'pending';
            // Insertar la reserva
            const insertResult = await client.query(`INSERT INTO mass_reservations (
          reservation_date,
          reservation_time,
          location,
          nombre,
          apellidos,
          dni,
          telefono,
          email,
          tipo_misa,
          intencion,
          difuntos,
          observaciones,
          precio,
          metodo_pago,
          comprobante_url,
          pago_verificado,
          status,
          confirmation_code,
          ip_address,
          user_agent
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
        ) RETURNING id, confirmation_code`, [
                body.date,
                body.time,
                'Parroquia',
                body.nombre,
                body.apellidos,
                body.dni,
                body.telefono,
                body.email.toLowerCase(),
                body.tipoMisa,
                body.intencion,
                body.difuntos || null,
                body.observaciones || null,
                precio,
                body.metodoPago,
                body.comprobanteUrl || null,
                false,
                status,
                confirmationCode,
                clientIp,
                userAgent
            ]);
            return {
                reservationId: insertResult.rows[0].id,
                confirmationCode: insertResult.rows[0].confirmation_code
            };
        });
        // TODO: Enviar correo de confirmación
        // await sendConfirmationEmail(body.email, result.confirmationCode);
        const response = {
            success: true,
            message: body.metodoPago === 'transferencia' ? 'Reserva creada exitosamente. Te contactaremos para validar tu transferencia.' : 'Reserva creada exitosamente. Recuerda acercarte a la secretaría para realizar el pago.',
            reservationId: result.reservationId,
            confirmationCode: result.confirmationCode
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response, {
            status: 201
        });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        if (error instanceof Error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: error.message
            }, {
                status: 400
            });
        }
        const errorResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleDbError"])(error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: errorResult.error || 'Error al crear la reserva'
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');
        const date = searchParams.get('date');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        let queryText = `
      SELECT 
        id,
        reservation_date,
        reservation_time,
        location,
        nombre,
        apellidos,
        dni,
        telefono,
        email,
        tipo_misa,
        intencion,
        precio,
        metodo_pago,
        pago_verificado,
        status,
        confirmation_code,
        created_at
      FROM mass_reservations
      WHERE 1=1
    `;
        const params = [];
        let paramCount = 0;
        if (status) {
            paramCount++;
            queryText += ` AND status = $${paramCount}`;
            params.push(status);
        }
        if (date) {
            paramCount++;
            queryText += ` AND reservation_date = $${paramCount}`;
            params.push(date);
        }
        queryText += ` ORDER BY reservation_date DESC, reservation_time ASC`;
        paramCount++;
        queryText += ` LIMIT $${paramCount}`;
        params.push(limit.toString());
        paramCount++;
        queryText += ` OFFSET $${paramCount}`;
        params.push(offset.toString());
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(queryText, params);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: result.rows,
            meta: {
                total: result.rowCount,
                limit,
                offset
            }
        });
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        const errorResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2f$postgres$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleDbError"])(error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: errorResult.error || 'Error al obtener las reservas'
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1b553344._.js.map