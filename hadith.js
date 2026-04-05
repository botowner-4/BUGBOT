const { Command } = require('your-command-library');

class HadithCommand extends Command {
    constructor() {
        super();
        this.collections = {
            bukhari: 'https://api.hadith.silakan.me/v1/hadith/bukhari',
            muslim: 'https://api.hadith.silakan.me/v1/hadith/muslim',
            // Add more collections here
        };
    }

    async execute(collectionName, hadithNumber) {
        if (!this.collections[collectionName]) {
            throw new Error(`Collection ${collectionName} not found.`);
        }

        try {
            const response = await fetch(`${this.collections[collectionName]}/${hadithNumber}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (!data || !data.hadith) {
                throw new Error('Hadith not found.');
            }
            return {
                collection: collectionName,
                number: hadithNumber,
                details: data.hadith,
            };
        } catch (error) {
            console.error('Error fetching hadith:', error);
            throw new Error('Failed to retrieve hadith due to server error.');
        }
    }
}

module.exports = HadithCommand;