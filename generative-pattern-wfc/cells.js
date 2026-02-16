//cell class
//cells are the elements within a grid that track
//state for planting tiles.
//cells have an array of superpositions (valid tile states)
//and a boolean state that describes if they have been collapsed
//or not

//reference: google ai overview from search term
//"how to remove elemnts from list in js"
//reference: oop ap cs a knowledge
//reference: https://discourse.processing.org/t/wave-collapse-function-algorithm-in-processing/12983
//reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#:~:text=%2C%20if%20specified).-,Description,to%20begin%20searching%20for%20searchElement%20.

class Cell {
  constructor() {
    this.collapsed = false;
    this.superpositions = [...TILES];
  }

  //accessors - may be unused if
  //fields can be directly accessed in js

  //isCollapsed(c) returns a boolean of whether
  //or not the inputted cell is collapsed
  isCollapsed() {
    return this.collapsed;
  }
  //getsuperpositions(c) checks what available superpositions
  //exist for an uncollapsed cell c
  getSuperpositions() {
    if (this.collapsed) {
      throw new Error("cell is collapsed, no available superpositions");
    }
    return this.superpositions;
  }

  //mutators

  //collapseTo(tile) sets the collapsed boolean field
  //in this cell to true if the cell is not collapsed.
  //additionally collapseTo(tile) will set the superpositions
  //to only be the inputted tile
  //PRECONDITION: !this.collapsed and this.includes(tile);
  //POSTCONDITION: this.collapsed, and this.superpositions = [tile]
  collapseTo(tile) {
    if (this.collapsed) {
      throw new Error("cell is already collapsed!");
    }
    if (!this.superpositions.includes(tile)) {
      throw new Error("attempting to collapse to invalid tile");
    }
    this.superpositions = [tile];
    this.collapsed = true;
  }

  //remSuperposition(c, superposition) removes the input superposition
  //from the list of possible superpositions in cell
  //c
  //PRECONDITION: !this.collapsed
  //POSTCONDITION: this.superpositions.includes(superposition) is false
  remSuperposition(superposition) {
    // if(this.collapsed){
    //   throw new Error("cell is already collapsed")
    // }
    //chat recommended changing above code block to
    if (this.collapsed) return;
    this.superpositions = this.superpositions.filter(
      (item) => item !== superposition,
    );
    if (this.superpositions.length === 0) {
      throw new Error("no valid tile types left in this cell");
    }
  }
}
