//添加DOM操作
$.fn.extend({
    // 清空每一个元素的内容
    empty: function () {
        /*
         * 实现思路：
         * 遍历实例，把遍历到的每一个元素innnerHTML = ''即可。
         * */
        this.each(function () {
            this.innerHTML = '';
        });

        //为了链式编程
        return this;
    },
    //清除所有元素
    remove: function () {
        /*
         * 实现思路：
         * 遍历所有元素，把遍历到的每一个都删除掉。
         * */
        this.each(function () {
            this.parentNode.removeChild(this);
        });
    },
    /*
     * function { appendTo } 把所有的元素添加到指定的selector中
     * param { selector: DOM || 选择器 || jQuery实例 }
     * return 所有被添加元素共同组成的新实例
     * */
    appendTo: function (selector) {
        /*
         * 大概实现思路：
         * 大概：遍历所有的元素，分别添加到selector中。
         *
         * 因为selector的类型太多，能否把它变成同一种类型处理呢？
         * 可以，统一使用jQuery包装成实例即可。
         *
         * 具体实现思路：
         * 1、定义一个数组，用来存储所有被添加的元素
         * 2、遍历this中的所有元素，依次添加到 $selector 中的所有元素，
         * 需要考虑遍历到元素，只能添加到$selector中的一个元素中，其余的元素添加的都是clone版本。
         * 另外还需要考虑每次添加时，都需要先把要添加的元素存储到数组中。
         * 3、最后通过jQuery(所有被添加元素组成的数组)包装成新实例返回。
         * */
        var result = [],$selector = jQuery(selector),temp;
            for(var i = 0,len = this.length;i < len; i++){
                for(var j = 0,leng = $selector.length;j < leng; j++){
                    //第一次添加的是真实的
                    if(j === 0){
                        temp = this[i];
                    }else{
                        temp = this[i].cloneNode( true );
                    }
                    $selector.appendChild( temp );
                    result.push( temp );
                }
            }
        return jQuery( result );
    },
    _appendTo: function (selector) {
        var result = [],$selector = jQuery(selector),temp;
        this.each(function () {
            var self = this;
            $selector.each(function (index) {
                temp = index === 0? self : self.cloneNode( true );
                this.appendChild( temp );
                result.push( temp );
            });
        });

        return jQuery( result );
    },
    /*
     * function { append } 给所有的元素添加指定的内容
     * param { context: DOM || jQuery实例 || 文本 }
     * return 给谁添加返回谁，说白了就是this
     * */
    append: function (context) {
        /*
         * 实现思路：
         * 1、如果context是字符串，那么把这个字符串累加到每一个元素中
         * 2、如果是其他东西，为了方便处理，统一转换为jQuery实例。
         * 3、遍历$context，把遍历到的每一项，分别添加到this的每一项中。
         * 需要注意的是，只有第一次添加是真实的，以后添加的都是clone版本。
         * 4、返回this
         * */
        if(jQuery.isString( context )){
            this.innerHTML += context;
        }else{
            jQuery( context).appendTo(this);
        }

        return this;
    },
    /*
     * function { prependTo } 把所有的元素添加到指定的selector最前面
     * param { selector: DOM || 选择器 || jQuery实例 }
     * return 所有被添加元素共同组成的新实例
     * */
    prependTo: function (selector) {
        var $selector = jQuery(selector),result = [],temp;

        this.each(function () {
            var self = this;
            $selector.each(function ( index ) {
                temp = index === 0? self : self.cloneNode( true );
                $selector.insertBefore(temp,this.firstChild);
                result.push( temp );
            });
        });

        return jQuery( temp );
    },
    /*
     * function { prepent } 给所有的元素最前面添加指定的内容
     * param { context: DOM || jQuery实例 || 文本 }
     * return 给谁添加返回谁，说白了就是this
     * */
    prepend: function ( context ) {
        if(jQuery.isString( context )){
            this.each(function () {
                this.innerHTML = context + this.innerHTML;
            } );
        }
        // 否则借用prependTo把context添加到this中
        else{
            $( context ).prependTo( this );
        }

        return this;
    }
});

/*
 * appendTo、append、prependTo、prepent：
 *
 * appendTo和prependTo有很大相同之处，
 * 不同点在于appendTo把自己添加到某元素的后面，
 * prependTo把自己添加到某元素的最前面。
 *
 * append和prepent有很大相同之处，
 * 不同点在于append给自己的后面添加元素，
 * prepend给自己的最前面添加元素。
 *
 * To和不To的区别：
 * 1、添加方向相反，
 * 2、不To的方法，对于字符串会当做文本添加；
 * 而To的方法，会把字符串当做选择器处理。
 * 也就是说，append和prepent支持给元素添加文本，appendTo和prependTo不支持。
 * */