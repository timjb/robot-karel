-- This is a translation of examples/javascript/pyramid.js to Haskell

import RobotKarel
import KarelLibrary

main = case execKarel karelMain $ emptyFiniteWorld 9 9 of 
         (Left e)  -> print e
         (Right w) -> print w


karelMain = buildPyramid >> gotoCorner >> removeMarkers

buildPyramid = outer >> untilK (testNext isMarker) inner
  where outer = outerRing >> fillRing
        inner = innerRing >> fillRing

removeMarkers = removeOuterRing >> whileK isMarker removeInnerRing

testNext :: Karel Bool -> Karel Bool
testNext a = move >> a >>= \res -> moveBack >> return res

inside p s = 4 `timesK` (whileK p s >> turnLeft)
ring p s = inside p s >> moveDiagonalLeft

superMove = putBrick >> move >> putMarker
outerRing = ring notIsWall superMove
innerRing = ring (testNext notIsMarker) superMove

putBrickBelowAndMove = move >> turnAround >> putBrick >> turnAround
fillRing = do
  untilK isMarker (do
    putBrickBelowAndMove
    ifK isMarker (moveLeft >> moveBack `doUntilK` isMarker >> move))
  turnAround
  moveDiagonalLeft

removeOuterRing = ring notIsWall (move >> removeMarker)
removeInnerRing = ring (testNext isMarker) (move >> removeMarker)
