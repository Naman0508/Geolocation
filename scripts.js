let ip;
async function getIP(){
    let response=await fetch("https://api.ipify.org/?format=json");
    let data=await response.json();
    return data
}

async function showIP(){
    ip=await getIP();
    let span=document.querySelector("#ip-container span")
    let span1=document.querySelector("h2 span")
    span1.innerText=ip.ip;
    console.log(ip)
    span.innerText=ip.ip;
}

showIP();

const buttons=document.getElementsByTagName("button")
buttons[0].addEventListener("click",()=>{
    let div=document.getElementById("ip-container")
    div.style.display='none';
    let container=document.getElementById("container")
    container.style.display='block';
    getData();
})

let postoffice;

async function getData(){
    let response=await fetch("https://ipinfo.io/49.36.209.240?token=e47c09e72dd0b3")
    let data=await response.json();
    console.log(data)
    console.log(data.loc);
    let spans=document.querySelectorAll("#show-info span")
    let location=data.loc.split(',');
    spans[0].innerText=location[0];
    spans[1].innerText=data.city;
    spans[2].innerText=data.org;
    spans[3].innerText=location[1];
    spans[4].innerText=data.region;
    spans[5].innerText=data.hostname;

    let iframe=document.getElementsByTagName('iframe')[0];
    iframe.src=`https://maps.google.com/maps?q=${location[0]}, ${location[1]}&output=embed`

    let tdpm=document.querySelectorAll("#tdpm span");
    tdpm[0].innerText=data.timezone;
    let datentime = new Date().toLocaleString("en-US", { timeZone: `${data.timezone}` });
    tdpm[1].innerText=datentime;
    tdpm[2].innerText=data.postal;


    let postalData=await getPostalData(data.postal);
    console.log(postalData)
    tdpm[3].innerText=postalData[0].Message;
    console.log(postalData[0].PostOffice)
    postoffice=postalData[0].PostOffice;
    displayPostOffice(postalData[0].PostOffice)
}


async function getPostalData(pincode){
    let response=await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    let data=await response.json();
    return data;
}


function displayPostOffice(data){
    let div=document.getElementById("postOffice")
    div.innerHTML="";
    for(let i=0;i<data.length;i++){
        let container=document.createElement("div")
        container.id="item-container"
        container.innerHTML=`<div>Name: ${data[i].Name}</div>
                            <div>Branch Type: ${data[i].BranchType}</div>
                            <div>Delivery Status: ${data[i].DeliveryStatus}</div>
                            <div>District: ${data[i].District}</div>
                            <div>Division: ${data[i].Division}</div>`
        div.append(container);    
    }                
}


let input=document.getElementsByTagName("input")[0];
input.addEventListener("input",()=>{
    let div=document.getElementById("postOffice")
    let str=input.value.toLowerCase();
    let data=[];
    for(let i=0;i<postoffice.length;i++){
        if(postoffice[i].Name.toLowerCase().startsWith(str) || postoffice[i].BranchType.toLowerCase().startsWith(str)){
            data.push(postoffice[i])
        }
    }
    if(data.length==0){
        div.innerHTML=`<h1 id="no-post">No Post-Office Found!!</h1>`
    }else{
        displayPostOffice(data);
    }
    
    
})