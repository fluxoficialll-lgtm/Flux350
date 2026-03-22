
import { config } from '../ValidaçãoDeAmbiente/config';
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';
import { servicoGestaoPerfil } from './Servico.Gestao.Perfil';
import API_Metodo_Google from '../APIs/APIsServicoAutenticacao/API.Servico.Metodo.Google';

// --- Interface ---
export interface IServicoGoogleAuth {
    autenticar(): Promise<{ token: string; user: Usuario | null }>;
}

// --- Real Implementation ---
class ServicoGoogleAuthReal implements IServicoGoogleAuth {
    async autenticar(): Promise<{ token: string; user: Usuario | null }> {
        console.log("Real Google Auth: Chamando API...");
        try {
            const response = await API_Metodo_Google.autenticar();
            console.log("Real Google Auth: Resposta da API recebida.");
            return response;
        } catch (error) {
            console.error("Real Google Auth: Erro ao autenticar via API.", error);
            throw error;
        }
    }
}

// --- Simulated Implementation ---
class ServicoGoogleAuthSimulado implements IServicoGoogleAuth {
    async autenticar(): Promise<{ token: string; user: Usuario | null }> {
        console.log("Simulated Google Auth: Iniciando autenticação simulada...");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
            const user = await servicoGestaoPerfil.getPublicProfileByUsername('usuariopadrao');
            const simulatedResponse = {
                token: 'simulated-google-jwt-token',
                user: user
            };
            console.log("Simulated Google Auth: Autenticação simulada bem-sucedida.");
            return simulatedResponse;
        } catch (error) {
            console.error("Simulated Google Auth: Erro na simulação.", error);
            throw error;
        }
    }
}

// --- Service Selection ---
let servicoSelecionado: IServicoGoogleAuth;

if (config.VITE_APP_ENV === 'simulation') {
    console.log("INFO: Usando MODO DE SIMULAÇÃO para o Serviço de Autenticação Google.");
    servicoSelecionado = new ServicoGoogleAuthSimulado();
} else {
    console.log("INFO: Usando Serviço de Autenticação Google REAL (Produção).");
    servicoSelecionado = new ServicoGoogleAuthReal();
}

export const servicoMetodoGoogle = servicoSelecionado;
