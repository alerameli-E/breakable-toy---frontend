import React, { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { Producto } from "../types";
import "../Styles/ModalDelete.css"
import URLS, { handleAxiosError } from "../utils";

interface ModalDeleteProps {
    deleteProduct: Producto;
    setDeleteProduct: Dispatch<SetStateAction<Producto | null>>;
    getCategories: () => void;
    getProducts: () => void;
    setNotification: (msg: string) => void
}

const ModalDelete: React.FC<ModalDeleteProps> = ({ deleteProduct, setDeleteProduct, getCategories, getProducts, setNotification }) => {

    const handleDeleteItem = () => {
        axios.delete(URLS.deleteProduct+"" +deleteProduct.id)
            .then(response => {
                if (response.status === 200) {
                    setNotification(`${deleteProduct.name} has been deleted correctly`)
                    setDeleteProduct(null)
                    getCategories()
                    getProducts()
                }
            })
            .catch(error => {
                handleAxiosError(error)
            })
    }

    return (
        <div className="modal-overlay">
            <div className="modal modal-delete">
                <h2 className="modal-title">Delete product </h2>
                <p className="modal-text">
                    Are you sure you want to delete the product: <strong>{deleteProduct.name}</strong>?
                </p>
                <div className="modal-buttons">
                    <button className="btn btn-delete" onClick={handleDeleteItem}>Delete</button>
                    <button className="btn btn-cancel" onClick={() => setDeleteProduct(null)}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default ModalDelete