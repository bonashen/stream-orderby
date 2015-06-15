/**
 * Created by bona on 2015/6/9.
 */
var through = require("through");
var each = require("foreach");

var orderBy = function (data, option) {
    var getValuefn = function (name) {
        return function (obj) {
            return getValue(obj, name);
        };
    };
    var getValue = function (obj, name) {//support dot operator
        name = name.split(".");
        var i, l;
        for (i = 0, l = name.length - 1; i < l; i++) {
            if (obj.hasOwnProperty(name[i]))
                obj = obj[name[i]];
            else {
                return null;
            }
        }
        return obj[name[l]];
    };

    function processOption(opt, reverse) {
        var ret = [];
        switch (typeof opt) {
            case 'object':
                if (opt instanceof Array) {//is array,like this:[{getValue:function(doc){},reverse:false},{key:'name',reverse:true}]
                    each(opt, function (value) {
                        ret = ret.concat(processOption(value));
                    });
                    break;
                }
                //is object,like this: {keys:'name',reverse:true}
                reverse = opt.reverse;
                if (opt.getValue) {
                    ret = [opt];
                    break;
                }
                else {
                    ret = processOption(opt.keys, reverse);
                }
                break;
            case 'string': // is String,like this: 'name,age'
                var tmp = ret;
                each(opt.split(','), function (name) {
                    tmp.push({getValue: getValuefn(name), reverse: reverse, description: 'order by ' + name});
                });
                break;
            case 'function'://is function,like this:function(doc){}
                ret = [{getValue: opt, description: 'order by function'}];
                break;
        }
        return ret;
    }

    option = processOption(option);

    //console.log(option);

    var compare = function (a, b) {
        var ret = 0;
        for (var i = 0; (i < option.length) && (ret === 0); i++) {
            var x, y;
            x = option[i].getValue(a);
            y = option[i].getValue(b);
            if (option[i].reverse) {
                var tmp = x;
                x = y;
                y = tmp;
            }
            ret = x < y ? -1 : x > y ? 1 : 0;
        }
        return ret;
    };

    return data.sort(compare);
};

module.exports = function (option) {
    var data = [];
    var s = through(
        //write
        data.push.bind(data)
        , function () {
            //end
            data = orderBy(data, option);
            function next() {
                var doc = data.shift();
                if (doc) {
                    s.emit('data', doc);
                    process.nextTick(next);
                } else {
                    s.emit('end');
                }
            }

            process.nextTick(next);

        });
    return s;
};