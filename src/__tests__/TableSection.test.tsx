import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import TableSection from '../components/TableSection';
import { Producto } from '../types';

jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;


const baseProps = {
    setIsModalOpen: jest.fn(),
    setProductsList: jest.fn(),
    setSelectedProduct: jest.fn(),
    setDeleteProduct: jest.fn(),
    getProducts: jest.fn(),
    handleOpenModal: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
});

test('Set product as out of stock when stock is > 0', async () => {
    const productWithStock: Producto = {
        id: 1,
        name: 'Laptop',
        category: 'Electronics',
        quantityInStock: '10',
        unitPrice: '999.99',
        expirationDate: '',
        creationDate: '',
        updateDate: ''
    };

    render(
        <TableSection
            {...baseProps}
            productsList={[productWithStock]}
        />
    );

    const button = screen.getByRole('button', { name: /Set Out of Stock/i });

    mockedAxios.mockResolvedValueOnce({ status: 200 });

    await userEvent.click(button);

    await waitFor(() => {
        expect(mockedAxios).toHaveBeenCalledWith({
            method: 'post',
            url: `http://localhost:9090/products/${productWithStock.id}/outofstock`
        });
    });
});

test('Set product as in stock when stock is 0', async () => {
    const productOutOfStock: Producto = {
        id: 2,
        name: 'Monitor',
        category: 'Electronics',
        quantityInStock: '0',
        unitPrice: '199.99',
        expirationDate: '',
        creationDate: '',
        updateDate: ''
    };

    render(
        <TableSection
            {...baseProps}
            productsList={[productOutOfStock]}
        />
    );

    const button = screen.getByRole('button', { name: /Restock/i });

    mockedAxios.mockResolvedValueOnce({ status: 200 });

    await userEvent.click(button);

    await waitFor(() => {

        expect(mockedAxios).toHaveBeenCalledWith({
            method: 'put',
            url: `http://localhost:9090/products/${productOutOfStock.id}/instock`
        });
    });
});
