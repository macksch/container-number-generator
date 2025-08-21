import { isoCodes, validPrefixes } from "./data.js";

console.log("validPrefixes:", validPrefixes);

const letterList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const digitList = "0123456789".split("");
const letterValues = {
  A: 10,
  B: 12,
  C: 13,
  D: 14,
  E: 15,
  F: 16,
  G: 17,
  H: 18,
  I: 19,
  J: 20,
  K: 21,
  L: 23,
  M: 24,
  N: 25,
  O: 26,
  P: 27,
  Q: 28,
  R: 29,
  S: 30,
  T: 31,
  U: 32,
  V: 34,
  W: 35,
  X: 36,
  Y: 37,
  Z: 38,
};
const multipliers = Array.from({ length: 10 }, (_, i) => 2 ** i);

// Kombobox mit Filterfunktion
window.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("isoCodeInput");
  const dropdown = document.getElementById("isoDropdown");

  function showDropdown(filtered) {
    dropdown.innerHTML = "";
    if (filtered.length === 0) {
      dropdown.style.display = "none";
      return;
    }
    filtered.forEach(({ code, desc }) => {
      const option = document.createElement("div");
      option.className = "dropdown-option";
      option.textContent = `${code} – ${desc}`;
      option.dataset.code = code;
      option.onclick = () => {
        input.value = code;
        dropdown.style.display = "none";
      };
      dropdown.appendChild(option);
    });
    dropdown.style.display = "block";
  }

  function filterOptions() {
    const val = input.value.trim().toUpperCase();
    if (!val) {
      dropdown.style.display = "none";
      return;
    }
    const filtered = isoCodes.filter(({ code }) => code.startsWith(val));
    showDropdown(filtered);
  }

  input.addEventListener("input", filterOptions);
  input.addEventListener("focus", filterOptions);
  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
});

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateContainerBase() {
  let prefix = randomChoice(validPrefixes);
  let digits = "";
  for (let i = 0; i < 6; i++) digits += randomChoice(digitList);
  return prefix + digits;
}

function calculateCheckDigit(base) {
  let values = [];
  for (let i = 0; i < base.length; i++) {
    let char = base[i];
    if (/[A-Z]/.test(char)) {
      values.push(letterValues[char]);
    } else {
      values.push(Number(char));
    }
  }
  let total = values.reduce((sum, val, i) => sum + val * multipliers[i], 0);
  let rest = total % 11;
  return rest === 10 ? 0 : rest;
}

function createContainer(base) {
  return base + calculateCheckDigit(base);
}

function generateNumbers() {
  console.log("generateNumbers wurde aufgerufen");
  const amount = parseInt(document.getElementById("amount").value, 10);
  const isoCode = document.getElementById("isoCodeInput").value.trim();
  const output = document.getElementById("output");
  const copyBtn = document.getElementById("copyBtn");
  output.innerHTML = "";
  copyBtn.style.display = "none";
  let copyText = "";

  if (isNaN(amount) || amount < 1) {
    output.textContent = "Bitte eine gültige Anzahl eingeben.";
    return;
  }

  // Nur gültige ISO Codes aus der Liste akzeptieren
  const isoValid = isoCodes.some(({ code }) => code === isoCode);

  if (isoCode && !isoValid) {
    output.textContent =
      "Bitte einen gültigen ISO Code aus der Liste auswählen.";
    return;
  }

  if (isoCode && isoValid) {
    // Tabelle mit Nummern und ISO Code
    let table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    let thead = document.createElement("thead");
    let headerRow = document.createElement("tr");
    ["Containernummer", "ISO Code"].forEach((text) => {
      let th = document.createElement("th");
      th.textContent = text;
      th.style.borderBottom = "2px solid #2a5d9f";
      th.style.padding = "8px";
      th.style.textAlign = "left";
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    let tbody = document.createElement("tbody");
    for (let i = 0; i < amount; i++) {
      let base = generateContainerBase();
      let number = createContainer(base);
      let row = document.createElement("tr");

      let tdNum = document.createElement("td");
      tdNum.textContent = number;
      tdNum.className = "container-number";
      tdNum.style.padding = "8px";

      let tdIso = document.createElement("td");
      tdIso.textContent = isoCode;
      tdIso.style.padding = "8px";

      row.appendChild(tdNum);
      row.appendChild(tdIso);
      tbody.appendChild(row);

      copyText += number + "\t" + isoCode + "\n";
    }
    table.appendChild(tbody);
    output.appendChild(table);
    copyBtn.style.display = "inline-block";
  } else {
    // Standard: Nur Nummern als Liste
    let list = document.createElement("ul");
    for (let i = 0; i < amount; i++) {
      let base = generateContainerBase();
      let number = createContainer(base);
      let item = document.createElement("li");
      item.className = "container-number";
      item.textContent = number;
      list.appendChild(item);

      copyText += number + "\n";
    }
    output.appendChild(list);
    copyBtn.style.display = "inline-block";
  }

  copyBtn.onclick = function () {
    navigator.clipboard.writeText(copyText.trim());
    copyBtn.textContent = "Kopiert!";
    setTimeout(
      () => (copyBtn.textContent = "In Zwischenablage kopieren"),
      1500
    );
  };
}

window.generateNumbers = generateNumbers;
