// utils.ts
import { AxiosError } from 'axios'

export const handleAxiosError = (error: AxiosError | any): void => {
    if (error.message === "Network Error") {
        alert("Connection with the server has been lost")
    } else if (error.response) {
        console.error("API error:", error.response.data)
        alert("Something went wrong: " + (error.response.data?.message || "Unknown error"))
    } else {
        console.error("Unexpected error:", error)
        alert("Unexpected error occurred")
    }
}

const baseURL = "http://localhost:9090/"

const URLS = {
    getProducts: baseURL + "getProducts",
    getCategories: baseURL + "getCategories",
    deleteProduct: baseURL + "products/",
    putProduct: baseURL + "products/",
    postProduct: baseURL + "products",
    outStock: baseURL + "products/",
    inStock: baseURL + "products/",
    getProductsFiltered: baseURL+"getProductsFiltered"
};

export default URLS
