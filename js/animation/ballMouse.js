window.addEventListener('load', function (e) {
  const STAR_COUNT = (window.innerWidth + window.innerHeight) / 100,
    STAR_MIN_SIZE = 5,
    STAR_MAX_SIZE = 10,
    GRAVITY_SIZE = 1,
    STAR_MASS = 5,
    STAR_REMOVE_TIME = 3000,
    RESISTANCE_SIZE = 0.0001;

  const canvas = document.getElementById('BallMouse'),
    context = canvas.getContext('2d');

  let scale = 1,
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

  function resize() {
    scale = window.devicePixelRatio || 1;
    width = window.innerWidth * scale;
    height = window.innerHeight * scale;
    canvas.width = width;
    canvas.height = height;
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
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: 0,
          siz: STAR_MIN_SIZE + Math.random() * (STAR_MAX_SIZE - STAR_MIN_SIZE) / 2,
          vx: 0,
          vy: 0,
          colorh: parseInt(Math.random() * 359)
        });
      }
    }
    stars.forEach((star) => {
      stars.forEach(bigStar => {
        let r2 = (star.x - bigStar.x) * (star.x - bigStar.x) + (star.y - bigStar.y) * (star.y - bigStar.y);
        r2 = Math.max(r2, (star.siz + bigStar.siz) * (star.siz + bigStar.siz));
        let f = GRAVITY_SIZE * star.siz * STAR_MASS * bigStar.siz * STAR_MASS / r2;
        star.vx -= (star.x - bigStar.x) / Math.sqrt(r2) * f / (star.siz * STAR_MASS);
        star.vy -= (star.y - bigStar.y) / Math.sqrt(r2) * f / (star.siz * STAR_MASS);
      });
    });
    stars.forEach((star) => {
      let v2 = star.vx * star.vx + star.vy * star.vy;
      let f = Math.PI * RESISTANCE_SIZE * star.siz * Math.sqrt(v2);
      star.vx -= star.vx / Math.sqrt(v2) * f / (star.siz * STAR_MASS);
      star.vy -= star.vy / Math.sqrt(v2) * f / (star.siz * STAR_MASS);
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
      context.lineWidth = star.siz * scale;
      context.strokeStyle = 'hsla(' + star.colorh + ',100%,60%, 70%)';
      context.beginPath();
      context.moveTo(star.x, star.y);
      context.lineTo(star.x, star.y);
      context.stroke();
    });
  }
  let inv;
  function onMouseDown(event) {
    let siz = STAR_MIN_SIZE + Math.random() * (STAR_MAX_SIZE - STAR_MIN_SIZE);
    stars.push({
      x: event.clientX + Math.random() * siz,
      y: event.clientY + Math.random() * siz,
      z: 0,
      siz: siz,
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