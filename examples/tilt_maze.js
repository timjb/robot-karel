function go() {
  fast();
  while (!isWall()) {
    move();
  }
  slowly();
}

// Exercise
// ========
//
// Move from the upper left to
// the lower right corner using only the
// functions go, turnLeft and turnRight.
//
// You can find a solution by scrolling
// down.
//
// More such "tilt mazes" can here:
// http://www.logicmazes.com/tilt.html
















































// Solution
// ========

/*
turnLeft();
go();
turnRight();
go();
turnRight();
go();
turnRight();
go();
turnRight();
go();
turnLeft();
go();
turnLeft();
go();
turnLeft();
go();
turnLeft();
go();
*/