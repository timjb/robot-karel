module.exports = {
  HIGHLIGHT_LINE: false,
  MAX_JUMP_HEIGHT: 1,
  COLORS: {
    BRICK:  0xff0000,
    BLOCK:  0x666666,
    MARKER: 0xcccc55
  },
  ERRORS: {
    put_brick_wall: "Karel kann keinen Ziegel hinlegen. Er steht vor einer Wand.",
    remove_brick_wall: "Karel kann keinen Ziegel aufheben. Er steht vor einer Wand.",
    remove_brick_no_brick: "Karel kann keinen Ziegel aufheben, da kein Ziegel vor ihm liegt.",
    move_wall: "karel kann keinen Schritt machen, er steht vor einer Wand.",
    move_too_high: "karel kann nur einen Ziegel pro Schritt nach oben oder unten springen.",
    put_block_wall: "karel kann keinen Quader hinlegen. Er steht vor einer Wand.",
    put_block_already_is_block: "karel kann keinen Quader hinlegen, da schon einer liegt.",
    put_block_is_brick: "karel kann keinen Quader hinlegen, da auf dem Feld schon Ziegel liegen.",
    remove_block_wall: "karel kann keinen Quader entfernen. Er steht vor einer Wand.",
    remove_block_no_block: "karel kann keinen Quader entfernen, da auf dem Feld kein Quader liegt."
  }
}
