import React from "react";

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    setCurrentPage: (page: number) => void;
    currentPage: number;
}


const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, setCurrentPage, currentPage }) => {
    const pages: number[] = [];

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="nav-bar">
            {pages.map((page) => (
                <button 
                key={page} 
                onClick={() => setCurrentPage(page)} 
                className={`nav-button ${currentPage === page ? 'active' : 'inactive'}`} >{page}</button>
            ))}
        </div>
    );
};



export default Pagination