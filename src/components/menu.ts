export interface Menu {
  label: string;
  pathname: string;
}

const MENU: Menu[] = [
  {
    label: 'Home',
    pathname: '/'
  },
  {
    label: 'Caro',
    pathname: '/Caro'
  },
  {
    label: 'Profile',
    pathname: '/profile'
  }
];
export default MENU;
