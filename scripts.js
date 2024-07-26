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

  // Handle cases like "::23.123", ":23.123", and "1::23.123"
  const parts = input.split("::");
  let hours = 0,
    minutes = 0,
    seconds = 0;
  let milliseconds = 0;

  if (parts.length > 1) {
    hours = parseInt(parts[0], 10) || 0; // Get hours from the first part
    input = parts[1]; // Update input to the second part
  }

  if (input.startsWith(":")) {
    input = "00:" + input.slice(1); // Add leading zeroes for minutes
  } else if (input.startsWith("::")) {
    input = "00:00:" + input.slice(2); // Add leading zeroes for hours and minutes
  }

  // Split the input into parts for minutes and seconds
  let timeParts = input.split(".");
  let timeSection = timeParts[0].split(":");

  if (timeSection.length === 3) {
    [hours, minutes, seconds] = timeSection.map((part) => parseInt(part, 10));
  } else if (timeSection.length === 2) {
    [minutes, seconds] = timeSection.map((part) => parseInt(part, 10));
  } else if (timeSection.length === 1) {
    seconds = parseInt(timeSection[0], 10);
  }

  milliseconds = timeParts[1] ? parseInt(timeParts[1], 10) : 0;

  return (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;
}

// Function to format input value on blur
function formatInput(input) {
  const timeInMilliseconds = parseTime(input.value);
  const hours = Math.floor(timeInMilliseconds / 3600000);
  const minutes = Math.floor((timeInMilliseconds % 3600000) / 60000);
  const seconds = Math.floor((timeInMilliseconds % 60000) / 1000);
  const milliseconds = timeInMilliseconds % 1000;
  input.value = formatTime(hours, minutes, seconds, milliseconds);
}

// Function to format time into hh:mm:ss,kkk
function formatTime(hours, minutes, seconds, milliseconds) {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")},${String(milliseconds)
    .toString()
    .padStart(3, "0")}`;
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

  const hours = Math.floor(totalMilliseconds / 3600000);
  const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
  const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
  const milliseconds = totalMilliseconds % 1000;

  document.getElementById("result").textContent = formatTime(
    hours,
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

  // Round milliseconds to the nearest whole number
  const roundedMilliseconds = Math.round(averageMilliseconds);

  const hours = Math.floor(roundedMilliseconds / 3600000);
  const minutes = Math.floor((roundedMilliseconds % 3600000) / 60000);
  const seconds = Math.floor((roundedMilliseconds % 60000) / 1000);
  const milliseconds = roundedMilliseconds % 1000;

  // Format the result
  document.getElementById("result").textContent = formatTime(
    hours,
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
    const hours = Math.floor(difference / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    const seconds = Math.floor((difference % 60000) / 1000);
    const milliseconds = difference % 1000;

    const differenceString = `Difference ${index + 1}: ${formatTime(
      hours,
      minutes,
      seconds,
      milliseconds
    )}`;
    const p = document.createElement("p");
    p.textContent = differenceString;
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
