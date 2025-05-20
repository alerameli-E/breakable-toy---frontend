import React, { Dispatch, SetStateAction, useState } from "react";
import "../Styles/TableSection.css"
import Pagination from "./Pagination";
import { Producto } from "../types";
import axios from "axios";
import "../Styles/Buttons.css"
import OrderButtton from "./OrderButton";

interface TableSectionProps {
    listaProductos: Producto[];
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    setListaProductos: Dispatch<SetStateAction<Producto[]>>;
    setProductoSeleccionado: Dispatch<SetStateAction<Producto | null>>;
    setProductoEliminar: Dispatch<SetStateAction<Producto | null>>;
    getProducts: () => void
    handleOpenModal: () => void
}

const TableSection: React.FC<TableSectionProps> = ({ listaProductos, setIsModalOpen, setListaProductos, setProductoSeleccionado, setProductoEliminar, getProducts, handleOpenModal }) => {

    const [sortedInformation, setSortedInformation] = useState({
        column: "",
        order: ""
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 10

    const lastItemPage = currentPage * itemPerPage
    const firstItemPage = lastItemPage - itemPerPage

    const currentItems = listaProductos.slice(firstItemPage, lastItemPage)

    const handleSorting = (orderCriteria: string) => {
        let newOrder: string = "";

        if (sortedInformation.column === orderCriteria) {
            if (sortedInformation.order === "asc") {
                newOrder = "desc";
            } else {
                newOrder = "asc";
            }
        } else {
            newOrder = "asc";
        }
        const copiaLista = listaProductos;

        const listaOrdenada = copiaLista.sort((a, b) => {
            const aVal = a[orderCriteria as keyof Producto];
            const bVal = b[orderCriteria as keyof Producto];

            if (typeof aVal === "number" && typeof bVal === "number") {
                if (newOrder === "asc") {
                    return aVal - bVal;
                } else {
                    return bVal - aVal;
                }
            } else {
                const aStr = String(aVal);
                const bStr = String(bVal);

                if (newOrder === "asc") {
                    return aStr.localeCompare(bStr);
                } else {
                    return bStr.localeCompare(aStr);
                }
            }

        });

        setListaProductos(listaOrdenada);
        setSortedInformation({
            column: orderCriteria,
            order: newOrder
        });
    };

    const handleEditButton = (item: Producto) => {
        setIsModalOpen(true)
        setProductoSeleccionado(item)
    }

    const setStockColor = (item: Producto) => {
        if (Number(item.quantityInStock) >= 5 && Number(item.quantityInStock) <= 10) return "orange-cell"
        if (Number(item.quantityInStock) < 5) return "red-cell"
    }

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

    const setStockValue = (item: Producto) => {
        const url = Number(item.quantityInStock) > 0
            ? `http://localhost:8080/products/${item.id}/outofstock`
            : `http://localhost:8080/products/${item.id}/instock`;

        const method = Number(item.quantityInStock) > 0 ? 'post' : 'put';

        axios({ method, url })
            .then(response => {
                if (response.status === 200) {
                    setListaProductos(prev => prev.map(producto => {
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
                console.error("Error actualizando stock:", error);
            });
    };


    return (
        <div className="tablesection-container">
            <h2>Products</h2>

            <button className="button add-button"
                onClick={handleOpenModal}>
                Add product</button>
            <table className="products-table">
                <thead>
                    <tr>
                        <th>#
                            <OrderButtton criteria="id" handleSorting={handleSorting} />
                        </th>
                        <th >Name
                            <OrderButtton criteria="name" handleSorting={handleSorting} />
                        </th>
                        <th className="centered-cell">Category
                            <OrderButtton criteria="category" handleSorting={handleSorting} />
                        </th>
                        <th className="centered-cell">Price
                            <OrderButtton criteria="unitPrice" handleSorting={handleSorting} />
                        </th>
                        <th className="centered-cell">Expiration date
                            <OrderButtton criteria="expirationDate" handleSorting={handleSorting} />
                        </th>
                        <th className="centered-cell">Stock
                            <OrderButtton criteria="quantityInStock" handleSorting={handleSorting} />
                        </th>
                        <th className="centered-cell">Actions</th>
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
                                <button className="button  edit-button" onClick={() => handleEditButton(item)}>Edit</button>
                                <button className="button delete-button" onClick={() => setProductoEliminar(item)}>Delete</button>
                                <button
                                    onClick={() => setStockValue(item)}
                                    className="button stock-button"
                                >{Number(item.quantityInStock) === 0 ? "Restock" : "Set Out of Stock"} </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination totalItems={listaProductos.length} itemsPerPage={itemPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />
        </div>
    )
}

export default TableSection;