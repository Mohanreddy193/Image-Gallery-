const albumList = document.getElementById("albumList");
const gallery = document.getElementById("gallery");
const imageInput = document.getElementById("imageInput");

let albums = JSON.parse(localStorage.getItem("albums")) || {};
let currentAlbum = null;
let images = [];
let currentIndex = 0;

/* CREATE ALBUM */
function createAlbum() {
  const name = document.getElementById("albumName").value.trim();
  if (!name) return alert("Enter album name");

  if (!albums[name]) {
    albums[name] = [];
    saveAlbums();
    renderAlbums();
  }
}

/* RENDER ALBUMS */
function renderAlbums() {
  albumList.innerHTML = "";

  Object.keys(albums).forEach(name => {
    const div = document.createElement("div");
    div.className = "album";
    div.innerText = name;

    div.onclick = () => openAlbum(name);

    albumList.appendChild(div);
  });
}

/* OPEN ALBUM */
function openAlbum(name) {
  currentAlbum = name;
  gallery.innerHTML = "";
  images = [];

  document.querySelectorAll(".album").forEach(a => a.classList.remove("active"));

  const selected = [...document.querySelectorAll(".album")]
    .find(a => a.innerText === name);

  if (selected) selected.classList.add("active");

  albums[name].forEach(src => addImage(src));
}

/* ADD IMAGE */
function addImage(src) {
  const div = document.createElement("div");
  div.className = "gallery-item";

  const img = document.createElement("img");
  img.src = src;

  img.onclick = () => openLightbox(images.indexOf(img));

  div.appendChild(img);
  gallery.appendChild(div);

  images.push(img);
}

/* UPLOAD */
imageInput.addEventListener("change", function () {
  if (!currentAlbum) return alert("Select album first");

  const files = Array.from(this.files);

  files.forEach(file => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const src = e.target.result;
      albums[currentAlbum].push(src);
      saveAlbums();
      addImage(src);
    };

    reader.readAsDataURL(file);
  });
});

/* SAVE */
function saveAlbums() {
  localStorage.setItem("albums", JSON.stringify(albums));
}

/* LIGHTBOX */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

function openLightbox(index) {
  currentIndex = index;
  lightbox.style.display = "flex";
  lightboxImg.src = images[currentIndex].src;
}

document.querySelector(".close").onclick = () => lightbox.style.display = "none";

document.querySelector(".next").onclick = () => {
  currentIndex = (currentIndex + 1) % images.length;
  lightboxImg.src = images[currentIndex].src;
};

document.querySelector(".prev").onclick = () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  lightboxImg.src = images[currentIndex].src;
};

/* INIT */
window.onload = () => {
  renderAlbums();

  // 🔥 Load default images into lightbox system
  const existingImages = document.querySelectorAll(".gallery-item img");

  existingImages.forEach(img => {
    images.push(img);

    img.addEventListener("click", () => {
      openLightbox(images.indexOf(img));
    });
  });
};
/* SCROLL REVEAL */
const elements = document.querySelectorAll(".gallery-item, .album, .hero");

window.addEventListener("scroll", () => {
  elements.forEach(el => {
    const position = el.getBoundingClientRect().top;

    if (position < window.innerHeight - 50) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }
  });
});

/* INITIAL STATE */
elements.forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(40px)";
  el.style.transition = "1s";
});