module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},30056,e=>e.a(async(t,r)=>{try{let t=await e.y("pg");e.n(t),r()}catch(e){r(e)}},!0),8376,e=>e.a(async(t,r)=>{try{var a=e.i(30056),s=t([a]);[a]=s.then?(await s)():s;let u=null;function n(){return u||(u=new a.Pool({host:process.env.DB_HOST,port:parseInt(process.env.DB_PORT||"5432"),database:process.env.DB_NAME,user:process.env.DB_USER,password:process.env.DB_PASSWORD,ssl:"true"===process.env.DB_SSL&&{rejectUnauthorized:!1},max:20,idleTimeoutMillis:3e4,connectionTimeoutMillis:2e3})).on("error",e=>{console.error("Error inesperado en el pool de PostgreSQL:",e)}),u}async function o(e,t){let r=n();Date.now();try{let a=await r.query(e,t);return Date.now(),a}catch(e){throw console.error("Error en consulta SQL:",e),e}}async function i(){let e=n();return await e.connect()}async function l(e){let t=await i();try{await t.query("BEGIN");let r=await e(t);return await t.query("COMMIT"),r}catch(e){throw await t.query("ROLLBACK"),e}finally{t.release()}}function c(e){return(console.error("Error de base de datos:",e),"23505"===e.code)?{success:!1,error:"El registro ya existe (duplicado)"}:"23503"===e.code?{success:!1,error:"Violación de clave foránea"}:"23502"===e.code?{success:!1,error:"Campo obligatorio faltante"}:{success:!1,error:"Error al procesar la solicitud"}}e.s(["handleDbError",()=>c,"query",()=>o,"transaction",()=>l]),r()}catch(e){r(e)}},!1),15020,e=>e.a(async(t,r)=>{try{var a=e.i(89171),s=e.i(8376),n=t([s]);async function o(){try{let e=await (0,s.query)(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
        COALESCE(SUM(precio) FILTER (WHERE status = 'confirmed'), 0) as total_revenue
      FROM mass_reservations
    `),t=await (0,s.query)(`
      SELECT COUNT(*) as count 
      FROM mass_reservations 
      WHERE reservation_date = CURRENT_DATE
    `),r=await (0,s.query)(`
      SELECT COUNT(*) as count 
      FROM mass_reservations 
      WHERE reservation_date >= CURRENT_DATE - INTERVAL '7 days'
    `),n=await (0,s.query)(`
      SELECT COUNT(*) as count 
      FROM contact_messages 
      WHERE status = 'unread'
    `),o=await (0,s.query)(`
      SELECT COUNT(*) as count FROM contact_messages
    `),i=await (0,s.query)(`
      SELECT COUNT(*) as count FROM gallery_albums
    `),l=await (0,s.query)(`
      SELECT COUNT(*) as count FROM gallery_images
    `),c=await (0,s.query)(`
      SELECT COUNT(*) as count FROM team_members
    `),u=await (0,s.query)(`
      SELECT COUNT(*) as count FROM parish_groups
    `),d=await (0,s.query)(`
      SELECT COUNT(*) as count FROM banners
    `),p=await (0,s.query)(`
      SELECT 
        mr.id, mr.nombre, mr.apellidos, mr.reservation_date, 
        mr.reservation_time, mr.tipo_misa, mr.status, mr.precio,
        mt.nombre as tipo_misa_nombre
      FROM mass_reservations mr
      LEFT JOIN mass_types mt ON mr.tipo_misa = mt.tipo_misa
      ORDER BY mr.created_at DESC
      LIMIT 5
    `),m=await (0,s.query)(`
      SELECT 
        mr.tipo_misa, 
        mt.nombre,
        COUNT(*) as count
      FROM mass_reservations mr
      LEFT JOIN mass_types mt ON mr.tipo_misa = mt.tipo_misa
      GROUP BY mr.tipo_misa, mt.nombre
      ORDER BY count DESC
    `),E=await (0,s.query)(`
      SELECT 
        TO_CHAR(reservation_date, 'YYYY-MM') as month,
        COUNT(*) as count
      FROM mass_reservations
      WHERE reservation_date >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY TO_CHAR(reservation_date, 'YYYY-MM')
      ORDER BY month ASC
    `),R=e.rows[0];return a.NextResponse.json({success:!0,data:{reservations:{total:parseInt(R.total),pending:parseInt(R.pending),confirmed:parseInt(R.confirmed),cancelled:parseInt(R.cancelled),completed:0,totalRevenue:parseFloat(R.total_revenue),today:parseInt(t.rows[0].count),thisWeek:parseInt(r.rows[0].count)},messages:{total:parseInt(o.rows[0].count),unread:parseInt(n.rows[0].count)},gallery:{albums:parseInt(i.rows[0].count),images:parseInt(l.rows[0].count)},team:parseInt(c.rows[0].count),groups:parseInt(u.rows[0].count),banners:parseInt(d.rows[0].count),recentReservations:p.rows,charts:{byMassType:m.rows.map(e=>({type:e.tipo_misa,name:e.nombre,count:parseInt(e.count)})),byMonth:E.rows.map(e=>({month:e.month,count:parseInt(e.count)}))}}})}catch(t){console.error("Error al obtener estadísticas:",t);let e=(0,s.handleDbError)(t);return a.NextResponse.json({success:!1,error:e.error},{status:500})}}[s]=n.then?(await n)():n,e.s(["GET",()=>o]),r()}catch(e){r(e)}},!1),2068,e=>e.a(async(t,r)=>{try{var a=e.i(47909),s=e.i(74017),n=e.i(96250),o=e.i(59756),i=e.i(61916),l=e.i(14444),c=e.i(37092),u=e.i(69741),d=e.i(16795),p=e.i(87718),m=e.i(95169),E=e.i(47587),R=e.i(66012),h=e.i(70101),w=e.i(26937),v=e.i(10372),y=e.i(93695);e.i(52474);var C=e.i(220),T=e.i(15020),x=t([T]);[T]=x.then?(await x)():x;let g=new a.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/api/admin/stats/route",pathname:"/api/admin/stats",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/admin/stats/route.ts",nextConfigOutput:"",userland:T}),{workAsyncStorage:f,workUnitAsyncStorage:N,serverHooks:b}=g;function O(){return(0,n.patchFetch)({workAsyncStorage:f,workUnitAsyncStorage:N})}async function _(e,t,r){g.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/admin/stats/route";a=a.replace(/\/index$/,"")||"/";let n=await g.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!n)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:T,params:x,nextConfig:O,parsedUrl:_,isDraftMode:f,prerenderManifest:N,routerServerContext:b,isOnDemandRevalidate:S,revalidateOnlyGenerated:I,resolvedPathname:M,clientReferenceManifest:A,serverActionsManifest:U}=n,q=(0,u.normalizeAppPath)(a),L=!!(N.dynamicRoutes[q]||N.routes[M]),D=async()=>((null==b?void 0:b.render404)?await b.render404(e,t,_,!1):t.end("This page could not be found"),null);if(L&&!f){let e=!!N.routes[M],t=N.dynamicRoutes[q];if(t&&!1===t.fallback&&!e){if(O.experimental.adapterPath)return await D();throw new y.NoFallbackError}}let P=null;!L||g.isDev||f||(P=M,P="/index"===P?"/":P);let F=!0===g.isDev||!L,H=L&&!F;U&&A&&(0,l.setReferenceManifestsSingleton)({page:a,clientReferenceManifest:A,serverActionsManifest:U,serverModuleMap:(0,c.createServerModuleMap)({serverActionsManifest:U})});let k=e.method||"GET",j=(0,i.getTracer)(),B=j.getActiveScopeSpan(),Y={params:x,prerenderManifest:N,renderOpts:{experimental:{authInterrupts:!!O.experimental.authInterrupts},cacheComponents:!!O.cacheComponents,supportsDynamicResponse:F,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:O.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a)=>g.onRequestError(e,t,a,b)},sharedContext:{buildId:T}},W=new d.NodeNextRequest(e),K=new d.NodeNextResponse(t),$=p.NextRequestAdapter.fromNodeNextRequest(W,(0,p.signalFromNodeResponse)(t));try{let n=async e=>g.handle($,Y).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=j.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let s=r.get("next.route");if(s){let t=`${k} ${s}`;e.setAttributes({"next.route":s,"http.route":s,"next.span_name":t}),e.updateName(t)}else e.updateName(`${k} ${a}`)}),l=!!(0,o.getRequestMeta)(e,"minimalMode"),c=async o=>{var i,c;let u=async({previousCacheEntry:s})=>{try{if(!l&&S&&I&&!s)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await n(o);e.fetchMetrics=Y.renderOpts.fetchMetrics;let i=Y.renderOpts.pendingWaitUntil;i&&r.waitUntil&&(r.waitUntil(i),i=void 0);let c=Y.renderOpts.collectedTags;if(!L)return await (0,R.sendResponse)(W,K,a,Y.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(a.headers);c&&(t[v.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==Y.renderOpts.collectedRevalidate&&!(Y.renderOpts.collectedRevalidate>=v.INFINITE_CACHE)&&Y.renderOpts.collectedRevalidate,s=void 0===Y.renderOpts.collectedExpire||Y.renderOpts.collectedExpire>=v.INFINITE_CACHE?void 0:Y.renderOpts.collectedExpire;return{value:{kind:C.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:s}}}}catch(t){throw(null==s?void 0:s.isStale)&&await g.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:S})},b),t}},d=await g.handleResponse({req:e,nextConfig:O,cacheKey:P,routeKind:s.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:N,isRoutePPREnabled:!1,isOnDemandRevalidate:S,revalidateOnlyGenerated:I,responseGenerator:u,waitUntil:r.waitUntil,isMinimalMode:l});if(!L)return null;if((null==d||null==(i=d.value)?void 0:i.kind)!==C.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(c=d.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});l||t.setHeader("x-nextjs-cache",S?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),f&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,h.fromNodeOutgoingHttpHeaders)(d.value.headers);return l&&L||p.delete(v.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,w.getCacheControlHeader)(d.cacheControl)),await (0,R.sendResponse)(W,K,new Response(d.value.body,{headers:p,status:d.value.status||200})),null};B?await c(B):await j.withPropagatedContext(e.headers,()=>j.trace(m.BaseServerSpan.handleRequest,{spanName:`${k} ${a}`,kind:i.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},c))}catch(t){if(t instanceof y.NoFallbackError||await g.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:S})}),L)throw t;return await (0,R.sendResponse)(W,K,new Response(null,{status:500})),null}}e.s(["handler",()=>_,"patchFetch",()=>O,"routeModule",()=>g,"serverHooks",()=>b,"workAsyncStorage",()=>f,"workUnitAsyncStorage",()=>N]),r()}catch(e){r(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__c5a2eb8f._.js.map