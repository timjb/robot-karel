import RobotKarel
import Control.Monad
import Control.Monad.State

main = putStr $ case execKarel karelMain $ emptyFiniteWorld 6 6 of 
                  (Left e)  -> show e
                  (Right w) -> showWorld w

karelMain :: Karel ()
karelMain = square 6

times :: (Monad m) => Int -> m a -> m ()
times = replicateM_

square :: Int -> Karel ()
square n = 4 `times` (line (n-1) >> turnLeft)

line :: Int -> Karel ()
line n = n `times` (putBrick >> move)
