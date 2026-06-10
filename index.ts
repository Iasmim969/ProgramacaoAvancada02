// 1. Sistema de cobrança engessado
class SistemaCobrancaStripe {
    cobrar(usuarioId: string, valorTokens: number): void {
        console.log(`Cobrando R$${valorTokens} via Stripe do usuário ${usuarioId}`);
    }
}

interface IServicoCobranca {
    registrar(usuarioId: string, valor: number): void;
}

class ServicoCobrancaStripe implements IServicoCobranca {
    private sistemaCobranca: SistemaCobrancaStripe;

    constructor(sistemaCobranca: SistemaCobrancaStripe = new SistemaCobrancaStripe()) {
        this.sistemaCobranca = sistemaCobranca;
    }

    registrar(usuarioId: string, valor: number): void {
        this.sistemaCobranca.cobrar(usuarioId, valor);
    }
}

// 2. Geradores especializados por tipo de IA
interface IGeradorIA {
    tipo: string;
    gerar(prompt: string): string;
}

interface IGeradorTexto {
    gerarTexto(prompt: string): string;
}

interface IGeradorImagem {
    gerarImagem(prompt: string): string;
}

interface IGeradorAudio {
    gerarAudio(prompt: string): string;
}

class GeradorTexto implements IGeradorIA, IGeradorTexto {
    public tipo = "TEXTO";

    gerar(prompt: string): string {
        return this.gerarTexto(prompt);
    }

    gerarTexto(prompt: string): string {
        return `[Texto Gerado]: Respondendo ao prompt: ${prompt}`;
    }
}

class GeradorImagem implements IGeradorIA, IGeradorImagem {
    public tipo = "IMAGEM";

    gerar(prompt: string): string {
        return this.gerarImagem(prompt);
    }

    gerarImagem(prompt: string): string {
        return `[Imagem Gerada]: URL da imagem baseada em: ${prompt}`;
    }
}

class GeradorAudio implements IGeradorIA, IGeradorAudio {
    public tipo = "AUDIO";

    gerar(prompt: string): string {
        return this.gerarAudio(prompt);
    }

    gerarAudio(prompt: string): string {
        return `[Áudio Gerado]: Arquivo de voz para: ${prompt}`;
    }
}

interface IModeloIA {
    nome: string;
    geradores: IGeradorIA[];
}

class ModeloOmni implements IModeloIA {
    public nome = "OmniIA";
    public geradores: IGeradorIA[] = [
        new GeradorTexto(),
        new GeradorImagem(),
        new GeradorAudio(),
    ];
}

class ModeloFocadoEmTexto implements IModeloIA {
    public nome = "ChatGPT-4";
    public geradores: IGeradorIA[] = [new GeradorTexto()];
}

// 3. A classe principal orquestra geradores sem conhecer cada tipo concreto
class AssistenteOmniIA {
    public nomeModelo: string;
    private servicoCobranca: IServicoCobranca;
    private usuarioId: string;
    private geradores: Map<string, IGeradorIA>;

    constructor(modelo: IModeloIA, servicoCobranca: IServicoCobranca, usuarioId: string) {
        this.nomeModelo = modelo.nome;
        this.servicoCobranca = servicoCobranca;
        this.usuarioId = usuarioId;
        this.geradores = new Map(modelo.geradores.map((gerador) => [gerador.tipo, gerador]));
    }

    processarRequisicaoUsuario(prompt: string, tipo: string): void {
        console.log(`Iniciando processamento com ${this.nomeModelo}...`);

        const gerador = this.geradores.get(tipo);

        if (!gerador) {
            throw new Error("Tipo de IA não suportado pelo sistema.");
        }

        gerador.gerar(prompt);
       
        this.servicoCobranca.registrar(this.usuarioId, 1.50);
    }
}
