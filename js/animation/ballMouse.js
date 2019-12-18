window.addEventListener('load', function (e) {
  const STAR_COUNT = (window.innerWidth + window.innerHeight) / 30,
    STAR_SIZE = 5.5,
    GRAVITY_SIZE = 10,
    STAR_MASS = 1,
    STAR_REMOVE_TIME = 2000;

  const canvas = document.getElementById('BallMouse'),
    context = canvas.getContext('2d');

  let scale = 1, // device pixel ratio
    width,
    height,
    nowtime;

  let stars = [];

  resize();
  step();

  window.onresize = resize;
  window.addEventListener('mousedown', function (e) {
    onMouseDown(e);
  });
  window.addEventListener('mouseup', function (e) {
    onMouseUp(e);
  });
  function placeStar(star) {
    star.x = Math.random() * width;
    star.y = Math.random() * height;
    return star;
  }

  function resize() {
    scale = window.devicePixelRatio || 1;
    width = window.innerWidth * scale;
    height = window.innerHeight * scale;
    canvas.width = width;
    canvas.height = height;
    stars.forEach(placeStar);
  }

  function step() {
    nowtime = new Date().getTime();
    context.clearRect(0, 0, width, height);
    update();
    render();
    requestAnimationFrame(step);
  }

  function update() {
    for (let index = 0; index < stars.length; index++) {
      const star = stars[index];
      if (star.z && nowtime > star.z) {
        stars.splice(index, 1);
        --index;
      }
    }
    if (stars.length < STAR_COUNT) {
      let place = (STAR_COUNT - stars.length) * Math.random();
      for (let i = 0; i < place; i++) {
        stars.push(placeStar({
          x: 0,
          y: 0,
          z: 0,
          vx: 0,
          vy: 0,
          colorh: parseInt(Math.random() * 359)
        }));
      }
    }
    stars.forEach((star) => {
      stars.forEach(bigStar => {
        let r2 = (star.x - bigStar.x) * (star.x - bigStar.x) + (star.y - bigStar.y) * (star.y - bigStar.y);
        r2 = Math.max(r2, STAR_SIZE * STAR_SIZE);
        let f = GRAVITY_SIZE * STAR_MASS * STAR_MASS / r2;
        star.vx -= (star.x - bigStar.x) / Math.sqrt(r2) * f / STAR_MASS;
        star.vy -= (star.y - bigStar.y) / Math.sqrt(r2) * f / STAR_MASS;
      });
    });
    stars.forEach((star) => {
      star.x += star.vx;
      star.y += star.vy;
      if (star.x < 0 || star.y < 0 || star.x > width || star.y > height) {
        if (star.z == 0) {
          star.z = nowtime + STAR_REMOVE_TIME;
        }
      } else {
        star.z = 0;
      }
    });
  }
  function render() {
    stars.forEach((star) => {
      context.beginPath();
      context.lineCap = 'round';
      context.lineWidth = STAR_SIZE * scale;
      context.strokeStyle = 'hsla(' + star.colorh + ',100%,70%,' + (star.z ? (star.z - nowtime) / STAR_REMOVE_TIME : 1) + ')';
      context.beginPath();
      context.moveTo(star.x, star.y);
      context.lineTo(star.x, star.y);
      context.stroke();
    });
  }
  let inv;
  function onMouseDown(event) {
    stars.push({
      x: event.clientX + Math.random() * STAR_SIZE,
      y: event.clientY + Math.random() * STAR_SIZE,
      z: 0,
      vx: 0,
      vy: 0,
      colorh: parseInt(Math.random() * 359)
    });
    inv = setTimeout(onMouseDown, 100, event);
  }
  function onMouseUp(event) {
    clearTimeout(inv);
  }
});