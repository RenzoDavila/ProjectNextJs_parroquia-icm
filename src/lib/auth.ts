/**
 * Utilidades de autenticación
 */

export interface AdminUser {
    id: number;
    email: string;
    name: string;
    role: string;
}

/**
 * Verifica si hay una sesión activa
 */
export async function checkAuth(): Promise<AdminUser | null> {
    try {
        const response = await fetch('/api/auth/me', {
            credentials: 'include',
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.success ? data.user : null;
    } catch (error) {
        console.error('Error checking auth:', error);
        return null;
    }
}

/**
 * Inicia sesión
 */
export async function login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error logging in:', error);
        return { success: false, error: 'Error de conexión' };
    }
}

/**
 * Cierra sesión
 */
export async function logout(): Promise<void> {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
    } catch (error) {
        console.error('Error logging out:', error);
    }
}
