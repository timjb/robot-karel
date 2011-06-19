module KarelLibrary
( ifElseK
, ifK
, unlessK
, whileK
, untilK
, doWhileK
, doUntilK
, timesK
, turnAround
, moveBack
, moveLeft
, moveRight
, moveDiagonalLeft
, moveDiagonalRight
, turnULeft
, turnURight
, gotoWall
, gotoCorner
) where


import RobotKarel
import Control.Monad (replicateM_, liftM)


-- Control statements
-- ==================

ifElseK :: Karel Bool -> Karel a -> Karel a -> Karel a
ifElseK i t e = i >>= \b -> if b then t else e

ifK :: Karel Bool -> Karel () -> Karel ()
ifK i t = ifElseK i t (return ())

unlessK :: Karel Bool -> Karel () -> Karel ()
unlessK i = ifElseK i (return ())

whileK :: Karel Bool -> Karel a -> Karel ()
whileK head body = ifElseK head (body >> whileK head body) (return ())

untilK :: Karel Bool -> Karel a -> Karel ()
untilK head = whileK (liftM not head)

doWhileK :: Karel a -> Karel Bool -> Karel ()
doWhileK body head = body >> whileK head body

doUntilK :: Karel a -> Karel Bool -> Karel ()
doUntilK body head = body >> untilK head body

timesK :: Int -> Karel a -> Karel ()
timesK = replicateM_


-- Helpers
-- =======

turnAround :: Karel ()
turnAround = 2 `timesK` turnLeft

moveBack :: Karel ()
moveBack = do
  turnAround
  move
  turnAround

moveLeft :: Karel ()
moveLeft = do
  turnLeft
  move
  turnRight

moveRight :: Karel ()
moveRight = do
  turnRight
  move
  turnLeft

moveDiagonalLeft :: Karel ()
moveDiagonalLeft = do
  move
  turnLeft
  move
  turnRight

moveDiagonalRight :: Karel ()
moveDiagonalRight = do
  move
  turnRight
  move
  turnLeft

turnULeft :: Karel ()
turnULeft = do
  turnLeft
  move
  turnLeft

turnURight :: Karel ()
turnURight = do
  turnRight
  move
  turnRight

gotoWall :: Karel ()
gotoWall = untilK isWall move

gotoCorner :: Karel ()
gotoCorner = turnRight >> 2 `timesK` (gotoWall >> turnLeft)
