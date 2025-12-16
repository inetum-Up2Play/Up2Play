import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
//import { Customer, Representative } from '@/domain/customer';
//import { CustomerService } from '@/service/customerservice';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-notificaciones',
  imports: [TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, HttpClientModule, CommonModule, ButtonModule],
  //providers: [CustomerService],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.scss',
})
export class Notificaciones implements OnInit{
  //   customers!: Customer[];

  tipos!: any[];

  loading: boolean = false;

  activityValues: number[] = [0, 100];

  //   constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.loading = false;

    this.tipos = [
      { label: 'INSCRITO', value: 'INSCRITO' },
      { label: 'PAGADO', value: 'PAGADO' },
      { label: 'ACTUALIZADO', value: 'ACTUALIZADO' },
      { label: 'DESAPUNTADO', value: 'DESAPUNTADO' },
      { label: 'CANCELADA', value: 'CANCELADA' },
      { label: 'CREADA', value: 'CREADA' },
      { label: 'EDITADA', value: 'EDITADA' },
    ];
  }

  clear(table: Table) {
    table.clear();
  }

  getSeverity(tipo: string) {
    switch (tipo) {
      case 'INSCRITO':
      case 'CREADA':
        return 'success'; // Verde

      case 'EDITADA':
      case 'PAGADO':
        return 'info'; // Azul

      case 'DESAPUNTADO':
      case 'ACTUALIZADO':
        return 'warn'; // Amarillo

      case 'CANCELADA':
        return 'danger'; // Rojo 

      default:
        return 'secondary'; // Gris
    }
  }


}

