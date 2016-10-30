(function ( w ) {

    /*
    * constructor { Pie } 饼图构造函数
    * param { x: number } 饼图圆心x轴坐标
    * param { y: number } 饼图圆心y轴坐标
    * param { r: number } 饼图半径
    * param { data: Array } 绘制饼图所需的数据
    * */
    function Pie( x, y, r, data ) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.data = data;

        // 扇形的颜色
        this.colors = [ 'skyblue', 'deeppink', 'orange', 'yellow', 'red', 'green' ];

        // 计算1数据所对应的角度值
        this.init();
    }

    /*
     * 给Pie添加一个静态方法，
     * 该方法会把角度转换为弧度
     * */
    Pie.angleToRadius = function( angle ) {
        // Math.PI / 180 得到1角度对应多少弧度
        return Math.PI / 180 * angle;
    };

    Pie.prototype = {

        // 拟补constructor丢失的问题
        constructor: Pie,

        // 求1数据对应的角度 = 360度 / 数据的总和
        init: function () {
            var num = 0;
            this.data.forEach(function ( val ) {
                num += val;
            });

            // 1数据所对应的角度值
            this.baseAngle = 360 / num;
        },

        // 绘制饼图
        draw: function () {
            var self = this,
                startAngle = 0,
                endAngle = 0;

            // 根据数据，画扇，共同组成一个饼图。
            this.data.forEach(function ( val, index ) {

                // 计算当前扇形的结束角度
                endAngle = startAngle + self.baseAngle * self.data[index];

                // 画扇
                ctx.beginPath();
                ctx.moveTo( self.x, self.y );
                ctx.arc( self.x, self.y, self.r, Pie.angleToRadius(startAngle), Pie.angleToRadius(endAngle));
                ctx.closePath();
                ctx.fillStyle = self.colors[index];
                ctx.fill();
2
                // 下一个扇形的起点，是当前扇形的结束点
                startAngle = endAngle;
            });
        }
    };

    // 把构造函数暴露到全局
    w.Pie = Pie;

}( window ));