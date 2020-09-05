const baseEndpoint = 'https://icanhazdadjoke.com/';
const form = document.querySelector('form.search');
const displayHTML = document.querySelector('.display');
const headerHTML = document.querySelector('.pages');
const random = document.querySelector('.random');
const innerModal = document.querySelector('.inner-modal');
const outerModal = document.querySelector('.outer-modal');
const jokeHolder = document.querySelector('.inner-modal p')
const random2 = document.querySelector('.random2');
let userInput = '';

//main function to get data
async function getData(options, number)
{
    let url = `${baseEndpoint}search?term=${options}&page=${number}`;
    let response = await fetch(url, {
        headers: {
            Accept: 'application/json',
        }
    });
    let data = await response.json();
    // console.log(data);
    return data;
}

//handle random jokes fetch
async function getRandom()
{
    let response = await fetch(baseEndpoint, {
        headers: {
            Accept: 'application/json',
        }
    });
    let data = await response.json();
    return data;
}

async function doStuff(element, num)
{
    let result = await getData(element, num);
    if (result.total_jokes === 0)
    {
        noJokes(result);
        return;
    }
    if (result.total_pages == 1)
    {
        displayJokes(result.results);
        removeButtons();
    }
    else if (result.total_pages > 1)
    {
        displayPage(result);
        if (result.current_page === result.previous_page)
        {
            document.getElementById("prev").disabled = true;
        }
        else if (result.current_page === result.next_page)
        {
            document.getElementById("next").disabled = true;
        }
    }
    displayJokes(result.results);
}

//handle submit form
async function handleSubmit(event)
{
    event.preventDefault();
    const element = event.currentTarget;
    userInput = element.query.value;
    doStuff(element.query.value, 1);
}

//handle page switches
async function handleClick(event)
{
    doStuff(userInput, event.target.value);
}

//take care of random joke button
async function handleButton(event)
{
    let result = await getRandom();
    jokeHolder.textContent = result.joke;
    outerModal.classList.add('open');
}

function modalClose()
{
    outerModal.classList.remove('open');
}

function noJokes(options)
{
    let html = `<p>Sorry, the joke with the word "${options.search_term}" doesn't exist. Try again!!</p>`;
    displayHTML.innerHTML = html;
}

//creating buttons when more than one page of jokes
function displayPage(options)
{
    let html = `<button id="prev" value="${options.previous_page}">Previous</button>
        <div class="space"></div>
        <button id="next" value="${options.next_page}">Next</button>`;
    headerHTML.innerHTML = html;
    headerHTML.addEventListener('click', handleClick);
}

function removeButtons()
{
    if (document.getElementById("prev") == null)
    {
        return;
    }
    else
    {
        document.getElementById("prev").remove();
        document.getElementById("next").remove();
        headerHTML.removeEventListener('click', handleClick);
    }
}


//creating new html when search for jokes
async function displayJokes(options)
{
    const html = options.map(
        option =>
        {
            return `<div class="items">
            <p>${option.joke}</p>
        </div>`
        });
    displayHTML.innerHTML = html.join('');
}

form.addEventListener('submit', handleSubmit);
random.addEventListener('click', handleButton);
random2.addEventListener('click', handleButton)
outerModal.addEventListener('click', function clicking(event)
{
    const target = event.target.closest('.inner-modal');
    if (!target)
    {
        modalClose();
    }
});

window.onload = function ()
{
    doStuff(userInput, 1);
};