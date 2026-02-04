import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelcase',
})
export class CamelcasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    return value
      .replace(/_/g, ' ') // Reemplaza barras bajas por espacios
      .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitaliza primera letra de cada palabra
  }
}
