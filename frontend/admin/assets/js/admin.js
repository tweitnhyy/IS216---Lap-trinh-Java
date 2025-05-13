document.addEventListener("DOMContentLoaded", () => {
  // Initialize charts with animations
  const combinedChart = echarts.init(document.getElementById("combinedChart"));
  combinedChart.setOption({
    //title: { text: "Doanh thu & Vé (5 năm qua)", textStyle: { color: '#333', fontWeight: 'bold' } },
    tooltip: { trigger: "axis", backgroundColor: 'rgba(0, 0, 0, 0.7)', textStyle: { color: '#fff' } },
    legend: { data: ["Vé đã bán", "Vé còn lại", "Doanh thu"], textStyle: { color: '#333' } },
    xAxis: { data: ["2020", "2021", "2022", "2023", "2024"], axisLabel: { color: '#333' } },
    yAxis: [
      { type: "value", name: "Số vé", position: "right", axisLabel: { color: '#333' } },
      { type: "value", name: "Doanh thu (triệu VNĐ)", position: "left", axisLabel: { color: '#333' } }
    ],
    series: [
      {
        name: "Vé đã bán",
        type: "bar",
        data: [1000, 1500, 2000, 2500, 3000],
        itemStyle: { color: "#4BC0C0" },
        animationDuration: 1000
      },
      {
        name: "Vé còn lại",
        type: "bar",
        data: [500, 300, 200, 100, 50],
        itemStyle: { color: "#FF6384" },
        animationDuration: 1000
      },
      {
        name: "Doanh thu",
        type: "line",
        yAxisIndex: 1,
        data: [50, 75, 100, 125, 150],
        itemStyle: { color: "#36A2EB" },
        animationDuration: 1000
      }
    ],
    animationEasing: 'elasticOut'
  });

  const revenueChart = echarts.init(document.getElementById("revenueChart"));
  revenueChart.setOption({
    //title: { text: "Doanh thu theo tháng (3 năm)", textStyle: { color: '#333', fontWeight: 'bold' } },
    tooltip: { trigger: "axis", backgroundColor: 'rgba(0, 0, 0, 0.7)', textStyle: { color: '#fff' } },
    legend: { data: ["2023", "2024", "2025"], textStyle: { color: '#333' } },
    xAxis: { type: "category", data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], axisLabel: { color: '#333' } },
    yAxis: { type: "value", axisLabel: { color: '#333' } },
    series: [
      { name: "2023", type: "line", data: [10, 20, 15, 25, 30, 40, 35, 45, 50, 55, 60, 65], itemStyle: { color: "#FF2D95" }, animationDuration: 1000 },
      { name: "2024", type: "line", data: [15, 25, 20, 30, 35, 45, 40, 50, 55, 60, 65, 70], itemStyle: { color: "#FFC1E3" }, animationDuration: 1000 },
      { name: "2025", type: "line", data: [20, 30, 25, 35, 40, 50, 45, 55, 60, 65, 70, 75], itemStyle: { color: "#09397C" }, animationDuration: 1000 }
    ],
    animationEasing: 'elasticOut'
  });

  const ticketsChart = echarts.init(document.getElementById("ticketsChart"));
  ticketsChart.setOption({
    //title: { text: "Vé đã bán theo tháng (3 năm)", textStyle: { color: '#333', fontWeight: 'bold' } },
    tooltip: { trigger: "axis", backgroundColor: 'rgba(0, 0, 0, 0.7)', textStyle: { color: '#fff' } },
    legend: { data: ["2023", "2024", "2025"], textStyle: { color: '#333' } },
    xAxis: { type: "category", data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], axisLabel: { color: '#333' } },
    yAxis: { type: "value", axisLabel: { color: '#333' } },
    series: [
      { name: "2023", type: "line", data: [100, 150, 120, 180, 200, 250, 220, 280, 300, 320, 340, 360], itemStyle: { color: "#FF2D95" }, animationDuration: 1000 },
      { name: "2024", type: "line", data: [120, 170, 140, 200, 220, 270, 240, 300, 320, 340, 360, 380], itemStyle: { color: "#FFC1E3" }, animationDuration: 1000 },
      { name: "2025", type: "line", data: [140, 190, 160, 220, 240, 290, 260, 320, 340, 360, 380, 400], itemStyle: { color: "#09397C" }, animationDuration: 1000 }
    ],
    animationEasing: 'elasticOut'
  });

  const ticketTypeChart = echarts.init(document.getElementById("ticketTypeChart"));
  ticketTypeChart.setOption({
    //title: { text: "Loại vé đã bán (Năm nay)", textStyle: { color: '#333', fontWeight: 'bold' } },
    tooltip: { trigger: "item", backgroundColor: 'rgba(0, 0, 0, 0.7)', textStyle: { color: '#fff' } },
    legend: { orient: "vertical", left: "left", textStyle: { color: '#333' } },
    series: [
      {
        name: "Loại vé",
        type: "pie",
        radius: "50%",
        data: [
          { value: 300, name: "VIP", itemStyle: { color: "#FF2D95" } },
          { value: 500, name: "Standard", itemStyle: { color: "#FFC1E3" } },
          { value: 200, name: "General", itemStyle: { color: "#09397C" } }
        ],
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0, 0, 0, 0.5)" } },
        animationDuration: 1000,
        animationEasing: 'elasticOut'
      }
    ]
  });

  const orgChart = echarts.init(document.getElementById("orgChart"));
  orgChart.setOption({
    //title: { text: "Biểu đồ Top ban tổ chức", textStyle: { color: '#333', fontWeight: 'bold' } },
    tooltip: { trigger: "item", backgroundColor: 'rgba(0, 0, 0, 0.7)', textStyle: { color: '#fff' } },
    legend: { orient: "vertical", left: "left", textStyle: { color: '#333' } },
    series: [
      {
        name: "Số sự kiện",
        type: "pie",
        radius: "50%",
        data: [
          { value: 50, name: "Org A", itemStyle: { color: "#FF2D95" } },
          { value: 30, name: "Org B", itemStyle: { color: "#FFC1E3" } },
          { value: 20, name: "Org C", itemStyle: { color: "#09397C" } },
          { value: 15, name: "Org D", itemStyle: { color: "#E4E4E4" } },
          { value: 10, name: "Org E", itemStyle: { color: "#F8EEFF" } }
        ],
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0, 0, 0, 0.5)" } },
        animationDuration: 1000,
        animationEasing: 'elasticOut'
      }
    ]
  });

  // Approve Table Functionality
  const approveTable = document.getElementById("approveTable");
  if (approveTable) {
    approveTable.querySelectorAll(".approve-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.closest("tr");
        row.classList.add("slide-up");
        setTimeout(() => {
          row.remove();
          alert("Đã thêm thành công!");
        }, 500);
      });
    });

    approveTable.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.closest("tr");
        row.classList.add("slide-down");
        setTimeout(() => row.remove(), 500);
      });
    });
  }

  // Add window resize listener for charts
  window.addEventListener('resize', () => {
    combinedChart.resize();
    revenueChart.resize();
    ticketsChart.resize();
    ticketTypeChart.resize();
    orgChart.resize();
  });
});