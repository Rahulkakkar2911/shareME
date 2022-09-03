const bodyEl = document.querySelector('body');
const appTitle = document.querySelector('.app-title');
const downloadContainer = document.querySelector('.download-container');
const downloadBtn = document.querySelector('.download-btn');

const switchTheme = function(cT){
    if(cT === 'dark_mode'){
        bodyEl.classList.add('dark');
        downloadBtn.classList.add('dark');
        downloadContainer.classList.add('dark');
        appTitle.classList.add('dark');
    }
    else{
        bodyEl.classList.remove('dark');
        downloadBtn.classList.remove('dark');
        downloadContainer.classList.remove('dark');
        appTitle.classList.remove('dark');
    }
}

let currentTheme = 'light_mode';
if(localStorage.theme){
    currentTheme = localStorage.getItem('theme');
    switchTheme(currentTheme);
}