$(function () {

    $.ajax({
        "type": "GET",
        "url": "http://h6.duchengjiu.top/shop/api_cart.php?token=" + localStorage.token,
        "dataType": "json",
        "success": function (response) {
            // console.log(response);
            // 判断购物车有没有商品
            var html = null;
            if (response.data.length > 0) {
                for (var i = 0; i < response.data.length; i++) {
                    var obj = response.data[i];
                    html += `<tr>
                                <td>
                                    <input type="checkbox" class="yc-goodscheck">
                                    <input type="hidden" class="goods_id" value=" ${ obj.goods_id } "/>
                                </td>
                                <td class="yc-simple">
                                    <img src="${obj.goods_thumb}" alt="">
                                    <span>${obj.goods_name}</span>
                                </td>
                                <td><strong>
                                    <span class="yc-goodspri">${obj.goods_price}</span>
                                </strong></td>
                                <td>
                                    <input type="button" class="leftbtn" value="-">
                                    <input type="text" name="goodsnum" class="yc-goodsnum" value=${obj.goods_number}>
                                    <input type="button"class="rightbtn" value="+">
                                </td>
                                <td>
                                    <span class="yc-sumPrice"> ${obj.goods_price*obj.goods_number} </span>
                                </td>
                                <td>
                                    <span class="yc-delete">&times;</span>
                                </td>
                            </tr>`;
                }
                $(".table.table-striped tbody").html(html);
            }

            // 价格变动
            function changePrice() {
                var total = 0;
                $(".yc-sumPrice").each(function () {
                    if ($(this).parent().parent().find(".yc-goodscheck").prop("checked")) {
                        total += 1 * $(this).text();
                    }
                })
                $(".yc-subprice").text("￥" + total);
                $(".yc-total").text("￥" + total);
            }
            changePrice();

            // checkbox点击改变价格
            $(".yc-goodscheck").click(function () {
                changePrice();
            });

            // 数量增减
            $(".leftbtn").each(
                function (i) {
                    var that = this;
                    $(this).click(function () {
                        updateCart(that, -1);
                    })
                })

            $(".rightbtn").each(
                function (i) {
                    var that = this;
                    $(this).click(function () {
                        updateCart(that, 1);
                    })
                })


            function updateCart(that, x) {
                var goodsNumVal = $(that).parent().find(".yc-goodsnum").val();
                goodsNumVal = +goodsNumVal + x;

                if (goodsNumVal < 1) goodsNumVal = 1;
                if (goodsNumVal > 10) goodsNumVal = 10;

                $(that).parent().find(".yc-goodsnum").val(goodsNumVal);
                var goodsnum = $(that).parent().parent().find(".yc-goodspri").text() * 1;
                $(that).parent().parent().find(".yc-sumPrice").text(goodsNumVal * goodsnum);
                changePrice();
            }

            function updataAjax(obj) {
                // 更新ajax数据
                var goods_id = obj.find(".goods_id").val();
                $.ajax({
                    "url": "http://h6.duchengjiu.top/shop/api_cart.php?token=" + localStorage.token,
                    "type": "POST",
                    "dataType": "json",
                    "data": {
                        "goods_id": goods_id,
                        "number": 0,
                    },
                    "success": function (response) {
                        // console.log(response);
                    }
                })
            }
            // 删除商品
            $(".yc-delete").each(function () {
                var that = this;
                $(this).click(function () {
                    layer.confirm('确定删除该商品？', {btn: ['确认', '取消'],btn1:function(){
                        updataAjax($(that).parent().parent());
                        $(that).parent().parent().remove();
                        getCart();
                        layer.msg('删除成功！', {icon: 1});
                    }});

                })
            })

            // 删除选中项
            $(".delSelect").click(function () {
                layer.confirm('确认删除所有选中商品？', {btn: ['确认', '取消'],btn1:function(){
                    $(".yc-goodscheck").each(function () {
                        var that = this;
                        if ($(that).prop("checked")) {
                            updataAjax($(that).parent().parent());
                            $(that).parent().parent().remove();
                            getCart();
                            layer.msg('删除成功！', {icon: 1});
                        };
                    })
                }});
            })
            // 全选
            $("input[name='selectAll']").click(function () {
                var checked = $(this).prop("checked");
                $(".yc-goodscheck").each(function () {
                    $(this).prop("checked", checked);
                })
                changePrice();                
            })


            // 获取金额
            $(".yc-after").click(function () {
                var sum = $(".yc-subprice").text();
                location.href = "address.html?sum=" + sum.substr(1);
            })
        }


    })
    // 更新购物车
    function getCart(){
        $.ajax({
            "type": "GET",
            "url": "http://h6.duchengjiu.top/shop/api_cart.php?token=" + localStorage.token,
            "dataType": "json",
            "success": function (response) {
                var carthtml="";
                if(!!response.data.length){
                    
                    for(var i=0; i<response.data.length ;i++){
                    var obj = response.data[i];
                    carthtml +=`<div><img src="${obj.goods_thumb}" alt=""><span>${obj.goods_name}</span></div>`
                    }
                    // var cartmore = `<span class="yc-cart-num"></span>`
                    $(".yc-cart-num").text(response.data.length);
                    $(".yc-cart-item").html(carthtml).css("padding","20px");
                }
            }
        })
    }

})