//添加静态方法
$.extend({
    // 给指定元素添加事件绑定句柄
    addEvent: function (ele, type, fn) {
        // 如果参数不够3个，或者ele不是DOM，那么不做处理
        if (!jQuery.isDom(ele) || arguments.length !== 3) {
            return;
        }

        // 兼容性事件绑定

        if (jQuery.isFunction(ele.addEventListener)) {
            ele.addEventListener(type, fn);
        } else {
            ele.attachEvent(type, fn);
        }
    },
    // 解除指定元素指定的事件绑定句柄
    removeEvent: function (ele, type, fn) {
        // 如果参数不够3个，或者ele不是DOM，那么不做处理
        if (jQuery.isDom(ele) || arguments.length !== 3) {
            return;
        }

        // 兼容性事件绑定

        if (jQuery.isFunction(ele.removeEventListener)) {
            ele.removeEventListener(type, fn);
        } else {
            ele.detachEvent(type, fn);
        }
    }
});

$.fn.extend({
    /*
     * function { on } 给所有元素绑定对应事件的事件句柄
     * param { type: string } 要绑定的事件类型
     * param { fn: Function } 要绑定的事件句柄
     * */
    on: function (type, fn) {
        /*
         * 实现思路：
         * 1、遍历所有元素，
         * 2、看看这个元素有没有$_event_cache属性，有则继续使用，没有则初始化为{}
         * 3、然后看看$_event_cache对象有有没有以 type 命名的数组，有则继续使用，没有则初始化为[]
         * 4、最后把fn 存储到 这个数组中。
         * 需要注意：如果是第一次给某个事件数组push函数，那么还需要额外绑定一个调用这些数组函数的函数。
         * */
        this.each(function () {
            this.$_event_cache = this.$_event_cache || {};
            //this.$_event_cache[ type ] = this.$_event_cache[ type ] || [];
            // 如果this.$_event_cache[ type ]有值，那么直接push新值即可
            if (this.$_event_cache[type]) {
                this.$_event_cache[type].push(fn);
            }
            // 判断是不是第一次添加事件绑定，
            // 如果是，则额外绑定一个函数，
            else if ((this.$_event_cache[type] = []).push(fn)) {
                var self = this;
                // 给元素绑定事件
                jQuery.addEvent(this, type, function (e) {
                    // 该事件处理函数，专门负责调用数组中的每一个函数
                    // IE6、7、8绑定事件处理函数，里面的this，并没有指向事件源，
                    // 所以不能使用this，只能现在外面把this使用另外一个变量保存起来，
                    // 然后在这里引用。
                    jQuery.each(self.$_event_cache[type], function () {
                        this(e);
                    });
                    //for( var i = 0,len = this.$_event_cache[ type].length; i < len; i++ ){
                    //    this.$_event_cache[ type ][ i ]( e );
                    //}
                });
            }
        });

        return this;
    },
    /*
     * function { off } 删除所有元素指定的事件句柄
     * param { type: string } 要删除的事件类型
     * param { fn: Function } 要删除的事件句柄
     * */
    off: function (type, fn) {
        /*
         * 实现思路：
         * 1、如果没有传参数，删除所有事件的处理函数( 把元素的$_event_cache里面存储的事件函数数组重置 )
         * 2、如果传入1个参数，那么解除对应事件的处理函数( 把元素的$_event_cache里面对应事件的函数数组重置 )
         * 3、如果传入2个参数，那么解除对应事件的对应处理函数( 遍历对应事件的数组，依次和fn比较，如果相等那么从数组中剔除 )
         * */
        var len = arguments.length;

        this.each(function () {
            // 得到当前元素的$_event_cache
            var $_event_cache = this.$_event_cache,
                key, i;

            // 如果元素没有$_event_cache，就不用做任何处理了
            if (!$_event_cache) {
                return;
            }
            // 没有传参数，把元素$_event_cache里面的所有事件函数数组清空
            if (len == 0) {
                for (key in $_event_cache) {
                    $_event_cache[key] = [];
                }
            }
            // 没有传1参数，把指定的事件函数数组清空
            else if (len == 1) {
                $_event_cache[type] = [];
            }
            // 没有传2参数，把指定的事件函数数组中指定的函数删除
            else if (len == 2) {
                for (i = $_event_cache[type].length - 1; i >= 0; i--) {
                    if ($_event_cache[type][i] == fn) {
                        $_event_cache[type].splice(i, 1);
                    }
                }
            }
        });
        return this;

    },

    /*
     * function { click } 给所有元素绑定点击事件
     * param { fn: Function } 事件句柄
     * */
    click: function (fn) {
        return this.on('click', fn);
        // 为了链式编程
        //return this;
    },

    _click: function (fn) {
        return this.on('click', fn);
    },


    /*
     * 存在的瑕疵：
     * 1、IE8是倒叙执行的
     * 2、off解除事件绑定句柄时，必须要用户传入函数，
     * 很繁琐，用户每次需要把这些函数记录下来才能解除。
     * */
});

// 批量给原型添加事件监听函数
var events = ( "blur focus focusin focusout load resize scroll unload click dblclick " +
"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
"change select submit keydown keypress keyup error contextmenu" ).split(" ");

jQuery.each(events, function (index, val) {
    $.fn[val] = function (fn) {
        return this.on(val, fn);
    }
});