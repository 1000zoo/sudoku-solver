from flask import Flask, request, jsonify, send_from_directory
from copy import deepcopy
import random

app = Flask(__name__, static_folder='static')

def get_blank(board):
    pos = []
    for i, row in enumerate(board):
        for j, col in enumerate(row):
            if col == 0:
                pos.append((i, j))
    return pos

def solve(board):
    answer = deepcopy(board)
    rows = [[False] * 10 for _ in range(10)]
    cols = [[False] * 10 for _ in range(10)]
    squares = [[False] * 10 for _ in range(10)]
    pos = get_blank(board)
    blank = len(pos)

    for i in range(9):
        for j in range(9):
            if not isinstance(board[i][j], int):
                return None

            if board[i][j] != 0:
                num = board[i][j]
                sq_index = (i // 3) * 3 + j // 3

                if rows[i][num] or cols[j][num] or squares[sq_index][num]:
                    return None
                rows[i][num] = True
                cols[j][num] = True
                squares[sq_index][num] = True
    # for i, r in enumerate(board):
    #     for j, c in enumerate(r):
    #         if c != 0:
    #             sq_index = (i // 3) * 3 + j // 3
    #             if rows[i][c] or cols[j][c] or squares[sq_index][c]:
    #                 return None


    def brute_force(depth):
        if depth == blank:
            return True
            
        
        r, c = pos[depth]
        sq_index = (r // 3) * 3 + c // 3
        q = list(range(1, 10))
        random.shuffle(q)
        for n in q:
            if not rows[r][n] and not cols[c][n] and not squares[sq_index][n]:
                rows[r][n] = cols[c][n] = squares[sq_index][n] = True
                answer[r][c] = n
                if brute_force(depth + 1):
                    return True
                
                rows[r][n] = cols[c][n] = squares[sq_index][n] = False
                answer[r][c] = 0
    
    
    return answer if brute_force(0) else None
    


@app.route('/solve_sudoku', methods=['POST'])
def solve_sudoku():
    data = request.json
    board = data['board']
    answer = solve(board)
    
    if answer:
        return jsonify({"status" : "success", "answer" : answer})
    else:

        return jsonify({"status" : "failure"})

@app.route('/')
def main():
    return send_from_directory('static', 'index.html')


if __name__ == "__main__":
    app.run('localhost', port=8080, debug=True)