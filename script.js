const list = document.getElementById("list");
const newElement = document.getElementById("newElement");
const doneButton = document.getElementById("doneButton");
const notDoneButton = document.getElementById("notDoneButton");
const allButton = document.getElementById("allButton");
const doneCount = document.getElementById("doneCount");
const notDoneCount = document.getElementById("notDoneCount");
const allCount = document.getElementById("allCount");

let elements = JSON.parse(localStorage.getItem("elements")) || [];
let filter = "all";

function addElement() {
    const name = newElement.value.trim();
    if (name === "") return;
    const id = Date.now().toString();
    const element = { id, name, completed: false };
    elements.push(element);
    list.appendChild(createElement(element));
    newElement.value = "";
    saveElements();
    updateCounts();
}

function removeElement(id) {
    const element = document.getElementById(id);
    list.removeChild(element);
    elements = elements.filter(e => e.id !== id);
    saveElements();
    updateCounts();
}

function completeElement(id) {
    const element = elements.find(e => e.id === id);
    element.completed = !element.completed;
    const text = document.getElementById(id + "Text");
    const checkbox = document.getElementById(id);
    text.style.textDecoration = element.completed ? "line-through" : "none";
    checkbox.checked = element.completed;
    if (filter === "done" && !element.completed ||
        filter === "notDone" && element.completed) {
        list.removeChild(text.parentNode);
    } else {
        text.parentNode.classList.toggle("completed", element.completed);
    }
    saveElements();
    updateCounts();
}

function createElement(element) {
    const li = document.createElement("li");
    li.id = element.id;
    li.classList.add("element");
    li.classList.toggle("completed", element.completed);
    li.innerHTML = `
        <input type="checkbox" id="${element.id}" onclick="completeElement('${element.id}')">
        <span id="${element.id}Text">${element.name}</span>
        <button onclick="removeElement('${element.id}')">X</button>
    `;
    const text = li.querySelector("span");
    const checkbox = li.querySelector("input[type='checkbox']");
    text.style.textDecoration = element.completed ? "line-through" : "none";
    checkbox.checked = element.completed;
    return li;
}

function saveElements() {
    localStorage.setItem("elements", JSON.stringify(elements));
}

function loadElements() {
    list.innerHTML = "";
    elements.forEach(element => {
        if (filter === "all" ||
            (filter === "done" && element.completed) ||
            (filter === "notDone" && !element.completed)) {
            list.appendChild(createElement(element));
        }
    });
    updateCounts();
}

function filterDone() {
    filter = "done";
    loadElements();
    doneButton.classList.add("active");
    notDoneButton.classList.remove("active");
    allButton.classList.remove("active");
}

function filterNotDone() {
    filter = "notDone";
    loadElements();
    doneButton.classList.remove("active");
    notDoneButton.classList.add("active");
    allButton.classList.remove("active");
}

function filterAll() {
    filter = "all";
    loadElements();
    doneButton.classList.remove("active");
    notDoneButton.classList.remove("active");
    allButton.classList.add("active");
}

function updateCounts() {
    doneCount.textContent = elements.filter(e => e.completed).length;
    notDoneCount.textContent = elements.filter(e => !e.completed).length;
    allCount.textContent = elements.length;
}

doneButton.addEventListener("click", filterDone);
notDoneButton.addEventListener("click", filterNotDone);
allButton.addEventListener("click", filterAll);
document.getElementById("addElement").addEventListener("click", addElement);

loadElements();