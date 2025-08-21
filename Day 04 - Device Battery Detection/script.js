// Check if the Battery API is supported
if ("getBattery" in navigator || "battery" in navigator) {
  document.getElementById("not-supported").style.display = "none";

  function updateBatteryInfo(battery) {
    // Update battery level
    const level = battery.level * 100;
    document.getElementById("battery-level").style.width = level + "%";
    document.getElementById("battery-percentage").textContent =
      Math.round(level) + "%";
    document.getElementById("level-status").textContent =
      Math.round(level) + "%";

    // Update charging status
    const chargingStatus = battery.charging ? "Yes" : "No";
    document.getElementById("charging-status").textContent = chargingStatus;

    // Update charging time
    const chargingTime =
      battery.chargingTime === Infinity
        ? "--"
        : formatTime(battery.chargingTime);
    document.getElementById("charging-time").textContent = chargingTime;

    // Update discharging time
    const dischargingTime =
      battery.dischargingTime === Infinity
        ? "--"
        : formatTime(battery.dischargingTime);
    document.getElementById("discharging-time").textContent = dischargingTime;

    // Update battery color based on level
    const batteryLevel = document.getElementById("battery-level");
    batteryLevel.classList.remove("low", "medium", "high");

    if (level <= 20) {
      batteryLevel.classList.add("low");
    } else if (level <= 60) {
      batteryLevel.classList.add("medium");
    } else {
      batteryLevel.classList.add("high");
    }
  }

  function formatTime(seconds) {
    if (seconds === Infinity || isNaN(seconds)) return "--";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    } else {
      return `${minutes} minutes`;
    }
  }

  // Get battery information
  function fetchBatteryInfo() {
    if (navigator.getBattery) {
      navigator.getBattery().then(updateBatteryInfo);
    } else if (navigator.battery) {
      updateBatteryInfo(navigator.battery);
    }
  }

  // Initial fetch
  fetchBatteryInfo();

  // Add event listener to refresh button
  document
    .getElementById("refresh-btn")
    .addEventListener("click", fetchBatteryInfo);
} else {
  // Show not supported message
  document.getElementById("not-supported").style.display = "block";
  document.querySelector(".battery-container").style.display = "none";
  document.querySelector(".status-info").style.display = "none";
  document.querySelector(".battery-actions").style.display = "none";
}
