export interface ProductTableItem {
    codigo: string;
    detalle: string;
    familia: string;
    precio: number;
    stock: number;
}

export interface ProductDetail {
    codigo: string;
    descripcion: string;
    familia: string;
    marca: string;
    precioCosto: number;
    precioVenta: number;
    iva: number;
    proveedor: string;
    stock: number;
    stockMin: number;
    stockIdeal: number;
    unidadPrecioLista1: number;
    unidadPrecioLista2: number;
    unidadPrecioLista3: number;
    cantXMayor: number;
    precioXMayor: number;
    nota: string;
    tieneImagen: boolean;
}

export interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
}