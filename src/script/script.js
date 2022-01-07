class dutiesList{
    constructor(textValue, boolean){
        this.value = textValue;
        this.boolean = boolean;
    }
}

const duties = [];
const newList = document.querySelector(".add-to-list > input");
const listContainer = document.querySelector(".list");

let listNum = 0;

function getDuties(){
    let dutiesListValue = JSON.parse(localStorage.getItem("listValue"));
    let dutiesListBoolean = JSON.parse(localStorage.getItem("listBoolean"));

    for (let i in dutiesListValue){
        let value = dutiesListValue[i];
        let bool = dutiesListBoolean[i];
        addToList(value, bool);

        // checkbox
        const checkBox = document.querySelectorAll(".list-button > input");
        if (bool == true){
            checkBox[i].setAttribute("checked", "true");
        }
    }
}

newList.addEventListener('keydown', key => {
    if (key.key == 'Enter'){
        addToList();
    }
})

function addToList(newListValue = newList.value, boolean = false){
    duties[listNum] = new dutiesList(newListValue, boolean);
    save(listNum);

    listNum ++;

    const newListSect = document.createElement("div");
    newListSect.id = `list-${listNum}`;
    newListSect.innerHTML = `<div class="list-text">${newListValue}</div>
    <div class="list-button">
        <input class="list-check" type="checkbox" onclick="toDoList(${listNum})">
        <button class="list-edit" onclick="editList(${listNum})"><i class="fas fa-edit"></i></button>
        <button class="list-delete" onclick="deleteList(${listNum})"><i class="fas fa-trash-alt"></i></button>
    </div>`;

    listContainer.appendChild(newListSect);
}

function toDoList(item){
    if (duties[item - 1].boolean == false){
        duties[item - 1].boolean = true;
    } else {
        duties[item - 1].boolean = false;
    }
    save((item-1));
}

function deleteList(item){
    listContainer.removeChild(document.getElementById(`list-${item}`));
    duties.splice((item-1),1);
    listNum --;
    changeAttributeId();
    localStorage.clear();
    for(let i = 0; i < duties.length; i ++){
        save(i);
    }
}

function changeAttributeId(){
    function attribute(inputF, value1, value2){
        for (let i = 0; i < inputF.length; i++){
            inputF[i].setAttribute(value1, value2 + "(" + (i+1) + ")");
        }
    }

    const listCheck = document.querySelectorAll(".list-check");
    attribute(listCheck, "onclick", "toDoList");

    const listDelete = document.querySelectorAll(".list-delete");
    attribute(listDelete, "onclick", "deleteList");

    const listEdit = document.querySelectorAll(".list-edit");
    attribute(listEdit, "onclick", "editList");

    const list = document.querySelectorAll(".list > div");
    for (let i = 0; i < list.length; i++){
        list[i].id = `list-${(i+1)}`;
    }
}

function editList(item){
    const newInput = document.createElement("input");
    newInput.setAttribute("placeholder", "مقدار جدید را وارد کرده و اینتر را بزنید");
    const list = document.querySelector(`#list-${item}`);
    const listText = document.querySelectorAll(".list-text")[item-1];
    list.replaceChild(newInput, listText);

    newInput.addEventListener('keydown', key => {
        if (key.key == 'Enter'){
            duties[item - 1].value = newInput.value;
            save((item-1));

            const newListText = document.createElement("div");
            newListText.classList.add("list-text");
            newListText.innerHTML = newInput.value;

            list.replaceChild(newListText, newInput);
        }
    })

}

function filterSearch(){
    const filterValue = document.querySelector(".filter > select").value;
    const searchValue = document.querySelector(".search-input > input").value;
    const list = document.querySelectorAll(".list > div");
    list.forEach(item => item.classList.add("hidden"));
    const listSearch = [];

    if (filterValue == "all"){
        list.forEach((item, index) => {            
            if (duties[index].value.includes(searchValue)){
                listSearch.push(index);
            }
        })
    } else if (filterValue == "done") {
        duties.filter((item, index) => {
            if (item.boolean == true){
                if (item.value.includes(searchValue)){
                    listSearch.push(index);
                }
            }
        })
    } else {
        duties.filter((item, index) => {
            if (item.boolean == false){
                if (item.value.includes(searchValue)){
                    listSearch.push(index);
                }
            }
        })
    }
    listSearch.filter(item => list[item].classList.remove("hidden"));
}

// save information
function save(){
    const listArray = [];
    const listBoolean = [];
    for (let i of duties){
        listArray.push(i.value);
        listBoolean.push(i.boolean);
    }
    localStorage.setItem("listValue", JSON.stringify(listArray));
    localStorage.setItem("listBoolean", JSON.stringify(listBoolean));
}