import React, { Dispatch, SetStateAction, useState } from "react";
import "../Styles/Modal.css"
import { Producto } from "../types";
import axios from "axios";

interface ModalProps {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    getProducts: () => void;
    getCategories: () => void;
    listaCategorias: string[]
    productoSeleccionado: Producto | null;
    setProductoSeleccionado: Dispatch<SetStateAction<Producto | null>>;
}

const Modal: React.FC<ModalProps> = ({ setIsModalOpen, getProducts, getCategories, listaCategorias, productoSeleccionado, setProductoSeleccionado }) => {

    const [errors, setErrors] = useState<string[]>([])
    const [newCategory, setNewCategory] = useState("")
    const [dataForm, setDataForm] = useState<Producto>({
        name: productoSeleccionado ? productoSeleccionado.name : "",
        category: productoSeleccionado ? productoSeleccionado.category : "SC",
        quantityInStock: productoSeleccionado ? productoSeleccionado.quantityInStock : "",
        unitPrice: productoSeleccionado ? productoSeleccionado.unitPrice : "",
        expirationDate: productoSeleccionado ? productoSeleccionado.expirationDate : "",
        creationDate: productoSeleccionado ? productoSeleccionado.creationDate : "",
        updateDate: ""
    })

    const handleSubmitButton = () => {
        if (validForm()) {
            const finalProduct = {
                name: dataForm.name,
                category: dataForm.category === "NC" ? newCategory : dataForm.category,
                unitPrice: Number(dataForm.unitPrice),
                expirationDate: dataForm.category === "Groceries" ? dataForm.expirationDate : null,
                quantityInStock: Number(dataForm.quantityInStock),
                creationDate: dataForm.creationDate,
                updateDate: new Date(),
            }

            const url = productoSeleccionado ?
                `http://localhost:8080/products/${productoSeleccionado.id}` :
                "http://localhost:8080/products"

            const method = productoSeleccionado ? "put" : "post"

            axios({ method, url, data: finalProduct })
                .then(response => {
                    if (response.status === 200) {
                        alert(`Product ${productoSeleccionado ? "edited" : "created"} correctly`)
                        getProducts()
                        getCategories()
                        setIsModalOpen(false)
                        setProductoSeleccionado(null)
                    }
                })
                .catch(error => {
                    alert("Ha ocurrido un error")
                })
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setProductoSeleccionado(null)
    }

    const validForm = (): boolean => {

        const foundErrors: string[] = []
        if (dataForm.category === "SC") {
            foundErrors.push("Select a category")
        }
        if (dataForm.category === "NC" && newCategory.length < 3) {
            foundErrors.push("New category should be longer")
        }
        if (dataForm.name.trim().length < 3) {
            foundErrors.push("Product name should be longer but shorter than 120")

        }
        if (isNaN(Number(dataForm.unitPrice)) || Number(dataForm.unitPrice) < 0.01) {
            foundErrors.push("Enter a valid number for the price")

        }
        if (isNaN(Number(dataForm.quantityInStock)) || Number(dataForm.quantityInStock) < 1) {
            foundErrors.push("Enter a valid number for stock")

        }
        if (dataForm.category === "Groceries" && (!dataForm.expirationDate || isNaN(Date.parse(dataForm.expirationDate)))) {
            foundErrors.push("Enter a valid expiration date")

        }

        setErrors(foundErrors)
        if (foundErrors.length > 0) {
            return false
        } else {
            return true
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">

                <h2>{productoSeleccionado ? "Edit " : "Create "} product</h2>
                <div className="modal-row">
                    <label>Name</label>
                    <input type="text" value={dataForm.name} onChange={(event) => setDataForm(prev => ({ ...prev, name: event.target.value }))}></input>
                </div>
                <div className="modal-row">

                    <label>Category</label>
                    <select value={dataForm.category} onChange={(event) => setDataForm(prev => ({ ...prev, category: event.target.value }))}>
                        <option value="SC">
                            Select category
                        </option>
                        {listaCategorias.map((item, index) => (
                            <option value={item} key={index}>
                                {item}
                            </option>
                        ))}
                        <option value="NC">
                            New category
                        </option>
                    </select>

                </div>
                {
                    dataForm.category === "NC" &&
                    <div className="modal-row">
                        <label>
                            New category
                        </label>
                        <input type="text" value={newCategory} onChange={(event) => setNewCategory(event.target.value)}></input>
                    </div>
                }

                <div className="modal-row">
                    <label>Stock</label>
                    <input type="text" value={dataForm.quantityInStock} onChange={(event) => setDataForm(prev => ({ ...prev, quantityInStock: event.target.value }))}></input>
                </div>
                <div className="modal-row">
                    <label>Unit price</label>
                    <input type="text" value={dataForm.unitPrice} onChange={(event) => setDataForm(prev => ({ ...prev, unitPrice: event.target.value }))}></input>
                </div>
                {
                    dataForm.category === "Groceries" &&
                    <div className="modal-row">
                        <label>Expiration date</label>
                        <input
                            type="date"
                            value={dataForm.expirationDate ?? ""}
                            onChange={(event) =>
                                setDataForm(prev => ({
                                    ...prev,
                                    expirationDate: event.target.value
                                }))
                            }
                        />

                    </div>
                }

                <div className=" modal-buttons-row">
                    <button className="modal-button modal-save-button" onClick={() => handleSubmitButton()}>
                        Save
                    </button>
                    <button onClick={handleCloseModal} className="modal-button modal-close-button">
                        Close
                    </button>
                </div>
                {errors.length > 0 && (
                    <div className="modal-error">
                        <ul>
                            {errors.map((err, index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Modal