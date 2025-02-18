const tasksContainer = document.getElementById("tasks-container");
const addTodoBtn = document.getElementById("add-task-btn");
const input = document.getElementById("task-input");

let taskArray;
let tasksInLocalStorage = JSON.parse(localStorage.getItem("taskArray"));

// checking if local storage empty
if (tasksInLocalStorage) {
  taskArray = tasksInLocalStorage;
  rendertask(taskArray);
} else {
  taskArray = [];
}

// render todos function
function rendertask(tasks) {
  tasks.forEach((task, currentIndex) => {
    // creating todo item and appending it to taskContainer
    let li = document.createElement("li");
    tasksContainer.appendChild(li);

    // creating content part inside li
    let contentDiv = document.createElement("div");
    contentDiv.setAttribute("class", "task-content");

    li.appendChild(contentDiv);

    //creating div for updating task status
    let statusDiv = document.createElement("div");
    statusDiv.setAttribute("class", "task-status-icon");
    statusDiv.setAttribute("data-status", "false");

    contentDiv.appendChild(statusDiv);

    // creating task details div
    let detailsDiv = document.createElement("div");
    detailsDiv.setAttribute("class", "task-details");

    contentDiv.appendChild(detailsDiv);

    // creating task name and task time div
    let taskNameDiv = document.createElement("div");
    taskNameDiv.setAttribute("class", "task-name");
    taskNameDiv.innerText = task;

    detailsDiv.appendChild(taskNameDiv);

    let taskTimeDiv = document.createElement("div");
    taskTimeDiv.setAttribute("class", "task-time");
    taskTimeDiv.innerText = getFormattedDate();

    detailsDiv.appendChild(taskTimeDiv);

    // creating controls part
    let controlsDiv = document.createElement("div");
    controlsDiv.setAttribute("class", "task-controls");

    li.appendChild(controlsDiv);

    // creating icon for delete
    let deleteIcon = document.createElement("img");
    deleteIcon.setAttribute("src", "./assets/delete.svg");

    deleteIcon.addEventListener("click", () => {
      tasksContainer.removeChild(li);
      taskArray.splice(currentIndex, 1);
      localStorage.setItem("taskArray", JSON.stringify(taskArray));
    });

    controlsDiv.appendChild(deleteIcon);

    // creating icon for edit
    let editIcon = document.createElement("img");
    editIcon.setAttribute("src", "./assets/edit.svg");

    editIcon.addEventListener("click", () => {
      taskNameDiv.contentEditable = true;
      taskNameDiv.focus();

      editIcon.style.display = "none";

      let saveIcon = document.createElement("img");
      saveIcon.setAttribute("src", "./assets/save.svg");
      controlsDiv.appendChild(saveIcon);

      saveIcon.addEventListener("click", () => {
        let modifiedText = taskNameDiv.innerText.trim();
        taskArray.splice(currentIndex, 1, modifiedText);
        taskNameDiv.contentEditable = false;
        taskNameDiv.innerText = modifiedText;
        controlsDiv.removeChild(saveIcon);
        editIcon.style.display = "inline";
        localStorage.setItem("taskArray", JSON.stringify(taskArray));
      });
    });

    controlsDiv.appendChild(editIcon);

    // updating todo status
    statusDiv.addEventListener("click", () => {
      if (statusDiv.dataset.status === "false") {
        statusDiv.dataset.status = "true";
        let statusIcon = document.createElement("img");
        statusIcon.setAttribute("src", "./assets/check.svg");
        statusDiv.appendChild(statusIcon);
        statusDiv.style.border = "none";
        statusDiv.style.backgroundColor = "#07bc0c";
        taskNameDiv.style.textDecoration = "line-through";
        taskNameDiv.style.color = "gray";
      } else {
        statusDiv.dataset.status = "false";
        statusDiv.innerHTML = "";
        statusDiv.style.border = "1px solid #808080";
        statusDiv.style.backgroundColor = "#fff";
        taskNameDiv.style.textDecoration = "none";
        taskNameDiv.style.color = "black";
      }
    });
  });
}

// rendering local storage tasks

addTodoBtn.addEventListener("click", () => {
  // alert if input is empty
  if (input.value === "") {
    alert("Enter your task first");
    return;
  }

  // if task is not empty push it in array
  taskArray.push(input.value.trim());
  localStorage.setItem("taskArray", JSON.stringify(taskArray));

  tasksContainer.innerHTML = "";

  rendertask(taskArray);

  // clearing input val after appending
  input.value = "";
});

// clear all todos fn
let clearBtn = document.getElementById("clear-tasks-btn");
clearBtn.addEventListener("click", () => {
  tasksContainer.innerHTML = "";
  taskArray = [];
  localStorage.clear();
});

//  fn to get current time and date
function getFormattedDate() {
  const now = new Date();

  // formatted time
  const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };
  const time = now.toLocaleTimeString("en-US", timeOptions);

  //  formatted date
  const dateOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
  const date = now.toLocaleDateString("en-GB", dateOptions).replace(/\//g, "/");

  return `${time}, ${date}`;
}
