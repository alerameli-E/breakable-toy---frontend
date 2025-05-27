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
import ErrorPage from './components/ErrorPage';
import  URLS  from './utils';

function App() {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productsList, setProductsList] = useState<Producto[]>([])
  const [categoriesList, setCategoriesList] = useState([])
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Producto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(false)
  const [notification, setNotification] = useState<string | null>(null);



  const [searchValues, setSearchValues] = useState<SearchValues>({
    name: "",
    category: "AC",
    availability: "All"
  })

  const getProducts = async (): Promise<void> => {
    return axios.get(URLS.getProducts)
      .then(response => {
        setProductsList(response.data);
      })
      .catch(() => {
        setErrorLoading(true);
      });
  };

  const getCategories = async(): Promise<void> => {
    return axios.get(URLS.getCategories)
      .then(response => {
        setCategoriesList(response.data);
      })
      .catch(() => {
        setErrorLoading(true);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getProducts(), getCategories()])
      .finally(() => {
        setIsLoading(false);
      });
  }, []);


  //useEffect to clean notification
  useEffect(() => {
    const visibleTime: number = 3000;
    if (notification) {
      const timeout = setTimeout(() => {
        setNotification(null);
      }, visibleTime);

      return () => clearTimeout(timeout);
    }
  }, [notification]);


  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  return (
    <div className='main-container'>
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      {isLoading ? (
        <div>Cargando...</div>
      ) : errorLoading ? (
        <ErrorPage />
      ) : (
        <>
          {categoriesList.length > 0 &&
            <FilterSection
              categoriesList={categoriesList}
              setProductsList={setProductsList}
              setSearchValues={setSearchValues}
              searchValues={searchValues}
              getProducts={getProducts}
            />}
          {isModalOpen &&
            <Modal
              getProducts={getProducts}
              getCategories={getCategories}
              setIsModalOpen={setIsModalOpen}
              categoriesList={categoriesList}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              setNotification={setNotification}
            />}
          {deleteProduct &&
            <ModalDelete
              deleteProduct={deleteProduct}
              setDeleteProduct={setDeleteProduct}
              getProducts={getProducts}
              getCategories={getCategories}
              setNotification={setNotification}
            />}

          <TableSection
            productsList={productsList}
            setIsModalOpen={setIsModalOpen}
            setProductsList={setProductsList}
            setSelectedProduct={setSelectedProduct}
            setDeleteProduct={setDeleteProduct}
            handleOpenModal={handleOpenModal}
          />
          <ResumeSection
            productsList={productsList}
          />
        </>
      )}
    </div>
  );

}

export default App;
