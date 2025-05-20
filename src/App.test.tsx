import React from "react";
import App from "./App";
import axios from "axios";
import { render, waitFor, screen } from "@testing-library/react";


// Simulamos axios para evitar hacer una llamada real al backend
jest.mock("axios");

test("llama al endpoint getProducts y muestra los productos en la tabla", async () => {
  // Simulamos la respuesta del endpoint getProducts
  (axios.get as jest.Mock).mockImplementation((url) => {
    if (url === "http://localhost:8080/getProducts") {
      return Promise.resolve({
        data: [
          {
            id: 1,
            name: "Producto A",
            category: "AC",
            unitPrice: "15.50",
            expirationDate: "2025-12-31",
            quantityInStock: "100",
            creationDate: "2024-01-01",
            updateDate: "2024-06-01",
          },
          {
            id: 2,
            name: "Producto B",
            category: "DC",
            unitPrice: "8.99",
            expirationDate: "2026-01-15",
            quantityInStock: "50",
            creationDate: "2024-02-15",
            updateDate: "2024-05-01",
          },
        ],
      });
    }
  
    if (url === "http://localhost:8080/getCategories") {
      return Promise.resolve({
        data: ["AC", "DC"],
      });
    }
  
    return Promise.reject(new Error("URL no reconocida"));
  });
  

  // Renderizamos la app
  render(<App />);

  // Esperamos a que los productos aparezcan en pantalla
  await waitFor(() => {
    // Aquí debes ajustar los textos según lo que renders tu TableSection
    expect(screen.getByText("Producto A")).toBeInTheDocument();
    expect(screen.getByText("Producto B")).toBeInTheDocument();
  });
});

