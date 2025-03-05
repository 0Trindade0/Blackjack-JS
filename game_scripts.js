// Classe Baralho
class Deck {
    #deck; 

    constructor() {
        this.reset();
    }

    reset() {
        this.#deck = [];
        //Criar e definir valor das cartas utilizando um objeto
        const cards = {
            "A": 11, "K": 10, "Q": 10, "J": 10, "10": 10, "9": 9, 
            "8": 8, "7": 7, "6": 6, "5": 5, "4": 4, "3": 3, "2": 2
        };
        let suits = ["Diamonds", "Hearts", "Spades", "Clubs"];

        //Criar as cartas.
        //Utilizando um for que para cada naipe irá fazer uma das 13 cartas,
        //criando assim um baralho de 52 cartas  
        for (let suit of suits) {
            for (let card in cards) {
                this.#deck.push({
                    card: card,
                    suit: suit,
                    value: cards[card]
                });
            }
        }
    }

    // Embaralhar o baralho utilizando Fisher-Yates Shuffle
    shuffle() {
        for (let i = this.#deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.#deck[i], this.#deck[j]] = [this.#deck[j], this.#deck[i]];
        }
    }

    // Retorna uma carta removida do topo do baralho
    drawCard() {
        return this.#deck.length > 0 ? this.#deck.pop() : null;
    }

    // Retorna o número de cartas restantes no baralho
    getCardCount() {
        return this.#deck.length;
    }
}

// Função para entregar cartas, utilizando drawCard() para tirar as cartas entregues do baralho
function handle_cards(deck) {
    let player_hand = [deck.drawCard(), deck.drawCard()]; // Duas cartas para o jogador
    let dealer_hand = [deck.drawCard(), deck.drawCard()]; // Duas cartas para o dealer
    return { player_hand, dealer_hand };
}

//Função para calcular o valor das mãos
function hand_value_calc(hand) {
    let total = 0;
    let aces = 0;

    for (let card of hand) {
        total += card.value;
        if (card.card === "A") {
            aces += 1;  // Contar quantos Ases existem na mão
        }
    }

    // Ajustar o valor do Ás se necessário (se passar de 21, reduz de 10)
    while (total > 21 && aces > 0) {
        total -= 10; // Ás passa de 11 para 1 (já conta como 10, então removemos 9)
        aces -= 1;
    }

    return total;
}

// Criar uma função para capturar as ações dos botões do HTML
function setupGameControls(callback) {
    document.getElementById("drawCard").addEventListener("click", () => callback(1));
    document.getElementById("endBet").addEventListener("click", () => callback(2));
    document.getElementById("forfeit").addEventListener("click", () => callback(3));
}

//Função para exibir as cartas na tela
function displayHands(playerHand, dealerHand, hideDealerCard = true) {
    let playerCards = playerHand.map(card => `${card.card} of ${card.suit}`).join(", ");
    let dealerCards = hideDealerCard 
        ? `${dealerHand[0].card} of ${dealerHand[0].suit}, ??` 
        : dealerHand.map(card => `${card.card} of ${card.suit}`).join(", ");

    document.getElementById("playerCards").innerText = `Player Hand: ${playerCards}`;
    document.getElementById("dealerCards").innerText = `Dealer Hand: ${dealerCards}`;
    document.getElementById("playerScore").innerText = `Player Score: ${hand_value_calc(playerHand)}`;
}

// Exibir mensagem de resultado
function displayMessage(message) {
    document.getElementById("gameMessage").innerText = message;
}

//Função principal do jogo Blackjack
async function Blackjack() {
    let game_deck = new Deck();  // Criar um novo baralho
    game_deck.shuffle();  // Embaralhar o baralho   
    let { player_hand, dealer_hand } = handle_cards(game_deck); //Criar mão do Player e do Dealer 
    let run_game = true; //Variável para manter o jogo rodando

    
    displayHands(player_hand, dealer_hand, true);
    /*console.log("\nPlayer Hand:", player_hand);
    console.log("Dealer Hand:", dealer_hand[0], "??");//Esconder a segunda carta do dealer
    console.log("\nPlayer Score:", hand_value_calc(player_hand));*/

    function handleAction(action) {
        if (!run_game) return; // Se o jogo já acabou, não faz nada

        if (action === 1) {
            // Draw Card: Comprar mais uma carta
            player_hand.push(game_deck.drawCard());
            displayHands(player_hand, dealer_hand, true); // Atualizar na tela
            /*console.log("\nPlayer Hand:", player_hand);
            console.log("\nPlayer Score:", hand_value_calc(player_hand));*/

            //Verificar se o jogador estourou
            if (hand_value_calc(player_hand) > 21) {
                //console.log("\nYou lose!\n Busted hands.");
                displayMessage("You loose! Busted hands.");
                run_game = false;
            }

        } else if (action === 2) {
            // End Bet: O dealer joga
            let dealer_total = hand_value_calc(dealer_hand);
            while (dealer_total < 17) {
                dealer_hand.push(game_deck.drawCard());
                dealer_total = hand_value_calc(dealer_hand);
            }

            /*console.log("\nDealer Hand:", dealer_hand);
            console.log("Dealer Score:", dealer_total);*/
            displayHands(player_hand, dealer_hand, false);

            let player_total = hand_value_calc(player_hand);
            let message = "";

            if (dealer_total > 21) {
                //Caso Dealer ultrapasse o limite
                //console.log("Dealer busted hands.\n You win!");
                message = "Dealer busted hands. You Won!";
            } else if (dealer_total > player_total) {
                //Caso Dealer tenha a maior mão
                //console.log("Dealer won."); 
                message = "Dealer Won.";
            } else if (dealer_total < player_total) {
                //Caso você tenha a maior mão
                //console.log("You win."); 
                message = "You win!";
            } else {
                //Empate
                //console.log("Draw."); 
                message = "Draw!";
            }
            displayMessage(message);
            run_game = false;

        } else if (action === 3) {
            // Forfeit: Desistir do jogo
            displayMessage("You forfeit the game!");
            run_game = false;
        } else {
            displayMessage("Invalid action! Try again.");//Caso usuário coloque algum caracter inválido.
        }
    }
    // Configurar os botões para enviar as ações ao jogo
    setupGameControls(handleAction);
}

function restartGame() {
    // Limpa todas as mensagens e cartas na tela
    document.getElementById("playerCards").innerText = "Player Hand: ";
    document.getElementById("dealerCards").innerText = "Dealer Hand: ";
    document.getElementById("playerScore").innerText = "Player Score: ";
    document.getElementById("gameMessage").innerText = "";

    // Chama a função Blackjack novamente para começar um novo jogo
    Blackjack();
}
// Adiciona evento ao botão de reinício
document.getElementById("restart").addEventListener("click", restartGame);

// Iniciar o jogo
Blackjack();
