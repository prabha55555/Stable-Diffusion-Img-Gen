import React, { useState, useEffect } from 'react'
import { Loader, Card, FormField } from '../components'

const RenderCard = ({data, title}) => {
    console.log("RenderCard received data:", data);
    if(data?.length > 0) {
        return data.map((post) => <Card key={post._id} {...post}/>);
    }

    return (
       <h2 className='mt-5 font-bold text-[#6449ff] text-xl uppercase'>{title}</h2>
    )
}

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [allPosts, setAllPosts] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedResults, setSearchedResults] = useState(null);
    const [searchTimeout, setSearchTimeout] = useState(null);

   
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);

            try {
                
                const response = await fetch(`${API_URL}/api/v1/post`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log("API Response status:", response.status);
                
                if(response.ok) {
                    const result = await response.json();
                    console.log("API Response data:", result);
                    setAllPosts(result.data.reverse());
                } else {
                    console.error("API Error:", response.status);
                    const errorText = await response.text();
                    console.error("Error details:", errorText);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                alert(error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchPosts();
    }, []); 

    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);

        setSearchTimeout(
            setTimeout(() => {
                const searchResults = allPosts.filter((item) => 
                    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.prompt.toLowerCase().includes(searchText.toLowerCase())
                );

                setSearchedResults(searchResults);
            }, 500)
        );
    };

    return (
        <section className='max-w-7xl mx-auto'>
            <div>
                <h1 className='font-extrabold text-black-600 text-[32px]'>The Community Showcase</h1>
                <p className="mt-3 text-gray-500 text-[16px] max-w-[500px]">Generate innovative and visually stunning images effortlessly with  powerful AI-driven creativity.</p>
            </div>

            <div className="mt-16">
                <FormField
                    labelName="Search posts"
                    type="text"
                    name="search"
                    placeholder="Search posts"
                    value={searchText}
                    handleChange={handleSearchChange}
                />
            </div>

            <div className="mt-10">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader/>
                    </div>
                ) : (
                    <>
                        {searchText && (
                            <h2 className='font-medium text-gray-500 text-xl mb-3'>
                                Showing result for <span className="text-gray-900">{searchText}</span>
                            </h2>
                        )}

                        <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                            {searchText ? (
                                <RenderCard 
                                    data={searchedResults} 
                                    title="No search results found" 
                                />
                            ) : (
                                <RenderCard 
                                    data={allPosts} 
                                    title="No posts found" 
                                />
                            )}
                        </div>
                    </> 
                )}
            </div>
        </section>
    )
}

export default Home;
