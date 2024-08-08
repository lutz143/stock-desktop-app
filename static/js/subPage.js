function fetchMetaData() {
    $.ajax({
        url: 'metadata',
        method: 'GET',
        success: function(data) {
            const table = $('meta-table').DataTable();
            table.clear();
            data.forEach(function(row) {
                table.row.add([
                    row.Ticker,
                    row.website,
                    row.fullTimeEmployees,
                    row.longBusinessSummary,
                    row.industry,
                    row.sector
                ]).draw();
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const headerButtons = document.querySelectorAll('.header-button');

    headerButtons.forEach(button => {
        button.addEventListener('click', () => {
            headerButtons.forEach(btn => {
                btn.classList.remove('active');
            })
            button.classList.add('active');
        })
    })
})