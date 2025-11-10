const OMDB_API_KEY = 'coloque sua chave aq';
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
    
}
