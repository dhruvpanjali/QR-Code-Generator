
let url = 'https://api.qrserver.com/v1/create-qr-code/?data=';
let form = document.querySelector("form");

async function getData(url){
    try{
        const config = { headers: {Accept : "image/png"}};
        let response = await axios.get(url, config);
        return response.config.url;
    }
    catch(error){
        console.error('Error:', error);
    }
}
async function getQR(QrUrl){
    try{
        const config = {responseType: "blob"};
        let response = await axios.get(QrUrl, config);
        return response.data;
    }
    catch(error){
        console.error('Error:', error);
    }
}

function ColorChangeValue() {

    let warning = document.querySelector("p");
    let qrColor = document.querySelector("#qr-color");
    let bgColor = document.querySelector("#bg-color");

    qrColor.addEventListener("change", ()=>{
        warning.classList.remove("warn-anim");
        let color = qrColor.value;
        let bgcolor = bgColor.value;
        checkCombo(color, bgcolor);
    });

    bgColor.addEventListener("change", ()=>{
        warning.classList.remove("warn-anim");
        let color = qrColor.value;
        let bgcolor = bgColor.value;
        checkCombo(color, bgcolor);
    });
}

function checkCombo(color, bgcolor) {
    let warning = document.querySelector("p");
    warning.classList.remove("warn-anim");

    if (color == bgcolor || (color == 'FFFF00' && bgcolor == 'FFFFFF')) {
        warning.innerText = "Combination must have contrast!";
        warning.classList.add("warn-anim");
    }
    else {
        let warning = document.querySelector("p");
        warning.innerText = "";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    ColorChangeValue();
});

let generateButton = document.querySelector('.generate-btn');
let heroSec = document.querySelector('.hero-container');
let heroCont = document.querySelector('.qr-generate');

let heroLeftPart = document.querySelector(".left-part");
let heroRightPart = document.querySelector(".right-part");

let qrImage = document.querySelector(".qr-img");
let inpLink = document.querySelector(".link");
let colorComboWarning = document.querySelector(".warning");

heroRightPart.style.display = "none";
heroLeftPart.style.width = "75%";

if(window.innerWidth <= 768){
    heroLeftPart.style.width = "90%";
    colorComboWarning.style.fontSize = "1rem";
}

let genr = false;
let windowresize = false;

function check(){
    if(window.innerWidth >= 768){
        if(windowresize == true && genr == true){
            heroSec.style.height = "85vh";
            heroCont.style.flexDirection = "row";
            heroLeftPart.style.width = "60%";
        }
    }else{
        if(genr == true){
            heroCont.style.flexDirection = "column";
            heroSec.style.height = "130vh";
            heroLeftPart.style.width = "90%";
        }
    }
    if(window.innerWidth >= 768){
        if(genr == true){
            heroRightPart.style.width = "40%";
        }
    }
}

generateButton.addEventListener('click', function() {
    
    if(inpLink.value != ""){
        heroRightPart.style.display = "";
        genr = true;
    } 
    check();
});

window.addEventListener('resize', function() {
    windowresize = true;
    check();
});

let warning2 = document.createElement("h4");
warning2.classList.add("inputWarning");
warning2.innerText = "Must enter to continue";

function gradientChange(color){
    if(color == "FF0000"){
        heroSec.style.setProperty("background", `linear-gradient(#6528F7 30%, #FF0000 100%)`);
    }else if(color == "008000"){
        heroSec.style.setProperty("background", `linear-gradient(#6528F7 30%, #008000 100%)`);
    }else if(color == "0000FF"){
        heroSec.style.setProperty("background", `linear-gradient(#6528F7 30%, #0000FF 100%)`);
    }else if(color == "FFFF00"){
        heroSec.style.setProperty("background", `linear-gradient(#6528F7 30%, #FFFF00 100%)`);
    }else if(color == "000000"){
        heroSec.style.setProperty("background", `linear-gradient(#6528F7 30%, #000000 100%)`);
    }else{
        heroSec.style.setProperty("background", `linear-gradient(#6528F7 30%, #FFFFFF 100%)`);
    }
}

function formTransition(){
    return new Promise((resolve, reject) =>{
        heroLeftPart.transition = "all 0.5s linear 0s";
        heroLeftPart.style.width = "70%";

        if(window.innerWidth <= 768){
            heroLeftPart.style.width = "90%";
            heroRightPart.style.width = "80%";
        }
        resolve();
    });
}

function qr_transition(){
    return new Promise((resolve, reject) =>{
        let qr_Div = document.querySelector(".right-part");

        qr_Div.style.width = "50%";
        qr_Div.style.transition = "all 0.8s linear 0s";
        qr_Div.style.opacity = "1";
        resolve();
    }); 
}

function downBtnTransition(){
    return new Promise((resolve, reject) =>{
        let downl_btn = document.querySelector(".download-btn");

        downl_btn.style.transition = "opacity 0.8s linear 0s";
        downl_btn.style.opacity = "1";
        resolve();
    }); 
}

form.addEventListener("submit", async(event)=>{
    
    event.preventDefault();
    let inputLink = form.elements[0];
    warning2.remove();

    if(inputLink.value != ""){
        let inputColor = form.elements[1];
        let inputBgColor = form.elements[2];
        
        let request = url+inputLink.value+"&color="+inputColor.value+"&bgcolor="+inputBgColor.value+"&qzone=1"+"&size=500x500";
        let responseUrl = await getData(request);

        try{
            await formTransition();
            await qr_transition();
            await downBtnTransition();
        }
        catch{
            console.log("error occured");
        }

        let image = document.querySelector("img");
        image.setAttribute("src", responseUrl);
        image.style.display = "block";
        
        image.classList.add("qr-img");

        const responseQr = await getQR(responseUrl);
        let img_link = URL.createObjectURL(responseQr);   

        let download_link = document.querySelector(".download-btn a");

        setTimeout(()=>{
            download_link.href = img_link;
            download_link.download = "QrCode.png";

            let qr_img = document.querySelector("img");
            qr_img.style.transition = "box-shadow 0.3s linear 0s";
            qr_img.style.boxShadow = "0 0rem 2rem rgba(0, 0, 0, 0.425)";
            gradientChange(inputColor.value);
        }, 200);
    }
    else{
        form.elements[0].insertAdjacentElement("afterend", warning2);
    }
});

