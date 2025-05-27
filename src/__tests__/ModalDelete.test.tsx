import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { Producto } from '../types';
import ModalDelete from '../components/ModalDelete';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const defaultProps = {
    setDeleteProduct: jest.fn(),
    getCategories: jest.fn(),
    getProducts: jest.fn(),
    setNotification: jest.fn()
}
 
beforeEach(() => {
    jest.clearAllMocks();
});

test('Delete product', async () => {
    const deleteProduct: Producto = {
        id: 1,
        name: "Product to delete",
        category: "Electronics",
        quantityInStock: "15",
        unitPrice: "20.5",
        expirationDate: "",
        creationDate: "2024-12-31",
        updateDate: "2025-05-22"
    }

    render(<ModalDelete {...defaultProps} deleteProduct={deleteProduct} />);

    const deleteButton = screen.getByRole('button', { name: /Delete/i });

    mockedAxios.delete.mockResolvedValueOnce({ status: 200 });

    await userEvent.click(deleteButton);

    await waitFor(() => {
        expect(mockedAxios.delete).toHaveBeenCalledWith(
            'http://localhost:9090/products/1'
        );

    });
});