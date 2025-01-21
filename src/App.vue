<script setup lang="ts">

import { ref } from 'vue'
import matrix from './components/classes/matrix'

enum GameStatus {
  not_started,
  started,
  lost,
  won
}

const directions = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1]]

var game_board_size_x: number
var game_board_size_y: number
var mines_board: matrix
var mine_numbers_board: matrix
var player_board = ref()

var game_status = GameStatus.not_started
var debug_mode = true

function create_boards() {
  mines_board = new matrix(game_board_size_x, game_board_size_y)
  mine_numbers_board = new matrix(game_board_size_x, game_board_size_y)
  player_board = ref(new matrix(game_board_size_x, game_board_size_y))
}

function print_debug(message: any) {
  if (debug_mode) { console.log(message) }
}

function print_for_player(message: any) {
  //console.log(message)
  alert(message)
}

function place_mines(mine_ratio = 8) {
  var matrix_size = mines_board.get_size()
  var mines_to_place = matrix_size / mine_ratio

  for (let index = 0; index < mines_to_place; index++) {
    var x = Math.floor(Math.random() * mines_board.width)
    var y = Math.floor(Math.random() * mines_board.height)
    if (mines_board.get_value(x, y) == 1) {
      mines_to_place++
    }
    mines_board.set_value(x, y, 1)
  }
}

function calculate_mine_numbers() {
  for (let y = 0; y < mine_numbers_board.height; y++) {
    for (let x = 0; x < mine_numbers_board.width; x++) {
      if (mines_board.get_value(x, y) == 1) {
        mine_numbers_board.set_value(x, y, -1)
      } else {
        var adjacent_mines = 0

        for (const direction of directions) {
          var dx = direction[0]
          var dy = direction[1]

          if (mines_board.get_value(x - dx, y - dy, true) == 1) { adjacent_mines++ }
        }

        mine_numbers_board.set_value(x, y, adjacent_mines)
      }
    }
  }
}

function count_mines() {
  var all_values = mines_board.get_all_values()
  var mines = 0
  for (let i = 0; i < all_values.length; i++) {
    mines += all_values[i];
  }
  return mines
}

function count_unrevealed_cells() {
  var player_cells = player_board.value.get_all_values()
  var unrevealed_cells = 0

  for (let i = 0; i < player_cells.length; i++) {
    if (player_cells[i] == "?") {
      unrevealed_cells++
    }
  }

  return unrevealed_cells
}

function check_for_win() {
  //check if there are unrevealed cells that are mines
  //count number of unrevealed cells in player board, compare to number of mains

  if (count_unrevealed_cells() == count_mines()) {
    //game won
    win_game()
  }
}

function reset_player_board() {
  player_board.value.set_all_values("?")
}

function reveal_cell(x: number, y: number) {
  if (game_status != GameStatus.started) {
    return
  }

  if (player_board.value.get_value(x, y) != "?") {
    return
  }

  if (mines_board.get_value(x, y) == 1) {
    game_over()
    return
  }

  auto_reveal_adjacent_mines(x, y)
  check_for_win()
}

function auto_reveal_adjacent_mines(x: number, y: number) {
  if (!mine_numbers_board.value_is_in_bounds(x, y)) {
    //"out of bounds
    return
  }

  if (player_board.value.get_value(x, y) != "?") {
    //already analized
    return
  }

  if (mine_numbers_board.get_value(x, y) == -1) {
    //mine found, finish recursion
    return
  }

  var number_of_adjacent_mines = mine_numbers_board.get_value(x, y)
  player_board.value.set_value(x, y, number_of_adjacent_mines + "")

  if (mine_numbers_board.get_value(x, y) > 0) {
    return
  }

  for (const direction of directions) {
    var dx = direction[0]
    var dy = direction[1]

    auto_reveal_adjacent_mines(x + dx, y - dy)
  }
}

function game_over() {
  game_status = GameStatus.lost
  print_for_player("you lost :c")
}

function win_game() {
  game_status = GameStatus.won
  print_for_player("you win c:")
}

function start_game(game_board_size_x_param=20, game_board_size_y_param=20) {
  game_status = GameStatus.started

  game_board_size_x = game_board_size_x_param
  game_board_size_y = game_board_size_y_param

  create_boards()
  reset_player_board()

  place_mines(10)

  calculate_mine_numbers()
}



start_game()

</script>

<template>

 
  <div v-for="y in player_board.height">

    <span v-for="x in player_board.width">



      <button class="buttoncell" v-bind:class="'buttoncolor'+player_board.get_value(x - 1, y - 1)"  @click="reveal_cell(x - 1, y - 1)">
      
        {{ player_board.get_value(x - 1, y - 1) }}
      </button>

    </span>

  </div>

</template>

<style scoped >

.buttoncell{
  color: rgb(95, 91, 91);
  background-color: rgb(133, 127, 127);
}

.buttoncolor0 {
  color:rgb(207, 206, 206);
  background-color: rgb(207, 206, 206);
}

.buttoncolor1 {
  color: rgb(37, 31, 194);
  background-color: rgb(207, 206, 206);
 
}

.buttoncolor2 {
  color: rgb(81, 147, 29);
  background-color: rgb(207, 206, 206);
}

.buttoncolor3 {
  color: rgb(185, 42, 42);
  background-color: rgb(207, 206, 206);
}

.buttoncolor4 {
  color: rgb(167, 124, 30);
  background-color: rgb(207, 206, 206);
}
</style>