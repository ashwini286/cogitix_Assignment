import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Episode {
    id: number;
    name: string;
    characters: string[];
}

interface Character {
    id: number;
    name: string;
    image: string;
}

const Episode1: React.FC = () => {
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(null);
    const [characterCount, setCharacterCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(8); // Number of characters to show per page

  
    useEffect(() => {
        axios.get('https://rickandmortyapi.com/api/episode')
            .then(response => {
                const fetchedEpisodes = response.data.results;
                setEpisodes(fetchedEpisodes);
            })
            .catch(error => console.error('Error fetching episodes:', error));
    }, []);

 
    const handleEpisodeClick = (episodeId: number) => {
        setSelectedEpisodeId(episodeId);
        const selectedEpisode = episodes.find(ep => ep.id === episodeId);

        if (selectedEpisode) {
            const characterIds = selectedEpisode.characters.map(url => url.split('/').pop()).join(',');
            axios.get(`https://rickandmortyapi.com/api/character/${characterIds}`)
                .then(response => {
                    const fetchedCharacters = Array.isArray(response.data) ? response.data : [response.data];
                    setCharacters(fetchedCharacters);
                    setCharacterCount(fetchedCharacters.length);
                    setCurrentPage(1); // Reset to first page
                })
                .catch(error => console.error('Error fetching characters for episode:', error));
        } else {
            setCharacterCount(0);
        }
    };

  
    const indexOfLastCharacter = currentPage * itemsPerPage;
    const indexOfFirstCharacter = indexOfLastCharacter - itemsPerPage;
    const currentCharacters = characters.slice(indexOfFirstCharacter, indexOfLastCharacter);

    
    const totalPages = Math.ceil(characterCount / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const selectedEpisode = episodes.find(ep => ep.id === selectedEpisodeId); // Get the selected episode

    return (
        <div className="flex md:flex-row flex-col   {/* Sidebar for episodes */}justify-center items-center">
          
            <div className="md:w-1/4 p-4 bg-gray-100 md:h-[600px] h-[300px] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">Episodes</h2>
                <hr className="my-4 border-t border-gray-300" />
                <ul className="space-y-2">
                    {episodes.map(episode => (
                        <li
                            key={episode.id}
                            onClick={() => handleEpisodeClick(episode.id)}
                            className={`p-2 cursor-pointer rounded-md hover:bg-gray-300 
                          ${selectedEpisodeId === episode.id ? 'bg-blue-500 text-white' : 'bg-white'}`}
                        >
                            {episode.name}
                        </li>
                    ))}
                </ul>
            </div>

         
            <div className="flex-1 p-4 h-[600px] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-center">Rick and Morty Characters</h2>
                <hr className="my-4 border-t border-gray-300" />

                <p className="mb-4">
                    {selectedEpisode
                    
                        ?      <p className="mb-4">{characterCount} characters in Episode - <span className='font-bold '> {selectedEpisode.name} </span> </p>
                        : <p className='font-bold text-center'> Please select an episode to see its characters </p>
                    }
                </p>

                <div>
                    <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
                        {currentCharacters.map(character => (
                            <div key={character.id} className="border rounded-md overflow-hidden shadow-md hover:bg-gray-300">
                                <img src={character.image} alt={character.name} className="w-full h-48 object-cover" />
                                <p className="p-2 text-center">{character.name}</p>
                            </div>
                        ))}
                    </div>


                
                    {selectedEpisodeId ? (
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    ) : null}

                </div>
            </div>
        </div>
    );
};

export default Episode1;
