$.fn.dynamicTestSearchExternally = function(id) {
    var target = $(this);
    var searchBox = $(id);

    searchBox.off('keyup').on('keyup', function() {
        if (searchBox.val() == '') {
            target.removeClass('hide').addClass('displayed');
        } else {
            var condition = parseTimeRangeCondition(searchBox.val());

            if ($.isEmptyObject(condition))
            {
                pattern = RegExp(searchBox.val(), 'gi');
                target.each(function() {
                    var t = $(this);
                    if (pattern.test(t.html())) {
                        t.removeClass('hide').addClass('displayed');
                    } else {
                        t.removeClass('displayed').addClass('hide');
                    }
                });
            } else {
                target.each(function() {
                    var t = $(this);

                    if (check(condition, getTestBeginTime(t))) {
                        t.removeClass('hide').addClass('displayed');
                    } else {
                        t.removeClass('displayed').addClass('hide');
                    }
                });
            };
        }
    });

    return target;
}



$(document).ready(function() 
{
    $('#test-collection .test').dynamicTestSearchExternally('#test-view #searchTests');
    $('#cat-collection .category-item').dynamicTestSearchExternally('#categories-view #searchTests');
    $('#exception-collection .exception-item').dynamicTestSearchExternally('#exceptions-view #searchTests');
        
});


function parseTimeRangeCondition(value)
{
    var date = {};

    if (0 === value.length) return date;

    var prefix = "#date-range(";

    if (0 === value.indexOf(prefix))
    {
        var pos = value.indexOf(")", prefix.length);
        if (pos < 0) pos = value.length;

        var raws = value.slice(prefix.length, pos).split("->");

        if (raws.length == 2)
        {
            var tempBegin = Date.parse(raws[0].trim());
            var tempEnd = Date.parse(raws[1].trim());

            if (!isNaN(tempBegin) && !isNaN(tempEnd))
            {
                date.begin = tempBegin;
                date.end = tempEnd;
            }
        }
    }

    return date;
}


function check(condition, value)
{
    if ("end" in condition && "begin" in condition)
    {
        return value >= condition.begin && value <= condition.end;
    }

    return true;
}

function getTestBeginTime(jqueryElement)
{
    var startedTimeElements = jqueryElement.find("span[title|='Test started time']");

    return Date.parse(startedTimeElements.text().trim());
}