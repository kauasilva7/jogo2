const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');

let pontuacao = 0;
let pontuacaoMaxima = localStorage.getItem('pontuacaoMaxima') || 0;

document.addEventListener('keypress', (e) => {
    if (e.code === 'Space') {
        personagem.saltar();
    }
});

class Entidade {
    constructor(x, y, largura, altura, cor) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.cor = cor;
    }

    desenhar() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

class Personagem extends Entidade {
    #velocidade_y;

    constructor(x, y, largura, altura, cor) {
        super(x, y, largura, altura, cor);
        this.#velocidade_y = 0;
        this.pulando = false;
    }

    saltar() {
        this.#velocidade_y = 15;
        this.pulando = true;
    }

    atualizar() {
        if (this.pulando) {
            this.y -= this.#velocidade_y;
            this.#velocidade_y -= Jogo.gravidade;
            if (this.y >= canvas.height - 50) {
                this.#velocidade_y = 0;
                this.y = canvas.height - 50;
                this.pulando = false;
            }
        }
    }

    colisao() {
        if (
            obstaculo.x < this.x + this.largura &&
            obstaculo.largura + obstaculo.x > this.x &&
            this.y < obstaculo.y + obstaculo.altura &&
            this.y + this.altura > obstaculo.y
        ) {
            obstaculo.velocidade_x = 0;
            ctx.fillStyle = 'Black';
            ctx.font = '50px Arial';
            ctx.fillText('GAME OVER', 300, 100);
            Jogo.gameOver = true;

            
            if (pontuacao > pontuacaoMaxima) {
                pontuacaoMaxima = pontuacao;
                localStorage.setItem('pontuacaoMaxima', pontuacaoMaxima);
            }
        }
    }

    DesenharPersonagem(){
        
    }
}

class Obstaculo extends Entidade {
    constructor(x, y, largura, altura, cor) {
        super(x, y, largura, altura, cor);
        this.velocidade_x = 3;
    }

    atualizar() {
        this.x -= this.velocidade_x;
        if (this.x <= 0 - this.largura) {
            this.x = canvas.width;
            this.velocidade_x += 1;
            pontuacao++; 
        }
    }
}

class Jogo {
    static gravidade = 0.5;
    static gameOver = false;

    constructor() {
        this.loop = this.loop.bind(this);
    }

    loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        obstaculo.desenhar();
        personagem.desenhar();
        personagem.atualizar();
        obstaculo.atualizar();
        personagem.colisao();

        ctx.fillStyle = 'Black';
        ctx.font = '20px Arial';
        ctx.fillText(`Pontuação: ${pontuacao}`, 10, 30);
        ctx.fillText(`Recorde: ${pontuacaoMaxima}`, 10, 60);

        if (!Jogo.gameOver) {
            requestAnimationFrame(this.loop);
        }
    }
}

const personagem = new Personagem(100, canvas.height - 50, 50, 50, 'Black');
const obstaculo = new Obstaculo(canvas.width - 50, canvas.height - 100, 50, 100, 'red');
const jogo = new Jogo();
jogo.loop();