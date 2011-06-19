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
, emptyInfiniteWorld
, emptyFiniteWorld
, showWorld
, Karel
, runKarel
, evalKarel
, execKarel
) where


import Control.Monad.Error
import Control.Monad.State
import Data.List (intercalate, transpose)
import Data.Maybe (fromJust)


-- Row

data Row a = Row { before  :: [a]
                 , current :: a
                 , after   :: [a]
                 } deriving (Show)

goForward :: Row a -> Maybe (Row a)
goForward (Row a b (c:cs)) = Just $ Row (b:a) c cs
goForward _                = Nothing

goBack :: Row a -> Maybe (Row a)
goBack (Row (a:as) b c) = Just $ Row as a (b:c)
goBack _                = Nothing

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
showWorld (Row a b c) = unlines $ map showRow (reverse $ limit c) ++ [showCurrRow b] ++ map showRow (limit a)
  where showRow     (Row d e f) = intercalate " " . map showField $ (reverse $ limit f) ++ [e] ++ limit d
        showCurrRow (Row d e f) = intercalate " " $ map showField (reverse $ limit f) ++ ["^"] ++ map showField (limit d)
        limit = take 10

emptyInfiniteWorld :: World
emptyInfiniteWorld = infiniteRow $ infiniteRow emptyField

emptyFiniteWorld :: Int -- ^ width
                 -> Int -- ^ depth
                 -> World
emptyFiniteWorld w d = Row [] row (replicate (d-1) row)
  where row = Row [] emptyField (replicate (w-1) emptyField)

currentField :: World -> Field
currentField (Row _ (Row _ field _) _) = field

modifyCurrentField :: (Field -> Field) -> World -> World
modifyCurrentField f (Row back (Row left   c   right) front) =
                     (Row back (Row left (f c) right) front)

nextField :: World -> Maybe Field
nextField w = fmap currentField (goForward w)


-- Actions
-- =======

data KarelError = TooHighError
                | NoBrickError
                | WallError
                | OtherError String

instance Error KarelError where
  strMsg = OtherError

instance Show KarelError where
  show TooHighError   = "Can't jump more than 1 brick up or down"
  show NoBrickError   = "Can't remove a brick because there isn't any"
  show WallError      = "Can't move/put a brick/etc because Karel's standing in front of a wall"
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

isWall :: Karel Bool
isWall = do
  nextWorld <- gets goForward
  case nextWorld of
    Nothing  -> return False
    (Just _) -> return True

move :: Karel ()
move = do
  nextWorld <- gets goForward
  case nextWorld of
    Nothing  -> throwError WallError
    (Just w) -> do
      bricksHere  <- gets $ bricks . currentField
      bricksThere <- countBricks
      let difference = abs $ bricksHere - bricksThere
      if difference > 2 then throwError TooHighError
                        else put w

-- for internal use only
rotateRight :: World -> World
rotateRight (Row a (Row b1 b2 b3) c) = Row (zipWith3 Row (myTranspose $ map before c) b1 (myTranspose $ map before a))
                                           (Row (map current c) b2 (map current a))
                                           (zipWith3 Row (myTranspose $ map after c) b3 (myTranspose $ map after a))
  where myTranspose :: [[a]] -> [[a]]
        myTranspose [] = repeat []
        myTranspose a  = transpose a

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
countBricks = gets $ maybe 0 bricks . nextField

isBrick :: Karel Bool
isBrick = do
  c <- countBricks
  return (c>0)

-- for internal use only
addBricks :: Int -> Karel ()
addBricks n = do
  nextWorld <- gets goForward
  case nextWorld of
    Nothing  -> throwError WallError
    (Just w) -> do
      bricks <- countBricks
      when (bricks + n < 0) (throwError NoBrickError)
      put (fromJust . goBack . modifyCurrentField addBricksToField $ w)
  where addBricksToField f = f { bricks = bricks f + n }

putBrick :: Karel ()
putBrick = addBricks 1

removeBrick :: Karel ()
removeBrick = addBricks (-1)
