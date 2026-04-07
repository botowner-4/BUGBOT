let baileys = null;

(async () => {
    baileys = await import('@whiskeysockets/baileys');
})();

module.exports = baileys;
