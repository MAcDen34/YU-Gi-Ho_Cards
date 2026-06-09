// Pharaoh Atem's Legendary Cards - Using correct API format
// The API returns data in data.data array

async function fetchPharaohCards() {
    try {
        const container = document.getElementById('card-container');
        container.innerHTML = '<div class="loading">⚔️ THE PHARAOH AWAKENS... DRAWING LEGENDARY CARDS ⚔️</div>';
        
        // List of legendary card names to fetch
        const cardNames = [
            'Dark Magician',
            'Dark Magician Girl',
            'Slifer the Sky Dragon',
            'Obelisk the Tormentor',
            'The Winged Dragon of Ra',
            'Exodia the Forbidden One',
            'Left Arm of the Forbidden One',
            'Right Arm of the Forbidden One',
            'Left Leg of the Forbidden One',
            'Right Leg of the Forbidden One',
            'Black Luster Soldier',
            'Buster Blader',
            'Summoned Skull',
            'Gaia the Fierce Knight',
            'Kuriboh',
            'Monster Reborn',
            'Pot of Greed',
            'Polymerization',
            'Swords of Revealing Light',
            'Mirror Force',
            'Magic Cylinder',
            'Red-Eyes Black Dragon',
            'Time Wizard',
            'Dark Magic Attack',
            'Thousand Knives'
        ];
        
        const fetchedCards = [];
        
        // Fetch each card by name
        for (let i = 0; i < cardNames.length; i++) {
            const cardName = cardNames[i];
            try {
                const encodedName = encodeURIComponent(cardName);
                const response = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?name=' + encodedName);
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.data && data.data.length > 0) {
                        const card = data.data[0];
                        fetchedCards.push(card);
                        console.log('✓ Found:', card.name);
                    } else {
                        console.log('✗ Not found:', cardName);
                    }
                } else {
                    console.log('✗ Failed:', cardName);
                }
                
                // Small delay to be nice to the API
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (err) {
                console.error('Error fetching:', cardName, err);
            }
        }
        
        console.log('Total cards fetched:', fetchedCards.length);
        
        if (fetchedCards.length === 0) {
            container.innerHTML = '<div class="loading" style="color:#ff4444;">💀 NO CARDS FOUND 💀</div>';
            return;
        }
        
        // Clear loading message
        container.innerHTML = '';
        
        // Counter for gods
        let godCount = 0;
        
        // Create and display each card
        for (let i = 0; i < fetchedCards.length; i++) {
            const card = fetchedCards[i];
            
            // Create card element
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            
            // Check if Egyptian God
            const isGod = (card.name === 'Slifer the Sky Dragon' || 
                          card.name === 'Obelisk the Tormentor' || 
                          card.name === 'The Winged Dragon of Ra');
            
            if (isGod) {
                godCount++;
                cardDiv.setAttribute('data-rare', 'god');
            }
            
            // Get image URL - use the small version for faster loading
            let imageUrl = 'https://via.placeholder.com/200x280?text=Card+Image';
            if (card.card_images && card.card_images[0]) {
                imageUrl = card.card_images[0].image_url_small;
            }
            
            // Get card type and race
            const cardType = card.type || 'Unknown';
            const cardRace = card.race || '';
            
            // Format stats
            let levelHtml = '';
            if (card.level) {
                levelHtml = '<span>⭐ ' + card.level + '</span>';
            }
            
            let rankHtml = '';
            if (card.rank) {
                rankHtml = '<span>⭐⭐ ' + card.rank + '</span>';
            }
            
            let atkHtml = '';
            if (card.atk !== undefined && card.atk !== null) {
                atkHtml = '<span>⚔️ ' + card.atk.toLocaleString() + '</span>';
            }
            
            let defHtml = '';
            if (card.def !== undefined && card.def !== null) {
                defHtml = '<span>🛡️ ' + card.def.toLocaleString() + '</span>';
            }
            
            // Create badges
            let iconicBadge = '';
            if (card.name === 'Dark Magician' || card.name === 'Dark Magician Girl' || 
                card.name === 'Exodia the Forbidden One') {
                iconicBadge = '<div class="iconic-badge">⭐ LEGENDARY ⭐</div>';
            }
            
            let godBadge = '';
            if (isGod) {
                godBadge = '<div class="god-badge">⚡ EGYPTIAN GOD ⚡</div>';
            }
            
            // Truncate long names
            let displayName = card.name;
            if (displayName.length > 22) {
                displayName = displayName.substring(0, 19) + '...';
            }
            
            // Build the card HTML
            cardDiv.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${imageUrl}" alt="${card.name}" onerror="this.src='https://via.placeholder.com/200x280?text=Card+Image'">
                </div>
                ${iconicBadge}
                ${godBadge}
                <h2>${displayName}</h2>
                <div class="type">${cardType}</div>
                ${cardRace ? '<div class="type">' + cardRace + '</div>' : ''}
                <div class="card-stats">
                    ${levelHtml}
                    ${rankHtml}
                    ${atkHtml}
                    ${defHtml}
                </div>
                <button class="view-details" data-card-id="${card.id}">⚔️ VIEW DETAILS ⚔️</button>
            `;
            
            container.appendChild(cardDiv);
        }
        
        // Add event listeners to all buttons
        const buttons = document.querySelectorAll('.view-details');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function(e) {
                e.stopPropagation();
                const cardId = this.getAttribute('data-card-id');
                window.location.href = 'details.html?id=' + cardId;
            });
        }
        
        // Add counter at the top
        const counter = document.createElement('div');
        counter.className = 'card-counter';
        counter.innerHTML = '📜 PHARAOH\'S LEGACY: ' + fetchedCards.length + ' LEGENDARY CARDS | ⚡ ' + godCount + ' EGYPTIAN GODS ⚡';
        container.parentNode.insertBefore(counter, container);
        
    } catch (error) {
        console.error('Error:', error);
        const container = document.getElementById('card-container');
        container.innerHTML = '<div class="loading" style="color:#ff4444;">💀 ERROR: ' + error.message + ' 💀</div>';
    }
}

// Start when page loads
window.addEventListener('DOMContentLoaded', function() {
    fetchPharaohCards();
});
