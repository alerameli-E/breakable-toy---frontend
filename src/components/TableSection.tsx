import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import "../Styles/TableSection.css"
import Pagination from "./Pagination";
import { Producto } from "../types";
import axios from "axios";
import "../Styles/Buttons.css"
import OrderButtton from "./OrderButton";
import URLS, { handleAxiosError } from "../utils";

interface TableSectionProps {
    productsList: Producto[];
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    setProductsList: Dispatch<SetStateAction<Producto[]>>;
    setSelectedProduct: Dispatch<SetStateAction<Producto | null>>;
    setDeleteProduct: Dispatch<SetStateAction<Producto | null>>;
    handleOpenModal: () => void;
}

const TableSection: React.FC<TableSectionProps> = ({
    productsList,
    setIsModalOpen,
    setProductsList,
    setSelectedProduct,
    setDeleteProduct,
    handleOpenModal
}) => {
    
    const [sortedInformation, setSortedInformation] = useState({
        column: "",
        order: ""
    });

    
    //Variables por pagination
    const itemPerPage = 10;
    const totalPages = Math.ceil(productsList.length / itemPerPage);

    const [currentPage, setCurrentPage] = useState(1);

    const lastItemPage = currentPage * itemPerPage;
    const firstItemPage = lastItemPage - itemPerPage;
    const currentItems = productsList.slice(firstItemPage, lastItemPage);

    //Listens if a value has changed to set the currenPage in case of over flow
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages === 0 ? 1 : totalPages);
        }
    }, [productsList, currentPage, totalPages]);

    
    //Sorts the products depending on the column given as parameter. Uses sortedInformation to store column and order
    const handleSorting = (orderCriteria: string) => {
        let newOrder: string = "";

        if (sortedInformation.column === orderCriteria) {
            newOrder = sortedInformation.order === "asc" ? "desc" : "asc";
        } else {
            newOrder = "asc";
        }

        //Create a copy which can be edited
        const copiaLista = [...productsList];

        const listaOrdenada = copiaLista.sort((a, b) => {
            const aVal = a[orderCriteria as keyof Producto];
            const bVal = b[orderCriteria as keyof Producto];

            if (typeof aVal === "number" && typeof bVal === "number") {
                return newOrder === "asc" ? aVal - bVal : bVal - aVal;
            } else {
                const aStr = String(aVal);
                const bStr = String(bVal);
                return newOrder === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
            }
        });

        setProductsList(listaOrdenada);
        setSortedInformation({
            column: orderCriteria,
            order: newOrder
        });
    };

    const handleEditButton = (item: Producto) => {
        setIsModalOpen(true);
        setSelectedProduct(item);
    };

    //Sets the color of the stock cell depending on the quantity
    const setStockColor = (item: Producto) => {
        if (Number(item.quantityInStock) >= 5 && Number(item.quantityInStock) <= 10) return "orange-cell";
        if (Number(item.quantityInStock) < 5) return "red-cell";
    };

    //Sets the color line of the product depending on expirationDate
    const setLineColor = (item: Producto) => {
        if (!item.expirationDate) return "";

        const expirationDate = new Date(item.expirationDate);
        const today = new Date();

        const diffInTime = expirationDate.getTime() - today.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

        if (diffInDays <= 7) return "red-cell";
        if (diffInDays <= 14) return "yellow-cell";
        return "green-cell";
    };


    //Handles to set the stock of a given product depending on the stock it has
    const setStockValue = (item: Producto) => {
        const url = Number(item.quantityInStock) > 0
            ? URLS.outStock + item.id + "/outofstock"
            : URLS.inStock + item.id + "/instock";

        const method = Number(item.quantityInStock) > 0 ? 'post' : 'put';

        axios({ method, url })
            .then(response => {
                if (response.status === 200) {
                    setProductsList(prev => prev.map(producto => {
                        if (producto.id === item.id) {
                            return {
                                ...producto,
                                quantityInStock: method === "post" ? "0" : "10"
                            };
                        }
                        return producto;
                    }));
                }
            })
            .catch(error => {
                handleAxiosError(error);
            });
    };

    return (
        <div className="tablesection-container">
            <h2>Products</h2>

            <button className="button add-button" onClick={handleOpenModal}>
                Add product
            </button>

            <table className="products-table">
                <thead>
                    <tr>
                        <th className="col-id">#
                            <OrderButtton criteria="id" handleSorting={handleSorting} />
                        </th>
                        <th className="col-name">Name
                            <OrderButtton criteria="name" handleSorting={handleSorting} />
                        </th>
                        <th className="col-category centered-cell">Category
                            <OrderButtton criteria="category" handleSorting={handleSorting} />
                        </th>
                        <th className="col-price centered-cell">Price
                            <OrderButtton criteria="unitPrice" handleSorting={handleSorting} />
                        </th>
                        <th className="col-expiration centered-cell">Expiration date
                            <OrderButtton criteria="expirationDate" handleSorting={handleSorting} />
                        </th>
                        <th className="col-stock centered-cell">Stock
                            <OrderButtton criteria="quantityInStock" handleSorting={handleSorting} />
                        </th>
                        <th className="col-actions centered-cell">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item, index) => (
                        <tr key={index} className={setLineColor(item)}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td className="centered-cell">{item.category}</td>
                            <td className="centered-cell">$ {item.unitPrice}</td>
                            <td className="centered-cell">{item.expirationDate}</td>
                            <td className={`${setStockColor(item)} centered-cell`}>{item.quantityInStock}</td>
                            <td className="centered-cell">
                                <button className="button edit-button" onClick={() => handleEditButton(item)}>Edit</button>
                                <button className="button delete-button" onClick={() => setDeleteProduct(item)}>Delete</button>
                                <button
                                    onClick={() => setStockValue(item)}
                                    className="button stock-button"
                                >
                                    {Number(item.quantityInStock) === 0 ? "Restock" : "Set Out of Stock"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination
                totalItems={productsList.length}
                itemsPerPage={itemPerPage}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
            />
        </div>
    );
};

export default TableSection;
