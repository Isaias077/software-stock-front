// src/Pages/ArticulosPage/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Container, Snackbar, Alert, Box } from '@mui/material';
import { ProductTableItem, ProductDetail, SnackbarState } from './types';
import ProductHeader from '../../components/ArticulosPage/ProductHeader';
import StatisticsSection from '../../components/ArticulosPage/StatisticsSection';
import TabsNavigation from '../../components/ArticulosPage/TabsNavigation';
import ProductTable from '../../components/ArticulosPage/ProductTable';
import ProductForm from '../../components/ArticulosPage/ProductForm';
import ActionButtons from '../../components/ArticulosPage/ActionButtons';
import DeleteDialog from '../../components/ArticulosPage/Dialogs/DeleteDialog';
import ExitDialog from '../../components/ArticulosPage/Dialogs/ExitDialog';
import ImageDialog from '../../components/ArticulosPage/Dialogs/ImageDialog';
import ExportDialog from '../../components/ArticulosPage/Dialogs/ExportDialog';
import LoadingIndicator from '../../components/ArticulosPage/LoadingIndicator';

const initialProductData: ProductTableItem[] = [
    { codigo: '77985255158301', detalle: 'ESPUMA', familia: 'ARTICULOS', precio: 17.00, stock: 0 },
    { codigo: '77959472050014', detalle: 'ESPUMA ARTIFICIAL', familia: 'ARTICULOS', precio: 9.50, stock: 0 },
    { codigo: '40258004371305', detalle: 'ESPUMA DE AFEITAR', familia: 'ARTICULOS', precio: 13.00, stock: 0 },
    { codigo: '77932116052476', detalle: 'ESPUMA GILLETTE', familia: 'ARTICULOS', precio: 15.00, stock: 0 },
    { codigo: '47402241459', detalle: 'ESPUMA GILLETTE', familia: 'ARTICULOS', precio: 24.00, stock: 53 },
    { codigo: '77932186951123', detalle: 'ESPUMA GILLETTE 150', familia: 'ARTICULOS', precio: 21.00, stock: 0 },
    { codigo: '7551037600520', detalle: 'EVEREADY AA X UNIDAD', familia: 'ARTICULOS', precio: 5.50, stock: 0 },
    { codigo: '3892095285', detalle: 'EVEREADY AAA X UNIDAD', familia: 'ARTICULOS', precio: 7.00, stock: 0 },
    { codigo: '7551037600182', detalle: 'EVEREADY C MEDIANA X UNO', familia: 'ARTICULOS', precio: 12.00, stock: 0 },
    { codigo: '7551037600018', detalle: 'EVEREADY D GRANDE X UNO', familia: 'ARTICULOS', precio: 16.00, stock: 0 },
    { codigo: '7802300790298', detalle: 'EXTRACTO TABACO', familia: 'ARTICULOS', precio: 11.50, stock: 0 },
    { codigo: '7622300847234', detalle: 'EXPRESS', familia: 'ARTICULOS', precio: 25.50, stock: 0 },
    { codigo: '7622300299637', detalle: 'EXPRESS CLASICA', familia: 'ARTICULOS', precio: 22.80, stock: 0 },
    { codigo: '7622300087722', detalle: 'EXPRESS LIGHT', familia: 'ARTICULOS', precio: 23.50, stock: 0 },
    { codigo: '7622300792148', detalle: 'EXPRESS 3 3', familia: 'ARTICULOS', precio: 13.50, stock: 0 },
  ];

const familias = ['ARTICULOS', 'BEBIDAS', 'LIMPIEZA', 'PERFUMERIA', 'ALIMENTOS'];
const proveedores = ['EVEREADY', 'GILLETTE', 'EXPRESS', 'COLGATE', 'UNILEVER'];

function ArticulosPage() {
    const tableRef = useRef<HTMLDivElement>(null);

    // Estados para los datos
    const [productData, setProductData] = useState<ProductTableItem[]>(initialProductData);
    const [filteredData, setFilteredData] = useState<ProductTableItem[]>(initialProductData);
    const [selectedProduct, setSelectedProduct] = useState<ProductDetail>({
        codigo: '7551037600182',
        descripcion: 'EVEREADY C MEDIANA X UNO',
        familia: 'ARTICULOS',
        marca: 'EVEREADY',
        precioCosto: 6.30,
        precioVenta: 12.00,
        iva: 21,
        proveedor: 'EVEREADY',
        stock: 0,
        stockMin: 0,
        stockIdeal: 0,
        unidadPrecioLista1: 0,
        unidadPrecioLista2: 0.00,
        unidadPrecioLista3: 0.00,
        cantXMayor: 1,
        precioXMayor: 0,
        nota: '',
        tieneImagen: false
    });

    // Estados para la interfaz
    const [highlightedRow, setHighlightedRow] = useState<string>('7551037600182');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isNewProduct, setIsNewProduct] = useState<boolean>(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [sortField, setSortField] = useState<string>('codigo');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeTab, setActiveTab] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    // Estados para diálogos y notificaciones
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openExitDialog, setOpenExitDialog] = useState<boolean>(false);
    const [openImageDialog, setOpenImageDialog] = useState<boolean>(false);
    const [openExportMenuDialog, setOpenExportMenuDialog] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    // Estadísticas rápidas
    const totalProducts = productData.length;
    const outOfStockProducts = productData.filter(p => p.stock <= 0).length;
    const totalValue = productData.reduce((sum, product) => sum + (product.precio * product.stock), 0);

    // Filtrar productos cuando cambia la búsqueda
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredData(productData);
        } else {
            const lowercaseQuery = searchQuery.toLowerCase();
            const filtered = productData.filter(product =>
                product.codigo.toLowerCase().includes(lowercaseQuery) ||
                product.detalle.toLowerCase().includes(lowercaseQuery) ||
                product.familia.toLowerCase().includes(lowercaseQuery)
            );
            setFilteredData(filtered);
        }
    }, [searchQuery, productData]);

    // Manejadores de interacción
    const handleRowClick = (product: ProductTableItem) => {
        if (!isEditing) {
            // Buscar los detalles completos del producto
            //@ts-ignore
            const currentProductInTable = productData.find(p => p.codigo === product.codigo);

            setSelectedProduct({
                ...selectedProduct,
                codigo: product.codigo,
                descripcion: product.detalle,
                familia: product.familia,
                precioVenta: product.precio,
                stock: product.stock
            });

            setHighlightedRow(product.codigo);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Convertir a número si el campo debería ser numérico
        const numericFields = ['precioCosto', 'precioVenta', 'iva', 'stock', 'stockMin', 'stockIdeal',
            'unidadPrecioLista1', 'unidadPrecioLista2', 'unidadPrecioLista3', 'cantXMayor', 'precioXMayor'];

        const processedValue = numericFields.includes(name) ?
            (value === '' ? 0 : parseFloat(value)) :
            value;

        setSelectedProduct({
            ...selectedProduct,
            [name]: processedValue
        });
    };

    const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const name = e.target.name as string;
        const value = e.target.value;

        setSelectedProduct({
            ...selectedProduct,
            [name]: value
        });
    };
    //@ts-ignore
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    // Funcionalidad para ordenar
    const handleSort = (field: string) => {
        const isAsc = sortField === field && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortField(field);

        const sortedData = [...productData].sort((a, b) => {
            // Determinar si son strings o números
            const valueA = typeof a[field as keyof ProductTableItem] === 'string'
                ? (a[field as keyof ProductTableItem] as string).toLowerCase()
                : a[field as keyof ProductTableItem];
            const valueB = typeof b[field as keyof ProductTableItem] === 'string'
                ? (b[field as keyof ProductTableItem] as string).toLowerCase()
                : b[field as keyof ProductTableItem];

            if (valueA < valueB) {
                return isAsc ? 1 : -1;
            }
            if (valueA > valueB) {
                return isAsc ? -1 : 1;
            }
            return 0;
        });

        setProductData(sortedData);
    };

    // Funcionalidad para buscar producto por código
    const handleSearchCode = () => {
        const foundProduct = productData.find(p => p.codigo === selectedProduct.codigo);

        if (foundProduct) {
            handleRowClick(foundProduct);
            setSnackbar({
                open: true,
                message: 'Producto encontrado',
                severity: 'success'
            });
        } else {
            setSnackbar({
                open: true,
                message: 'Código de producto no encontrado',
                severity: 'error'
            });
        }
    };

    // Funcionalidad de los botones principales

    // Nuevo Artículo
    const handleNewProduct = () => {
        // Generar un código único (podría generarse en el servidor en un caso real)
        const generateUniqueCode = () => {
            return Math.floor(Math.random() * 10000000000000).toString();
        };

        const newProduct: ProductDetail = {
            codigo: generateUniqueCode(),
            descripcion: '',
            familia: 'ARTICULOS',
            marca: '',
            precioCosto: 0,
            precioVenta: 0,
            iva: 21,
            proveedor: '',
            stock: 0,
            stockMin: 0,
            stockIdeal: 0,
            unidadPrecioLista1: 0,
            unidadPrecioLista2: 0,
            unidadPrecioLista3: 0,
            cantXMayor: 1,
            precioXMayor: 0,
            nota: '',
            tieneImagen: false
        };

        setSelectedProduct(newProduct);
        setIsNewProduct(true);
        setIsEditing(true);
        setHighlightedRow('');
        setActiveTab(1); // Cambiar a la pestaña de datos
    };

    // Modificar Artículo
    const handleModifyProduct = () => {
        if (highlightedRow) {
            setIsEditing(true);
            setActiveTab(1); // Cambiar a la pestaña de datos
        } else {
            setSnackbar({
                open: true,
                message: 'Seleccione un producto para modificar',
                severity: 'warning'
            });
        }
    };

    // Guardar Artículo (para Nuevo y Modificar)
    const handleSaveProduct = () => {
        setLoading(true);

        // Simulación de procesamiento
        setTimeout(() => {
            // Validación básica
            if (!selectedProduct.descripcion) {
                setSnackbar({
                    open: true,
                    message: 'La descripción del producto es obligatoria',
                    severity: 'error'
                });
                setLoading(false);
                return;
            }

            if (selectedProduct.precioVenta <= 0) {
                setSnackbar({
                    open: true,
                    message: 'El precio de venta debe ser mayor que cero',
                    severity: 'error'
                });
                setLoading(false);
                return;
            }

            // Crear el objeto para la tabla
            const productForTable: ProductTableItem = {
                codigo: selectedProduct.codigo,
                detalle: selectedProduct.descripcion,
                familia: selectedProduct.familia,
                precio: selectedProduct.precioVenta,
                stock: selectedProduct.stock
            };

            if (isNewProduct) {
                // Añadir nuevo producto
                setProductData([...productData, productForTable]);
            } else {
                // Actualizar producto existente
                setProductData(productData.map(product =>
                    product.codigo === selectedProduct.codigo ? productForTable : product
                ));
            }

            setIsEditing(false);
            setIsNewProduct(false);
            setHighlightedRow(selectedProduct.codigo);
            setActiveTab(0); // Volver a la pestaña de listado

            setSnackbar({
                open: true,
                message: `Producto ${isNewProduct ? 'creado' : 'actualizado'} correctamente`,
                severity: 'success'
            });

            setLoading(false);
        }, 800);
    };

    // Eliminar Artículo
    const handleDeleteProduct = () => {
        if (highlightedRow) {
            setOpenDeleteDialog(true);
        } else {
            setSnackbar({
                open: true,
                message: 'Seleccione un producto para eliminar',
                severity: 'warning'
            });
        }
    };

    const confirmDeleteProduct = () => {
        setLoading(true);

        // Simulación de procesamiento
        setTimeout(() => {
            // Eliminar el producto
            const updatedProducts = productData.filter(
                product => product.codigo !== selectedProduct.codigo
            );

            setProductData(updatedProducts);

            // Seleccionar el primer producto si hay alguno
            if (updatedProducts.length > 0) {
                handleRowClick(updatedProducts[0]);
            } else {
                setSelectedProduct({
                    codigo: '',
                    descripcion: '',
                    familia: 'ARTICULOS',
                    marca: '',
                    precioCosto: 0,
                    precioVenta: 0,
                    iva: 21,
                    proveedor: '',
                    stock: 0,
                    stockMin: 0,
                    stockIdeal: 0,
                    unidadPrecioLista1: 0,
                    unidadPrecioLista2: 0,
                    unidadPrecioLista3: 0,
                    cantXMayor: 1,
                    precioXMayor: 0,
                    nota: '',
                    tieneImagen: false
                });
            }

            setOpenDeleteDialog(false);

            setSnackbar({
                open: true,
                message: 'Producto eliminado correctamente',
                severity: 'success'
            });

            setLoading(false);
        }, 800);
    };

    // Imprimir la tabla
    const handlePrintTable = () => {
        if (productData.length === 0) {
            setSnackbar({
                open: true,
                message: 'No hay productos para imprimir',
                severity: 'warning'
            });
            return;
        }

        setLoading(true);

        // Simulación de procesamiento
        setTimeout(() => {
            // Crear una nueva tabla HTML para imprimir
            const printContent = document.createElement('div');

            // Añadir estilos para la impresión
            printContent.innerHTML = `
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; margin-top: 10px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          h2 { font-size: 18px; margin-bottom: 10px; }
          .fecha { font-size: 12px; margin-bottom: 20px; }
          @media print {
            body * { visibility: hidden; }
            #print-content, #print-content * { visibility: visible; }
            #print-content { position: absolute; left: 0; top: 0; width: 100%; }
          }
        </style>
        <div id="print-content">
          <h2>Listado de Artículos</h2>
          <div class="fecha">Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Detalle</th>
                <th>Familia</th>
                <th>Precio</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              ${productData.map(product => `
                <tr>
                  <td>${product.codigo}</td>
                  <td>${product.detalle}</td>
                  <td>${product.familia}</td>
                  <td class="text-right">$${product.precio.toFixed(2)}</td>
                  <td class="text-center">${product.stock}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

            document.body.appendChild(printContent);

            // Imprimir y luego eliminar el elemento temporal
            window.print();
            document.body.removeChild(printContent);

            setLoading(false);
        }, 800);
    };

    // Exportar a PDF
    const handleExportToPDF = () => {
        if (productData.length === 0) {
            setSnackbar({
                open: true,
                message: 'No hay productos para exportar',
                severity: 'warning'
            });
            return;
        }

        setLoading(true);

        // Simulación de procesamiento
        setTimeout(() => {
            // Crear un elemento temporal con los datos formateados
            const pdfContent = document.createElement('div');

            // Añadir estilos para el PDF
            pdfContent.innerHTML = `
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { font-size: 18px; text-align: center; margin-bottom: 10px; }
          table { border-collapse: collapse; width: 100%; margin-top: 10px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .fecha { font-size: 12px; text-align: center; margin-bottom: 20px; }
        </style>
        <h1>Listado de Artículos</h1>
        <div class="fecha">Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Detalle</th>
              <th>Familia</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            ${productData.map(product => `
              <tr>
                <td>${product.codigo}</td>
                <td>${product.detalle}</td>
                <td>${product.familia}</td>
                <td class="text-right">$${product.precio.toFixed(2)}</td>
                <td class="text-center">${product.stock}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

            // Convertir el HTML a un PDF y descargar
            // Usamos un enfoque que no requiere bibliotecas externas
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Listado de Artículos</title>');
                printWindow.document.write('</head><body>');
                printWindow.document.write(pdfContent.innerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();

                // Añadir un pequeño retraso para permitir que el contenido se cargue
                setTimeout(() => {
                    printWindow.print();

                    // Cerrar la ventana después de imprimir o cancelar
                    printWindow.addEventListener('afterprint', () => {
                        printWindow.close();
                    });

                    setSnackbar({
                        open: true,
                        message: 'PDF generado correctamente',
                        severity: 'success'
                    });
                }, 500);
            } else {
                setSnackbar({
                    open: true,
                    message: 'No se pudo abrir la ventana para imprimir. Compruebe su bloqueador de ventanas emergentes.',
                    severity: 'error'
                });
            }

            setLoading(false);
        }, 800);
    };

    // Exportar a Excel (CSV)
    const handleExportToExcel = () => {
        if (productData.length === 0) {
            setSnackbar({
                open: true,
                message: 'No hay productos para exportar',
                severity: 'warning'
            });
            return;
        }

        setLoading(true);

        // Simulación de procesamiento
        setTimeout(() => {
            // Crear el contenido CSV
            const headers = ['Código', 'Detalle', 'Familia', 'Precio', 'Stock'];
            let csvContent = headers.join(',') + '\n';

            // Añadir los datos
            productData.forEach(product => {
                // Escapar campos que puedan contener comas
                const detalle = `"${product.detalle.replace(/"/g, '""')}"`;
                const familia = `"${product.familia.replace(/"/g, '""')}"`;
                const precio = product.precio.toFixed(2);

                const row = [
                    product.codigo,
                    detalle,
                    familia,
                    precio,
                    product.stock
                ].join(',');

                csvContent += row + '\n';
            });

            // Crear un blob y un enlace de descarga
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            // Configurar el enlace y simular clic
            link.setAttribute('href', url);
            link.setAttribute('download', `Listado_Articulos_${new Date().toISOString().slice(0, 10)}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setSnackbar({
                open: true,
                message: 'Archivo CSV generado correctamente',
                severity: 'success'
            });

            setLoading(false);
        }, 800);
    };

    // Salir
    const handleExit = () => {
        if (isEditing) {
            setOpenExitDialog(true);
        } else {
            // Aquí podría redirigirse a otra página o cerrar el componente
            setSnackbar({
                open: true,
                message: 'Saliendo del módulo de artículos',
                severity: 'info'
            });
        }
    };

    // Manejar cierre de diálogos
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Subir imagen
    const handleUploadImage = () => {
        setOpenImageDialog(true);
    };

    // Función auxiliar para determinar si un botón debe estar deshabilitado
    const isButtonDisabled = (buttonType: string): boolean => {
        switch (buttonType) {
            case 'new':
                return isEditing;
            case 'modify':
                return isEditing || productData.length === 0;
            case 'save':
                return !isEditing;
            case 'delete':
                return isEditing || productData.length === 0;
            case 'print':
            case 'exportPDF':
            case 'exportExcel':
                return productData.length === 0;
            default:
                return false;
        }
    };

    // Formatear moneda
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
            .format(value)
            .replace('ARS', '$')
            .trim();
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <ProductHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <StatisticsSection
                productData={productData}
                formatCurrency={formatCurrency}
            />

            <TabsNavigation
                activeTab={activeTab}
                handleTabChange={handleTabChange}
            />

            {/* Contenido de las tabs */}
            <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
                <ProductTable
                    filteredData={filteredData}
                    highlightedRow={highlightedRow}
                    isEditing={isEditing}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    searchQuery={searchQuery}
                    handleSort={handleSort}
                    handleRowClick={handleRowClick}
                    handleModifyProduct={handleModifyProduct}
                    handleDeleteProduct={handleDeleteProduct}
                    handlePrintTable={handlePrintTable}
                    setOpenExportMenuDialog={setOpenExportMenuDialog}
                    setSearchQuery={setSearchQuery}
                    handleNewProduct={handleNewProduct}
                    formatCurrency={formatCurrency}
                    isButtonDisabled={isButtonDisabled}
                />
            </Box>

            {/* Pestaña de Detalles */}
            <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
                <ProductForm
                    isEditing={isEditing}
                    isNewProduct={isNewProduct}
                    selectedProduct={selectedProduct}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    handleSearchCode={handleSearchCode}
                    handleSaveProduct={handleSaveProduct}
                    handleNewProduct={handleNewProduct}
                    handleUploadImage={handleUploadImage}
                    handleExit={handleExit}
                    isButtonDisabled={isButtonDisabled}
                    setIsEditing={setIsEditing}
                    setIsNewProduct={setIsNewProduct}
                    setActiveTab={setActiveTab}
                    productData={productData}
                    handleRowClick={handleRowClick}
                    familias={familias}
                    proveedores={proveedores}
                />
            </Box>

            {/* Botones de acción flotantes (solo en modo listado) */}
            {activeTab === 0 && (
                <ActionButtons
                    isEditing={isEditing}
                    handleNewProduct={handleNewProduct}
                    isButtonDisabled={isButtonDisabled}
                />
            )}

            {/* Diálogos */}
            <DeleteDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                selectedProduct={selectedProduct}
                confirmDeleteProduct={confirmDeleteProduct}
                loading={loading}
            />

            <ExitDialog
                open={openExitDialog}
                onClose={() => setOpenExitDialog(false)}
                handleConfirm={() => {
                    setIsEditing(false);
                    setIsNewProduct(false);
                    setOpenExitDialog(false);
                    setActiveTab(0);

                    // Restaurar datos originales
                    if (!isNewProduct) {
                        const originalProduct = productData.find(p => p.codigo === selectedProduct.codigo);
                        if (originalProduct) {
                            handleRowClick(originalProduct);
                        }
                    }
                }}
            />

            <ImageDialog
                open={openImageDialog}
                onClose={() => setOpenImageDialog(false)}
            />

            <ExportDialog
                open={openExportMenuDialog}
                onClose={() => setOpenExportMenuDialog(false)}
                handlePrintTable={handlePrintTable}
                handleExportToPDF={handleExportToPDF}
                handleExportToExcel={handleExportToExcel}
            />

            {/* Snackbar para notificaciones */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Indicador de carga global */}
            {loading && <LoadingIndicator />}
        </Container>
    );
}

export default ArticulosPage;