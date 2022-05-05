const dropzone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('.file-input');
const browseBtn = document.querySelector('.browse-btn');
const bgProgress = document.querySelector('.bg-progress');
const percentageSpan = document.querySelector('.percent-num');
const progressBar = document.querySelector('.progress-bar');
const progressContainer = document.querySelector('.progress-container');
const shareContainer = document.querySelector('.share-container');
const fileURLInput = document.querySelector('.input-container input');
const copyBtn = document.querySelector('.input-container img');
const emailForm = document.querySelector('#email-form');

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

const host = `http://localhost:8000`;
const uploadURL = `${host}/api/files`;
const emailURL = `${host}/api/files/send`;
dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    if(dropzone.classList.contains('dragged'))
        dropzone.classList.remove('dragged');
    const files = e.dataTransfer.files;
    console.log(files);
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
    progressContainer.style.display = "none";
}
//copy to clipboard
copyBtn.addEventListener('click', () => {
    fileURLInput.select();
    document.execCommand("copy");
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
    emailForm[2].setAttribute("disabled", "true");
    // console.table(formData);
    const response = await fetch(emailURL, {
        method:"POST",
        headers: {
            "content-Type" : "application/json"
        },
        body : JSON.stringify(formData)
    });
    const {success} = await response.json();
    if(success){
        shareContainer.style.display = "none";
    }
})

