import React, { useEffect, useState} from 'react';
import Card from './Card';
import axios from 'axios';



const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

function Deck() {
    const [deck, setDeck] = useState(null);
    const [picked, setPicked] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);

    useEffect(function deckFromAPI() {
        async function fetchData() {
            const res = await axios.get(`${API_BASE_URL}/new/shuffle/`);
            setDeck(res.data);
        }
        fetchData();
    }, []);

    // DRAW CARD
    async function draw() {
        try {
            const drawResp = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/`);
            if(drawResp.data.remaining === 0) throw new Error('No more cards!');
            const card = drawResp.data.cards[0];

            setPicked(res => [
                ...res,
                {
                    id:card.code,
                    name: card.suit + ' ' + card.value,
                    image: card.image,
                },
            ]);
        } catch(err) {
            alert(err);
        }
    }

    // Shuffle:
    async function startShuffling() {
        setIsShuffling(true);
        try {
            await axios.get(`${API_BASE_URL}/${deck.deck_id}/shuffle/`);
            setPicked([]);
        } catch (err) {
            alert(err);
        } finally {
            setIsShuffling(false);
        }
    }


    // draw button 
    function drawBtn() {
        if (!deck) return null;
        return (
            <button className="Deck-gimme" onClick={draw} disabled={isShuffling}>DRAW</button>      
        )
    }

    // shuffle button
    function shuffleBtn() {
        if (!deck) return null;
        return (
            <button className="Deck-gimme" onClick={startShuffling} disabled={isShuffling}>New Deck</button>      
        )
    }


    return (
        <main className ='Deck'>
            {drawBtn()}
            {shuffleBtn()}
            <div>{
                picked.map(c => (
                <Card key={c.id} name={c.name} image={c.image} />  
                ))} 
            </div>
        </main>    
    )
}

export default Deck;