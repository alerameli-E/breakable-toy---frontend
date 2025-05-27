import React from "react";
import "../Styles/ResumeSection.css"
import { Producto } from "../types";

interface ModalsResumen {
    productsList: Producto[]
}

const ResumeSection: React.FC<ModalsResumen> = ({ productsList }) => {

    //This const creates an object that has the resume of the procucts by the function reduce
    const resumeByCategory = productsList.reduce((acc, producto) => {
        const { category, quantityInStock, unitPrice } = producto;
        const quantity = Number(quantityInStock);
        const totalCost = quantity * Number(unitPrice);

        const existingProduct = acc.find(item => item.category === category);

        if (existingProduct) {
            existingProduct.totalQuantity += quantity;
            existingProduct.totalValue += totalCost;
        } else {
            acc.push({
                category: category,
                totalQuantity: quantity,
                totalValue: totalCost,
            });
        }

        return acc;
    }, [] as { category: string; totalQuantity: number; totalValue: number }[]);

    const generalResume = productsList.reduce(
        (acc, producto) => {
            const quantity = Number(producto.quantityInStock);
            const precio = Number(producto.unitPrice);
            const totalCost = quantity * precio;

            acc.quantityInStock += quantity;
            acc.totalValue += totalCost;
            return acc;
        },
        { quantityInStock: 0, totalValue: 0 }
    );

    const formatCurrency = (number: Number) => {
        if (isNaN(Number(number))) {
            number = 0;
        }

        return number.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN"
        })
    }

    return (
        <div className="resumeSection-container">
            <h2>Products overview</h2>

            <table className="resume-table">
                <thead>
                    <tr>
                        <th >Category</th>
                        <th className="centered-cell">Total product in stock</th>
                        <th className="centered-cell">Total value in stock</th>
                        <th className="centered-cell">Averge price in stock</th>
                    </tr>
                </thead>
                <tbody>
                    {resumeByCategory.map((item, index) => (
                        <tr key={index}>
                            <td>{item.category}</td>
                            <td className="centered-cell">{item.totalQuantity}</td>
                            <td className="centered-cell">{formatCurrency(item.totalValue)}</td>
                            <td className="centered-cell">{formatCurrency(item.totalValue / item.totalQuantity)}</td>
                        </tr>

                    ))}
                    <tr>
                        <td>General info</td>
                        <td className="centered-cell">{generalResume.quantityInStock}</td>
                        <td className="centered-cell">{formatCurrency(generalResume.totalValue)}</td>
                        <td className="centered-cell">
                            {formatCurrency(generalResume.totalValue / generalResume.quantityInStock || 0)}
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
    )
}

export default ResumeSection