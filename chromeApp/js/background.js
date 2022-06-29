const images = ["0.jpg", "1.jpg", "2.jpg"];

const chosenImage = images[Math.floor(Math.random()*images.length)];

//const bgImage = document.createElement("img");
//bgImage.src = `img/${chosenImage}`;
//bgImage.classList.add("image");
//document.body.appendChild(bgImage);

document.body.style.background = `url(img/${chosenImage})`;
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";