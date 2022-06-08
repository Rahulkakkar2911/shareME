const themeSwitchLink = document.querySelector('#theme-switcher');

let currentTheme = 'light_mode';
if(localStorage.theme){
    currentTheme = localStorage.getItem('theme');

    if(currentTheme === 'dark_mode'){
        themeSwitchLink.href = `css/downloadStyledark.css`;
    }
    else{
        themeSwitchLink.href = `#`;
    }
}