
import _ from 'lodash';


export default function sketch(s) {

  let x, y, backgroundColor;

  const nbStars = 500;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let stars;
  const speed = 10;
  const pzFactor = 0.9;
  const noiseScale = 1;

  let color = null;

  class Star {
    constructor(props) {
      this.origin = null;
      this.coord = null;
      this.reset();
      this.sign = -1;
      this.oldPos = null;
    }

    reset() {
      this.origin = s.createVector(s.random(-width, width), s.random(-height, height), s.random()*height);
      this.coord = this.origin.copy();
      this.oldPos = this.origin.copy();
    }

    update() {
      this.oldPos = this.coord.copy();
      this.coord.z += this.sign * speed;
      this.oldPos.z = this.coord.z / pzFactor;

      if (this.coord.z < 1 || this.coord.z > height) {
        if (s.random() < 0.5) {
          this.reset();
        }
        this.sign *= -1;
      }

      this.oldPos.x = s.map(this.origin.x / this.oldPos.z, -1, 1, -width, width);
      this.oldPos.y = s.map(this.origin.y / this.oldPos.z, -1, 1, -height, height);

      this.coord.x = s.map(this.origin.x / this.coord.z, -1, 1, -width, width);
      this.coord.y = s.map(this.origin.y / this.coord.z, -1, 1, -height, height);
    }

    draw() {
      const size = s.lerp(8, 1, this.coord.z / height);
      let col = color;

      if (this.sign < 0) {
        col = s.color(s.abs(360 - s.hue(color)), 100, 100);
      }
      s.stroke(col);
      s.strokeWeight(size);
      s.strokeCap(s.ROUND);
      s.line(this.coord.x, this.coord.y, this.oldPos.x, this.oldPos.y);

      s.noStroke();
      s.fill(col);
      s.ellipse(this.coord.x, this.coord.y, size, size);
    }

  }

  s.setup = () => {
    s.createCanvas(width, height);
    s.colorMode(s.HSB);
    backgroundColor = s.color(0,0,0);
    stars = _.range(nbStars).map(() => new Star());
  };

  s.draw = () => {
    s.background(backgroundColor);
    s.translate(width/2, height/2);
    _(stars).each(obj => {
      const noiseVal = s.noise(s.mouseX * noiseScale);
      color = s.color(noiseVal*360, 100, 100);
      obj.update();
      obj.draw();
    });
  };

  s.windowResized = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    s.resizeCanvas(width, height);
  }
}
