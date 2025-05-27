import React, { Dispatch, SetStateAction, useState } from "react";
import "../Styles/Modal.css"
import { Producto } from "../types";
import axios from "axios";
import URLS, { handleAxiosError } from "../utils";

interface ModalProps {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    getProducts: () => void;
    getCategories: () => void;
    categoriesList: string[]
    selectedProduct: Producto | null;
    setSelectedProduct: Dispatch<SetStateAction<Producto | null>>;
    setNotification: (msg: string) => void;
}

const Modal: React.FC<ModalProps> = ({
    setIsModalOpen,
    getProducts,
    getCategories,
    categoriesList,
    selectedProduct,
    setSelectedProduct,
    setNotification
}) => {

    const [errors, setErrors] = useState<string[]>([])
    const [newCategory, setNewCategory] = useState("")
    const [dataForm, setDataForm] = useState<Producto>({
        name: selectedProduct ? selectedProduct.name : "",
        category: selectedProduct ? selectedProduct.category : "SC",
        quantityInStock: selectedProduct ? selectedProduct.quantityInStock : "",
        unitPrice: selectedProduct ? selectedProduct.unitPrice : "",
        expirationDate: selectedProduct ? selectedProduct.expirationDate : "",
        creationDate: selectedProduct ? selectedProduct.creationDate : "",
        updateDate: ""
    })

    //Method to handles save action. Depending if it is for update or create
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

            const url = selectedProduct ?
                URLS.putProduct + selectedProduct.id :
                URLS.postProduct

            const method = selectedProduct ? "put" : "post"

            axios({ method, url, data: finalProduct })
                .then(async (response) => {
                    if (response.status === 200) {
                        setNotification(`Product ${selectedProduct ? "edited" : "created"} correctly`);
                        await getProducts();
                        await getCategories();
                        setIsModalOpen(false);
                        setSelectedProduct(null);
                    }
                })
                .catch(error => {
                    handleAxiosError(error)
                })
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedProduct(null)
    }


    //Method to validate form
    const validForm = (): boolean => {

        const foundErrors: string[] = []
        if (dataForm.category === "SC") {
            foundErrors.push("Select a category")
        }
        if (dataForm.category === "NC" && newCategory.length < 3) {
            foundErrors.push("New category should be longer")
        }
        if (dataForm.category === "NC") {
            const newCategoryLower = newCategory.trim().toLowerCase();
            const categoryExists = categoriesList.some(
                (cat) => cat.toLowerCase() === newCategoryLower
            );

            if (newCategory.length < 3) {
                foundErrors.push("New category should be longer");
            } else if (categoryExists) {
                foundErrors.push("This category already exists");
            }
        }

        if (isNaN(Number(dataForm.unitPrice)) || Number(dataForm.unitPrice) < 0.01) {
            foundErrors.push("Enter a valid number for the price")

        }
        if (isNaN(Number(dataForm.quantityInStock))) {
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

                <h2>{selectedProduct ? "Edit " : "Create "} product</h2>
                <div className="modal-row">
                    <label htmlFor="name-input">Product name</label>
                    <input id="name-input" type="text" value={dataForm.name} onChange={(event) => setDataForm(prev => ({ ...prev, name: event.target.value }))}></input>
                </div>
                <div className="modal-row">

                    <label htmlFor="category-select">Category</label>
                    <select id="category-select" value={dataForm.category} onChange={(event) => setDataForm(prev => ({ ...prev, category: event.target.value }))}>
                        <option value="SC">
                            Select category
                        </option>
                        {categoriesList.map((item, index) => (
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
                        <label htmlFor="new-category-select">
                            New category
                        </label>
                        <input id="new-category-select" type="text" value={newCategory} onChange={(event) => setNewCategory(event.target.value)}></input>
                    </div>
                }

                <div className="modal-row">
                    <label htmlFor="stock-input">Stock</label>
                    <input id="stock-input" type="text" value={dataForm.quantityInStock} onChange={(event) => setDataForm(prev => ({ ...prev, quantityInStock: event.target.value }))}></input>
                </div>
                <div className="modal-row">
                    <label htmlFor="price-input">Unit price</label>
                    <input id="price-input" type="text" value={dataForm.unitPrice} onChange={(event) => setDataForm(prev => ({ ...prev, unitPrice: event.target.value }))}></input>
                </div>
                {
                    dataForm.category === "Groceries" &&
                    <div className="modal-row">
                        <label htmlFor="expiration-input">Expiration date</label>
                        <input
                            id="expiration-input"
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