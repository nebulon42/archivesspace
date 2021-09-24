$(function () {
  var initCustomReportTemplateForm = function () {
    $(document).on('change', '#custom_record_type', function () {
      var selected_record_type = $(this).val();

      $('.record_type').hide();
      $('.record_type.' + selected_record_type).show();

      $('li.sidebar-entry-basic_information_fields a')[0].href =
        '#' + selected_record_type + '_basic_information_fields';
      $('li.sidebar-entry-linked_records a')[0].href =
        '#' + selected_record_type + '_linked_records';
      $('li.sidebar-entry-sort_by a')[0].href =
        '#' + selected_record_type + '_sort_by';
    });
    $('#custom_record_type').trigger('change');
  };

  initCustomReportTemplateForm();

  // Don't fire a request for *every* keystroke.  Wait until they stop
  // typing for a moment.
  var username_typeahead = AS.delayedTypeAhead(function (query, callback) {
    $.ajax({
      url: AS.app_prefix('users/complete'),
      data: { query: query },
      type: 'GET',
      success: function (usernames) {
        callback(usernames);
      },
      error: function () {
        callback([]);
      },
    });
  });

  function extractor(query) {
    var result = /([^,]+)$/.exec(query);
    if (result && result[1]) return result[1].trim();
    return '';
  }

  $('.user-field').typeahead({
    source: username_typeahead.handle,
    updater: function (item) {
      $text_area = $('#' + this.$element.attr('id').replace(/_control$/, ''));
      console.log(item + ' *');
      values = $text_area.val().split('\n');
      values.push(item);
      set = new Set(values);
      console.log(set);
      deduped_values = [];
      set.forEach(function (value) {
        if (value.length > 0) {
          deduped_values.push(value);
        }
      });
      $text_area.val(deduped_values.join('\n'));
      return '';
    },
  });

  $('.user-field-clear-button').click(function (e) {
    $(this).siblings('textarea').val('');
  });
});

$(document).ready(function () {
  $('#check_all').on('click', function () {
    $(this).toggleClass('btn-success');
    var checkboxes = $('.display input[type="checkbox"]');
    if (checkboxes.prop('checked')) {
      checkboxes.prop('checked', false);
    } else {
      checkboxes.prop('checked', true);
    }
  });
});
