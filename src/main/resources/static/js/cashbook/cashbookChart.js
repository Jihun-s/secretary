function totalMonthExpense() {
    $.ajax({
        url: "/secretary/cashbook/chart/donutMonthExpense",
        type: "POST",
        data: { chYear: 2023, chMonth: 9 },
        dataType: "JSON",
        success: (result) => {
          // alert(JSON.stringify(result));
          let dataFromServer = result;
    
          const labels = dataFromServer.map(
            (item) => `${item.cate1Name} - ${item.cate2Name}`
          );
          const data = dataFromServer.map((item) => item.totalMonthExpense);
    
          // 데이터를 복사하고 정렬
          const sortedData = [...data].sort((a, b) => b - a);
    
          // 동적으로 배경색을 설정
          const backgroundColors = data.map((amount) => {
            const rank = sortedData.indexOf(amount) + 1; // 순위는 1부터 시작
    
            if (rank === 1) {
              return "#696CFF";
            } else if (rank === 2) {
              return "#71DD37";
            } else if (rank === 3) {
              return "#03C3EC";
            } else {
              return "#8592A3";
            }
          });
    
          const ctx = document.getElementById("DonutMonthExpense").getContext("2d");
          const DonutMonthExpense = new Chart(ctx, {
            type: "doughnut",
            data: {
              labels: labels,
              datasets: [
                {
                  data: data,
                  backgroundColor: backgroundColors,
                  borderColor: ["black"],
                  borderWidth: 0,
                },
              ],
            },
            options: {
              aspectRatio: 1,
              maintainAspectRatio: false,
            },
          });
        },
        error: (e) => {
          console.log("도넛 월지출 실패" + JSON.stringify(e));
        },
      });
}