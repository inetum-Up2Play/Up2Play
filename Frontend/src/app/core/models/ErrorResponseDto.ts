export interface ErrorResponseDto {
    error: string;     // Código del error, ej: "CORREO_NO_COINCIDE"
    message: string;      // Descripción técnica o explicación del error
    status: number;      // Código HTTP, ej: 409
    path: string;        // Ruta donde ocurrió el error
    timestamp: string;   // Fecha y hora del error en formato ISO
}
