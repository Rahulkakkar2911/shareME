const alertBox = document.querySelector('.alert');
const dropzone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('.file-input');
const browseBtn = document.querySelector('.browse-btn');
const bgProgress = document.querySelector('.bg-progress');
const percentageSpan = document.querySelector('.percent-num');
const progressBar = document.querySelector('.progress-bar');
const progressContainer = document.querySelector('.progress-container');
const shareContainer = document.querySelector('.share-container');
const fileURLInput = document.querySelector('.input-container input');
const copyBtn = document.querySelector('.input-container span');
const emailForm = document.querySelector('#email-form');
const emailcontainer = document.querySelector('.email-container');
const emailBtn = document.querySelector('.email-btn');
const QRBtn = document.querySelector('.QR-btn');
const modal = document.querySelector('.modal');
const modalCloseBtn = document.querySelector('.close-btn-qr');
const qrContainer = document.querySelector('.qr-container');
const qrImg = document.querySelector('.qr-img-container img');
const themebtn = document.querySelector('.switch-theme');
const themeIcon = document.querySelector('.switch-theme span')
const themeSwitchCss = document.querySelector('#theme_switcher');

let fileLink = "";
let currentTheme = localStorage.getItem('theme') || localStorage.setItem('theme', 'light_mode');

window.addEventListener('load', ()=>{
    let currentTheme = localStorage.getItem('theme');
    if(currentTheme === 'light_mode'){
        themeIcon.innerText = 'dark_mode';
        themeSwitchCss.href = "#";
    }
    else if(currentTheme === 'dark_mode'){
        themeIcon.innerText = 'light_mode';
        themeSwitchCss.href = "css/styledark.css";
    }
})


const storeLocalTheme = (theme) => {
    localStorage.setItem("theme", theme);
}

const changeTheme = (theme) => {
    if(theme === "light_mode"){
        currentTheme = 'dark_mode';
        storeLocalTheme('dark_mode');
        themeIcon.innerText = 'light_mode';
        themeSwitchCss.href = "css/styledark.css";
    }
    else if(theme === "dark_mode"){
        currentTheme = 'light_mode';
        storeLocalTheme('light_mode');
        themeIcon.innerText = 'dark_mode';
        themeSwitchCss.href = "#";
    }
}

// setTheme(currentTheme);

themebtn.addEventListener('click', ()=>{
    changeTheme(currentTheme);
})
modalCloseBtn.addEventListener('click', ()=>{
    
    qrContainer.classList.remove('popin');
    setTimeout(() => {
        modal.classList.add('hide');
    }, 600);
})

dropzone.addEventListener('dragover', (e) => {
    //preventing default download
    e.preventDefault();
    if(!dropzone.classList.contains('.dragged'))
        dropzone.classList.add('dragged');
});
dropzone.addEventListener('dragleave', (e) => {
    if(dropzone.classList.contains('dragged'))
        dropzone.classList.remove('dragged');
});

const host = `https://rocky-bayou-91584.herokuapp.com`;
const uploadURL = `${host}/api/files`;
const emailURL = `${host}/api/files/send`;
dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    if(dropzone.classList.contains('dragged'))
        dropzone.classList.remove('dragged');
    const files = e.dataTransfer.files;
    //agar koi file h to hi upload kr
    if(files.length){
        fileInput.files = files;
        uploadFile();
    }
});
browseBtn.addEventListener('click', (e) => {
    //adding add files input functionality without form element
    fileInput.click();
})

const uploadFile = () => {
    progressContainer.style.display = 'block';
    //selecting 1st file only;
    const file = fileInput.files[0];
    //creating form data without form element
    const formData = new FormData();
    //formdata being populated with name / value pair
    formData.append("myfile", file);
    // creating xhr request to the server for posting the file
    const xhr = new XMLHttpRequest();
    //when file is uploaded finsish stop 
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            onUploadSuccess(JSON.parse(xhr.response));
        }
    }
    xhr.upload.onerror = () => {
        fileInput.value = "";
        showAlert(`Error, Please try Again!`,false);
        setTimeout(()=>{
            location.reload();
        },2500);
    }
    //fired when there is a change in upload progress
    xhr.upload.onprogress = uploadProgress;
    xhr.open("POST", uploadURL);
    xhr.send(formData);
}
//browse se add krne pe upload file call hojaega
fileInput.addEventListener('change', uploadFile);
const uploadProgress = (e) => {
    // calculating percentage for progress bar
    const percent = Math.round((e.loaded / e.total) * 100);
    //updating the width to make progress bar
    bgProgress.style.width = `${percent}%`;
    percentageSpan.innerHTML = percent;
    progressBar.style.width = `${percent}%`;
}
const onUploadSuccess = ({file:url}) => {
    fileInput.value = "";
    emailForm[2].removeAttribute("disabled");
    shareContainer.style.display = "block";
    fileURLInput.value = url;
    //reset
    bgProgress.style.width = `${0}%`;
    percentageSpan.innerHTML = 0;
    progressBar.style.width = `${0}%`;
    fileLink = url;
    progressContainer.style.display = "none";
}
//copy to clipboard
copyBtn.addEventListener('click', () => {
    fileURLInput.select();
    document.execCommand("copy");
    showAlert("Copied to Clipboard", true);
});
emailForm.addEventListener('submit',async (e) => {
    //prevent reloading
    e.preventDefault();
    const url = fileURLInput.value;

    const formData = {
        uuid: url.split("/").splice(-1, 1)[0],
        emailTo:emailForm.elements["to-email"].value,
        emailFrom:emailForm.elements["from-email"].value,
    }
    console.table(formData);

    if(!formData.uuid || !formData.emailTo || !formData.emailFrom){
        e.preventDefault();
        showAlert("All fields are required!", false);
        return;
    }
    //form data is valid
    const response = await fetch(emailURL, {
        method:"POST",
        headers: {
            "content-Type" : "application/json"
        },
        body : JSON.stringify(formData)
    });
    emailForm[2].setAttribute("disabled", "true");
    const result = await response.json();
    if(result.success){
        shareContainer.style.display = "none";
        showAlert('Email Sent!' ,true);
    }
})
let alertTimer;
const showAlert = (message, success) => {
    if(success === true)
    {   
        if(currentTheme === "dark_mode"){
            alertBox.style.backgroundColor = `#646FD4`;
        }
        else{
           alertBox.style.backgroundColor = `#83BD75`;
        }
    }
    else{
        alertBox.style.backgroundColor = "#EB5353";
    }
    alertBox.innerText = message;
    alertBox.style.transform = "translate(-50%, 0px)";
    clearTimeout(alertTimer);
    alertTimer = setTimeout(() => {
    alertBox.style.transform = "translate(-50%, -60px)";
    },2000)
}
QRBtn.addEventListener('click', () => {
    emailcontainer.style.display = "none";
    if(fileLink === ""){
        return;
    }
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${fileLink}`;
    modal.classList.remove('hide');
    qrImg.addEventListener('load', ()=>{
        qrContainer.classList.add('popin');
    });
});
emailBtn.addEventListener('click', () => {
    emailcontainer.style.display = "flex";
});