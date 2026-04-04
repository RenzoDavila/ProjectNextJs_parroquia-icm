# 🚀 Guía de Despliegue — Parroquia ICM en cPanel

> Sigue esta guía **paso a paso** cada vez que necesites actualizar la web en producción.

---

## 📦 FASE 1: Compilar en tu PC

Abre **PowerShell** en la carpeta del proyecto y ejecuta estos 4 comandos:

```powershell
# 1. Compilar el proyecto
$env:JWT_SECRET='build-time-placeholder'; $env:NODE_ENV='production'; npm run build

# 2. Copiar archivos estáticos al standalone (SIN ESTO no hay estilos)
Copy-Item -Recurse -Force "public" ".next\standalone\public"
Copy-Item -Recurse -Force ".next\static" ".next\standalone\.next\static"

# 3. Crear el ZIP
Compress-Archive -Path ".next\standalone\*" -DestinationPath "update.zip" -Force

# 4. Verificar que se creó
Get-Item "update.zip" | Select-Object Name, @{N='MB';E={[math]::Round($_.Length/1MB,1)}}
```

✅ Deberías ver algo como: `update.zip — 14.1 MB`

> ⚠️ **Si el build falla** con error de `JWT_SECRET`: asegúrate de haber ejecutado la línea 1 completa (incluye `$env:JWT_SECRET=...`).

---

## ☁️ FASE 2: Subir el ZIP al servidor

### Dónde subir:

El ZIP debe quedar en la carpeta **`ProjectNextJs_parroquia-icm`** (NO en `public_html`).

### Cómo subir:

1. Abre tu navegador → **cPanel** → **Administrador de Archivos**
2. En el **panel izquierdo**, haz clic en la carpeta **`ProjectNextJs_parroquia-icm`** para entrar
3. Verifica que estás dentro (la barra de ruta debe mostrar: `ProjectNextJs_parroquia-icm`)
4. Haz clic en **"⬆ Cargar"** (en la barra superior)
5. Arrastra o selecciona el archivo `update.zip` desde tu PC:
   ```
   d:\DESARROLLO\Parroquia\ProjectNextJs_parroquia-icm\update.zip
   ```
6. **Espera a que termine** (barra al 100%, ~14 MB)

> ⚠️ **MUY IMPORTANTE:** Si por error lo subiste a `public_html` u otra carpeta, muévelo con la terminal:
>
> ```bash
> mv /home/corazon2/public_html/update.zip /home/corazon2/ProjectNextJs_parroquia-icm/
> ```

---

## 🖥️ FASE 3: Instalar en el servidor

Abre **cPanel → Terminal** y ejecuta estos comandos **uno por uno**:

```bash
# 1. Entrar a la carpeta del proyecto
cd /home/corazon2/ProjectNextJs_parroquia-icm

# 2. Verificar que el ZIP está aquí
ls -la update.zip

# 3. Borrar la versión vieja (NO borra .env.production)
rm -rf .next node_modules public server.js package.json package-lock.json src database scripts

# 4. Descomprimir
unzip update.zip

# 5. Corregir permisos (OBLIGATORIO - evita error 500)
chmod -R 755 /home/corazon2/ProjectNextJs_parroquia-icm/

# 6. Recrear enlace a imágenes subidas (OBLIGATORIO - sin esto no se ven banners ni fotos)
ln -s /home/corazon2/public_html/uploads /home/corazon2/ProjectNextJs_parroquia-icm/public/uploads

# 7. Limpiar el ZIP
rm update.zip
```

### ¿Cómo saber si todo salió bien?

Después del paso 4, deberías ver muchos archivos descomprimiéndose.
Después del paso 6, verifica con:

```bash
ls -la public/uploads/
```

Debe mostrar: `banners` y `team`.

---

## 🔄 FASE 4: Reiniciar la aplicación

1. Ve a **cPanel → Setup Node.js App**
2. Busca tu aplicación en la lista
3. Haz clic en el botón azul **RESTART**

---

## ✅ FASE 5: Verificar

Abre en tu navegador:

| Qué verificar    | URL                                                                     |
| ---------------- | ----------------------------------------------------------------------- |
| Página principal | https://www.corazondemariaarequipa.com                                  |
| API de banners   | https://www.corazondemariaarequipa.com/api/banners                      |
| Panel admin      | https://www.corazondemariaarequipa.com/admin/login                      |
| Imagen de prueba | https://www.corazondemariaarequipa.com/uploads/banners/ (algún archivo) |

### Prueba rápida desde la terminal (opcional):

```bash
/home/corazon2/nodevenv/ProjectNextJs_parroquia-icm/20/bin/node server.js
```

Debe mostrar `✓ Ready in Xs`. Para con `Ctrl+C`.

---

## 🔧 Solución de Problemas

| Problema                            | Causa                                 | Solución                                                                                             |
| ----------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Error 500** en la web             | Permisos incorrectos                  | `chmod -R 755 /home/corazon2/ProjectNextJs_parroquia-icm/`                                           |
| **Sin estilos / CSS roto**          | No se copió `.next/static`            | Repetir paso 2 de la Fase 1 y resubir                                                                |
| **Banners/fotos no cargan**         | Falta symlink de uploads              | `ln -s /home/corazon2/public_html/uploads /home/corazon2/ProjectNextJs_parroquia-icm/public/uploads` |
| **API devuelve error**              | BD no conecta (SSL forzado u otro)    | Verificar `.env.production` tiene `DB_SSL=false`                                                     |
| **Build falla con JWT_SECRET**      | Variable no definida                  | Ejecutar `$env:JWT_SECRET='placeholder'` antes del build                                             |
| **`unzip: cannot find update.zip`** | ZIP subido en carpeta equivocada      | Moverlo: `mv /home/corazon2/public_html/update.zip /home/corazon2/ProjectNextJs_parroquia-icm/`      |
| **`node: command not found`**       | Node no está en PATH del servidor     | Usar ruta completa: `/home/corazon2/nodevenv/ProjectNextJs_parroquia-icm/20/bin/node`                |
| **`Cannot find module 'next'`**     | Permisos en node_modules              | `chmod -R 755 node_modules/`                                                                         |
| **`EADDRINUSE`** al probar manual   | La app de Passenger ya está corriendo | Normal, hacer la prueba vía navegador                                                                |

---

## 📋 Resumen Express (para copiar/pegar rápido)

### En tu PC (PowerShell):

```powershell
$env:JWT_SECRET='build-time-placeholder'; $env:NODE_ENV='production'; npm run build
Copy-Item -Recurse -Force "public" ".next\standalone\public"
Copy-Item -Recurse -Force ".next\static" ".next\standalone\.next\static"
Compress-Archive -Path ".next\standalone\*" -DestinationPath "update.zip" -Force
```

### En el servidor (después de subir el ZIP a `ProjectNextJs_parroquia-icm`):

```bash
cd /home/corazon2/ProjectNextJs_parroquia-icm
rm -rf .next node_modules public server.js package.json package-lock.json src database scripts
unzip update.zip
chmod -R 755 /home/corazon2/ProjectNextJs_parroquia-icm/
ln -s /home/corazon2/public_html/uploads /home/corazon2/ProjectNextJs_parroquia-icm/public/uploads
rm update.zip
```

Luego: **cPanel → Setup Node.js App → RESTART**
