import * as thr from "./three.js/build/three.module.js";

let game = 0;
let ding = new Audio("./ding.mp3");
let sensitivity = 5;

const raycaster = new thr.Raycaster();
const pointer = new thr.Vector2();
let handleMouseDown;
let mode = 0;
let speedX = 0.02;
let speedY = 0.02;
let fov = 30;

let countdownInterval;

document.getElementById("vid-1").playbackRate = 0.5;
document.getElementById("vid-2").playbackRate = 0.5;
document.getElementById("vid-3").playbackRate = 0.5;
document.getElementById("vid-4").playbackRate = 0.5;

document.getElementById("playButton").addEventListener("click", play);
document.getElementById("settingButton").addEventListener("click", setting);
document.getElementById("saveButton").addEventListener("click", save);
document.getElementById("mode-1").addEventListener("click", startGame);
document.getElementById("mode-2").addEventListener("click", startGame2);
document.getElementById("mode-3").addEventListener("click", startGame3);
document.getElementById("mode-4").addEventListener("click", startGame4);

function play() {
  ding.currentTime = 0;
  ding.play();
  document.getElementById("selectMode").classList.remove("hide");
  document.getElementById("menu").classList.add("hide");
}

function save() {
  ding.currentTime = 0;
  ding.play();
  document.getElementById("menu").classList.remove("hide");
  document.getElementById("settings").classList.add("hide");
}

function setting() {
  ding.currentTime = 0;
  ding.play();
  document.getElementById("settings").classList.remove("hide");
  document.getElementById("menu").classList.add("hide");
}

function startTimer(duration) {
  timer = duration;
  const timerElement = document.getElementById("timer");
  timerElement.innerText = "01:00";

  countdownInterval = setInterval(function () {
    if (stop === 1) {
      clearInterval(countdownInterval);
      return;
    }

    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;

    timerElement.textContent = formattedTime;

    if (--timer < 0) {
      clearInterval(countdownInterval);
      stop = 1;
    }
  }, 1000);
}

const crosshairColor = document.getElementById("crosshairColor");
const target = document.getElementById("targetColor");
let targetColor = "#FF0000";

target.addEventListener("input", function () {
  targetColor = target.value;
});

crosshairColor.addEventListener("change", function () {
  const selectedColor = crosshairColor.value;
  if (selectedColor === "white") {
    crosshair.style.filter =
      "invert(100%) sepia(4%) saturate(372%) hue-rotate(21deg) brightness(118%) contrast(100%)";
  } else if (selectedColor === "red") {
    crosshair.style.filter =
      "invert(20%) sepia(88%) saturate(7413%) hue-rotate(6deg) brightness(99%) contrast(124%)";
  } else if (selectedColor === "cyan") {
    crosshair.style.filter =
      "invert(69%) sepia(58%) saturate(1771%) hue-rotate(136deg) brightness(103%) contrast(106%)";
  } else if (selectedColor === "green") {
    crosshair.style.filter =
      "invert(53%) sepia(83%) saturate(2951%) hue-rotate(82deg) brightness(125%) contrast(117%)";
  } else if (selectedColor === "yellow") {
    crosshair.style.filter =
      "invert(97%) sepia(63%) saturate(2210%) hue-rotate(360deg) brightness(106%) contrast(100%)";
  }
});

let stop = 0;
let balls = [];
let score = 0;
let ambientLight;
let pointLight;
let timer;
let totalClick = 0;
let ballsHit = 0;

function startGame() {
  mode = 0;
  game = 1;
  ding.currentTime = 0;
  ding.play();
  stop = 0;
  menu.classList.add("hide");
  nav.classList.remove("hide");
  crosshair.classList.remove("hide");
  document.getElementById("selectMode").classList.add("hide");
  document.body.style.cursor = "none";
  score = 0;
  totalClick = 0;
  ballsHit = 0;
  let scoreElement = document.getElementById("score");
  let accuracyElement = document.getElementById("accuracy");
  scoreElement.innerText = score + " pts";
  accuracyElement.innerText = Math.floor((1 / 1) * 100) + "%";
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  startTimer(59);

  let randX, randY;

  function isValid() {
    for (let i = 0; i < balls.length; i++) {
      if (
        Math.abs(balls[i].position.x - randX) < 1 ||
        Math.abs(balls[i].position.y - randY) < 1
      ) {
        return false;
      }
    }
    return true;
  }

  for (let i = 0; i < 3; i++) {
    while (true) {
      randX = Math.random() * 7 - 3;
      randY = Math.random() * 5 - 2;
      if (isValid()) {
        break;
      }
    }

    const geo = new thr.SphereGeometry(0.7, 32, 16);
    const material = new thr.MeshPhongMaterial({
      color: targetColor,
    });
    const mesh = new thr.Mesh(geo, material);
    mesh.position.set(randX, randY, 0);
    balls.push(mesh);
    scene.add(mesh);
  }

  const newBall = () => {
    ding.currentTime = 0;
    ding.play();
    ballsHit++;
    while (true) {
      randX = Math.random() * 7 - 3;
      randY = Math.random() * 5 - 2;
      if (isValid()) {
        break;
      }
    }

    const geo = new thr.SphereGeometry(0.7, 32, 16);
    const material = new thr.MeshPhongMaterial({
      color: targetColor,
    });
    const mesh = new thr.Mesh(geo, material);
    mesh.position.set(randX, randY, 0);
    balls.push(mesh);
    scene.add(mesh);
  };

  ambientLight = new thr.AmbientLight(0xffffff, 0.5);
  pointLight = new thr.PointLight(0xffffff, 1);
  pointLight.position.set(0, 0, 25);

  scene.add(ambientLight, pointLight);

  handleMouseDown = function () {
    if (stop !== 1) {
      const intersects = raycaster.intersectObjects(balls);
      if (intersects.length > 0) {
        const clickedBall = intersects[0].object;
        const index = balls.indexOf(clickedBall);

        if (index !== -1) {
          newBall();
          scene.remove(clickedBall);
          balls.splice(index, 1);
          score += 10;
          scoreElement.innerText = score + " pts";
        }
      } else {
        if (score > 0) {
          score = score - 2;
          scoreElement.innerText = score + " pts";
        }
      }
      totalClick++;
      accuracyElement.innerText =
        Math.floor((ballsHit / totalClick) * 100) + "%";
    } else {
      return;
    }
  };

  document.addEventListener("mousedown", handleMouseDown);
}

function startGame2() {
  mode = 0;
  game = 1;
  ding.currentTime = 0;
  ding.play();
  stop = 0;
  menu.classList.add("hide");
  nav.classList.remove("hide");
  crosshair.classList.remove("hide");
  document.getElementById("selectMode").classList.add("hide");
  document.body.style.cursor = "none";
  score = 0;
  totalClick = 0;
  ballsHit = 0;
  let scoreElement = document.getElementById("score");
  let accuracyElement = document.getElementById("accuracy");
  scoreElement.innerText = score + " pts";
  accuracyElement.innerText = Math.floor((1 / 1) * 100) + "%";
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  startTimer(59);

  let randX, randY;

  function isValid() {
    for (let i = 0; i < balls.length; i++) {
      if (
        Math.abs(balls[i].position.x - randX) < 0.4 ||
        Math.abs(balls[i].position.y - randY) < 0.4
      ) {
        return false;
      }
    }
    return true;
  }

  for (let i = 0; i < 6; i++) {
    while (true) {
      randX = Math.random() * 7 - 3;
      randY = Math.random() * 5 - 2;
      if (isValid()) {
        break;
      }
    }

    const geo = new thr.SphereGeometry(0.2, 32, 16);
    const material = new thr.MeshPhongMaterial({
      color: targetColor,
    });
    const mesh = new thr.Mesh(geo, material);
    mesh.position.set(randX, randY, 0);
    balls.push(mesh);
    scene.add(mesh);
  }

  const newBall = () => {
    ding.currentTime = 0;
    ding.play();
    ballsHit++;
    while (true) {
      randX = Math.random() * 7 - 3;
      randY = Math.random() * 5 - 2;
      if (isValid()) {
        break;
      }
    }

    const geo = new thr.SphereGeometry(0.2, 32, 16);
    const material = new thr.MeshPhongMaterial({
      color: targetColor,
    });
    const mesh = new thr.Mesh(geo, material);
    mesh.position.set(randX, randY, 0);
    balls.push(mesh);
    scene.add(mesh);
  };

  ambientLight = new thr.AmbientLight(0xffffff, 0.5);
  pointLight = new thr.PointLight(0xffffff, 1);
  pointLight.position.set(0, 0, 25);

  scene.add(ambientLight, pointLight);

  handleMouseDown = function () {
    if (stop !== 1) {
      const intersects = raycaster.intersectObjects(balls);
      if (intersects.length > 0) {
        const clickedBall = intersects[0].object;
        const index = balls.indexOf(clickedBall);

        if (index !== -1) {
          newBall();
          scene.remove(clickedBall);
          balls.splice(index, 1);
          score += 10;
          scoreElement.innerText = score + " pts";
        }
      } else {
        if (score > 0) {
          score = score - 2;
          scoreElement.innerText = score + " pts";
        }
      }
      totalClick++;
      accuracyElement.innerText =
        Math.floor((ballsHit / totalClick) * 100) + "%";
    } else {
      return;
    }
  };

  document.addEventListener("mousedown", handleMouseDown);
}

function startGame3() {
  mode = 0;
  game = 1;
  ding.currentTime = 0;
  ding.play();
  stop = 0;
  menu.classList.add("hide");
  nav.classList.remove("hide");
  crosshair.classList.remove("hide");
  document.getElementById("selectMode").classList.add("hide");
  document.body.style.cursor = "none";
  score = 0;
  totalClick = 0;
  ballsHit = 0;
  let scoreElement = document.getElementById("score");
  let accuracyElement = document.getElementById("accuracy");
  scoreElement.innerText = score + " pts";
  accuracyElement.innerText = Math.floor((1 / 1) * 100) + "%";
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  startTimer(59);

  let randX, randY, randZ;

  function isValid() {
    for (let i = 0; i < balls.length; i++) {
      if (
        Math.abs(balls[i].position.x - randX) < 0.2 ||
        Math.abs(balls[i].position.y - randY) < 0.2
      ) {
        return false;
      }
    }
    return true;
  }

  for (let i = 0; i < 1; i++) {
    while (true) {
      randX = Math.random() * 5 - 2;
      randY = Math.random() * 5 - 2;
      randZ = -Math.random() * 15;
      if (isValid()) {
        break;
      }
    }

    const geo = new thr.SphereGeometry(0.2, 32, 16);
    const material = new thr.MeshPhongMaterial({
      color: targetColor,
    });
    const mesh = new thr.Mesh(geo, material);
    mesh.position.set(randX, randY, randZ);
    balls.push(mesh);
    scene.add(mesh);
  }

  const newBall = () => {
    ding.currentTime = 0;
    ding.play();
    ballsHit++;
    while (true) {
      randX = Math.random() * 5 - 2;
      randY = Math.random() * 5 - 2;
      randZ = -Math.random() * 15;
      if (isValid()) {
        break;
      }
    }

    const geo = new thr.SphereGeometry(0.2, 32, 16);
    const material = new thr.MeshPhongMaterial({
      color: targetColor,
    });
    const mesh = new thr.Mesh(geo, material);
    mesh.position.set(randX, randY, randZ);
    balls.push(mesh);
    scene.add(mesh);
  };

  ambientLight = new thr.AmbientLight(0xffffff, 0.5);
  pointLight = new thr.PointLight(0xffffff, 1);
  pointLight.position.set(0, 0, 25);

  scene.add(ambientLight, pointLight);

  handleMouseDown = function () {
    if (stop !== 1) {
      const intersects = raycaster.intersectObjects(balls);
      if (intersects.length > 0) {
        const clickedBall = intersects[0].object;
        const index = balls.indexOf(clickedBall);

        if (index !== -1) {
          newBall();
          scene.remove(clickedBall);
          balls.splice(index, 1);
          score += 10;
          scoreElement.innerText = score + " pts";
        }
      } else {
        if (score > 0) {
          score = score - 2;
          scoreElement.innerText = score + " pts";
        }
      }
      totalClick++;
      accuracyElement.innerText =
        Math.floor((ballsHit / totalClick) * 100) + "%";
    } else {
      return;
    }
  };

  document.addEventListener("mousedown", handleMouseDown);
}

let move = 0;
let hit = 0;

function startGame4() {
  hit = 0;
  move = 0;
  mode = 4;
  game = 1;
  ding.currentTime = 0;
  ding.play();
  stop = 0;
  menu.classList.add("hide");
  nav.classList.remove("hide");
  crosshair.classList.remove("hide");
  document.getElementById("selectMode").classList.add("hide");
  document.body.style.cursor = "none";
  score = 0;
  totalClick = 0;
  ballsHit = 0;
  let scoreElement = document.getElementById("score");
  let accuracyElement = document.getElementById("accuracy");
  scoreElement.innerText = score + " pts";
  accuracyElement.innerText = Math.floor((1 / 1) * 100) + "%";
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  startTimer(59);

  let randX, randY, randZ;

  function isValid() {
    for (let i = 0; i < balls.length; i++) {
      if (
        Math.abs(balls[i].position.x - randX) < 0.2 ||
        Math.abs(balls[i].position.y - randY) < 0.2
      ) {
        return false;
      }
    }
    return true;
  }

  for (let i = 0; i < 1; i++) {
    while (true) {
      randX = Math.random() * 5 - 2;
      randY = Math.random() * 5 - 2;
      randZ = -Math.random() * 15;
      if (isValid()) {
        break;
      }
    }

    const geo = new thr.SphereGeometry(0.4, 32, 16);
    const material = new thr.MeshPhongMaterial({
      color: targetColor,
    });
    const mesh = new thr.Mesh(geo, material);
    mesh.position.set(randX, randY, randZ);
    balls.push(mesh);
    scene.add(mesh);
  }

  ambientLight = new thr.AmbientLight(0xffffff, 0.5);
  pointLight = new thr.PointLight(0xffffff, 1);
  pointLight.position.set(0, 0, 25);

  scene.add(ambientLight, pointLight);

  handleMouseDown = function () {
    move++;
    if (stop !== 1) {
      const intersects = raycaster.intersectObjects(balls);
      if (intersects.length > 0 && mode == 4) {
        const clickedBall = intersects[0].object;
        const index = balls.indexOf(clickedBall);
        clickedBall.material.color.set("blue");
        hit++;

        if (index !== -1) {
          score += 2;
          scoreElement.innerText = score + " pts";
        }
      } else {
        balls[0].material.color.set(targetColor);
      }
      totalClick++;
      accuracyElement.innerText = Math.floor((hit / move) * 100) + "%";
    } else {
      return;
    }
  };

  document.addEventListener("mousemove", handleMouseDown);
}

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

document.addEventListener("mousemove", onPointerMove);

let width = window.innerWidth;
let height = window.innerHeight;
let aspect = width / height;

let camera = new thr.PerspectiveCamera(30, aspect, 0.1, 1000);
let scene = new thr.Scene();
let renderer = new thr.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);

camera.position.set(0, 0, 30);
camera.lookAt(0, 0, 0);

document.body.appendChild(renderer.domElement);

const textureLoader = new thr.TextureLoader();

const skybox = [
  new thr.MeshBasicMaterial({
    map: textureLoader.load("./Skybox/sky1/corona_rt.png"),
    side: thr.DoubleSide,
  }),
  new thr.MeshBasicMaterial({
    map: textureLoader.load("./Skybox/sky1/corona_lf.png"),
    side: thr.DoubleSide,
  }),
  new thr.MeshBasicMaterial({
    map: textureLoader.load("./Skybox/sky1/corona_up.png"),
    side: thr.DoubleSide,
  }),
  new thr.MeshBasicMaterial({
    map: textureLoader.load("./Skybox/sky1/corona_dn.png"),
    side: thr.DoubleSide,
  }),
  new thr.MeshBasicMaterial({
    map: textureLoader.load("./Skybox/sky1/corona_bk.png"),
    side: thr.DoubleSide,
  }),
  new thr.MeshBasicMaterial({
    map: textureLoader.load("./Skybox/sky1/corona_ft.png"),
    side: thr.DoubleSide,
  }),
];

const BoxGeometry = new thr.BoxGeometry(200, 200, 200);
const cube = new thr.Mesh(BoxGeometry, skybox);

scene.add(cube);

let blackMaterial = new thr.MeshBasicMaterial({ color: "black" });
let grayMaterial = new thr.MeshBasicMaterial({
  color: "silver",
  side: thr.DoubleSide,
});

document.getElementById("sky").addEventListener("click", () => {
  document.getElementById("sky").style.border = "2px solid red";
  document.getElementById("black").style.border = "2px solid white";
  document.getElementById("gray").style.border = "2px solid white";
  cube.material = skybox;
});

document.getElementById("black").addEventListener("click", () => {
  document.getElementById("sky").style.border = "2px solid white";
  document.getElementById("black").style.border = "2px solid red";
  document.getElementById("gray").style.border = "2px solid white";
  cube.material = blackMaterial;
});

document.getElementById("gray").addEventListener("click", () => {
  document.getElementById("sky").style.border = "2px solid white";
  document.getElementById("black").style.border = "2px solid white";
  document.getElementById("gray").style.border = "2px solid red";
  cube.material = grayMaterial;
});

const center = new thr.Vector2(0, 0);

const endSection = document.getElementById("endSection");

const returnBtn = document.getElementById("return");
returnBtn.addEventListener("click", function () {
  ding.currentTime = 0;
  ding.play();
  endSection.classList.add("hide");
  menu.classList.remove("hide");
  document.getElementById("selectMode").classList.add("hide");
});

const returnBtn2 = document.getElementById("return2");
returnBtn2.addEventListener("click", function () {
  ding.currentTime = 0;
  ding.play();
  endSection.classList.add("hide");
  menu.classList.remove("hide");
  document.getElementById("selectMode").classList.add("hide");
});

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);
onWindowResize();

window.onload = () => {
  const volumeSlider = document.getElementById("volume");
  const volumeValue = document.getElementById("volumeValue");

  const sensitivitySlider = document.getElementById("sensitivity");
  const sensitivityValue = document.getElementById("sensitivityValue");

  const fovSlider = document.getElementById("fov");
  const fovValue = document.getElementById("fovValue");

  volumeValue.textContent = volumeSlider.value;
  sensitivityValue.textContent = sensitivitySlider.value;
  fovValue.textContent = fovSlider.value;
};

document.addEventListener("DOMContentLoaded", function () {
  const volumeSlider = document.getElementById("volume");
  const volumeValue = document.getElementById("volumeValue");

  const sensitivitySlider = document.getElementById("sensitivity");
  const sensitivityValue = document.getElementById("sensitivityValue");

  const fovSlider = document.getElementById("fov");
  const fovValue = document.getElementById("fovValue");

  volumeSlider.addEventListener("input", function () {
    volumeValue.textContent = volumeSlider.value;
    ding.volume = volumeSlider.value / 100;
  });

  sensitivitySlider.addEventListener("input", function () {
    sensitivityValue.textContent = sensitivitySlider.value;
    sensitivity = sensitivitySlider.value;
  });

  fovSlider.addEventListener("input", function () {
    fovValue.textContent = fovSlider.value;
    fov = fovSlider.value;
  });
});

function handleEscKey(event) {
  if (game == 1) {
    if (event.key === "Escape") {
      stop = 1;
    }
  }
}

document.addEventListener("keydown", handleEscKey);

function animate() {
  camera.fov = fov;
  camera.updateProjectionMatrix();
  if (stop == 1) {
    document.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mousemove", handleMouseDown);
  } else if (mode == 4 && balls.length > 0) {
    if (score > 0) {
      let scoreElement = document.getElementById("score");
      score = score - 1;
      scoreElement.innerText = score + " pts";
    }

    balls[0].position.x += speedX;
    balls[0].position.y += speedY;

    if (balls[0].position.x <= -2 || balls[0].position.x >= 3) {
      speedX = -speedX;
    }
    if (balls[0].position.y <= -2 || balls[0].position.y >= 3) {
      speedY = -speedY;
    }
  }

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  raycaster.setFromCamera(center, camera);
  camera.lookAt(pointer.x * sensitivity, pointer.y * sensitivity, 0);
  if (stop == 1) {
    clearInterval(countdownInterval);
    game = 0;
    for (let i = 0; i < balls.length; i++) {
      scene.remove(balls[i]);
    }
    scene.remove(pointLight);
    scene.remove(ambientLight);
    balls = [];
    const end = document.getElementById("end");
    end.innerText = "Score: " + score;

    endSection.classList.remove("hide");
    nav.classList.add("hide");
    crosshair.classList.add("hide");
    document.body.style.cursor = "";
    stop = 0;
  }
}

animate();
