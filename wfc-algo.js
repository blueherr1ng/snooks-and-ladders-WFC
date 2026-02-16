//wave function collapse algorithm
//algorithmically solves a grid by placing valid tiles in it
//while acting upon a set of rules to eventually flood the grid
//with tiles to form a procedurally generated image

//reference: https://youtu.be/2SuvO4Gi7uY?si=JAj3ykYYx6NNpEeZ
//reference: https://vectrx.substack.com/p/wave-function-collapse
//reference: https://discourse.processing.org/t/wave-collapse-function-algorithm-in-processing/12983
//reference: https://www.kirupa.com/javascript/2d_arrays.htm#:~:text=Old%2Dschool%20For%20Loop%20Approach,having%20a%20value%20of%200.
//reference: https://www.boristhebrave.com/2020/04/13/wave-function-collapse-explained/
//reference: BFS! https://www.cs.cmu.edu/~15122/handouts/slides/review/22-dfs.pdf

//tiles "library"

//body configurations
const sh = new Tile("sh", { n: 0, e: 1, s: 0, w: 1 }, 0.2);
const sv = new Tile("sv", { n: 1, e: 0, s: 1, w: 0 }, 0.2);
const arcq1 = new Tile("q1", { n: 1, e: 0, s: 0, w: 1 }, 0.08);
const arcq2 = new Tile("q2", { n: 1, e: 1, s: 0, w: 0 }, 0.08);
const arcq3 = new Tile("q3", { n: 0, e: 1, s: 1, w: 0 }, 0.08);
const arcq4 = new Tile("q4", { n: 0, e: 0, s: 1, w: 1 }, 0.08);
//head configurations
const hn = new Tile("hn", { n: 1, e: 0, s: 0, w: 0 }, 0.04);
const hs = new Tile("hs", { n: 0, e: 0, s: 1, w: 0 }, 0.04);
const hw = new Tile("hw", { n: 0, e: 0, s: 0, w: 1 }, 0.04);
const he = new Tile("he", { n: 0, e: 1, s: 0, w: 0 }, 0.04);

const wc = new Tile("wc", { n: 1, e: 1, s: 1, w: 1 }, 0);

//array of possible tile superpositions for cell superpositions
const TILES = [sh, sv, arcq1, arcq2, arcq3, arcq4, hn, hs, hw, he];
Tile.getAdjacencies();
//dimensions for grid
const dim = 20;
let grid = [];

//initGrid initializes a grid of default constructor cells that will
//be solved upon in future iterations as part of the wave function collapse
//POSTCONDITION: a 10x10 grid (temporary) is generated
function initGrid() {
  grid = [];
  for (let r = 0; r < dim; r++) {
    const row = [];
    for (let c = 0; c < dim; c++) {
      row.push(new Cell());
    }
    grid.push(row);
  }
  return grid;
}

function getWeightedRandom(options) {
  let totalWeight = 0;
  for (let tile of options) {
    totalWeight += tile.weight;
  }
  let r = random(totalWeight);

  for (let tile of options) {
    if (r < tile.weight) {
      return tile;
    }
    r -= tile.weight;
  }
}

//lowestEntropies(grid) returns an array containing indices of
//cells with the lowest entropy.
//PRECONDITION: grid is a VALID grid
//POSTCONDITION: lowestEntropies(grid) returns the indices of lowest entropies
function lowestEntropies() {
  //find minimum available entropy
  let min = Infinity;
  for (let r = 0; r < dim; r++) {
    for (let c = 0; c < dim; c++) {
      let less = grid[r][c].superpositions.length < min;
      if (less && !grid[r][c].collapsed) {
        min = grid[r][c].superpositions.length;
      }
    }
  }
  //if no entropy is found, give an empty array
  if (min === Infinity) {
    return [];
  }

  //scan for all values sharing the minimum and add them to an array
  let lowests = [];
  for (let r = 0; r < dim; r++) {
    for (let c = 0; c < dim; c++) {
      let minfound = grid[r][c].superpositions.length === min;
      if (minfound && !grid[r][c].collapsed) {
        lowests.push([r, c]);
      }
    }
  }
  return lowests;
}

function getNeighbors(r, c) {
  let result = [];
  if (r > 0) {
    result.push([r - 1, c]);
  }
  if (r < dim - 1) {
    result.push([r + 1, c]);
  }
  if (c > 0) {
    result.push([r, c - 1]);
  }
  if (c < dim - 1) {
    result.push([r, c + 1]);
  }
  return result;
}

function getDirection(r, c, nr, nc) {
  if (nr - r == 1) {
    return "s";
  }
  if (r - nr == 1) {
    return "n";
  }
  if (nc - c == 1) {
    return "e";
  }
  if (c - nc == 1) {
    return "w";
  }
}

function updateNeighbor(cur_r, cur_c, new_r, new_c) {
  //calculate direction through change in index
  let dir = getDirection(cur_r, cur_c, new_r, new_c);
  let cell = grid[cur_r][cur_c];
  let nborCell = grid[new_r][new_c];
  //store past length of neighbor superpositions
  let nborOld = nborCell.superpositions.length;

  let trash = [];

  for (let nbor_pos of nborCell.superpositions) {
    let compatible = false;
    for (let pos of cell.superpositions) {
      let possibles = pos.adjacencies[dir];
      if (possibles.includes(nbor_pos)) {
        compatible = true;
        break;
      }
    }
    if (!compatible) {
      trash.push(nbor_pos);
    }
  }

  for (let bad of trash) {
    nborCell.remSuperposition(bad);
  }

  //get new length of neighbor superpositions
  let nborNew = nborCell.superpositions.length;

  //return a boolean if updates actually occured
  return nborOld != nborNew;
}

//propagate
function propagate(r, c) {
  let Q = [];
  //enqueue starting position
  Q.push([r, c]);
  //begin loop
  //while(!queue_empty(Q))
  while (Q.length > 0) {
    //dequeue "vertex" v (current indices)
    let [cur_row, cur_col] = Q.shift();
    //get list of neighbors from "vertex" v
    let nbors = getNeighbors(cur_row, cur_col);
    //while(more neighbors exist)
    while (nbors.length > 0) {
      // dequeue first "neighbor vertex" w
      let [nbor_row, nbor_col] = nbors.shift();
      //if w is not marked and not collapsed
      if (!grid[nbor_row][nbor_col].collapsed) {
        //update based off of v
        let isChanged = updateNeighbor(cur_row, cur_col, nbor_row, nbor_col);
        if (isChanged) {
          Q.push([nbor_row, nbor_col]);
        }
      }
    }
  }
}

function solve() {
  //logic that loops this
  let superpositions = lowestEntropies();
  while (superpositions.length != 0) {
    let [r, c] = random(superpositions);
    let cell = grid[r][c];
    if (cell.superpositions.length == 0) {
      cell.superpositions = [wc];
      cell.collapsed = true;
    } else {
      let choice = getWeightedRandom(cell.superpositions);
      cell.collapseTo(choice);
    }
    propagate(r, c);
    superpositions = lowestEntropies();
  }
  console.log("solved");
}
