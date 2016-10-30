$.fn.extend({
    // 判断元素中是否含有指定的class
    hasClass: function (className) {
        /*
         * 实现思路：
         * 遍历所有的元素，只要有一个元素存在指定的className，
         * 那么就返回true，否则返回false
         * */
        var i = 0, len = this.length;
        for (; i < len; i++) {
            if ((' ' + this.className + ' ').indexOf(' ' + className + ' ') > -1) {
                return true;
            }
        }
        return false;
    },
    addClass: function (className) {
        this.each(function () {
            if (!jQuery(this).hasClass(className)) {
                this.className = ( this.className + ' ' + className ).replace(/^\*|\*$/g, '');
            }
        });

        //为了链式编程
        return this;
    },
    removeClass: function (className) {
        //如果不传参数，将className全部清空
        var len = arguments.length;
        if (className == null) {
            return this;
        }
        if (len == 0) {
            this.each(function () {
                this.className = '';
            });
        } else {
            this.each(function () {
                this.className = (' ' + this.className + ' ')
                    .replace(' ' + className + ' ', ' ')
                    .replace(/^\*|\*$/g, '');
            });
        }

        return this;
    },
    // 有就删除，没有就添加
    toggleClass: function (className) {
        this.each(function () {
            var $this = jQuery(this);
            if ($this.hasClass(className)) {
                $this.removeClass(className);
            } else {
                $this.addClass(className);
            }
        });

        return this;
    },
    /*
     * function { attr } 获取元素或者给元素设置属性节点
     * param { name: string || object }
     * param { value: string }
     * return { 属性值 || this }
     * */
    attr: function (name, value) {
        /*
         * 实现思路：
         * 1、使用一个变量存储arguments的length属性，
         * 2、如果length为1，name为字符串，则获取第一个元素(this[0])的对应属性节点值
         * 3、如果length为1，name为对象，则遍历所有元素，分别给他们设置对象中所有配置的属性节点。
         * 4、如果length为2，则遍历所有元素，分别以name为key，value为值，添加属性节点。
         * 5、如果是设置，return this； 如果是获取，return 属性值。
         * 补充：attr是设置或获取属性节点，所以需要通过getAttribute和setAttribute方法来实现。
         * */
        var len = arguments.length;
        //传入为空，直接返回this
        if (name == null) {
            return this;
        }

        //传入一个参数
        else if (len === 1) {
            // 1个参数，并且是字符串，则返回第一个元素的属性值
            if (jQuery.toString(name)) {
                return this[0] && this[0].getAttribute(name);
            }
            // 1个参数，并且是对象
            else if (typeof  name === 'object') {
                // 遍历所有元素
                this.each(function () {
                    var self = this;
                    // 遍历所有要设置的属性key与value
                    jQuery.each(name, function (key, value) {
                        // 分别给每一个元素设置所有的属性值
                        self.setAttribute(key, value);
                    });
                });
            }
        }

        // 如果传入二个参数
        else if (len === 2) {
            this.each(function () {
                this.setAttribute(name, value);
            });
        }

        //为了链式编程
        return this;
    },
    /*
     * function { prop } 获取元素或者给元素设置属性
     * param { name: string || object }
     * param { value: string }
     * return { 属性值 || this }
     * */
    prop: function (name, value) {
        /*
         * 实现思路：
         * 1、使用一个变量存储arguments的length属性，
         * 2、如果length为1，name为字符串，则获取第一个元素(this[0])的对应属性值
         * 3、如果length为1，name为对象，则遍历所有元素，分别给他们设置对象中所有配置的属性。
         * 4、如果length为2，则遍历所有元素，分别以name为key，value为值，添加属性。
         * 5、如果是设置，return this； 如果是获取，return 属性值。
         * 补充：prop是设置或获取属性，所以需要元素.属性名来获取，或者元素.属性名 = 属性值的方法来设置。
         * */
        var len = arguments.length;
        if (name == null) {
            return this;
        }
        if (len == 1) {
            if (jQuery.toString(name)) {
                return this[0] && this[0][name];
            } else if (typeof  name == 'object') {
                this.each(function () {
                    var self = this;
                    jQuery.each(name, function (key, value) {
                        self[key] = value;
                    });
                });

            }
        }

        else if (len == 2) {
            this.each(function () {
                this[name] = value;
            });
        }

        return this;
    },
    /*
     * function {html} 设置或获取元素的内容
     * param {html：string || 没有}
     * **/
    html: function (html) {
        /*
         * 实现思路
         * 1、如果传入了html，遍历所有的元素，设置他们的innerHtml为传入的参数
         * 2、如果没传，返回第一个元素的innerHtml
         * 3、传入null，清空所以
         * 4、传入undefined，不做处理
         * 备注：如果是获取，则返回第一个元素的innerHtml，如果是设置，就返回this
         * **/
        var len = arguments.length;
        if (html == null) {
            this.each(function () {
                this.innerHTML = '';
            });
        } else if (len == 1 && html === undefined) {
            return this;
        }
        else if (len == 0) {
            return this[0] && this[0].innerHTML;
        } else {
            this.each(function () {
                this.innerHTML = html;
            });
        }

        return this;
    },
    /*
     * function {text} 设置或获取所有元素的内容
     * param {text：string || 没有}
     * **/
    text: function (text) {
        /*
         * 实现思路
         * 1、如果传入了html，遍历所有的元素，设置他们的innerText为传入的参数
         * 2、如果没传，返回所有元素的innerText
         * 3、传入null，清空所有
         * 4、传入undefined，不做处理
         * 备注：如果是获取，则返回所有元素的innerText，如果是设置，就返回this
         * **/
        var len = arguments.length,
            result = '';
        if (text === null) {
            this.each(function () {
                this.innerText = '';
            });
        } else if (len == 1 && text === undefined) {
            return this;
        } else if (len === 0) {
            this.each(function () {
                result += this.innerText
            });
        } else {
            this.each(function () {
                this.innerText = text;
            });
        }

        return this;
    },

    /*
     * function { val } 获取所有第一个元素的value属性值，或者（清除||设置）所有元素的value，
     * param { value: 没有 || null || undefined || string }
     * */
    val: function( value ){
        /*
         * 实现思路：
         * 1、如果没有传参，则返回第一个元素的value属性值( 可以考虑借用prop )
         * 2、如果传入的是null或undefined，则设置所有元素的value属性值为''( 可以考虑借用prop )
         * 3、如果传入其他数据，则设置所有元素的value属性值为指定的值( 可以考虑借用prop )
         * 备注：如果没有传参，返回第一个元素的value属性值，否则返回this。
         * */

        var len = arguments.length;

        if( len == 0 ){
            return this[0] && this[0].value;
        }
        if( value === null ){
            return this.prop()
        }else{
            this.each(function () {
                this.value = value;
            });
        }
    },

    /*
     * function { val } 获取所有第一个元素的value属性值，或者（清除||设置）所有元素的value，
     * param { value: 没有 || null || undefined || string }
     * */
    _val: function( value ){
        /*
         * 实现思路：
         * 1、如果没有传参，则返回第一个元素的value属性值( 可以考虑借用prop )
         * 2、如果传入的是null或undefined，则设置所有元素的value属性值为''( 可以考虑借用prop )
         * 3、如果传入其他数据，则设置所有元素的value属性值为指定的值( 可以考虑借用prop )
         * 备注：如果没有传参，返回第一个元素的value属性值，否则返回this。
         * */
        var len = arguments.length;

        if( len == 0 ){
            return this.prop('value');
        }

        if( value === null ){
            value = '';
        }
        return this.prop('value',value);
    },
    /*
     * function { css } 获取第一个元素的指定的样式值，或者批量设置样式值
     * param { value: 没有 || null || undefined || string }
     * */
    css: function( style, value ) {
        /*
         * 实现思路：
         * 1、如果不传参，则返回this
         * 2、如果传入1个参数为字符串，则返回第一个元素的指定样式
         * 3、如果传入1个参数为对象，则给所有元素批量添加样式
         * 4、如果传入2个参数，则给所有元素添加指定的样式
         * */
        var len = arguments.length;

        // 如果不传参，则返回this
        if ( len == 0 ) {
            return this;
        }

        if ( len == 1 ) {

            // 如果传入1个参数为字符串，则返回第一个元素的指定样式
            if ( jQuery.isString( style ) ) {
                return jQuery.getStyle( this[0], style );
            }

            // 如果传入1个参数为对象，则给所有元素批量添加样式
            else if ( typeof style == 'object' ) {
                this.each( function() {
                    var self = this;
                    jQuery.each( style, function( key, val ) {
                        self.style[ key ] = val;
                    } );
                } );
            }

        }

        // 如果传入2个参数，则给所有元素添加指定的样式
        else if ( len == 2 ) {
            this.each( function() {
                this.style[ style ] = value;
            } );
        }

        // 为了链式编程
        return this;
    }
});