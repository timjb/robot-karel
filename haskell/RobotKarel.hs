{-# LANGUAGE GeneralizedNewtypeDeriving #-}

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
, World
, Karel
, runKarel
, evalKarel
, execKarel
, emptyWorld
, showWorld
) where


import Control.Monad.Error
import Control.Monad.State
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


-- Actions
-- =======

data KarelError = TooHighError
                | NoBrickError
                | OtherError String

instance Error KarelError where
  strMsg = OtherError

instance Show KarelError where
  show TooHighError   = "Can't jump more than 1 brick up or down"
  show NoBrickError   = "Can't remove a brick because there isn't any"
  show (OtherError s) = s

newtype Karel a = K { runK :: ErrorT KarelError (State World) a }
                  deriving (Monad, MonadError KarelError, MonadState World)

runKarel :: Karel a -> World -> Either KarelError (a, World)
runKarel k w = case runState (runErrorT (runK k)) w of
                 (Left err, _) -> Left err
                 (Right r, w)  -> Right (r, w)

evalKarel :: Karel a -> World -> Either KarelError a
evalKarel k = fmap fst . runKarel k

execKarel :: Karel a -> World -> Either KarelError World
execKarel k = fmap snd . runKarel k

-- Navigation

-- TODO: Test if the difference in height is one or zero, complain otherwise.
move :: Karel ()
move = do
  bricksHere  <- gets $ bricks . currentField
  bricksThere <- gets $ bricks . nextField
  let difference = abs $ bricksHere - bricksThere
  if difference > 2 then throwError TooHighError
                    else modify goForward

-- for internal use only
rotateRight :: World -> World
rotateRight (Row a (Row b1 b2 b3) c) = Row (zipWith3 Row (transpose $ map before c) b1 (transpose $ map before a))
                                           (Row (map current c) b2 (map current a))
                                           (zipWith3 Row (transpose $ map after c) b3 (transpose $ map after a))

-- when the world rotates right beneath the robot, it seems like the robot turns left
turnLeft :: Karel ()
turnLeft = modify rotateRight

turnRight :: Karel ()
turnRight = do
  turnLeft
  turnLeft
  turnLeft


-- Markers

isMarker :: Karel Bool
isMarker = gets $ marker . currentField

putMarker :: Karel ()
putMarker = modify $ modifyCurrentField (\f -> f { marker = True })

removeMarker :: Karel ()
removeMarker = modify $ modifyCurrentField (\f -> f { marker = False })

toggleMarker :: Karel ()
toggleMarker = do
  m <- isMarker
  if m then removeMarker
       else putMarker


-- Bricks

countBricks :: Karel Int
countBricks = gets $ bricks . nextField

isBrick :: Karel Bool
isBrick = do
  c <- countBricks
  return (c>0)

-- for internal use only
addBricks :: Int -> World -> World
addBricks n = goBack . modifyCurrentField (\f -> f { bricks = bricks f + 1 }) . goForward

putBrick :: Karel ()
putBrick = modify (addBricks 1)

removeBrick :: Karel ()
removeBrick = do
  bricks <- countBricks
  if bricks <= 0 then throwError NoBrickError
                 else modify (addBricks (-1))
