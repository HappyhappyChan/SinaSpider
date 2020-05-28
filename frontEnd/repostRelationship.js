(function(){
var myChart = echarts.init(document.getElementById('main'));
myChart.showLoading();

//分层实现十六进制颜色固定
function color16(node){
    var color;
    if (node.level==1){
        color='#0000FF';
    }else if (node.level==2){
        color='#2E8B57';
    }else if (node.level==3){
        color='#FFA500';
    }else if (node.level==4){
        color='#FF00FF';
    }else{
        color='#000';
    }
    return color;
}

// json中screen_name：源博主名、fs_screen_name：转发博主名、（？）：粉丝数、level：转发层级、bw_id：源博文id、fs_bw_id：转发博文id
$.getJSON('rp_relationship.json', function (json) {
    var newNode = {
        name: json.nodes[0].screen_name+"\n("+json.nodes[0].bw_id+")",
        itemStyle: {
            color:'#DC143C'
        },
        symbolSize: 250
    };
    var newLink = {
        source: json.nodes[0].fs_screen_name+"\n("+json.nodes.fs_bw_id+")",
        target: newNode.name
    };
    myChart.hideLoading();
    option = {
        title: {
            text: 'Retweet Relationship'
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {  //连接线上提示文字格式化
                if (params.data.source) {
                   return params.data.source + '->' + params.data.target ;
                }
                else {
                    return params.id;
                }
            }
        },
        legend: [{
            show:false
        }],
        animation: false,
        series : [
            { 
                type: 'graph',
                layout: 'force',
                data: json.nodes.map(function (node) {
                    return {
                        name: node.fs_screen_name+"\n("+node.fs_bw_id+")",
                        symbolSize: 50,
                        // 待数据完善，用粉丝数确定圆的大小
                        itemStyle: {
                            color:color16(node)
                        },
                    }
                }),
                edges: json.nodes.map(function (edge) {
                    return {
                        source: edge.screen_name+"\n("+edge.bw_id+")",
                        target: edge.fs_screen_name+"\n("+edge.fs_bw_id+")"
                    };
                }),
                emphasis: {
                    label: {
                        position: 'right',
                        show: true
                    }
                },
                roam: true,
                focusNodeAdjacency: true,
                lineStyle: {
                    width: 0.8,
                    curveness: 0.3,
                    opacity: 0.7
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1,
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                },
                force: {
                    edgeLength: 80,
                    repulsion: 500,
                    gravity: 0.2
                },
               draggable:true
            }
        ]
    };
    //增加缺失的根节点
    myChart.setOption(option);
    function addnode(newNode,newLink,option){
        option.series[0].data.push(newNode);
        option.series[0].edges.push(newLink);
        option.animation = true;
        myChart.setOption(option,true);
        window.onresize = addnode;
    }
    addnode(newNode,newLink,option);
});
})(); 
