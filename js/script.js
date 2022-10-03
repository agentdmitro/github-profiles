const APIURL = "https://api.github.com/users/";

const main = document.getElementById('main');
const cardHTML = document.getElementById('cardHTML');
const search = document.getElementById('search');
const form = document.getElementById('form');


async function getUser(username) {
    const resp = await fetch(APIURL + username);
    const respData = await resp.json();

    createUserCard(respData);
    getRepos(username);
}

async function getRepos(username) {
    const resp = await fetch('https://api.github.com/search/repositories?q=user:' + username + '+sort:updated ');
    const respData = await resp.json();

    addReposToCard(respData);
}

getUser('agentdmitro');

function createUserCard(user) {
    const card = document.createElement('div');
    card.classList.add('card');

        if(user.login){
            card.innerHTML = `
            <div>
                <img class="avatar" src="${user.avatar_url}" alt="">
            </div>
            <div>
                <h1>${user.name}</h1>
                <a style="opacity: 0.7" href="${user.html_url}">${user.blog}</a>
                <p>${user.bio ? user.bio : 'no bio yet'}</p>
    
                <ul class="info">
                    <li><i class="fa fa-eye" aria-hidden="true"></i> ${user.followers}</li>
                    <li><i class="fa-solid fa-heart"></i> ${user.following}</li>
                    <li><i class="fas fa-comment-alt"></i> ${user.public_repos}</li>
                </ul>
                <h2>Repos: </h2>
                ${user.public_repos ? '<div class="repos" id="repos"></div>' : '<p style="margin-top: 1rem">no repos</p>'}
            </div>
        `;
        }else{
            card.innerHTML = `<b>Undefined :(</b>`
        }

    cardHTML.appendChild(card);
}

function addReposToCard(repos) {
    const reposEl = document.getElementById("repos");

    repos.items
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10)
        .forEach((repo) => {
            const repoEl = document.createElement("a");
            repoEl.classList.add("repo");

            repoEl.href = repo.html_url;
            repoEl.target = "_blank";
            repoEl.innerText = repo.name;

            reposEl.appendChild(repoEl);
        });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = search.value;

    if(user){
        cardHTML.innerHTML = ``;
        getUser(user);

        search.value = '';
    }
    
})