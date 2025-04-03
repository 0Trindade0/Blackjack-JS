
document.addEventListener("DOMContentLoaded", () => {
    const deck = new Deck();
    deck.shuffle();

    const cards = document.querySelectorAll(".cards2");

    document.getElementById("testButton").addEventListener("click", () => {
        cards.forEach(card => {
            const drawnCard = deck.drawCard();
            console.log("Carta sorteada:", drawnCard); // Verifica se uma carta foi sorteada

            if (drawnCard) {
                card.querySelector(".suit").textContent = drawnCard.value;
                card.querySelector(".card_value").textContent = drawnCard.suit;
                card.querySelector(".suit2").textContent = drawnCard.value;
            } else {
                console.warn("O baralho acabou! Criando um novo...");
                deck.cards = deck.createDeck();
                deck.shuffle();
            }
        });
    });
});
