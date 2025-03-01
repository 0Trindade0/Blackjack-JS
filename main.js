//Importando o módulo readline para entrada do usuário
const readline = require('readline');

// Classe Baralho
class Deck {
    constructor() {
        this.deck = this.deck_creator();
    }

    // Função para criar o baralho
    deck_creator() {
        //Criar e definir valor das cartas utilizando um objeto
        let cards = {
            "A": 11, "K": 10, "Q": 10, "J": 10, "10": 10, "9": 9, 
            "8": 8, "7": 7, "6": 6, "5": 5, "4": 4, "3": 3, "2": 2
        };
        let suits = ["Diamonds", "Hearts", "Spades", "Clubs"];
        let deck = [];

        //Criar as cartas.
        //Utilizando um for que para cada naipe irá fazer uma das 14 cartas,
        //criando assim um baralho de 52 cartas  
        for (let suit of suits) {
            for (let card in cards) {
                deck.push({
                    card: card,
                    suit: suit,
                    value: cards[card]
                });
            }
        }
        return deck;
    }

    // Função para embaralhar o baralho
    shuffle_deck() {
        this.deck.sort(() => Math.random() - 0.5);
         /*
        Math.random() gera um número entre 0 e 1.
        Subtrair 0.5 cria um número entre -0.5 e 0.5, aleatoriamente positivo ou negativo.
        Isso faz com que a função sort() reorganize os elementos de forma aleatória.
        */
    }
}

// Função para entregar cartas, utilizando pop() para tirar as cartas entregues do baralho
function handle_cards(deck) {

    let player_hand = [deck.pop(), deck.pop()]; // Duas cartas para o jogador
    let dealer_hand = [deck.pop(), deck.pop()]; // Duas cartas para o dealer

    return { player_hand, dealer_hand };
}

/*
    Regra do Ás no Blackjack:
    - O Ás pode valer 11 ou 1, dependendo do total da mão.
    - Inicialmente, ele conta como 11.
    - Se o total da mão ultrapassar 21 e houver Ases, um Ás muda para 1 (-10 pontos).
    - Isso impede que o jogador "estoure" automaticamente ao ter um Ás.
*/
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

async function Blackjack()
{
    let game_deck = new Deck();  // Criar um novo baralho
    game_deck.shuffle_deck();  // Embaralhar o baralho   
    let { player_hand, dealer_hand } = handle_cards(game_deck.deck);//Criar mão do Player e do Dealer 
    let run_game = true; //Variável para manter o jogo rodando

    // Criando uma interface de entrada
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    //Função para fazer perguntas de forma assíncrona
    function ask_question(query) {
        return new Promise(resolve => rl.question(query, resolve));
    }

    while(run_game)
        {
            //Exibir as cartas do player e do dealer
            console.log("\nPlayer Hand:", player_hand);
            console.log("Dealer Hand:", dealer_hand[0], "??");//Esconder a segunda carta do dealer
            //Calcular o valor das mãos
            let player_total = hand_value_calc(player_hand);
            let dealer_total = hand_value_calc(dealer_hand);
            //Exibir pontuações
            console.log("\nPlayer Score:", player_total);
    
            //Verificar se o jogador estourou
            if (player_total > 21)
            {
                console.log("\nYou lose!\n Busted hands.");
            }


        const action = await ask_question("\nWhat do you wish to do?\nDraw card (1) \nEnd Bet (2) \nForfeit(3): ");
    
        if(action == "1")
        {
            player_hand.push(game_deck.deck.pop());
        }else if(action == "2")
            {
                //Jogador decidiu não apostar mais, dealer joga até ter 17 ou mais
                while(dealer_total < 17)
                {
                    dealer_hand.push(game_deck.deck.pop());
                    dealer_total = hand_value_calc(dealer_hand);
                }
                
                console.log("\nDealer Hand:", dealer_hand);
                console.log("Dealer Score:", dealer_total);

                if (dealer_total > 21){ 
                        console.log("Dealer busted hands.\n You won!");//Caso Dealer ultrapasse o limite
                    } else if (dealer_total > player_total) {
                        console.log("Dealer won."); //Caso Dealer tenha a maior mão
                    } else if (dealer_total < player_total) {
                        console.log("You win."); //Caso você tenha a maior mão
                    } else {
                        console.log("Draw."); //Empate
                    }
                    run_game = false;
            }else if(action == "3"){//Desistir do jogo
                console.log("Você desistiu do jogo!"); 
                run_game = false;
            }else
                {
                    console.log("Ação inválida! Tente novamente.");//Caso usúario coloque algum caracter inválido.
                  }
        }
        rl.close();
} 

Blackjack();