function handleTime(start = null, end = null) {
    let format = 'YYYY-MM-DDTHH:mm:ss';

    if (start == null) {
        start = moment().startOf('day').format(format) + 'Z';
    }

    if (end == null) {
        end = moment().endOf('day').format(format) + 'Z';
    }

    let start_time = new Date(start);
    let end_date = new Date(end);
    $('#start').val(start);
    $('#stop').val(end);

    $('.time-range').daterangepicker({
      timePicker: true,
      startDate: start_time,
      endDate: end_date,
      locale: {
        format: 'MMMM D, YYYY hh:mm A'
      }
    }, function(start, end, label) {
      $('#start').val(start.format(format) + 'Z');
      $('#stop').val(end.format(format) + 'Z');
    });
}