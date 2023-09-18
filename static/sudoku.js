
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000); // 3초 후에 토스트 메시지 숨김
}


document.addEventListener("DOMContentLoaded", function() {
    const sudokuForm = document.getElementById('sudokuForm');
    const refreshButton = document.getElementById('refreshButton');

    // 새로고침 버튼 이벤트 바깥으로 이동
    refreshButton.addEventListener('click', function() {
        event.stopPropagation(); // 이벤트 전파 중지
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                cell.value = "";  // 모든 칸을 빈 문자열로 설정
            }
        }
    });

    sudokuForm.addEventListener('submit', function(event) {
        event.preventDefault();

        let board = [];
        for (let i = 0; i < 9; i++) {
            let row = [];
            for (let j = 0; j < 9; j++) {
                let cellValue = document.getElementById(`cell-${i}-${j}`).value;
                if (cellValue === "") {
                    row.push(0);
                } else {
                    row.push(parseInt(cellValue, 10));
                }
            }
            board.push(row);
        }

        // 여기서 board는 9x9 배열로, 스도쿠 보드의 각 칸의 값을 담고 있습니다.
        // 이 값을 JSON 형식으로 변환하여 서버로 전송할 수 있습니다.

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/solve_sudoku', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.status === "success") {
                    const answer = response.answer;
                    for (let i = 0; i < 9; i++) {
                        for (let j = 0; j < 9; j++) {
                            const cell = document.getElementById(`cell-${i}-${j}`);
                            cell.value = answer[i][j];
                        }
                    }
                } else {
                    showToast("해당 스도쿠 문제는 풀이가 불가능합니다.");
                }
            }
        };
        xhr.send(JSON.stringify({ board: board }));
    });
});

