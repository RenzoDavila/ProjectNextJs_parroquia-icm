Guía Maestra de Actualización.

Guarda este resumen. Estos son los pasos exactos y "quirúrgicos" para actualizar tu web sin llenar el disco, sin borrar tus fotos subidas y asegurando que los estilos (CSS) funcionen.
FASE 1: En tu PC (Preparar el Paquete)

El objetivo es crear un ZIP que tenga todo lo necesario para funcionar, incluyendo los estilos que faltaban antes.

    Compila:
    Bash

    npm run build

    Copia los archivos estáticos (CRÍTICO):

        Ve a la carpeta .next/standalone.

        Copia la carpeta public (de la raíz de tu proyecto) y pégala dentro de standalone.

        Crea la carpeta .next/static dentro de standalone/.next/ y copia ahí el contenido de tu .next/static original.

        (Si no haces esto, la web se verá sin estilos).

    Comprimir:

        Entra a standalone.

        Selecciona todo (incluyendo la carpeta .next que acabas de rellenar).

        Crea el archivo update.zip.

FASE 2: En el Servidor (Limpieza y Despliegue)

Abre tu terminal negra en cPanel y ejecuta esto línea por línea:

1. Entrar a la carpeta:
Bash

cd ProjectNextJs_parroquia-icm

2. Borrar la versión vieja (Comando seguro): Este comando borra todo el código viejo pero RESPETA tu archivo .env.production y tus logs.
Bash

rm -rf .next node_modules public server.js package.json package-lock.json src database

(Nota: No te preocupes por la carpeta uploads, esa está segura en public_html).

3. Subir y Descomprimir:

    Sube tu update.zip usando el Administrador de Archivos de cPanel.

    Una vez subido, vuelve a la terminal y descomprime (o hazlo desde el cPanel):
    Bash

    unzip update.zip

    (Si al descomprimir se crea una carpeta standalone, entra en ella. Si se descomprimen los archivos sueltos, salta al paso 5).

4. Mover los archivos a la raíz (Si se creó carpeta standalone):
Bash

mv standalone/* .
mv standalone/.next .
rm -rf standalone

5. Limpieza final: Borra el zip para ahorrar espacio.
Bash

rm update.zip

FASE 3: Reiniciar (El toque final)

    Ve a cPanel > Setup Node.js App.

    Dale al botón azul RESTART.

✅ Checklist de Verificación

Si seguiste esto al pie de la letra:

    [ ] Tus cambios de código estarán activos.

    [ ] Las imágenes de "Equipo" se verán (porque el .htaccess ya las protege).

    [ ] El diseño se verá bien (porque copiaste la carpeta static manualmente).

    [ ] Tu disco no se llenará (porque borraste lo viejo antes).