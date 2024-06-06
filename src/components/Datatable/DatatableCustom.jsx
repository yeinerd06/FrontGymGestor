const customStyles = {
  rows: {
    style: {
      minHeight: '40px', // anula la altura predeterminada de las filas
    },
  },
  headCells: {
    style: {
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
      backgroundColor: '#0047ab', // Cambia el color de fondo a un azul más oscuro (#0047ab)
      color: '#fff', // Cambia el color del texto a blanco (#fff) para que sea legible
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      className: 'bg-primary', // Agrega la clase CSS 'bg-primary' al encabezado
    },
  },
  cells: {
    style: {
      paddingLeft: '1rem',
      paddingRight: '1rem',
      backgroundColor: 'transparent',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#525f7f',
    },
  },
};

const customTheme = {
  text: {
    primary: '#333',
    secondary: '#555',
  },
  background: {
    default: '#F9F9F9',
  },
  context: {
    background: '#E5F4FF',
    text: '#268bd2',
  },
  divider: {
    default: '#ccc',
  },
  action: {
    button: '#333',
    hover: '#f1f1f1',
    disabled: '#f3f3f3',
  },
};

export { customStyles, customTheme };
