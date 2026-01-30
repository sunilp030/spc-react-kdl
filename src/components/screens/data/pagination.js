import React from 'react'

const Pagination = ({ nPages, currentPage, setCurrentPage }) => {

    const pageNumbers = [...Array(nPages + 1).keys()].slice(1)



    const nextPage = () => {
        if (currentPage !== nPages) setCurrentPage(currentPage + 1)
    }
    const prevPage = () => {
        if (currentPage !== 1) setCurrentPage(currentPage - 1)
    }
    return (
        <nav className='mx-auto'>
            <ul className='pagination mx-auto' style={{ width: '80%', overflow: 'auto' }}>
                <li className="page-item">
                    <a className="page-link" style={{ cursor: 'pointer' }}
                        onClick={prevPage} >
                        Previous
                    </a>
                </li>
                {pageNumbers.map(pgNumber => (
                    <li key={pgNumber} className={`page-item ${currentPage == pgNumber ? 'active' : ''} `} >
                        <a onClick={() => setCurrentPage(pgNumber)} style={{ cursor: 'pointer' }}
                            className='page-link'>
                            {pgNumber}
                        </a>
                    </li>
                ))}
                <li className="page-item">
                    <a className="page-link" style={{ cursor: 'pointer' }}
                        onClick={nextPage}>
                        Next
                    </a>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination