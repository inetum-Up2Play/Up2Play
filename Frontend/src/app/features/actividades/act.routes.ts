import { Routes } from '@angular/router';
import { Actividades } from './pages/actividades/actividades';
import { CrearActividad } from './pages/crear-actividad/crear-actividad';
import { InfoActividad } from './pages/info-actividad/info-actividad';

export const ACT_ROUTES: Routes = [
    { 
        path: '', 
        component: Actividades 
    },
    { 
        path: 'crear-actividad', 
        component: CrearActividad
    },
    {
        path: 'info-actividad/:id',
        component: InfoActividad
    }
];