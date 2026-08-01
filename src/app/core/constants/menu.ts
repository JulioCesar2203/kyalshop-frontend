export const MENU_KYALSHOP = [
  {
    titulo: 'Inicio',
    icono: 'bi bi-house-door',
    url: '/admin/inicio'
  },
  {
    titulo: 'Configuración',
    icono: 'bi bi-gear',
    url: '/admin/configuracion'
  },
  {
    titulo: 'Gestión de Envíos',
    icono: 'bi bi-box-seam',
    url: '/admin/envios'
  },
  {
    titulo: 'Reportes',
    icono: 'bi bi-bar-chart',
    url: '/admin/reportes'
  },
  {
    titulo: 'Compartir',
    icono: 'bi bi-share',
    url: '/admin/compartir'
  },
];

export const SUBMENUS_KYALSHOP: any = {
  '/admin/configuracion': {
    titulo: 'CONFIGURACIÓN',
    opciones: [
      { titulo: 'Datos Públicos', icono: 'bi bi-globe', url: '/admin/configuracion/datos-publicos' },
      { titulo: 'Seguridad', icono: 'bi bi-shield-lock', url: '/admin/configuracion/seguridad' }
    ]
  },
  '/admin/envios': {
    titulo: 'GESTIÓN DE ENVÍOS',
    opciones: [
      { titulo: 'Bandeja Shalom', icono: 'bi bi-shop', url: '/admin/envios/shalom' },
      { titulo: 'Bandeja Delivery', icono: 'bi bi-truck', url: '/admin/envios/delivery' }
    ]
  },
  '/admin/reportes': {
    titulo: 'REPORTES',
    opciones: [
      { titulo: 'Generales', icono: 'bi bi-graph-up', url: '/admin/reportes/generales' }
    ]
  },
  '/admin/compartir': {
    titulo: 'COMPARTIR',
    opciones: [
      { titulo: 'Enlaces', icono: 'bi bi-link-45deg', url: '/admin/compartir/enlaces' }
    ]
  }
};