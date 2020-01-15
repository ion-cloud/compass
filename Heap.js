// This Heap class defaults to behavior as a minHeap where popping
// off the heap will result in the smallest value of the Tree-sorted
// heap. You can invert this into a maxHeap by supplying a comparator
// function or even a custom Heap or operate on custom data
export class Heap{
  constructor(values,compare=(x,y)=>x<y){
    this.values = [];
    this.compare = compare;
    values.forEach(o=> this.push(o));
  }
  get length(){
    return this.values.length;
  }
  push(value){
    this.values.push(value);
    this.float(this.values.length-1);
  }
  swap(i,j){
    [this.values[i],this.values[j]] = [this.values[j],this.values[i]];
  }

  // Moves a value downward until it is greater (minHeap) or lesser
  // (maxHeap) than its children.
  sink(index){
    const value = this.values[index];

    let leftIndex, rightIndex, swapIndex, needsSwap;

    // Invariant: the value is at index.
    // Variant: the index proceedes down the tree.
    while (true) {

      // Compute the indicies of the children.
      rightIndex = (index + 1) * 2;
      leftIndex = rightIndex - 1;

      // determine if it is greater (minHeap) or smaller (maxHeap) than the
      // parent (value) and thus whether it can be floated upward
      needsSwap = false;
      if (leftIndex < this.values.length) {
        // If the child is greater than the parent, it can be floated.
        if (this.compare(this.values[leftIndex],value)) {
          swapIndex = leftIndex;
          needsSwap = true;
        } //end if
      } //end if

      // If the right child exists, determine whether it is greater (minHeap)
      // or smaller (maxHeap) than the parent (value), or even greater than
      // the left child.
      if (rightIndex < this.values.length) {
        if (this.compare(this.values[rightIndex],needsSwap?this.values[leftIndex]:value)) {
          swapIndex = rightIndex;
          needsSwap = true;
        } //end if
      } //end if

      // if there is a child that is less than the value, float the child and
      // sink the value.
      if (needsSwap) {
        this.swap(index,swapIndex);
        index = swapIndex;
        // and continue sinking
      } else {
        break; //if the children are both less than value, stop
      } //end if
    }
  }
  float(originalIndex){
    let selectedIndex = originalIndex,
        value = this.values[selectedIndex];

    while(selectedIndex>0){
      const parentIndex = Math.floor((selectedIndex+1)/2)-1,
            parentValue = this.values[parentIndex];

      if(!this.compare(parentValue,value)){
        this.swap(parentIndex,selectedIndex);
      }else{

        // stop if the parent is greater than the value
        break;
      } //end if
      selectedIndex = parentIndex; //continue up the tree
    }
  }
  updateItem(item){
    const index = this.values.indexOf(item);

    if(index===-1) return;
    this.sink(index);
    this.float(index);
  }
  pop(){
    const result = this.values[0],
          top = this.values.pop();

    if(this.values.length){
      this.values[0] = top;
      this.sink(0);
    } //end if
    return result;
  }
}
