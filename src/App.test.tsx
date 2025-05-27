import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';
import { Producto } from './types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
window.alert = jest.fn();


describe('App - getProducts only', () => {
  test('calls getProducts and renders products', async () => {
    const mockProducts: Producto[] = [
      {
        id: 1,
        name: "Producto A",
        category: "AC",
        unitPrice: "15.50",
        expirationDate: "2025-12-31",
        quantityInStock: "100",
        creationDate: "2024-01-01",
        updateDate: "2024-06-01"
      }
    ];

    // Solo simulamos getProducts. getCategories da una lista vacía.
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes("getProducts")) {
        return Promise.resolve({ data: mockProducts });
      } else if (url.includes("getCategories")) {
        return Promise.resolve({ data: [] }); // simulamos vacío
      }
      return Promise.reject(new Error("URL no manejada"));
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText("Cargando...")).not.toBeInTheDocument();
    });

    // Asegúrate de que el producto se renderiza por su nombre
    expect(screen.getByText("Producto A")).toBeInTheDocument();
  });

  test('shows error screen if getProducts fails', async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes("getProducts")) {
        return Promise.reject(new Error("fallo en productos"));
      } else if (url.includes("getCategories")) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error("URL no manejada"));
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
