import React from "react";
import "../Styles/ResumeSection.css"
import { Producto } from "../types";

interface ModalsResumen {
    listaProductos: Producto[]
}

const ResumeSection: React.FC<ModalsResumen> = ({ listaProductos }) => {

    const resumenPorCategoria = listaProductos.reduce((acc, producto) => {
        const { category, quantityInStock, unitPrice } = producto;
        const cantidad = Number(quantityInStock);
        const costoTotal = cantidad * Number(unitPrice);

        const existente = acc.find(item => item.categoria === category);

        if (existente) {
            existente.cantidadTotal += cantidad;
            existente.valorTotal += costoTotal;
        } else {
            acc.push({
                categoria: category,
                cantidadTotal: cantidad,
                valorTotal: costoTotal,
            });
        }

        return acc;
    }, [] as { categoria: string; cantidadTotal: number; valorTotal: number }[]);



    const formateoMoneda = (number: Number) =>{
        if(isNaN(Number(number))){
            number = 0;
        }

        return number.toLocaleString("es-MX",{
            style:"currency",
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
                    {resumenPorCategoria.map((item, index) => (
                        <tr key={index}>
                            <td>{item.categoria}</td>
                            <td className="centered-cell">{item.cantidadTotal}</td>
                            <td className="centered-cell">{formateoMoneda(item.valorTotal)}</td>
                            <td className="centered-cell">{formateoMoneda(item.valorTotal / item.cantidadTotal)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ResumeSection