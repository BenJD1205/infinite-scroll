import React, { useState, useEffect} from 'react'
import Search from './Search'
import Loading from './Loading'
/*
 * Define type of Product
 */
type Product = {
    id: number
    thumbnail: string
    title: string
    price: number
    description: string
}

/*
 * InfiniteScroll component is used display product by scrolling
 */
const InfiniteScroll = () => {
    const [items, setItems] = useState<Product[]>([])
    const [search, setSearch] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<any>(null)
    const [page, setPage] = useState<number>(1)

    /*
     * handle search 
     */
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    /*
     * handle data by search
     */
    const handleDataBySearch = async () => {
        const response = await fetch(`https://dummyjson.com/products/search?q=${search}`)
        const data = await response.json()
        const { products } = data
        setItems((prevItems) => [...prevItems, ...products])
    };

    /*
     * fetch data
     */
    const fetchData = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(
                `https://dummyjson.com/product?page=${page}&limit=20`
            )
            const data = await response.json()
            const { products } = data
            setItems((prevItems) => [...prevItems, ...products])
            setPage((prevPage) => prevPage + 1)
        } catch (error: any) {
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop !==
                document.documentElement.offsetHeight ||
            isLoading
        ) {
            return
        }
        fetchData()
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isLoading])

    useEffect(() => {
        handleDataBySearch();
    },[search]) 

    return (
        <div className='infinite'>
            <Search onSearch={handleSearch} />
            <div className='container'>
                {items.map((item, idx) => (
                    <div className='content' key={idx}>
                        <img src={item.thumbnail} alt={item.title} />
                        <div className='info'>
                            <span>{item.title}</span>
                            <span>{item.description}</span>
                        </div>
                    </div>
                ))}
            </div>
            {isLoading && <p><Loading isLoading={isLoading} /></p>}
            {error && <p>Error: {error.message}</p>}
        </div>
    )
}

export default InfiniteScroll
