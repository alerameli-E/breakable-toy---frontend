import React, { useEffect, useState } from 'react';
import './App.css';
import FilterSection from './components/FilterSection';
import TableSection from './components/TableSection';
import Modal from './components/Modal';
import axios from 'axios';
import ResumeSection from './components/ResumeSection';
import { Producto } from './types';
import { SearchValues } from './types';
import ModalDelete from './components/ModalDelete';

function App() {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [listaProductos, setListaProductos] = useState<Producto[]>([])
  const [listaCategorias, setListaCategorias] = useState([])
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [productoEliminar, setProductoEliminar] = useState<Producto | null>(null);


  const [searchValues, setSearchValues] = useState<SearchValues>({
    name: "",
    category: "AC",
    availability: "All"
  })

  const getProducts = () => {
    axios.get("http://localhost:8080/getProducts")
      .then(response => {
        setListaProductos(response.data);
      })
      .catch(error => {
        console.error("Error al obtener productos:", error);
      });
  }

  const getCategories = () => {
    axios.get("http://localhost:8080/getCategories")
      .then(response => {
        setListaCategorias(response.data);
      }).catch(error => {
        console.log("Error al cargar las categorias: ", error)
      })
  }

  useEffect(() => {
    getProducts()
    getCategories()
  }, []);


  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  return (
    <div className='main-container'>
      {listaCategorias.length > 0 &&
        <FilterSection
          listaCategorias={listaCategorias}
          setListaProductos={setListaProductos}
          setSearchValues={setSearchValues}
          searchValues={searchValues}
        />}
      {isModalOpen &&
        <Modal
          getProducts={getProducts}
          getCategories={getCategories}
          setIsModalOpen={setIsModalOpen}
          listaCategorias={listaCategorias}
          productoSeleccionado={productoSeleccionado}
          setProductoSeleccionado={setProductoSeleccionado}
        />}
      {productoEliminar &&
        <ModalDelete
          productoEliminar={productoEliminar}
          setProductoEliminar={setProductoEliminar}
          getProducts= {getProducts}
          getCategories={getCategories}
        />}
     
      <TableSection
        listaProductos={listaProductos}
        setIsModalOpen={setIsModalOpen}
        setListaProductos={setListaProductos}
        setProductoSeleccionado={setProductoSeleccionado}
        setProductoEliminar={setProductoEliminar}
        getProducts = {getProducts}
        handleOpenModal={handleOpenModal}
      />
      <ResumeSection 
        listaProductos={listaProductos}
      />
    </div>
  );
}

export default App;
