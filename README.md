# Breakable Toy 1: Manage Inventory System

A web application built with React and TypeScript to manage a product inventory. It allows users to filter, sort, add, edit, and delete products through a clean and interactive interface.

---

## Key Features

- **Advanced product filtering** by:
  - Name
  - Category
  - Stock availability  
  - Filters can be combined (one, two, or all three).

- **Interactive product table**:
  - Click column headers to sort (ascending or descending).
  - **Row colors** change based on the product’s **expiration date**.
  - **Stock cell color** changes depending on quantity available.

- **Product actions**:
  - **Edit**: Opens a modal to update product details.
  - **Delete**: Opens a confirmation modal before deletion.
  - **Set Stock**:
    - If stock is 0, the button shows "Restock" and sets stock to 10.
    - If stock is greater than 0, the button shows "Set out of stock" and sets stock to 0.

- **Add product**:
  - Opens a modal with a form.
  - If "Groceries" is selected as the category, an **expiration date** field is required.
  - If "New Category" is selected, a text input appears to enter the new category name.

- **Summary section**: A bottom table displays general information about selected products.

---

## Technologies Used

- **React 19** – JavaScript library for building user interfaces.
- **TypeScript** – Typed superset of JavaScript.
- **Axios** – HTTP client for API requests.
- **Lucide React** – Icon library using SVGs.
- **React Scripts** – Configuration and scripts from Create React App.

---

## Installation & Usage

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/breakable-toy-inventory.git
   cd breakable-toy-inventory
   

2. Install depencencies:
  ```bash
    npm install
  ```

This installs all required dependencies, including:

- react, react-dom, react-scripts

- typescript, @types/react, @types/node

- axios, lucide-react, and others

---

3. Backend Requirement

This frontend app requires a backend server to fetch and manage product data.
You can find it here:
Backend GitHub Repository -> https://github.com/alerameli-E/breakable-toy---backend

Make sure the backend server is running before launching the frontend.

Start the app:

```bash

npm start
```
---

Author
Developed by Alerameli E.
