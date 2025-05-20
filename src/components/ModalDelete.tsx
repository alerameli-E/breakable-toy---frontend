import React, { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { Producto } from "../types";
import "../Styles/ModalDelete.css"

interface ModalDeleteProps {
    productoEliminar: Producto;
    setProductoEliminar: Dispatch<SetStateAction<Producto | null>>;
    getCategories: () => void;
    getProducts: () => void;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({ productoEliminar, setProductoEliminar, getCategories, getProducts }) => {

    const handleDeleteItem = () => {
        axios.delete(`http://localhost:8080/products/${productoEliminar.id}`)
            .then(response => {
                if (response.status === 200) {
                    alert(`${productoEliminar.name} ha sido eliminado correctamente`)
                    setProductoEliminar(null)
                    getCategories()
                    getProducts()
                }
            })
    }

    return (
        <div className="modal-overlay">
            <div className="modal modal-delete">
                <h2 className="modal-title">Delete product </h2>
                <p className="modal-text">
                    Are you sure you want to delete the product: <strong>{productoEliminar.name}</strong>?
                </p>
                <div className="modal-buttons">
                    <button className="btn btn-delete" onClick={handleDeleteItem}>Eliminar</button>
                    <button className="btn btn-cancel" onClick={() => setProductoEliminar(null)}>Cancelar</button>
                </div>
            </div>
        </div>
    )
}

export default ModalDelete