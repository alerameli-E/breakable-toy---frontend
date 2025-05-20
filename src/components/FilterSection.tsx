import React, { Dispatch, SetStateAction } from "react";
import "../Styles/FilterSection.css"
import { Producto } from "../types";
import { SearchValues } from "../types";
import axios from "axios";
import "../Styles/Buttons.css"


interface FilterSectionProps {
    listaCategorias: string[];
    setListaProductos: Dispatch<SetStateAction<Producto[]>>
    searchValues: SearchValues,
    setSearchValues: Dispatch<SetStateAction<SearchValues>>
}

const FilterSection: React.FC<FilterSectionProps> = ({
    listaCategorias,
    setListaProductos,
    searchValues,
    setSearchValues,
}) => {

    const handleSearch = () => {
        axios.post("http://localhost:8080/getProductsFiltered", searchValues)
            .then(response => {
                console.log(response.data)
                setListaProductos(response.data)
            })
            .catch(error => {
                console.log("Error al buscar los datos: ", error)
            })
    }

    return (
        <div className="filtersection-container">
            <h2>Search product</h2>
            <div className="filter-row">
                <label htmlFor="name">Name</label>
                <input id="name" type="text" value={searchValues.name} onChange={(event) => setSearchValues(prev => ({ ...prev, name: event.target.value }))} />
            </div>

            <div className="filter-row">
                <label htmlFor="category">Category</label>
                <select value={searchValues.category} onChange={(event) => setSearchValues(prev => ({ ...prev, category: event.target.value }))} >
                    <option value="AC">Any category</option>
                    {listaCategorias.map((categoria, index) => (
                        <option key={index} value={categoria}>{categoria}</option>
                    ))}
                </select>

            </div>

            <div className="filter-row">
                <label htmlFor="availability">Availability</label>
                <select value={searchValues.availability} onChange={(event) => setSearchValues(prev => ({ ...prev, availability: event.target.value }))} >
                    <option value="All">
                        All
                    </option>
                    <option value="in">
                        In stock
                    </option>
                    <option value="out">
                        Out of stock
                    </option>

                </select>
            </div>

            <button className="button filter-button" onClick={() => handleSearch()}>
                Search</button>
        </div>

    )
}

export default FilterSection;