import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PALABRAS_PROHIBIDAS } from '../utils/palabras-proh.constant'; // Importar la lista

/**
 * Validador que verifica si algún control de formulario contiene alguna palabra de la lista de PALABRAS_PROHIBIDAS.
 * * @returns {ValidationErrors | null} Devuelve { profanity: true } si se encuentra una palabra prohibida, de lo contrario, null.
 */
export function prohibidasValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value: string = control.value;

        if (!value) {
            return null; // Si el campo está vacío, la validación pasa. Si es requerido, Validators.required se encarga.
        }

        // 1. Cconvertir a minúsculas, eliminar acentos/caracteres especiales
        const normalizedValue = value.toLowerCase().trim();
        
        // 2. Dividir el texto en palabras para una verificación más precisa
        const words = normalizedValue.split(/\s+|,|\.|!|\?/g).filter(w => w.length > 0);

        // 3. Verifica si alguna palabra del campo está en la lista de prohibidas
        const foundProfanity = words.some(word => PALABRAS_PROHIBIDAS.includes(word));

        // Si se encuentra alguna palabra prohibida, devuelve el error
        return foundProfanity ? { profanity: true } : null;
    };
}