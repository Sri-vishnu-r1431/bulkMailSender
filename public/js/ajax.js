let tenth = 0;
let twelfth = 0;
let community = "";
let Hosteler = "yes";
let Year = 1;
async function receiveData() {
    tenth = document.querySelector("#tenth").value;
    twelfth = document.querySelector("#twelfth").value;
    Hosteler = document.querySelector("#Hosteler").value;
    Year = document.querySelector("#Year").value;
    let feePending = document.querySelector("#feePending").value;
    let output = {}, res = {};
    let mailId = document.querySelector("#numMail");
    mailId = parseInt(mailId.textContent, 10);
    for (let i = 0; i < mailId; i++) {
        let mails = document.querySelector(".Mails");
        mails.parentElement.removeChild(mails);
    }
    community = document.querySelector("#community").value;
    document.querySelector("#to").value = "";
    console.log(community, " ", Year, " ", Hosteler, " ", feePending);
    await axios.get("http://localhost:3000/fe", { params: { tenth, twelfth, community, Hosteler, Year, feePending } })
        .then((res) => {
            output = res;
        })
        .catch((err) => {
            console.log(err);
        })
    let list = document.querySelector(".list");
    let mails = output.data;
    let str = "";
    for (let i = 0; i < mails.length; i++) {
        let div_ele = document.createElement('div');
        div_ele.classList.add("Mails");
        let para = document.createElement('p');
        para.innerText = mails[i].userEmail;
        div_ele.append(para);
        list.append(div_ele);
        str += mails[i].userEmail + " ";
    }
    document.querySelector("#to").value = str;
    document.querySelector("#numMail").textContent = mails.length;
}
let submit = document.querySelector("#query-btn");
submit.addEventListener("click", receiveData);

