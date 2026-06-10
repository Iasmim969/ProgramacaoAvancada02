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

class GeradorTexto implements IGeradorIA {
    public tipo = "TEXTO";

    gerar(prompt: string): string {
        return `[Texto Gerado]: Respondendo ao prompt: ${prompt}`;
    }
}

class GeradorImagem implements IGeradorIA {
    public tipo = "IMAGEM";

    gerar(prompt: string): string {
        return `[Imagem Gerada]: URL da imagem baseada em: ${prompt}`;
    }
}

class GeradorAudio implements IGeradorIA {
    public tipo = "AUDIO";

    gerar(prompt: string): string {
        return `[Áudio Gerado]: Arquivo de voz para: ${prompt}`;
    }
}

// 3. A classe principal orquestra geradores sem conhecer cada tipo concreto
class AssistenteOmniIA {
    public nomeModelo: string;
    private servicoCobranca: IServicoCobranca;
    private usuarioId: string;
    private geradores: Map<string, IGeradorIA>;

    constructor(nomeModelo: string, servicoCobranca: IServicoCobranca, usuarioId: string, geradores: IGeradorIA[]) {
        this.nomeModelo = nomeModelo;
        this.servicoCobranca = servicoCobranca;
        this.usuarioId = usuarioId;
        this.geradores = new Map(geradores.map((gerador) => [gerador.tipo, gerador]));
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

// 4. Um modelo específico recebe apenas as capacidades que suporta
class ModeloFocadoEmTexto extends AssistenteOmniIA {
    constructor(servicoCobranca: IServicoCobranca, usuarioId: string) {
        super("ChatGPT-4", servicoCobranca, usuarioId, [new GeradorTexto()]);
    }
}
