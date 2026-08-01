import { Component } from '@angular/core';
import { MENU_KYALSHOP } from '../../core/constants/menu';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class InicioComponent {
  public modulos = MENU_KYALSHOP.filter(item => item.url !== '/admin/inicio');
}
