Hooks.on("ready", () => {
  // Ajoute un élément d'image au DOM pour le logo de pause
  const img = document.createElement("img");
  img.id = "pause-logo";
  img.src = "modules/switchThemeDnD/DBZ/pause-icon.webp"; // Remplacez par le chemin de votre logo
  document.body.appendChild(img);

  // Écoute les changements d'état de pause
  Hooks.on("pauseGame", (isPaused) => {
      const logo = document.getElementById("pause-logo");
      if (isPaused) {
          logo.style.display = "block"; // Affiche le logo
      } else {
          logo.style.display = "none";  // Cache le logo
      }
  });
});
