//tile class
//tiles are the available configurations for a cell in
//a grid, and are renderable objects
//tile objects have an id, sockets for north south east west
//and a weight at which they are randomly generated
//tiles can be compared for valid adjacency when
//rendering and solving a grid
//reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
//reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects
//reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch

class Tile {
  constructor(id, sockets, weight) {
    this.id = id;
    this.sockets = sockets;
    this.weight = weight;
  }

  //find the opposite directions
  static OPP = {
    n: "s",
    e: "w",
    s: "n",
    w: "e",
  };

  display(x, y, w) {
    push();
    translate(x + w / 2, y + w / 2);
    let snookRand = random(1);
    stroke(230);
    strokeWeight(40);
    noFill();

    switch (this.id) {
      case "sh":
        line(-w / 2, 0, w / 2, 0);
        if (snookRand < 0.2) {
          push();
          stroke(255);
          strokeWeight(36);
          line(-w / 2, 0, w / 2, 0);
          pop();
        }
        break;
      case "sv":
        line(0, -w / 2, 0, w / 2);
        if (snookRand > 0.2) {
          push();
          stroke(255);
          strokeWeight(36);
          line(0, -w / 2, 0, w / 2);
          pop();
        }
        break;
      case "q1":
        arc(-w / 2, -w / 2, w, w, 0, HALF_PI);
        if (snookRand < 0.6) {
          push();
          stroke(255);
          strokeWeight(36);
          arc(-w / 2, -w / 2, w, w, 0, HALF_PI);
          pop();
        }
        break;
      case "q2":
        arc(w / 2, -w / 2, w, w, HALF_PI, PI);
        if (snookRand < 0.3) {
          push();
          stroke(255);
          strokeWeight(36);
          arc(w / 2, -w / 2, w, w, HALF_PI, PI);
          pop();
        }
        break;
      case "q3":
        arc(w / 2, w / 2, w, w, PI, PI + HALF_PI);
        if (snookRand < 0.5) {
          push();
          stroke(255);
          strokeWeight(36);
          arc(w / 2, w / 2, w, w, PI, PI + HALF_PI);
          pop();
        }
        break;
      case "q4":
        arc(-w / 2, w / 2, w, w, PI + HALF_PI, TWO_PI);
        if (snookRand > 0.3) {
          push();
          stroke(255);
          strokeWeight(36);
          arc(-w / 2, w / 2, w, w, PI + HALF_PI, TWO_PI);
          pop();
        }
        break;
      case "hn":
        line(0, 0, 0, -w / 2);
        circle(0, 0, 0.9);

        //beak
        push();
        strokeWeight(20);
        stroke("orange");
        fill("orange");
        circle(0, w / 4, 0.5);
        pop();

        push();
        stroke(255);
        strokeWeight(36);
        line(0, 0, 0, -w / 2);
        circle(0, 0, 0.9);
        pop();

        //eyes
        for (let side of [-1, 1]) {
          push();
          translate((w / 5) * side, w / 12);
          strokeWeight(8);
          stroke("rgb(71, 72, 115)");
          circle(0, 0, 0.5);
          pop();
        }

        break;
      case "hs":
        line(0, 0, 0, w / 2);
        circle(0, 0, 0.9);

        //beak
        push();
        strokeWeight(20);
        stroke("orange");
        fill("orange");
        circle(0, -w / 4, 0.5);
        pop();

        push();
        stroke(255);
        strokeWeight(36);
        line(0, 0, 0, w / 2);
        circle(0, 0, 0.9);
        pop();

        //eyes
        for (let side of [-1, 1]) {
          push();
          translate((w / 5) * side, -w / 12);
          strokeWeight(8);
          stroke("rgb(71, 72, 115)");
          circle(0, 0, 0.5);
          pop();
        }

        break;
      case "he":
        line(0, 0, w / 2, 0);
        circle(0, 0, 0.9);

        //beak
        push();
        strokeWeight(20);
        stroke("orange");
        fill("orange");
        circle(-w / 4, 0, 0.5);
        pop();

        push();
        stroke(255);
        strokeWeight(36);
        line(0, 0, w / 2, 0);
        circle(0, 0, 0.9);
        pop();

        //eyes
        for (let side of [-1, 1]) {
          push();
          translate(-w / 12, (w / 5) * side);
          strokeWeight(8);
          stroke("rgb(71, 72, 115)");
          circle(0, 0, 0.5);
          pop();
        }

        break;
      case "hw":
        line(0, 0, -w / 2, 0);
        circle(0, 0, 0.9);

        //beak
        push();
        strokeWeight(20);
        stroke("orange");
        fill("orange");
        circle(w / 4, 0, 0.5);
        pop();

        push();
        stroke(255);
        strokeWeight(36);
        line(0, 0, -w / 2, 0);
        circle(0, 0, 0.9);
        pop();

        //eyes
        for (let side of [-1, 1]) {
          push();
          translate(w / 12, (w / 5) * side);
          strokeWeight(8);
          stroke("rgb(71, 72, 115)");
          circle(0, 0, 0.5);
          pop();
        }

        break;
      case "wc":
        fill(255, 0, 0, 100);
        rect(-w / 2, -w / 2, w, w);
        break;
    }
    pop();
  }

  //checks if tile A in the direction of tile B
  //is a valid pairing of tile adjacencies
  //PRECONDITION: A is a valid tile, B is a valid tile, and
  //              dir is a valid direction
  //POSTCONDITION: boolean return of whether A and B are valid pairings for
  //               a specified direction
  static adjacentValid(A, B, dir) {
    return A.sockets[dir] == B.sockets[Tile.OPP[dir]];
  }

  //calculates valid adjacent tiles given a library of tiles to
  //operate on.
  //PRECONDITION: none
  //POSTCONDITION: tiles in TILES library gains new field called adjacencies
  //               that stores valid adjacent tiles per direction
  static getAdjacencies() {
    //tile 1
    for (let tile of TILES) {
      //create new field
      tile.adjacencies = { n: [], e: [], s: [], w: [] };
      //loop over other tiles
      for (let tile2 of TILES) {
        //loop over directions
        for (let dir of ["n", "e", "s", "w"]) {
          if (Tile.adjacentValid(tile, tile2, dir)) {
            tile.adjacencies[dir].push(tile2);
          }
        }
      }
    }
  }
}
