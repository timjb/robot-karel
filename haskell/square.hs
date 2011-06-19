import RobotKarel
import KarelLibrary

main = case execKarel karelMain $ emptyFiniteWorld 6 6 of 
         (Left e)  -> print e
         (Right w) -> print w

karelMain :: Karel ()
karelMain = square 6

square :: Int -> Karel ()
square n = 4 `timesK` (line (n-1) >> turnLeft)

line :: Int -> Karel ()
line n = n `timesK` (putBrick >> move)
