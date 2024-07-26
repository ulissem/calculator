// Function to update labels dynamically based on their position
function updateLabels() {
  const containers = document.querySelectorAll("#inputContainer .container");
  containers.forEach((container, index) => {
    const label = container.querySelector("label");
    label.textContent = `Time ${index + 1}:`;
    label.setAttribute("for", `time${index + 1}`);
    const input = container.querySelector("input");
    input.setAttribute("id", `time${index + 1}`);
  });
}

// Function to add a new time input field
function addInput() {
  const container = document.createElement("div");
  container.className = "container";
  const inputCount = document.querySelectorAll(".time-input").length + 1;

  container.innerHTML = `
          <label for="time${inputCount}">Time ${inputCount}:</label>
          <input type="text" id="time${inputCount}" class="time-input" placeholder="hh:mm:ss,kkk or seconds" onblur="formatInput(this)" onclick="this.select()" value="00:00:00,000">
          <button type="button" class="delete-button" onclick="deleteInput(this)">&#10005;</button>
      `;

  document.getElementById("inputContainer").appendChild(container);
  updateLabels();
}

// Function to delete a time input field
function deleteInput(button) {
  const container = button.parentElement;
  container.remove();
  updateLabels();
}

// Helper function to format time into hh:mm:ss,kkk
function formatTime(hours, minutes, seconds, milliseconds) {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")},${String(milliseconds).padEnd(
    3,
    "0"
  )}`;
}

// Function to parse input time and convert to total milliseconds
function parseTime(input) {
  if (input.trim() === "") {
    return 0; // Return 0 milliseconds if input is empty
  }

  // Handle milliseconds input
  if (input.startsWith(".") || input.startsWith("0.")) {
    let milliseconds = parseFloat(input).toFixed(3).slice(2);
    return parseInt(milliseconds, 10);
  }

  // Handle pure seconds input
  if (!input.includes(":") && !input.includes(".") && !input.includes(",")) {
    return parseFloat(input) * 1000; // Convert seconds to milliseconds
  }

  // Standardize input
  input = input.replace(",", ".");

  // Split input by ":"
  const parts = input.split(":");
  let days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0;

  // Check the length of parts
  if (parts.length === 4) {
    // If there are four parts, treat as days, hours, minutes, seconds
    days = parseInt(parts[0], 10) || 0; // Get days
    hours = parseInt(parts[1], 10) || 0; // Get hours
    minutes = parseInt(parts[2], 10) || 0; // Get minutes
    seconds = parseInt(parts[3].split(".")[0], 10) || 0; // Get seconds
    milliseconds = parts[3].split(".")[1]
      ? parseInt(parts[3].split(".")[1], 10)
      : 0; // Get milliseconds
  } else if (parts.length === 3) {
    // If there are three parts, treat as hours, minutes, seconds
    hours = parseInt(parts[0], 10) || 0; // Get hours
    minutes = parseInt(parts[1], 10) || 0; // Get minutes
    seconds = parseInt(parts[2].split(".")[0], 10) || 0; // Get seconds
    milliseconds = parts[2].split(".")[1]
      ? parseInt(parts[2].split(".")[1], 10)
      : 0; // Get milliseconds
  } else if (parts.length === 2) {
    // If there are two parts, treat as minutes, seconds
    minutes = parseInt(parts[0], 10) || 0; // Get minutes
    seconds = parseInt(parts[1].split(".")[0], 10) || 0; // Get seconds
    milliseconds = parts[1].split(".")[1]
      ? parseInt(parts[1].split(".")[1], 10)
      : 0; // Get milliseconds
  } else {
    // Default case (for seconds only)
    seconds = parseInt(parts[0], 10) || 0;
    milliseconds = parts[0].split(".")[1]
      ? parseInt(parts[0].split(".")[1], 10)
      : 0;
  }

  // Convert all time to milliseconds
  return (
    (days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds) * 1000 +
    milliseconds
  );
}

// Updated formatInput function to use the new formatTime function
function formatInput(input) {
  const timeInMilliseconds = parseTime(input.value);
  const totalDays = Math.floor(timeInMilliseconds / 86400000); // 24 * 60 * 60 * 1000
  const remainingHours = Math.floor((timeInMilliseconds % 86400000) / 3600000); // 60 * 60 * 1000
  const minutes = Math.floor((timeInMilliseconds % 3600000) / 60000); // 60 * 1000
  const seconds = Math.floor((timeInMilliseconds % 60000) / 1000); // 1000
  const milliseconds = timeInMilliseconds % 1000; // remaining milliseconds
  input.value = formatTime(
    totalDays,
    remainingHours,
    minutes,
    seconds,
    milliseconds
  );
}

// Function to format time into dd:hh:mm:ss,kkk
function formatTime(days, hours, minutes, seconds, milliseconds) {
  // Calculate total hours
  const totalHours = days * 24 + hours;

  // If total hours exceed 24, return in dd:hh:mm:ss,kkk format
  if (totalHours >= 24) {
    return `${String(days).padStart(2, "0")}:${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )},${String(milliseconds).padEnd(3, "0")}`;
  } else {
    // Otherwise return in hh:mm:ss,kkk format
    return `${String(totalHours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")},${String(milliseconds).padEnd(
      3,
      "0"
    )}`;
  }
}

// Function to retrieve and parse all time inputs
function getTimes() {
  const inputs = document.querySelectorAll(".time-input");
  const times = [];
  inputs.forEach((input) => {
    const timeInMilliseconds = parseTime(input.value);
    times.push(timeInMilliseconds);
  });
  return times;
}

// Function to calculate sum
function calculateSum() {
  const times = getTimes();
  const totalMilliseconds = times.reduce((acc, curr) => acc + curr, 0);

  // Calculate total time components
  const totalDays = Math.floor(totalMilliseconds / 86400000); // 24 * 60 * 60 * 1000
  const remainingHours = Math.floor((totalMilliseconds % 86400000) / 3600000); // 60 * 60 * 1000
  const minutes = Math.floor((totalMilliseconds % 3600000) / 60000); // 60 * 1000
  const seconds = Math.floor((totalMilliseconds % 60000) / 1000); // 1000
  const milliseconds = totalMilliseconds % 1000; // remaining milliseconds

  // Set result to formatted time
  document.getElementById("result").textContent = formatTime(
    totalDays,
    remainingHours,
    minutes,
    seconds,
    milliseconds
  );
}

// Function to calculate average
function calculateAverage() {
  const times = getTimes();
  const count = times.length;
  if (count === 0) return;

  const totalMilliseconds = times.reduce((acc, curr) => acc + curr, 0);
  const averageMilliseconds = totalMilliseconds / count;

  // Calculate average time components
  const totalDays = Math.floor(averageMilliseconds / 86400000); // 24 * 60 * 60 * 1000
  const remainingHours = Math.floor((averageMilliseconds % 86400000) / 3600000); // 60 * 60 * 1000
  const minutes = Math.floor((averageMilliseconds % 3600000) / 60000); // 60 * 1000
  const seconds = Math.floor((averageMilliseconds % 60000) / 1000); // 1000
  const milliseconds = averageMilliseconds % 1000; // remaining milliseconds

  // Set result to formatted average time
  document.getElementById("result").textContent = formatTime(
    totalDays,
    remainingHours,
    minutes,
    seconds,
    milliseconds
  );
}

// Function to calculate differences between consecutive times
function calculateDifference() {
  const times = getTimes();
  const differences = [];

  for (let i = 0; i < times.length - 1; i++) {
    // Calculate the absolute difference
    const diff = Math.abs(times[i + 1] - times[i]);
    differences.push(diff);
  }

  displayDifferences(differences);
}

// Function to display differences
function displayDifferences(differences) {
  const differencesDiv = document.getElementById("differences");
  differencesDiv.innerHTML = "";

  differences.forEach((difference, index) => {
    const totalDays = Math.floor(difference / 86400000); // 24 * 60 * 60 * 1000
    const remainingHours = Math.floor((difference % 86400000) / 3600000); // 60 * 60 * 1000
    const minutes = Math.floor((difference % 3600000) / 60000); // 60 * 1000
    const seconds = Math.floor((difference % 60000) / 1000); // 1000
    const milliseconds = difference % 1000; // remaining milliseconds

    // Format the difference
    const differenceString = formatTime(
      totalDays,
      remainingHours,
      minutes,
      seconds,
      milliseconds
    );
    const p = document.createElement("p");
    p.textContent = `Difference ${index + 1}: ${differenceString}`;
    differencesDiv.appendChild(p);
  });
}

// Initialize onload to set up blur event for existing inputs and select all text on click
document.addEventListener("DOMContentLoaded", () => {
  // Apply the onblur event and onclick event to all existing input fields
  const existingInputs = document.querySelectorAll(".time-input");
  existingInputs.forEach((input) => {
    input.addEventListener("blur", () => formatInput(input));
    input.addEventListener("click", () => input.select()); // Add click event to select text
  });
});
