/**
 * Created by lailai on 2017/4/24.
 */
//控制sidbar选中
$(function(){
    //$('#mytab li:eq(0) a').tab('show');

   /* $('#mytab li a').on('shown.bs.tab',function(e){
        alert('123')
        $(e.target).addClass('active');
        $(e.relatedTarget).removeClass('active');
    });*/
    $('#mytab a').click(function (e) {
        //e.preventDefault();
        //$(this).tab('show');
        $(this.relatedTarget).removeClass('active');
        var num=$(this).index();
        $("#mytab li").eq(num).tab('show');
        $(this.target).addClass('active');
    })
});