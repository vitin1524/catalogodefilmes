const OMDB_API_KEY = '52cb694a';
const listaFilmesContainer = document.querySelector(`.lista-filmes`);
const searchInput = document.querySelector(`.search-input`);

// --- A. Função para Criar o HTML do Card ---
/**
 * Cria o elemnto HTML de um card de filme com os dados da OMDB.
 * @param {Object} filme 
 */
function criarCardFilme(filme) {
    const card =document.createElement(`div`);
    card.classList.add(`card-filme`);
    card.dataset.imdbId = filme.imdbID;
    const rating = filme.imdbRating ? `⭐ ${filme.imdbRating}` : `⭐ N/A`
    card.innerHTML = `
    <img src="${filme.poster !== 'N/A' ? filme.poster : 'placeholder.jpg'}"
        alt="${filme.title}"
        class="poster-filme">
    <span class="avaliacao">${rating}</span>
    <div class="card-detalhes">
        <h3 class="titulo-filme">${filme.title} (${filme.year})</h3>
        <buttton class="botao-adicionar" data-title="${filme.title}">
            + Minha Lista
        </button>
    </div>
`;

card.addEventListener(`click`, () => buscarEExibirDetalhes(filme.imdbID));

return card;
}

// --- B. Função Principal de Busca ---
/**
 * Busca o filme na OMDB e atualiza o container.
 * @param {string} termo - Termo de busca digitado pelo usuário.
 */
async function buscarFilmes(termo) {
    if (!termo) return;
    listaFilmesContainer.innerHTML = `<p style="text-align: center; color: gray;">Carregando...</p>`;

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${termo}&apikey=${OMDB_API_KEY}`);
        const data = await response.json();
        listaFilmesContainer.innerHTML = '';

        if (data.Response === 'true' && data.search) {
            data.search.forEach(async (filmeBase) => {
                const filmeDetalhado = await buscarDetalhes(filmeBase.imdbID);
                if (filmeDetalhado) {
                    listaFilmesContainer.appendChild(criarCardFilme(filmeDetalhado));
                }
            });
        } else {
            listaFilmesContainer.innerHTML = `<p style="text-align: center;">Nenhum filme encontrado para "${termo}".</p>`;
        }
    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
        listaFilmesContainer.innerHTML = '<p style="text-align: center; color: red;">Erro na conexão com a API.</p>';
    }
}

async function buscarDetalhes(imdbID) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${OMDB_API_KEY}`);
        const data = await response.json();
        return data.Response === 'True' ? data : null;
    } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
    }
}

function buscarEExibirDetalhes(imdbID) {
    alert(`Funcionalidade de Detalhes/Trailer para o ID: ${imdbID} (Ainda precisa ser implementada).`);
}

let searchTimeout;
searchInput.addEventListener('input', (event) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() =>{
        buscarFilmes(event.target.value.trim());
    }, 500);
});

document.addEventListener('DOMContentLoaded', () => {
    buscarFilmes('popular');
});