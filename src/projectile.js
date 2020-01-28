export default function main() {
  const canvas = document.getElementById("simulation");
  const ctx = canvas.getContext("2d");
  const startButton = document.getElementById("start");
  const stopButton = document.getElementById("stop");

  let animation;

  const projectile = createProjectile(ctx, { x: 0, y: 0 });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    projectile.draw();

    projectile.x += projectile.v;
    projectile.y += projectile.v;

    animation = window.requestAnimationFrame(draw);
  }

  startButton.addEventListener("click", () => {
    animation = window.requestAnimationFrame(draw);
  });

  stopButton.addEventListener("click", () => {
    window.cancelAnimationFrame(animation);
  });
}

function createProjectile(ctx, position) {
  const { x, y } = position;

  return {
    x: x,
    y: y,
    v: 5,
    radius: 5,
    color: "white",
    draw: function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  };
}
