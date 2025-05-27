import React, { Dispatch, SetStateAction } from "react";
import "../Styles/FilterSection.css"
import { Producto } from "../types";
import { SearchValues } from "../types";
import axios from "axios";
import "../Styles/Buttons.css"
import URLS, { handleAxiosError } from "../utils";


interface FilterSectionProps {
    categoriesList: string[];
    setProductsList: Dispatch<SetStateAction<Producto[]>>
    searchValues: SearchValues,
    setSearchValues: Dispatch<SetStateAction<SearchValues>>,
    getProducts: () => void
}

const FilterSection: React.FC<FilterSectionProps> = ({
    categoriesList,
    setProductsList,
    searchValues,
    setSearchValues,
    getProducts
}) => {

    const handleSearch = () => {
        const trimmedValues = {
            ...searchValues,
            name: searchValues.name.trim()
        };

        axios.post(URLS.getProductsFiltered, trimmedValues)
            .then((response) => {
                const answer = (response.data)
                setProductsList(answer)
            })
            .catch(error => {
                handleAxiosError(error)
            })
    }


    const handleClear = () => {
        getProducts()
        setSearchValues(
            {
                name: "",
                category: "AC",
                availability: "All"
            }
        )
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
                    {categoriesList.map((categoria, index) => (
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

            <div className="filter-buttons">
                <button className="button filter-button" onClick={handleSearch}>
                    Search
                </button>
                <button className="button clear-button" onClick={handleClear}>
                    Clear filters
                </button>
            </div>

        </div>

    )
}

export default FilterSection;