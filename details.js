async function fetchCardDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const cardId = urlParams.get('id');
        
        if (!cardId) {
            document.getElementById('card-details').innerHTML = '<div class="loading" style="color:#ff4444;">💀 No card selected 💀</div>';
            return;
        }
        
        const container = document.getElementById('card-details');
        container.innerHTML = '<div class="loading">🔮 SUMMONING CARD DETAILS... 🔮</div>';
        
        const response = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?id=' + cardId);
        
        if (!response.ok) {
            throw new Error('Failed to fetch card');
        }
        
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            throw new Error('Card not found');
        }
        
        const card = data.data[0];
        
        console.log('Card loaded:', card.name);
        
        let imageUrl = 'https://via.placeholder.com/400x580?text=No+Image';
        if (card.card_images && card.card_images[0]) {
            imageUrl = card.card_images[0].image_url;
        }
        
        let description = card.desc || 'No description available.';
        description = description.replace(/\n/g, '<br>');
        
        // Build monster info
        let monsterInfo = '';
        
        if (card.type && card.type.includes('Monster')) {
            if (card.level) monsterInfo += '<p><strong>⭐ Level:</strong> ' + card.level + '</p>';
            if (card.rank) monsterInfo += '<p><strong>⭐⭐ Rank:</strong> ' + card.rank + '</p>';
            if (card.attribute) monsterInfo += '<p><strong>💠 Attribute:</strong> ' + card.attribute + '</p>';
            if (card.atk !== undefined) monsterInfo += '<p><strong>⚔️ ATK:</strong> ' + card.atk.toLocaleString() + '</p>';
            if (card.def !== undefined) monsterInfo += '<p><strong>🛡️ DEF:</strong> ' + card.def.toLocaleString() + '</p>';
        } else {
            monsterInfo += '<p><strong>🎴 Spell/Trap Type:</strong> ' + (card.type || 'N/A') + '</p>';
            if (card.race) monsterInfo += '<p><strong>🏷️ Race:</strong> ' + card.race + '</p>';
        }
        
        // Build the HTML with visible text
        container.innerHTML = `
            <div class="detail-card">
                <img src="${imageUrl}" alt="${card.name}">
                <h1>✨ ${card.name} ✨</h1>
                
                <p><strong>🆔 ID:</strong> ${card.id}</p>
                <p><strong>📜 Card Type:</strong> ${card.type || 'N/A'}</p>
                ${card.race && !card.type.includes('Monster') ? '<p><strong>🏷️ Race:</strong> ' + card.race + '</p>' : ''}
                ${monsterInfo}
                ${card.archetype ? '<p><strong>🏺 Archetype:</strong> ' + card.archetype + '</p>' : ''}
                
                <div class="description-box">
                    <strong>📖 CARD DESCRIPTION:</strong><br>
                    <div style="margin-top: 10px;">${description}</div>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error:', error);
        const container = document.getElementById('card-details');
        container.innerHTML = `
            <div class="detail-card" style="text-align: center; padding: 40px;">
                <h1 style="color: #ff4444;">💀 ERROR 💀</h1>
                <p style="color: white;">${error.message}</p>
                <p style="margin-top: 20px;"><a href="index.html" style="color: #ffd700;">← Back to Deck</a></p>
            </div>
        `;
    }
}

window.addEventListener('DOMContentLoaded', fetchCardDetails);
