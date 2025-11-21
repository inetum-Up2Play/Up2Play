import { Routes } from '@angular/router';
import { Actividades } from './pages/actividades/actividades';
import { CrearActividad } from './pages/crear-actividad/crear-actividad';
import { InfoActividad } from './pages/info-actividad/info-actividad';
import { EditarActividad } from './pages/editar-actividad/editar-actividad';

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
    },
    {
        path: 'editar-actividad/:id',
        component: EditarActividad
    }
];