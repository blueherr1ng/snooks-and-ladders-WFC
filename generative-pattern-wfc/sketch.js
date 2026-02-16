function setup() {
  createCanvas(windowWidth, windowHeight);
  background("rgb(99, 173, 248)");
  initGrid();
  Tile.getAdjacencies();
  solve();
}

function renderGrid() {
  let w = width / dim;
  for (let r = 0; r < dim; r++) {
    for (let c = 0; c < dim; c++) {
      let x = c * w;
      let y = r * w;
      let cell = grid[r][c];

      //grid vizualizer
      stroke("rgb(60, 158, 255)");
      noFill();
      rect(x, y, w, w);

      //cell drawer
      if (cell.collapsed) {
        let tile = cell.superpositions[0];
        tile.display(x, y, w);
      } else {
        fill(200, 50);
        noStroke();
        ellipse(x + w / 2, y + w / 2, w * 0.2);
      }
    }
  }
}

function renderLadders() {
  let w = width / dim;

  for (let numladder = 0; numladder < 10; numladder++) {
    let randrow = floor(random(0, dim));
    let randcol = floor(random(0, dim));
    let x = randcol * w;
    let y = randrow * w;
    let ladderlen = floor(random(1, 3));
    for (let h = 0; h < ladderlen; h++) {
      if (randrow + h >= dim) break;
      push();
      translate(x + w / 2, y + h * w + w / 2);
      stroke("rgb(136, 74, 35)");
      strokeWeight(10);
      line(-w / 4, w / 4, w / 4, w / 4);
      line(-w / 4, -w / 4, w / 4, -w / 4);
      for (let side of [-1, 1]) {
        push();
        translate((w / 4) * side, 0);
        line(0, -w / 2, 0, w / 2);
        pop();
      }
      pop();
    }
  }
}

function draw() {
  background("rgb(99, 173, 248)");
  renderGrid();
  renderLadders();
  noLoop();
}
