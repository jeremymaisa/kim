const realFileBtn = document.getElementById("real-file");
  const customBtn = document.getElementById("custom-button");
  const customTxt = document.getElementById("custom-text");

  customBtn.addEventListener("click", function() {
      realFileBtn.click();
  });

  realFileBtn.addEventListener("change", function() {
      if (realFileBtn.value) {
          customTxt.innerHTML = realFileBtn.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
          customTxt.style.color = "#b184e1"; 
      } else {
          customTxt.innerHTML = "No file chosen, yet.";
          customTxt.style.color = "rgba(255, 255, 255, 0.5)";
      }
  });