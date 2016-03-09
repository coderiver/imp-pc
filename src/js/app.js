/*global $, jQuery, noUiSlider*/
$(function() {

    // show step 2
    (function() {
        var wrapper = $('.l-content-wrapper');
        var sidebar = $('.l-page-sidebar');
        var body = $('body');
        var btn = $('#btn-confirm');
        var stepOne = $('#step-one');
        var stepTwo = $('#step-two');
        var tiles = stepTwo.find('> .tile, > .tile-group');
        var duration = 500;
        var delay = 200;

        stepTwo.hide();
        tiles.css({
            transform: 'translateY(100px)',
            transition: 'all 0.5s ease',
            opacity: 0
        });

        btn.on('click', showStepTwo);

        function showStepTwo() {
            wrapper.css('overflow', 'hidden');
            wrapper.find('.l-page-content').animate({scrollTop: 0}, duration);
            sidebar.show();
            setTimeout(function() {
                body.toggleClass('sidebar-active');
            }, 0);
            stepOne.add('.header .btn-round').fadeOut(500, function () {
                stepTwo.show(animateTiles);
                wrapper.css('overflow', '');
            });
        }

        function animateTiles() {
            tiles.each(function (i, el) {
                var tile = $(el);
                setTimeout(function () {
                    tile.css({
                        transform: '',
                        opacity: ''
                    });
                    setTimeout(function () {
                        tile.css({
                            transition: ''
                        });
                    }, duration);
                }, i * delay);
            });
        }
    })();

    // app design block
    (function() {
        var container = $('#app-design');
        var panel = container.find('.tile-panel');
        var radio = container.find('.tile input[type="radio"]');
        radio.on('change', function(e) {
            var value = $(this).val();
            var visible = panel.is(':visible');
            if (value !== '1' && !visible) {
                panel.slideDown();
            } else if (value === '1' && visible) {
                panel.slideUp();
            }
        });
        panel.slideUp();
    })();

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
    (function() {

        /**
         * Attandence slider Class
         * @param { string, object } container
         * @param { object } options
         * @constructor
         *
         * options.values - array of points for slider
         * options.breakpoint - array of points on where tooltip should change his icon
         * option.initValue - initial value for slider
         */
        function AttendanceSlider(container, options) {
            this.container             = (container instanceof $) ? container : $(container);
            this.values                = options.values;
            this.breakpoints           = options.breakpoints;
            this.initValue             = (options.initValue == null) ? this.values[0] : options.initValue;
            this.currentBpIndex        = null;
            this.currentValue          = null;

            this.init();
        }

        AttendanceSlider.CLASS_TEST = /bp-\d/g;

        AttendanceSlider.prototype.init = function() {
            var slider = this.slider   = this.container.find('.slider');
            this.tooltip               = this.container.find('.slider-tooltip').remove();
            this.displayedValue        = this.container.find('.slider-value');

            this.container.find('.slider-points').html(this.renderDots());
            this.displayedValue.html(this.renderDisplayedValues());

            this.displayedValuesList = this.displayedValue.children().first();

            noUiSlider.create(slider[0], {
                start: this.values[0],
                range: this.createRange()
            });

            slider.find('.noUi-handle-lower').append(this.tooltip);

            slider[0].noUiSlider.on('slide', this.onSliderSlide.bind(this));
            slider[0].noUiSlider.on('set', this.onSliderSlide.bind(this));
            slider[0].noUiSlider.set(this.initValue);
        };

        AttendanceSlider.prototype.onSliderSlide = function(strVal, handle, val, tap, positions) {
            var value = val[handle];
            var newBpIndex = this.getBpIndex(value);
            this.updateTooltip(newBpIndex);
            this.changeDisplayedValue(value);
        };

        AttendanceSlider.prototype.createRange = function(values) {
            values = values || this.values;
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
        };

        AttendanceSlider.prototype.renderDots = function(values) {
            values = values || this.values;
            var step = Math.round(100 / (values.length - 1) * 100) / 100;

            return values.map(function(val, i) {
                return (
                    '<div class="slider-point" style="left: ' + (step * i) + '%">' +
                        this.formatValueSting(val, values) +
                    '</div>'
                );
            }.bind(this)).join(' ');
        };

        AttendanceSlider.prototype.renderDisplayedValues = function(values) {
            values = values || this.values;
            var html = '<ul class="slider-values-list">';

            html += values.map(function(val, i) {
                return (
                    '<li class="slider-value-list-item" data-value="' + val + '">' +
                        '<span>' + this.formatValueSting(val) + '</span>' +
                    '</li>'
                );
            }.bind(this)).join(' ');

            html += '</ul>';

            return html;
        };

        AttendanceSlider.prototype.formatValueSting = function(value) {
            var array = this.values;
            var index = array.indexOf(value);
            switch (index) {
                case -1:
                    return this.formatNumber(value);
                case array.length - 1:
                    return this.formatNumber(array[index - 1]) + '+';
                default:
                    return this.formatNumber(array[index - 1] || 0) + '-' + this.formatNumber(value);
            }
        };

        AttendanceSlider.prototype.formatNumber = function(str) {
            if (typeof str === 'number') str = str.toString();
            return str
                .split('')
                .reverse()
                .map(function(el, i) {
                    return (i === 0 || i % 3) ? el : el + ',';
                })
                .reverse()
                .join('');
        };

        AttendanceSlider.prototype.getBpIndex = function(val) {
            var breakpoints = this.breakpoints;
            for (var i = 0; i < breakpoints.length; i++) {
                if (val >= breakpoints[i] && val < (breakpoints[i + 1] || Infinity)) return i;
            }
            return 0;
        };

        AttendanceSlider.prototype.changeDisplayedValue =  function(newValue) {
            if (newValue === this.currentValue) return;
            var index = this.values.indexOf(newValue);

            if (index > -1) {
                this.displayedValuesList.css({
                    transform: 'translateY(-' + this.displayedValue.height() * index + 'px)'
                });
                this.displayedValue.css({
                    width: this.displayedValuesList.children().eq(index).children().first().width()
                })
            }

            this.currentValue = newValue;
        };

        AttendanceSlider.prototype.updateTooltip = function(index) {
            if (index === this.currentBpIndex) return;

            this.tooltip
                .removeClass(function(i, className) {
                    var matched = className.match(AttendanceSlider.CLASS_TEST);
                    if (matched) return matched.join(' ');
                    return '';
                })
                .addClass('bp-' + (index + 1));

            this.currentBpIndex = index;
        };

        // create instances
        new AttendanceSlider('.attendance:first', {
            values: [50, 100, 250, 500, 1000, 3000, 5000, 10000, 25000, 30000],
            breakpoints: [50, 250, 1000, 5000]
        });

        new AttendanceSlider('.attendance:last', {
            values: [50, 100, 500, 1000, 5000, 10000, 15000, 20000],
            breakpoints: [50, 500, 1000, 5000],
            initValue: 500
        });
    })();
});
