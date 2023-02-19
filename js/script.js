const valueInput = document.querySelector('.search-input')
valueInput.addEventListener('keyup', debounce(searchRepository.bind(this), 400))

const repositoriesWrapper = createElement('div', 'repositoriesWrapper');

async function searchRepository() {
    if (valueInput.value.includes(' ') || valueInput.value == '') {
        repositoriesWrapper.textContent = ''
    }
    return await fetch(`https://api.github.com/search/repositories?q=${valueInput.value}&per_page=5`).then(res => {
        if (res.ok) {
            repositoriesWrapper.textContent = ''
            res.json().then(res => {
                const finishedResult = [];
                res.items.forEach(repository => {
                    finishedResult.push(repository)
                    const autoComplitRepositories = createElement('div', 'autoComplitRepositoriesName');
                    autoComplitRepositories.textContent = repository.name;
                    autoComplitRepositories.addEventListener('click', (e) => {
                        const block = addInfoInBlock(repository.name, repository.owner.login, repository.stargazers_count);
                        selectedRepositoryWrapper = createElement('div', 'selectedRepositoryWrapper');
                        selectedRepositoryWrapper.append(block)
                        document.querySelector('.listWrapper').append(selectedRepositoryWrapper);
                        valueInput.value = '';
                        repositoriesWrapper.textContent = ''
                    });
                    repositoriesWrapper.append(autoComplitRepositories);
                })
            },
                document.querySelector('.resultWrapper').append(repositoriesWrapper)
            )
        }
    })
}

function createElement(elementTag, elementClass, elementId) {
    const element = document.createElement(elementTag);
    if (elementClass) {
        element.classList.add(elementClass)
    }
    if (elementId) {
        element.id = elementId;
    }
    return element;
}

function addInfoInBlock(name, owner, stars) {
    const resultBlock = createElement('div', 'selectedRepository')
    const blockName = createElement('p', 'info-repository')
    blockName.textContent = `Name: ${name}`
    resultBlock.appendChild(blockName)
    const blockOwner = createElement('p', 'info-repository')
    blockOwner.textContent = `Owner: ${owner}`
    resultBlock.appendChild(blockOwner)
    const blockStars = createElement('p', 'info-repository')
    blockStars.textContent = `Stars: ${stars}`
    resultBlock.appendChild(blockStars)
    const btnCross = createElement('button', 'cross')
    btnCross.addEventListener('click', (e) => {
        if (e.target.className != 'cross' && e.target.className != 'cross-line') return;
        let pane = e.target.closest('.selectedRepositoryWrapper');
        pane.remove();
    })
    const btnCrossLine1 = createElement('div', 'cross-line')
    const btnCrossLine2 = createElement('div', 'cross-line')
    btnCross.append(btnCrossLine1)
    btnCross.append(btnCrossLine2)
    resultBlock.appendChild(btnCross)
    return resultBlock
}

function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        let context = this, args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};