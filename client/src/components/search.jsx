import { useState } from "react"

export default function Search(props) {
    const [barcode, setBarCode] = useState(" ")

    function handleSearch(e) {
        setBarCode(e.target.value)
        props.setSearch(barcode)
    }
    const reset = () => {
        props.reset()
    }
    return (
        <nav className="navbar navbar-light bg-light">
            <form className="form-inline" onSubmit={(e) => { e.preventDefault() }}>
                <input value={barcode} onChange={handleSearch} className="form-control mr-sm-2" type="search" placeholder={`The barcode is ${props.search}`} aria-label="Search" />
                <button className="btn btn-outline-danger " onClick={reset}>Reset</button>
            </form>
        </nav>

    )
}