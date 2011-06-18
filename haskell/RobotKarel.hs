module RobotKarel
( move
, turnLeft
, turnRight
, isMarker
, putMarker
, removeMarker
, toggleMarker
, countBricks
, isBrick
, putBrick
, removeBrick
, World(..)
, emptyWorld
, showWorld
) where


import Control.Monad.State
import Control.Monad.Trans.Error
import Data.List (intercalate, transpose)


-- Row

data Row a = Row { before  :: [a]
                 , current :: a
                 , after   :: [a]
                 } deriving (Show)

goForward :: Row a -> Row a
goForward (Row a b (c:cs)) = Row (b:a) c cs

goBack :: Row a -> Row a
goBack (Row (a:as) b c) = Row as a (b:c)

infiniteRow :: a -> Row a
infiniteRow a = Row (repeat a) a (repeat a)


-- Field

data Field = Field { marker :: Bool
                   , bricks :: Int
                   }

emptyField :: Field
emptyField = Field False 0

showField :: Field -> String
showField f
  | marker f  = [['a'..] !! bricks f]
  | otherwise = show $ bricks f


-- World

type World = Row (Row Field)

showWorld :: World -> String
showWorld (Row a b c) = intercalate "\n" $ map showRow $ (reverse $ take n a) ++ [b] ++ take n c
  where showRow (Row d e f) = intercalate " " . map showField $ (reverse $ take n d) ++ [e] ++ take n f
        n = 8

emptyWorld :: World
emptyWorld = infiniteRow $ infiniteRow emptyField

currentField :: World -> Field
currentField (Row _ (Row _ field _) _) = field

modifyCurrentField :: (Field -> Field) -> World -> World
modifyCurrentField f (Row back (Row left   c   right) front) =
                      (Row back (Row left (f c) right) front)

nextField :: World -> Field
nextField = currentField . goForward


-- Navigation

-- TODO: Test if the difference in height is one or zero, complain otherwise.
move :: State World ()
move = modify goForward

-- for internal use only
rotateRight :: World -> World
rotateRight (Row a (Row b1 b2 b3) c) = Row (zipWith3 Row (transpose $ map before c) b1 (transpose $ map before a))
                                           (Row (map current c) b2 (map current a))
                                           (zipWith3 Row (transpose $ map after c) b3 (transpose $ map after a))

-- when the world rotates right beneath the robot, it seems like the robot turns left
turnLeft :: State World ()
turnLeft = modify rotateRight

turnRight :: State World ()
turnRight = do
  turnLeft
  turnLeft
  turnLeft


-- Markers

isMarker :: State World Bool
isMarker = gets $ marker . currentField

putMarker :: State World ()
putMarker = modify $ modifyCurrentField (\f -> f { marker = True })

removeMarker :: State World ()
removeMarker = modify $ modifyCurrentField (\f -> f { marker = False })

toggleMarker :: State World ()
toggleMarker = do
  m <- isMarker
  if m then removeMarker
       else putMarker


-- Bricks

countBricks :: State World Int
countBricks = gets $ bricks . nextField

isBrick :: State World Bool
isBrick = do
  c <- countBricks
  return (c>0)

-- for internal use only
addBricks :: Int -> World -> World
addBricks n = goBack . modifyCurrentField (\f -> f { bricks = bricks f + 1 }) . goForward

putBrick :: State World ()
putBrick = modify (addBricks 1)

-- maybe test if there is a brick and complain otherwise?
removeBrick :: State World ()
removeBrick = modify (addBricks (-1))
