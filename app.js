// Wait for the document to load
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("filterDate").valueAsDate = new Date(); // Set today's date in filter
  checkDateAndResetPoints(); // Check if points need resetting
  loadTasks();
  updateProgress();
  updatePointsDisplay();
  applyTheme(); // Apply saved theme
});

// Function to check date and reset points if the day changes
function checkDateAndResetPoints() {
  let lastDate = localStorage.getItem("lastDate");
  let today = new Date().toISOString().split("T")[0];
  
  if (lastDate !== today) {
      localStorage.setItem("points", JSON.stringify(0)); // Reset points
      localStorage.setItem("lastDate", today); // Update last saved date
  }
}

function addTask() {
  let taskInput = document.getElementById("taskInput");
  let taskText = taskInput.value.trim();
  if (taskText === "") {
      alert("Please add a task");
      return;
  }

  let taskDate = new Date().toISOString().split("T")[0];
  let task = { text: taskText, date: taskDate, completed: false }; 

  // ✅ Fix: पहले localStorage से Tasks लाओ
  let tasks = JSON.parse(localStorage.getItem("tasks")) || []; 

  // ✅ Fix: अब सही से Push करो
  tasks.push(task); 
  localStorage.setItem("tasks", JSON.stringify(tasks));

  displayTask(task); // ✅ Task Show करो
  taskInput.value = "";
  updateProgress();
}


function displayTask(task) {
  let taskList = document.getElementById("taskList");
  let li = document.createElement("li");
  li.setAttribute("data-date", task.date);
  li.classList.toggle("completed", task.completed);
  li.innerHTML = `
      <span>${task.text} (${task.date})</span>
      <div>
          <button class="edit-btn" onclick="editTask(this)">Edit</button>
          <button class="complete-btn" onclick="completeTask(this)">✔</button>
          <button class="delete-btn" onclick="deleteTask(this)">✖</button>
      </div>
  `;
  taskList.appendChild(li);
  setTimeout(() => li.classList.add("visible"), 100); 
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  document.getElementById("taskList").innerHTML = ""; // Clear list
  tasks.forEach(displayTask);
  updateProgress();
}

function completeTask(button) {
  let li = button.parentElement.parentElement;
  let taskText = li.querySelector("span").textContent.split(" (")[0];

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let task = tasks.find(task => task.text === taskText);

  if (task) {
      task.completed = !task.completed; // Status toggle करो
      // console.log("Task Status:", task.completed); // Debugging के लिए
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  //  Check करें कि class लग रही है या नहीं
  li.classList.toggle("completed", task.completed);
  // console.log("Class Applied:", li.classList.contains("completed")); // Debugging के लिए

  updatePoints(task.completed);
  updateProgress();
}



function deleteTask(button) {
  let li = button.parentElement.parentElement;
  let taskText = li.querySelector("span").textContent.split(" (")[0];
  
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  li.remove();
  updateProgress();
  updatePointsDisplay();
}

function updatePoints(isCompleted) {
  let points = JSON.parse(localStorage.getItem("points")) || 0;
  if (isCompleted) {
      points += 1;
  } else {
      points -= 1;
  }
  localStorage.setItem("points", JSON.stringify(points));
  updatePointsDisplay();
}

function updatePointsDisplay() {
  let points = JSON.parse(localStorage.getItem("points")) || 0;
  document.getElementById("points").innerText = `Points: ${points}`;
  updateBadge(points);
}

function updateBadge(points) {
  let badge = "";
  if (points >= 20) {
      badge = "🏆 Pro Planner";
  } else if (points >= 10) {
      badge = "🥈 Task Master";
  } else if (points >= 5) {
      badge = "🥉 Beginner";
  }
  document.getElementById("badge").innerText = badge ? `Badge: ${badge}` : "";
}

function updateProgress() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let completedTasks = tasks.filter(task => task.completed).length;
  let totalTasks = tasks.length;
  let progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  document.getElementById("task-progress").value = progress;
  document.getElementById("progress-text").innerText = `${Math.round(progress)}%`;
}

function editTask(button) {
  let li = button.parentElement.parentElement;
  let span = li.querySelector("span");
  let oldText = span.textContent.split(" (")[0];
  let newText = prompt("Edit your task:", oldText);

  if (newText !== null && newText.trim() !== "") {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      let task = tasks.find(task => task.text === oldText);
      if (task) {
          task.text = newText;
      }
      localStorage.setItem("tasks", JSON.stringify(tasks));
      span.textContent = `${newText} (${li.getAttribute("data-date")})`;
  }
}

function filterTasks() {
  let selectedDate = document.getElementById("filterDate").value;
  let tasks = document.querySelectorAll("#taskList li");
  
  tasks.forEach(task => {
      task.style.display = task.getAttribute("data-date") === selectedDate ? "flex" : "none";
  });
}

// Dark Mode Toggle
function toggleTheme() {
  let body = document.body;
  body.classList.toggle("dark-mode");
  let theme = body.classList.contains("dark-mode") ? "dark" : "light";
  localStorage.setItem("theme", theme);
  applyTheme();
}

function applyTheme() {
  let savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      document.body.style.transition = "background 0.5s ease-in-out, color 0.5s ease-in-out";
  } else {
      document.body.classList.remove("dark-mode");
      document.body.style.transition = "background 0.5s ease-in-out, color 0.5s ease-in-out";
  }
}

function sendReminder() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let pendingTasks = tasks.filter(task => !task.completed).length;

  if (pendingTasks > 0) {
      alert(`⚠️ Reminder: You have ${pendingTasks} pending tasks!`);
  }
}

// Set reminder every 1 hour
setInterval(sendReminder, 60 * 60 * 1000);

