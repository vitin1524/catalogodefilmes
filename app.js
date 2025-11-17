// Substitua pela sua chave REAL do OMDB API
const OMDB_API_KEY = '274672bb';
const listaFilmesContainer = document.querySelector('.lista-filmes');
const searchInput = document.querySelector('.search-input');

// --- A. Função para Criar o HTML do Card ---
/**
 * Cria o elemento HTML de um Card de Filmes com os dados da OMDB.
 * @param {Ojbect} filme - Objeto de filme retornado pela API.
 */

function criarCardFilme(filme) {
    const card = document.createElement('div');
    card.classList.add('card-filme');
    // Adiciona o IMDB ID como um data-attribute para buscar detalhes/trailer depois
    card.dataset.imdbId = filme.imdbID;

    // Garante que o rating seja um valor presente
    const rating = filme.imdbRating ? `${filme.imdbRating}` : `N/A`;

    // Conteúdo HTML card, usando as novas classes CSS
    card.innerHTML = `
        <img src="${filme.Poster !== 'N/A' ? filme.Poster : 'placeholder.jpg'}"
            alt="${filme.Title}"
            class="poster-filme">
        <span class="avaliacao">${rating}</span>
        <div class="card-detalhes">
            <h3 class="titulo-filme">${filme.Title} (${filme.Year})</h3>
            <buttton class="botao-adicionar" data-title="${filme.Title}">
                + Minha Lista
            </button>
        </div>
    `;

    // Adiciona um listener para a funcionalidade de trailer (Se você tiver API)
    // Se você usar OMDB, precisará de uma segunda chamada para os detalhes
    card.addEventListener('click', () => buscarEExibirDetalhes(filme.imdbID));
    
    return card;
}

// --- B. Função Principal de Busca ---
/**
 * Busca o filme na OMDB e atualiza o container.
 * @param {string} termo - Termo de busca digitado pelo usuário.
 */

async function buscarFilmes(termo) {
    if (!termo) return; // Não busca se o estiver vazio

    // Limpa a lista anterior e mostra um indicador de carregamento
    listaFilmesContainer.innerHTML = '<p style="text-align: center; color: gray;">Carregando...</p>';

    try {
        // Busca na OMDB (O parâmetro 's' é para buscar por termo)
        const response = await fetch(`https://www.omdbapi.com/?s=${termo}&apikey=${OMDB_API_KEY}`);
        const data = await response.json();

        // Limpa o container novamente
        listaFilmesContainer.innerHTML = '';

        if (data.Response === 'True' && data.Search) {
            data.Search.forEach(async (filmeBase) => {
                // A OMDB retorna apenas dados básicos na busca (s=).
                // Precisamos de uma segunda busca (i=) para pegar o Rating.
                const filmeDetalhado = await buscarDetalhes(filmeBase.imdbID);
                if (filmeDetalhado) {
                    listaFilmesContainer.appendChild(criarCardFilme(filmeDetalhado));
                }
            })
        } else {
            listaFilmesContainer.innerHTML = `<p style="text-align: center;">Nenhum filme encontrado para "${termo}".</p>`;
        }
    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
        listaFilmesContainer.innerHTML = '<p style="text-align: center; color: red;">Erro na conexão com API.</p>';
    }
}

// --- C. Função para Buscar Detalhes e Trailer (Chamada Adicinal) ---
// É NECESSÁRIA pois a OMDB não retorna o Rating na busca por 's'
async function buscarDetalhes(imdbID) {
    try {
        // Busca na OMDB (O parâmetro 'i' é para buscar por 's')
        const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${OMDB_API_KEY}`);
        const data = await response.json();
        return data.Response === 'True' ? data : null;
    } catch (error) {
        console.error("Erro ao buscaar detalhes:", error);
        return null;
    }
}

// --- D. Lógica para exibir Detalher/Trailer (Implementação do Modal) ---
// Se você usava uma API diferente para Trailer, integre-a aqui.
function buscarEExibirDetalhes(imdbID) {
    // 1. Você faria uma nova busca (na OMDB ou em outra API como a TheMovieDB/Youtube)
    //      para obter o link do trailer ou mais detalhes.

    // 2. Você criaria um elemento de Modal (janela pop-up) com o trailer/detalhe.

    alert(`Funcionalidade de Detalhes/Trailer para o ID: ${imdbID} (Ainda precisa ser implementada).`);
    // Exemplo de como abrir um link se você tiver o URL do trailer:
    // window.open('LINK_DO_TRAILER', '_blank');
}

// --- E. Implementação do DEBOUNCE na Busca ---
// Isso evita chamar a API a cada tecla digitada.
let searchTimeout;
searchInput.addEventListener('input', (event) => {
    // Limpa o timeout anteiror para evitar chamadas múlltiplas.
    clearTimeout(searchTimeout);

    // Define um novo Timeout para buscar apos 500ms (0.5s)
    searchTimeout = setTimeout(() => {
       buscarFilmes(event.target.value.trim()); 
    }, 500);
})

// Exemplo de carregamento inicial
document.addEventListener('DOMContentLoaded', () => {
    // Busca filmes ao carregar a página (Ex: os mais recentes)
    buscarFilmes('popular');
})
