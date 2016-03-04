$(function() {

    // fields
    $('.field__input')
        .on('focus', function(e) {
            $(this).parent().addClass('is-focus is-filled');
        })
        .on('blur', function(e) {
            var $this = $(this);
            $this.parent().removeClass('is-focus');
            if (!$this.val()) $this.parent().removeClass('is-filled');
        });

    $('.field__clear').on('click', function(e) {
        var parent = $(this).parents('.field');
        var input = parent.find('.field__input');
        e.preventDefault();
        if (input.val()) {
            input.val('');
            parent.removeClass('is-filled');
        }
    });

    // radio groups
    $('.check-group .radio, .check-group .check').on('click', function(e) {
        e.stopPropagation();
    });
    $('.check-group').on('click', function(e) {
        $(this).find('input[type="radio"], input[type="checkbox"]').trigger('click');
    });

    // attendance slider
    var container = $('.attendance');
    var slider = container.find('.slider');
    var tooltip = container.find('.slider-tooltip').remove();
    var displayedValue = container.find('.attendance__value');
    var currentBpIndex;
    var CLASS_TEST = /bp-\d/g;

    var values = [50, 100, 250, 500, 1000, 3000, 5000, 10000, 25000, 30000];
    var breakpoints = [50, 250, 1000, 5000];

    container.find('.slider-points').html(renderDots(values));

    noUiSlider.create(slider[0], {
        start: values[0],
        range: createRange(values)
    });

    slider.find('.noUi-handle-lower').append(tooltip);

    slider[0].noUiSlider.on('change', onSliderChange);
    slider[0].noUiSlider.on('set', onSliderChange);
    slider[0].noUiSlider.set(values[0]);

    function onSliderChange(strVal, handle, val, tap, positions) {
        var value = val[handle];
        var newBpIndex = getBpIndex(value);

        displayedValue.text(formatValueSting(val[handle], values));

        if (newBpIndex !== currentBpIndex) {
            tooltip
                .removeClass(function(i, className) {
                    var matched = className.match(CLASS_TEST);
                    if (matched) return matched.join(' ');
                    return '';
                })
                .addClass('bp-' + (newBpIndex + 1));
        }
    }

    function createRange(values) {
        var range = {};
        var step = Math.round(100 / (values.length - 1) * 100) / 100;
        values.forEach(function(val, i) {
            switch (i) {
                case 0:
                    range.min = [val, values[i + 1] - val];
                    break;
                case values.length - 1:
                    range.max = [val];
                    break;
                default:
                    range[i * step + '%'] = [val, values[i + 1] - val];
            }
        });
        return range;
    }

    function renderDots(values) {
        var step = Math.round(100 / (values.length - 1) * 100) / 100;

        return values.map(function(val, i) {
            return (
                '<div class="slider-point" style="left: ' + (step * i) + '%">'
                    + formatValueSting(val, values)
                + '</div>'
            );
        }).join('');
    }

    function formatValueSting(value, array) {
        var index = array.indexOf(value);
        switch (index) {
            case -1:
                return formatNumber(value);
            case array.length - 1:
                return formatNumber(array[index - 1]) + '+';
            default:
                return formatNumber(array[index - 1] || 0) + '-' + formatNumber(value);
        }
    }

    function formatNumber(str) {
        if (typeof str !== 'string') str = str.toString();
        return str
            .split('')
            .reverse()
            .map(function(el, i) {
                return (i === 0 || i % 3) ? el : el + ',';
            })
            .reverse()
            .join('');
    }

    function getBpIndex(val) {
        for (var i = 0; i < breakpoints.length; i++) {
            if (val >= breakpoints[i] && val < (breakpoints[i + 1] || Infinity)) return i;
        }
        return 0;
    }
});
