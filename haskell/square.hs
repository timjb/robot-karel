import RobotKarel
import Control.Monad.State

main = putStr . showWorld . snd $ runState karelMain emptyWorld

karelMain :: State World ()
karelMain = square 6

times :: (Monad m) => Int -> m () -> m ()
times n action = foldl (>>) (return ()) $ replicate n (action)

square :: Int -> State World ()
square n = 4 `times` (line (n-1) >> turnLeft)

line :: Int -> State World ()
line n = n `times` (putBrick >> move)
