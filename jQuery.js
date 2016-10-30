(function (w) {
    //为了避免全部变量污染，将变量定义到自定义函数中
    var version = "1.0.0";

    var document = w.document;

    var arr = [],
        push = arr.push,
        slice = arr.slice;

    var obj = {},
        toString = obj.toString,
        hasown = obj.hasOwnProperty;
    //工厂函数
    function jQuery(selector) {
        return new init(selector);
    }

    //原型简写
    jQuery.fn = jQuery.prototype = {
        jQuery: version,
        constructor: jQuery,
        isReady: false,
        length: 0,
        toArray: function () {
            return slice.call(this);
        },
        get: function (num) {
            /*
             * 如果为整数，则返回this[num]
             * 如果为负数，则返回this[this.length + num]
             * 如果为null或undefined，则调用toArray返回数组
             * */
            if (num == null) {
                return this.toArray();
            }

            return num >= 0 ? this[num] : this[this.length + num];
        },
        slice: function () {
            /*
             slice返回的是一个新的实例：可以通过jQuery()得到
             * 截取的功能可以借用数组的slice方法实现。
             * */
            /*var $new = jQuery();
             var arr = slice.apply( this, arguments );
             push.apply( $new, arr );
             return $new;*/

            return jQuery(slice.apply(this, arguments));
        },
        eq: function (num) {
            var dom;
            //如果传入null或undefined，则返回一个新的实例
            if (num == null) {
                return jQuery();
            }
            //如果传入数字，得到对应下标的元素，包装成新的实例返回
            // 如果没有得到，则直接返回新的实例。
            /*dom = this.get( num );
             if ( dom ) {
             return jQuery( dom );
             }else {
             return jQuery();
             }*/

            return (dom = this.get(num)) ? jQuery(dom) : jQuery();
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        // 原型上的each方法，是为实例准备的，
        // 所以借用静态的each遍历实例即可。
        each: function (fn) {
            return jQuery.each(this, fn);
        },
        // 原型上的map方法，是为实例准备的，
        // 所以借用静态的map遍历实例,
        // 然后把静态map方法返回的数组再返回即可。
        map: function (fn) {
            return jQuery.map(this, fn);
        },
        push: push,
        sort: arr.sort,
        splice: arr.splice

    }

    // 给jQuery自身以及原型添加一个extend方法
    jQuery.extend = jQuery.fn.extend = function () {
        /*
         * 如果传入1个对象，把这个对象的内容copy到this身上，
         * 如果传入多个对象，把后面所有对象的内容copy到第一个对象身上。
         * */
            var arg = arguments,
                argLen = arg.length,
                key, i = 1;

            // 1个对象，把这个对象的内容copy到this身上
            if (argLen == 1) {
                for (key in arg[0]) {
                    this[key] = arg[0][key];
                }
            }
            // 多个对象，把后面所有对象的内容copy到第一个对象身上。
            else if (argLen > 1) {
                for (; i < argLen; i++) {
                    for (key in arg[i]) {
                        arg[0][key] = arg[i][key];
                    }
                }
            }
        }
        for (var key in obj) {
            this[key] = obj[key];
        }


    //添加静态方法
    jQuery.extend({
        //接下来是判断输入的变量。
        //判断是不是函数
        isFunction: function (func) {
            return typeof func === 'function';
        },
        //判断是不是字符串
        isString: function (str) {
            return typeof str === 'string';
        },
        //判断是不是Dom
        //dom元素都有nodeType属性
        isDom: function (dom) {
            return !!dom && !!dom.nodeType;
        },
        //判断是不是html片段
        //html片段：
        //以<开头，>结尾，length大于三
        isHTML: function (html) {
            return html.charAt(0) === '<' &&
                html.charAt(html.length - 1) === '>' &&
                html.length >= 3;
        },
        //判断是不是window
        isWindow: function (win) {
            return !!win && win.window === win;
        },
        //判断是不是数组或者伪数组
        isLikeArray: function (likeArray) {
            //首先，如果传入的是function或者window直接返回false
            if (jQuery.isFunction(likeArray) || jQuery.isWindow(likeArray)) {
                return false;
            }
            //如果likeArray是对象，且有length属性，length属性值为0或者拥有length-1的属性
            return !!likeArray && typeof likeArray === 'object' &&
                'length' in likeArray &&
                (likeArray.length === 0 || [likeArray.length - 1] in likeArray);
        },
        //解析html
        parseHTML: function (ht) {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = ht;
            return tempDiv.children;
        },
        // 封装一个兼容的DOMContentLoaded方法
        ready: function (fn) {
            // 如果页面已经触发了DOMContentLoaded事件，那么直接执行fn，
            // 再监听DOMContentLoaded事件已经无用了。
            if (jQuery.fn.isReady) {
                return fn();
            }
            // IE9以及现代浏览器使用addEventListener以及DOMContentLoaded事件
            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', function () {
                    jQuery.fn.isReady = true;
                    fn();
                });
            }
            // IE8使用attachEvent以及onreadystatechange事件
            else {
                document.attachEvent('onreadystatechange', function () {
                    jQuery.fn.isReady = true;
                    fn();
                });
            }
        },
        //对传入的数组或者对象进行遍历，返回遍历好的数据
        each: function (obj, fn) {
            var i = 0, len, key;
            //传入的是普通数组，就直接采用for循环遍历取值
            if (jQuery.isLikeArray(obj)) {
                for (len = obj.length; i < len; i++) {
                    //当要找到某个值时停止继续遍历，让返回值变为false，直接跳出
                    if (fn.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            }
            //传入的是对象的时候，for--in遍历取到买一个的值
            else {
                for (key in obj) {
                    if (fn.call(obj[key], key, obj[key]) === false) {
                        break;
                    }
                }
            }
            return obj;
        },
        //也是对传入的数组或者对象进行遍历，不过返回的是数组的形式。
        map: function (obj, fn) {
            var result = [],
                i = 0, len, temp, key;
            //传入的是数组
            if (jQuery.isLikeArray(obj)) {
                for (len = obj.length; i < len; i++) {
                    temp = fn(obj[i], i);
                    if (temp != null) {
                        result.push(temp);
                    }
                }
            } else {
                for (key in obj) {
                    temp = fn(obj[key], key);
                    if (temp != null) {
                        result.push(temp);
                    }
                }
            }
            return result;
        },

    });

    //真正的构造函数
    var init = jQuery.fn.init = function (selector) {
        //空处理，直接返回this
        if (!selector) {
            return this;
        }

        //函数，直接添加到DOMContentLoaded事件中
        if (jQuery.isFunction(selector)) {
            jQuery.ready(selector);
        }
        //字符串，要么解析为DOM，要么解析为html片段
        else if (jQuery.isString(selector)) {
            //html片段
            if (jQuery.isHTML(selector)) {
                push.apply(this, jQuery.parseHTML(selector));
            }
            //选择器
            else {
                try {
                    push.apply(this, document.querySelectorAll(selector));
                } catch (e) {
                }
            }
        }

        //dom,直接添加到this中
        else if (jQuery.isDom(selector)) {
            push.call(this, selector);
        }

        //数组或者伪数组，把每一项都添加到this
        else if (jQuery.isLikeArray(selector)) {
            push.apply(this, slice.call(selector));
        }

        //其他，直接添加到this中
        else {
            push.call(this, selector);
        }
    }

    //让构造函数的原型和工厂函数的原型保持一致
    init.prototype = jQuery.fn;

    //将函数暴露在全局
    w.jQuery = w.$ = jQuery;

    $(function () {
    });
}(window));
