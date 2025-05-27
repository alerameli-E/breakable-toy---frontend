// Mocks y librerías
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../components/Modal';
import axios from 'axios';
import { Producto } from '../types';


jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;


const defaultProps = {
    setIsModalOpen: jest.fn(),
    setSelectedProduct: jest.fn(),
    getProducts: jest.fn(),
    getCategories: jest.fn(),
    categoriesList: ['Groceries', 'Electronics'],
    setNotification: jest.fn()
};

beforeEach(() => {
    jest.clearAllMocks();
});

test('Edit mode: calls PUT correctly', async () => {

    const selectedProduct: Producto = {
        id: 1,
        name: 'Old Product',
        category: 'Groceries',
        quantityInStock: '10',
        unitPrice: '20.5',
        expirationDate: '2025-12-31',
        creationDate: '2024-01-01',
        updateDate: '',
    };

    render(<Modal {...defaultProps} selectedProduct={selectedProduct} />);

    const nameInput = screen.getByLabelText(/product name/i);
    const saveButton = screen.getByRole('button', { name: /save/i });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Updated Product');


    mockedAxios.mockResolvedValueOnce({ status: 200 });

    fireEvent.click(saveButton);

    await waitFor(() => {
        expect(mockedAxios).toHaveBeenCalledWith(
            expect.objectContaining({
                method: 'put',
                url: 'http://localhost:9090/products/1',
                data: expect.objectContaining({
                    name: 'Updated Product',
                    category: 'Groceries',
                    quantityInStock: 10,
                    unitPrice: 20.5,
                    expirationDate: '2025-12-31',
                }),
            })
        );
    });
});

test('Create mode: calls POST correctly', async () => {

    render(<Modal {...defaultProps} selectedProduct={null} />);

    mockedAxios.mockResolvedValueOnce({ status: 200 });

    await userEvent.type(screen.getByLabelText(/product name/i), 'New Product');
    await userEvent.selectOptions(screen.getByLabelText(/category/i), 'Groceries');
    await userEvent.type(screen.getByLabelText(/stock/i), '5');
    await userEvent.type(screen.getByLabelText(/unit price/i), '15');
    await userEvent.type(screen.getByLabelText(/expiration date/i), '2026-01-01');

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
        expect(mockedAxios).toHaveBeenCalledWith(
            expect.objectContaining({
                method: 'post',
                url: 'http://localhost:9090/products',
                data: expect.objectContaining({
                    name: 'New Product',
                    category: 'Groceries',
                    quantityInStock: 5,
                    unitPrice: 15,
                    expirationDate: '2026-01-01',
                }),
            })
        );
    });
});

test('Invalid form: does NOT call axios', async () => {
    render(<Modal {...defaultProps} selectedProduct={null} />);

    // No se llena ningún campo obligatorio
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
        expect(mockedAxios).not.toHaveBeenCalled();
        expect(screen.getByText(/select a category/i)).toBeInTheDocument();
        expect(screen.getByText(/product name should be longer/i)).toBeInTheDocument();
    });
});
