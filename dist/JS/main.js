
// const selectElement = selector => {
// const element = document.querySelector(selector)
// if(element) return element;
// throw new Error(`Something went, make sure that ${selector} exists or is typed correctly.`);
// };

// const bodyElement = document.body;
// const themeToggleBtn = selectElement('#theme-btn');
// console.log(selectElement('#theme-btn'))
// themeToggleBtn.addEventListener('click',()=>{
//     bodyElement.classList.toggle('light-theme');
    
// });
const wrapper = document.querySelector('.card-base');
const search  = wrapper.querySelector('#search-content');
const infoText = wrapper.querySelector('.info');
removeIcon = wrapper.querySelector('#removeIcon');
volumeIcon = wrapper.querySelector('#volume-btn');
let audio;
function buildData(data,sinput)
{
    if(data.title)
    {
        infoText.innerHTML = `We coudn't find the meaning of the word <span> "${sinput}"</span>. Please try again with another word.`
        wrapper.classList.remove("active");
    }
    else{
        wrapper.classList.add("active");
        let wordmeaning = data[0].meanings[0].definitions[0];
        let phone;
        if(data[0].phonetics[0].text ==  undefined)
        {
            for(let i = 0;i<data[0].phonetics.length;i++)
            {
                if(data[0].phonetics[i].text!=undefined)
                {
                    phone = data[0].phonetics[i].text;
                }
            }
            phonetics = `${data[0].meanings[0].partOfSpeech} ${phone}`;
        }
        else
        {
            phonetics = `${data[0].meanings[0].partOfSpeech} ${data[0].phonetics[0].text}`;
        }   


        if(wordmeaning.example == undefined)
        {
            wordmeaning.example = ''
        }

        document.querySelector('#search-word').innerText = data[0].word;
        document.querySelector('#phonetics').innerText = phonetics;
        document.querySelector('#meaning').innerText = wordmeaning.definition;
         document.querySelector('#example').innerText = wordmeaning.example;
        synonyms  = wrapper.querySelector('.info-part #syno');
        synonyms.innerText = " ";

        var flag = 0;
        for(let i=0; i < Object.keys(data[0]).length; i++)
        {
            for (let j=0;j<Object.keys(data[i].phonetics).length; j++)
            {
                if(data[i].phonetics[j].audio == undefined || data[i].phonetics[j].audio== '' )
                {
                    continue;
                }
                else
                {
                    
                    audio = new Audio(data[i].phonetics[j].audio);
                    flag = 1;
                    break;
                    // audio = new Audio("https:"+data[i].phonetic[j].audio);
                }
            }
            if(flag==1)
            {
                break;
            }
        }
        // phonetics

        console.log("Audio Link: ",audio);

        for(let i=0;i<5;i++)
        {
            if((data[0].meanings[0].synonyms[i]) == undefined)
            {
                break;
                // document.querySelector('#syn').classList.add('display-none');
            }
            else
            {
                let tag = `<span id="syno" class="meaning-text underline">${data[0].meanings[0].synonyms[i]}, </span>`;
                synonyms.insertAdjacentHTML("beforeend",tag);
            }
        }

        console.log(data);
    }
}

function fetchData(data)
{
    // infoText.style.color = '#fff';
  wrapper.classList.remove("active");
  infoText.innerHTML = `Searching the meaning of <span>"${data}"</span>`;
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${data}`;
  fetch(url).then(res => res.json()).then(result => buildData(result,data));
}

volumeIcon.addEventListener('click',()=>{
    audio.play();
    // volumeIcon.style.color = $secondry-color-dark-hover;
})

search.addEventListener('keyup',e=>{
    if(e.key==="Enter" && e.target.value)
    {     
        wrapper.classList.remove("active");
        fetchData(e.target.value);
    }
    if(e.target.value!='')
    {
        removeIcon.style.display = "block";
    }
    if(e.target.value=='')
    {
        removeIcon.style.display = "none";
    }
    
})

removeIcon.addEventListener('click',()=>{
    search.value = "";
    wrapper.classList.remove("active");
    removeIcon.style.display = "none";
    search.focus();
    infoText.innerText = `Type a word and press enter to search its meaning.`;
})

