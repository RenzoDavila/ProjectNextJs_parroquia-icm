import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'general'; // banners, services, gallery, etc.
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de archivo no permitido. Solo se permiten imágenes.' },
        { status: 400 }
      );
    }

    // Validar tamaño (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'El archivo es demasiado grande. Máximo 10MB.' },
        { status: 400 }
      );
    }

    // Generar nombre único
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;

    // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
    let uploadDir;

    if (process.env.NODE_ENV === 'production') {
      // EN EL SERVIDOR: Guardar en public_html para que no se borre al actualizar la app
      // y para que Apache sirva la imagen directamente.
      // Ruta: /home/corazon2/public_html/uploads/team (o la carpeta que sea)
      uploadDir = path.join('/home/corazon2/public_html/uploads', folder);
    } else {
      // EN TU PC: Guardar en la carpeta normal del proyecto
      uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    }
    // -------------------------------

    // Crear directorio si no existe
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // El directorio ya existe o hubo un error de permisos
      console.error('Info directorio:', error);
    }

    // Guardar archivo
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Retornar URL pública
    // La URL sigue siendo /uploads/... porque public_html es la raíz de tu dominio
    const publicUrl = `/uploads/${folder}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json(
      { success: false, error: 'Error al subir el archivo' },
      { status: 500 }
    );
  }
}